import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    // Find user with valid reset token
    const user = await users.findOne({
      passwordResetToken: token,
      passwordResetExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired reset token",
        },
        { status: 400 },
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and remove reset token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          passwordResetToken: "",
          passwordResetExpiry: "",
        },
      },
    )

    return NextResponse.json(
      {
        message: "Password has been reset successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
