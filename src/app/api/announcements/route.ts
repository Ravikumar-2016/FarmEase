import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("FarmEase")
  return { db }
}

interface Announcement {
  _id?: ObjectId
  announcementId: string
  title: string
  message: string
  type: "warning" | "info" | "success" | "error"
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

// GET announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") === "true"

    const { db } = await connectToDatabase()

    const query: Record<string, unknown> = {}
    if (activeOnly) {
      query.isActive = true
    }

    const announcements = await db.collection("announcements").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

// POST new announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, isActive, createdBy } = body

    if (!title || !message || !type || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const announcement: Announcement = {
      announcementId: new ObjectId().toString(),
      title,
      message,
      type,
      isActive: isActive || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
    }

    const result = await db.collection("announcements").insertOne(announcement)

    return NextResponse.json({ success: true, announcementId: result.insertedId })
  } catch (error) {
    console.error("Error creating announcement:", error)
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}

// PUT update announcement
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { announcementId, title, message, type, isActive } = body

    if (!announcementId) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    }

    if (title !== undefined) updateData.title = title
    if (message !== undefined) updateData.message = message
    if (type !== undefined) updateData.type = type
    if (isActive !== undefined) updateData.isActive = isActive

    const result = await db.collection("announcements").updateOne({ announcementId }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating announcement:", error)
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 })
  }
}

// DELETE announcement
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get("announcementId")

    if (!announcementId) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("announcements").deleteOne({
      announcementId: announcementId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}
