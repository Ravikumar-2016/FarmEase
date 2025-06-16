import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { username, newEmail, otp } = await request.json()

    if (!username || !newEmail || !otp) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ message: "OTP must be 6 digits" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    const user = await users.findOne({ username })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (
      !user.emailChangeOtp ||
      !user.emailChangeOtpExpiry ||
      user.emailChangeOtp !== otp ||
      new Date(user.emailChangeOtpExpiry) < new Date() ||
      user.pendingEmail !== newEmail
    ) {
      return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 })
    }

    // Update email and remove OTP fields
    await users.updateOne(
      { username },
      {
        $set: {
          email: newEmail,
          updatedAt: new Date(),
        },
        $unset: {
          emailChangeOtp: "",
          emailChangeOtpExpiry: "",
          pendingEmail: "",
        },
      },
    )

    return NextResponse.json({ message: "Email verified and updated successfully" })
  } catch (error) {
    console.error("Verify email change error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
