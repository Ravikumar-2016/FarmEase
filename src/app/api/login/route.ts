import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    // Find user by username or email
    const user = await users.findOne({
      $or: [{ username }, { email: username }],
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await users.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        userType: user.userType,
        username: user.username,
        fullName: user.fullName,
      },
      { status: 200 },
    )

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
