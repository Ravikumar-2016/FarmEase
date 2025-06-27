import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("FarmEase")
  return { db }
}

interface Ticket {
  _id?: ObjectId
  ticketId: string
  submitterName: string
  submitterUsername: string
  userType: "employee" | "admin"
  subject: string
  message: string
  category: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved"
  response?: string
  submittedAt: string
  respondedAt?: string
}

// GET tickets with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const userType = searchParams.get("userType")

    const { db } = await connectToDatabase()

    const query: any = {}

    if (username) {
      query.submitterUsername = username
    }

    if (status) {
      query.status = status
    }

    if (category) {
      query.category = category
    }

    if (userType && ["employee", "admin"].includes(userType)) {
      query.userType = userType
    }

    console.log("Fetching tickets with query:", query)

    const tickets = await db.collection("tickets").find(query).sort({ submittedAt: -1 }).toArray()

    return NextResponse.json(
      {
        success: true,
        tickets: tickets || [],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tickets",
        tickets: [],
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

// POST new ticket (employee/admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received ticket submission:", body)

    const { submitterName, submitterUsername, userType, subject, message, category, priority = "normal" } = body

    // Validate required fields
    if (!submitterName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Submitter name is required",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!submitterUsername?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Submitter username is required",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!userType || !["employee", "admin"].includes(userType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid user type is required (employee or admin)",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!subject?.trim() || subject.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject must be at least 5 characters long",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Message must be at least 10 characters long",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (!category?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Category is required",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Validate subject and message length
    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject must be less than 200 characters",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message must be less than 2000 characters",
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

    // Generate unique ticket ID
    const ticketId = new ObjectId().toString()

    const newTicket: Ticket = {
      ticketId,
      submitterName: submitterName.trim(),
      submitterUsername: submitterUsername.trim(),
      userType,
      subject: subject.trim(),
      message: message.trim(),
      category: category.trim(),
      priority: priority || "normal",
      status: "open",
      submittedAt: new Date().toISOString(),
    }

    console.log("Inserting ticket:", newTicket)

    const result = await db.collection("tickets").insertOne(newTicket)

    if (!result.insertedId) {
      throw new Error("Failed to insert ticket into database")
    }

    console.log("Ticket created successfully:", result.insertedId)

    return NextResponse.json(
      {
        success: true,
        message: "Ticket submitted successfully. Admin will review and respond.",
        ticketId: result.insertedId,
        ticket: newTicket,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create ticket. Please try again.",
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

// PUT update ticket (admin response only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received ticket update:", body)

    const { ticketId, status, response, priority } = body

    if (!ticketId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket ID is required",
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

    // Check if ticket exists
    const existingTicket = await db.collection("tickets").findOne({
      ticketId: ticketId.trim(),
    })

    if (!existingTicket) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket not found",
        },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (status) {
      if (!["open", "in-progress", "resolved"].includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid status. Must be open, in-progress, or resolved.",
          },
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }
      updateData.status = status
    }

    if (response?.trim()) {
      if (response.trim().length < 10) {
        return NextResponse.json(
          {
            success: false,
            error: "Response must be at least 10 characters long.",
          },
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }

      if (response.length > 2000) {
        return NextResponse.json(
          {
            success: false,
            error: "Response must be less than 2000 characters.",
          },
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }

      updateData.response = response.trim()
      updateData.respondedAt = new Date().toISOString()

      // Auto-set status to resolved if not specified
      if (!status) {
        updateData.status = "resolved"
      }
    }

    if (priority) {
      if (!["low", "normal", "high", "urgent"].includes(priority)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid priority. Must be low, normal, high, or urgent.",
          },
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }
      updateData.priority = priority
    }

    console.log("Updating ticket with data:", updateData)

    const result = await db.collection("tickets").updateOne({ ticketId: ticketId.trim() }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket not found",
        },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    console.log("Ticket updated successfully")

    return NextResponse.json(
      {
        success: true,
        message: "Ticket updated successfully",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update ticket",
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

// DELETE ticket (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticketId = searchParams.get("ticketId")

    if (!ticketId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket ID is required",
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

    const result = await db.collection("tickets").deleteOne({
      ticketId: ticketId.trim(),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket not found",
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
        message: "Ticket deleted successfully",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete ticket",
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
