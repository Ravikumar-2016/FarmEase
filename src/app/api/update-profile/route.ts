import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { username, fullName, mobile, area, state, zipcode } = await request.json()

    if (!username) {
      return NextResponse.json({ message: "Username is required" }, { status: 400 })
    }

    // Validate mobile number if provided
    if (mobile && !/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ message: "Mobile number must be 10 digits" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    const user = await users.findOne({ username })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user profile (excluding email - email is handled separately)
    const updateData = {
      fullName: fullName || "",
      mobile: mobile || "",
      area: area || "",
      state: state || "",
      zipcode: zipcode || "",
      updatedAt: new Date(),
    }

    const result = await users.updateOne({ username }, { $set: updateData })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes were made" }, { status: 400 })
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
