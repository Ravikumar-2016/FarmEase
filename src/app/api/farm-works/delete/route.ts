import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest) {
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

    if (work.status === "active") {
      return NextResponse.json({ error: "Cannot delete active works. Cancel the work first." }, { status: 400 })
    }

    // Delete the work
    const result = await farmWorks.deleteOne({
      _id: new ObjectId(workId),
      farmerUsername: farmerUsername,
    })

    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: "Work deleted successfully.",
      })
    } else {
      return NextResponse.json({ error: "Failed to delete work" }, { status: 500 })
    }
  } catch (error) {
    console.error("Farm work deletion error:", error)
    return NextResponse.json({ error: "Failed to delete work" }, { status: 500 })
  }
}
