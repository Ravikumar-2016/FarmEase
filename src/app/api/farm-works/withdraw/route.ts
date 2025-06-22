import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workId, labourUsername } = body

    if (!workId || !labourUsername) {
      return NextResponse.json({ error: "Work ID and labour username are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    interface LabourApplication {
      labourUsername: string;
      // add other fields if needed
    }

    interface FarmWork {
      _id: ObjectId;
      status: string;
      workDate: string | Date;
      labourApplications?: LabourApplication[];
      // add other fields if needed
    }

    const farmWorks = db.collection<FarmWork>("farmWorks")

    // Check if work exists
    const work = await farmWorks.findOne({ _id: new ObjectId(workId) })

    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 })
    }

    if (work.status !== "active") {
      return NextResponse.json({ error: "Can only withdraw from active works" }, { status: 400 })
    }

    // Check if it's more than 1 day before work date
    const workDate = new Date(work.workDate)
    const oneDayBefore = new Date(workDate)
    oneDayBefore.setDate(oneDayBefore.getDate() - 1)
    oneDayBefore.setHours(23, 59, 59, 999)

    const currentTime = new Date()
    if (currentTime > oneDayBefore) {
      return NextResponse.json(
        {
          error: "Cannot withdraw application. Deadline has passed (11:00 PM the day before work date)",
        },
        { status: 400 },
      )
    }

    // Check if user has applied
    const hasApplied = work.labourApplications?.some(
      (app: { labourUsername: string }) => app.labourUsername === labourUsername,
    )

    if (!hasApplied) {
      return NextResponse.json({ error: "You haven't applied for this work" }, { status: 400 })
    }

    // Remove application - Fix the TypeScript error by using proper MongoDB syntax
    await farmWorks.updateOne(
      { _id: new ObjectId(workId) },
      {
        $pull: {
          labourApplications: { labourUsername: labourUsername },
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Application withdrawn successfully.",
    })
  } catch (error) {
    console.error("Application withdrawal error:", error)
    return NextResponse.json({ error: "Failed to withdraw application" }, { status: 500 })
  }
}
