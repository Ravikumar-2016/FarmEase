import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("FarmEase")
  return { db }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get("announcementId")

    if (!announcementId) {
      return NextResponse.json(
        {
          success: false,
          error: "Announcement ID is required",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("announcements").deleteOne({ announcementId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Announcement not found",
        },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Announcement deleted successfully",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete announcement",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
