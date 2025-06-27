import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("FarmEase")
    return { db }
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// GET partners with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    const { db } = await connectToDatabase()

    const query: any = { userType: "admin" }

    if (status) {
      query.status = status
    }

    if (type) {
      query.type = type
    }

    console.log("Fetching partners with query:", query)

    const partners = await db.collection("users").find(query).sort({ createdAt: -1 }).toArray()

    console.log("Found partners:", partners.length)

    return NextResponse.json({
      success: true,
      partners: partners || [],
    })
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch partners",
        partners: [],
      },
      { status: 500 },
    )
  }
}

// POST new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received partner creation:", body)

    const {
      fullName,
      username,
      password,
      organizationName,
      type,
      contactPerson,
      email,
      mobile,
      areaOfCollaboration,
      termsSummary,
      area,
      state,
      zipcode,
    } = body

    // Validate required fields
    if (!fullName?.trim()) {
      return NextResponse.json({ success: false, error: "Full name is required" }, { status: 400 })
    }

    if (!username?.trim()) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    if (!password?.trim()) {
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 })
    }

    if (!email?.trim()) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    if (!mobile?.trim()) {
      return NextResponse.json({ success: false, error: "Mobile number is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if email already exists in users collection
    const existingEmail = await db.collection("users").findOne({
      email: email.trim().toLowerCase(),
    })

    if (existingEmail) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 })
    }

    // Check if username already exists in users collection
    const existingUsername = await db.collection("users").findOne({
      username: username.trim().toLowerCase(),
    })

    if (existingUsername) {
      return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10)

    const newPartner = {
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      password: hashedPassword,
      organizationName: organizationName?.trim() || "",
      type: type?.trim() || "",
      contactPerson: contactPerson?.trim() || "",
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      areaOfCollaboration: areaOfCollaboration?.trim() || "",
      termsSummary: termsSummary?.trim() || "",
      area: area?.trim() || "",
      state: state?.trim() || "",
      zipcode: zipcode?.trim() || "",
      userType: "admin",
      status: "active",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    }

    console.log("Inserting partner:", newPartner)

    const result = await db.collection("users").insertOne(newPartner)

    if (!result.insertedId) {
      throw new Error("Failed to insert partner into database")
    }

    console.log("Partner created successfully:", result.insertedId)

    return NextResponse.json({
      success: true,
      message: "Partner added successfully",
      partnerId: result.insertedId,
      partner: newPartner,
    })
  } catch (error) {
    console.error("Error creating partner:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create partner. Please try again.",
      },
      { status: 500 },
    )
  }
}

// PUT update partner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received partner update:", body)

    const {
      partnerId,
      fullName,
      username,
      password,
      organizationName,
      type,
      contactPerson,
      email,
      mobile,
      areaOfCollaboration,
      termsSummary,
      area,
      state,
      zipcode,
      status,
    } = body

    if (!partnerId?.trim()) {
      return NextResponse.json({ success: false, error: "Partner ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if partner exists
    const existingPartner = await db.collection("users").findOne({
      _id: new ObjectId(partnerId.trim()),
      userType: "admin",
    })

    if (!existingPartner) {
      return NextResponse.json({ success: false, error: "Partner not found" }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (fullName?.trim()) {
      updateData.fullName = fullName.trim()
    }

    if (username?.trim()) {
      // Check if username is already used by another user
      const usernameExists = await db.collection("users").findOne({
        username: username.trim().toLowerCase(),
        _id: { $ne: new ObjectId(partnerId.trim()) },
      })

      if (usernameExists) {
        return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 400 })
      }

      updateData.username = username.trim().toLowerCase()
    }

    if (password?.trim()) {
      // Hash new password
      const hashedPassword = await bcrypt.hash(password.trim(), 10)
      updateData.password = hashedPassword
    }

    if (organizationName?.trim()) {
      updateData.organizationName = organizationName.trim()
    }

    if (type?.trim()) {
      updateData.type = type.trim()
    }

    if (contactPerson?.trim()) {
      updateData.contactPerson = contactPerson.trim()
    }

    if (email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
      }

      // Check if email is already used by another user
      const emailExists = await db.collection("users").findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: new ObjectId(partnerId.trim()) },
      })

      if (emailExists) {
        return NextResponse.json({ success: false, error: "Email is already used by another user" }, { status: 400 })
      }

      updateData.email = email.trim().toLowerCase()
    }

    if (mobile?.trim()) {
      updateData.mobile = mobile.trim()
    }

    if (areaOfCollaboration?.trim()) {
      updateData.areaOfCollaboration = areaOfCollaboration.trim()
    }

    if (termsSummary !== undefined) {
      updateData.termsSummary = termsSummary?.trim() || ""
    }

    if (area?.trim()) {
      updateData.area = area.trim()
    }

    if (state?.trim()) {
      updateData.state = state.trim()
    }

    if (zipcode?.trim()) {
      updateData.zipcode = zipcode.trim()
    }

    if (status && ["active", "inactive", "pending"].includes(status)) {
      updateData.status = status
    }

    console.log("Updating partner with data:", updateData)

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(partnerId.trim()), userType: "admin" }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Partner not found" }, { status: 404 })
    }

    console.log("Partner updated successfully")

    return NextResponse.json({ success: true, message: "Partner updated successfully" })
  } catch (error) {
    console.error("Error updating partner:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update partner",
      },
      { status: 500 },
    )
  }
}

// DELETE partner - Fixed version
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get("partnerId")

    console.log("DELETE request received for partnerId:", partnerId)

    if (!partnerId?.trim()) {
      console.log("Partner ID is missing")
      return NextResponse.json({ success: false, error: "Partner ID is required" }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(partnerId.trim())) {
      console.log("Invalid ObjectId format:", partnerId)
      return NextResponse.json({ success: false, error: "Invalid partner ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    console.log("Attempting to delete partner with ID:", partnerId.trim())

    // First check if partner exists
    const existingPartner = await db.collection("users").findOne({
      _id: new ObjectId(partnerId.trim()),
      userType: "admin",
    })

    if (!existingPartner) {
      console.log("Partner not found for deletion")
      return NextResponse.json({ success: false, error: "Partner not found" }, { status: 404 })
    }

    console.log("Partner found, proceeding with deletion:", existingPartner.fullName)

    // Delete the partner
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(partnerId.trim()),
      userType: "admin",
    })

    console.log("Delete result:", result)

    if (result.deletedCount === 0) {
      console.log("No partner was deleted")
      return NextResponse.json({ success: false, error: "Failed to delete partner" }, { status: 500 })
    }

    console.log("Partner deleted successfully")

    return NextResponse.json({
      success: true,
      message: "Partner deleted successfully",
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error deleting partner:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete partner",
      },
      { status: 500 },
    )
  }
}
