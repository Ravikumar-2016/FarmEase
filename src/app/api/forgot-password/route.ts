import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { sendEmail, generateOTP, getOTPExpiry, emailTemplates } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    console.log("Forgot password API called for email:", email)

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    const user = await users.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 })
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    console.log("Generated reset OTP:", otp, "for email:", email)

    // Store OTP
    await users.updateOne(
      { email },
      {
        $set: {
          resetOtp: otp,
          resetOtpExpiry: otpExpiry,
          updatedAt: new Date(),
        },
      },
    )

    // Send email
    const emailSent = await sendEmail(
      email, 
      "Reset Your FarmEase Password", 
      emailTemplates.passwordReset(otp)
    )

    console.log("Reset email sent result:", emailSent)

    return NextResponse.json({
      message: "Password reset code sent to your email. It will expire in 10 minutes.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined
      }, 
      { status: 500 }
    )
  }
}
