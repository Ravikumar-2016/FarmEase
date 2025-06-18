import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("farmease")

    // Try both collection names to be safe
    let announcements = await db.collection("announcements").find({}).sort({ createdAt: -1 }).limit(10).toArray()

    if (announcements.length === 0) {
      announcements = await db.collection("Announcements").find({}).sort({ createdAt: -1 }).limit(10).toArray()
    }

    console.log("Found announcements:", announcements) // Debug log

    return NextResponse.json({
      success: true,
      announcements: announcements.map((announcement) => ({
        _id: announcement._id.toString(),
        title: announcement.title || announcement.Title || "Announcement",
        message: announcement.message || announcement.Message || announcement["hello i m not empty"] || "No message",
        type: announcement.type || announcement.Type || "info",
        createdAt: announcement.createdAt || announcement.CreatedAt || new Date().toISOString(),
        isActive: announcement.isActive !== false, // Default to true if not specified
      })),
    })
  } catch (error) {
    console.error("Announcements fetch error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, message, type = "info" } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ success: false, error: "Title and message are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("farmease")
    const collection = db.collection("announcements")

    const result = await collection.insertOne({
      title,
      message,
      type,
      isActive: true,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      announcementId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Announcement creation error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
