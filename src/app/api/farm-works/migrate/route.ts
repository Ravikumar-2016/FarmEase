import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Migration script to add workId to existing farmWorks documents
export async function POST(_request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("FarmEase")
    const farmWorks = db.collection("farmWorks")

    // Find documents without workId
    const documentsWithoutWorkId = await farmWorks.find({ workId: { $exists: false } }).toArray()

    if (documentsWithoutWorkId.length === 0) {
      return NextResponse.json({
        message: "All documents already have workId",
        migratedCount: 0,
      })
    }

    // Generate workId for each document
    const bulkOps = documentsWithoutWorkId.map((doc) => {
      const timestamp = Date.now().toString(36)
      const random = Math.random().toString(36).substr(2, 5)
      const workId = `work_${timestamp}_${random}`

      return {
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { workId } },
        },
      }
    })

    const result = await farmWorks.bulkWrite(bulkOps)

    return NextResponse.json({
      success: true,
      message: `Migration completed. Added workId to ${result.modifiedCount} documents.`,
      migratedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: "Migration failed" }, { status: 500 })
  }
}
