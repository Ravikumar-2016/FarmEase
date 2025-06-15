import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { sendEmail, generateOTP, getOTPExpiry, emailTemplates } from "@/lib/email"


export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    const user = await users.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email is already verified" }, { status: 400 })
    }

    // Generate new OTP
    const emailVerificationOtp = generateOTP()
    const emailVerificationExpiry = getOTPExpiry()

    // Update user with new OTP
    await users.updateOne(
      { email },
      {
        $set: {
          emailVerificationOtp,
          emailVerificationExpiry,
          updatedAt: new Date(),
        },
      },
    )

    // Send new verification email
    await sendEmail(email, "Verify Your FarmEase Account - New Code", emailTemplates.signupVerification(emailVerificationOtp))

    return NextResponse.json({ message: "New verification code sent to your email" }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Resend verification error:", errorMessage)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

