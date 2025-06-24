import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { createNotification } from "../../notifications/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workId, farmerUsername } = body

    if (!workId || !farmerUsername) {
      return NextResponse.json({ error: "Work ID and farmer username are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const farmWorks = db.collection("farmWorks")

    // Check if work exists and belongs to the farmer
    const work = await farmWorks.findOne({
      _id: new ObjectId(workId),
      farmerUsername: farmerUsername,
    })

    if (!work) {
      return NextResponse.json({ error: "Work not found or unauthorized" }, { status: 404 })
    }

    if (work.status !== "active") {
      return NextResponse.json({ error: "Only active works can be cancelled" }, { status: 400 })
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
          error: "Cannot cancel work less than 1 day before the scheduled date",
        },
        { status: 400 },
      )
    }

    // Update work status to cancelled
    await farmWorks.updateOne(
      { _id: new ObjectId(workId) },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      },
    )

    // Create notifications
    const workName = `${work.workType} work`

    // Notify the farmer
    await createNotification(
      db,
      farmerUsername,
      "farmer",
      "cancellation",
      work.workId || workId,
      work.cropName,
      workName,
      `You cancelled ${workName} for ${work.cropName}`,
    )

    // Notify all applicants
    for (const application of work.labourApplications || []) {
      await createNotification(
        db,
        application.labourUsername,
        "labour",
        "cancellation",
        work.workId || workId,
        work.cropName,
        workName,
        `Farmer ${farmerUsername} cancelled ${workName} for ${work.cropName}`,
        farmerUsername,
      )
    }

    return NextResponse.json({
      success: true,
      message: "Work cancelled successfully. All applicants have been notified.",
    })
  } catch (error) {
    console.error("Farm work cancellation error:", error)
    return NextResponse.json({ error: "Failed to cancel work" }, { status: 500 })
  }
}
