import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ message: "OTP must be 6 digits" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const signupOtps = db.collection("signup_otps")

    const otpRecord = await signupOtps.findOne({ email })

    if (
      !otpRecord ||
      !otpRecord.otp ||
      !otpRecord.otpExpiry ||
      otpRecord.otp !== otp ||
      new Date(otpRecord.otpExpiry) < new Date()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired verification code. Please request a new one." },
        { status: 400 },
      )
    }

    // Mark OTP as verified but keep it for account creation
    await signupOtps.updateOne(
      { email },
      {
        $set: {
          verified: true,
          verifiedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Verify signup OTP error:", errorMessage)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
