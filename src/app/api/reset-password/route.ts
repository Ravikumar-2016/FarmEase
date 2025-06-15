import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json()
    console.log("Reset password API called for email:", email)

    if (!email || !otp || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ message: "OTP must be 6 digits" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    const user = await users.findOne({ email })

    if (
      !user ||
      !user.resetOtp ||
      !user.resetOtpExpiry ||
      user.resetOtp !== otp ||
      new Date(user.resetOtpExpiry) < new Date()
    ) {
      return NextResponse.json({ message: "Invalid or expired reset code" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and remove OTP
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetOtp: "",
          resetOtpExpiry: "",
        },
      },
    )

    console.log("Password reset successfully for:", email)

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined
      }, 
      { status: 500 }
    )
  }
}
