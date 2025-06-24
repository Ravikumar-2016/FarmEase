import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Helper to get db from clientPromise
async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("FarmEase")
  return { db }
}

interface Notification {
  _id?: ObjectId
  notificationId: string
  userId: string
  type: "farmer" | "labour"
  eventType: "application" | "withdrawal" | "creation" | "completion" | "cancellation"
  workId: string
  cropName: string
  workName: string
  message: string
  timestamp: Date
  isRead: boolean
  relatedUserId?: string
}

// Generate unique workId
function generateWorkId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `work_${timestamp}_${random}`
}

// Create notification helper
async function createNotification(
  db: any,
  userId: string,
  type: "farmer" | "labour",
  eventType: Notification["eventType"],
  workId: string,
  cropName: string,
  workName: string,
  message: string,
  relatedUserId?: string,
) {
  const notification: Notification = {
    notificationId: new ObjectId().toString(),
    userId,
    type,
    eventType,
    workId,
    cropName,
    workName,
    message,
    timestamp: new Date(),
    isRead: false,
    relatedUserId,
  }

  await db.collection("notifications").insertOne(notification)
}

// GET notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const query: any = { userId }
    if (unreadOnly) {
      query.isRead = false
    }

    const notifications = await db
      .collection("notifications")
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    const unreadCount = await db.collection("notifications").countDocuments({ userId, isRead: false })

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

// POST - Mark notifications as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notificationIds, markAllAsRead } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    let updateQuery: any = { userId }

    if (markAllAsRead) {
      // Mark all notifications as read for this user
      updateQuery = { userId, isRead: false }
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      updateQuery = {
        userId,
        notificationId: { $in: notificationIds },
      }
    } else {
      return NextResponse.json({ error: "No notifications specified" }, { status: 400 })
    }

    const result = await db.collection("notifications").updateMany(updateQuery, { $set: { isRead: true } })

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}

// Export helper functions for use in other API routes
export { createNotification, generateWorkId }
