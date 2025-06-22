import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workId, labourUsername, name, mobile } = body

    if (!workId || !labourUsername || !name || !mobile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    interface LabourApplication {
      name: string;
      mobile: string;
      labourUsername: string;
      appliedAt: Date;
    }

    interface FarmWork {
      _id: ObjectId;
      workDate: Date | string;
      status: string;
      laboursRequired: number;
      labourApplications: LabourApplication[];
      // add other fields as needed
    }

    const farmWorks = db.collection<FarmWork>("farmWorks")

    // Check if work exists and is still accepting applications
    const work = await farmWorks.findOne({ _id: new ObjectId(workId) })

    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 })
    }

    if (work.status !== "active") {
      return NextResponse.json({ error: "This work is no longer active" }, { status: 400 })
    }

    // Check if it's past 11 PM on the day before work date
    const workDate = new Date(work.workDate)
    const dayBefore = new Date(workDate)
    dayBefore.setDate(dayBefore.getDate() - 1)
    dayBefore.setHours(23, 0, 0, 0) // 11 PM day before

    const currentTime = new Date()
    if (currentTime > dayBefore) {
      return NextResponse.json(
        { error: "Application deadline has passed (11 PM day before work date)" },
        { status: 400 },
      )
    }

    if (work.labourApplications.length >= work.laboursRequired) {
      return NextResponse.json({ error: "This work has reached maximum applications" }, { status: 400 })
    }

    // Check if user already applied
    const alreadyApplied = (work.labourApplications ?? []).some((app: LabourApplication) => app.labourUsername === labourUsername)

    if (alreadyApplied) {
      return NextResponse.json({ error: "You have already applied for this work" }, { status: 400 })
    }

    // Add application
    const application = {
      name,
      mobile,
      labourUsername,
      appliedAt: new Date(),
    }

    await farmWorks.updateOne({ _id: new ObjectId(workId) }, { $push: { labourApplications: application } })

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! The farmer will contact you soon.",
    })
  } catch (error) {
    console.error("Farm work application error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
