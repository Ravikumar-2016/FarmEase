import { NextResponse, type NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("FarmEase")
  return { db }
}

interface Query {
  _id?: ObjectId
  queryId: string
  submitterName: string
  submitterUsername: string
  userType: "farmer" | "labour"
  subject: string
  message: string
  status: "pending" | "in-progress" | "resolved"
  assignedEmployee?: string
  response?: string
  submittedAt: string
  respondedAt?: string
  area?: string
  state?: string
  mobile?: string
  email?: string
  priority?: "low" | "normal" | "high" | "urgent"
  category?: string
}

// GET queries with filtering (only farmer/labour queries)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const status = searchParams.get("status")
    const assignedEmployee = searchParams.get("assignedEmployee")
    const userType = searchParams.get("userType")

    const { db } = await connectToDatabase()

    const query: any = { userType: { $in: ["farmer", "labour"] } } // Only user queries

    if (username) {
      query.submitterUsername = username
    }

    if (status) {
      query.status = status
    }

    if (assignedEmployee) {
      query.assignedEmployee = assignedEmployee
    }

    if (userType && ["farmer", "labour"].includes(userType)) {
      query.userType = userType
    }

    console.log("Fetching queries with query:", query)

    const queries = await db.collection("queries").find(query).sort({ submittedAt: -1 }).toArray()

    return NextResponse.json(
      {
        success: true,
        queries: queries || [],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching queries:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch queries",
        queries: [],
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

// POST new query (farmer/labour only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received query submission:", body)

    const {
      submitterName,
      submitterUsername,
      userType,
      subject,
      message,
      area,
      state,
      mobile,
      email,
      priority = "normal",
      category,
    } = body

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

    if (!userType || !["farmer", "labour"].includes(userType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid user type is required (farmer or labour)",
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

    // Generate unique query ID
    const queryId = new ObjectId().toString()

    const newQuery: Query = {
      queryId,
      submitterName: submitterName.trim(),
      submitterUsername: submitterUsername.trim(),
      userType,
      subject: subject.trim(),
      message: message.trim(),
      status: "pending",
      submittedAt: new Date().toISOString(),
      priority: priority || "normal",
    }

    // Add optional fields if provided
    if (area?.trim()) newQuery.area = area.trim()
    if (state?.trim()) newQuery.state = state.trim()
    if (mobile?.trim()) newQuery.mobile = mobile.trim()
    if (email?.trim()) newQuery.email = email.trim()
    if (category?.trim()) newQuery.category = category.trim()

    console.log("Inserting query:", newQuery)

    const result = await db.collection("queries").insertOne(newQuery)

    if (!result.insertedId) {
      throw new Error("Failed to insert query into database")
    }

    console.log("Query created successfully:", result.insertedId)

    return NextResponse.json(
      {
        success: true,
        message: "Query submitted successfully. We'll respond within 24 hours.",
        queryId: result.insertedId,
        query: newQuery,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error creating query:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create query. Please try again.",
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

// PUT update query (employee response only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received query update:", body)

    const { queryId, status, response, assignedEmployee, priority, employeeUsername } = body

    if (!queryId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Query ID is required",
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

    // Check if query exists and is a user query
    const existingQuery = await db.collection("queries").findOne({
      queryId: queryId.trim(),
      userType: { $in: ["farmer", "labour"] },
    })

    if (!existingQuery) {
      return NextResponse.json(
        {
          success: false,
          error: "Query not found or access denied",
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
      if (!["pending", "in-progress", "resolved"].includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid status. Must be pending, in-progress, or resolved.",
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

    if (assignedEmployee?.trim()) {
      updateData.assignedEmployee = assignedEmployee.trim()

      // Auto-set status to in-progress if not specified
      if (!status && !response) {
        updateData.status = "in-progress"
      }
    }

    if (employeeUsername?.trim()) {
      updateData.assignedEmployee = employeeUsername.trim()
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

    console.log("Updating query with data:", updateData)

    const result = await db.collection("queries").updateOne({ queryId: queryId.trim() }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Query not found",
        },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    console.log("Query updated successfully")

    return NextResponse.json(
      {
        success: true,
        message: "Query updated successfully",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error updating query:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update query",
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

// DELETE query (employee only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryId = searchParams.get("queryId")

    if (!queryId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Query ID is required",
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

    const result = await db.collection("queries").deleteOne({
      queryId: queryId.trim(),
      userType: { $in: ["farmer", "labour"] },
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Query not found or access denied",
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
        message: "Query deleted successfully",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error deleting query:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete query",
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
