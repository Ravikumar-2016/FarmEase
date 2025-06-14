import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["username", "email", "password", "userType"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate mobile number if provided
    if (body.mobile && !/^\d{10}$/.test(body.mobile)) {
      return NextResponse.json({ message: "Mobile number must be 10 digits" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const usersCollection = db.collection("users")
    const signupOtps = db.collection("signup_otps")

    // Check if email was verified
    const otpRecord = await signupOtps.findOne({ email: body.email, verified: true })
    if (!otpRecord) {
      return NextResponse.json({ message: "Email not verified. Please verify your email first." }, { status: 400 })
    }

    // Check if user with same username or email exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    })

    if (existingUser) {
      if (existingUser.username === body.username) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 })
      }
      if (existingUser.email === body.email) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 })
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // Create user object
    const newUser = {
      username: body.username,
      email: body.email,
      password: hashedPassword,
      userType: body.userType,
      fullName: body.fullName || "",
      mobile: body.mobile || "",
      area: body.area || "",
      state: body.state || "",
      zipcode: body.zipcode || "",
      emailVerified: true, // Already verified via OTP
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert user into database
    const result = await usersCollection.insertOne(newUser)

    if (!result.insertedId) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
    }

    // Clean up OTP record
    await signupOtps.deleteOne({ email: body.email })

    return NextResponse.json(
      {
        message: "Account created successfully!",
        userId: result.insertedId,
        userType: body.userType,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create account error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
