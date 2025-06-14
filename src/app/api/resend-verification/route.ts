import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import nodemailer from "nodemailer"

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
    const emailVerificationOtp = Math.floor(100000 + Math.random() * 900000).toString()
    const emailVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

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
    await sendVerificationEmail(email, emailVerificationOtp)

    return NextResponse.json({ message: "New verification code sent to your email" }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Resend verification error:", errorMessage)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Send verification email
async function sendVerificationEmail(email: string, otp: string): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || typeof SMTP_SECURE === "undefined") {
    console.log(`Email verification OTP for ${email}: ${otp}`) // For development
    console.log("SMTP not configured - OTP logged to console for development")
    return
  }

  const smtpPort = Number.parseInt(SMTP_PORT as string, 10)

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "Verify Your FarmEase Account - New Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">New Verification Code</h2>
        <p>You requested a new verification code for your FarmEase account.</p>
        <p>Please use the code below to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #16a34a; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This verification code will expire in 10 minutes</li>
          <li>This code can only be used once</li>
          <li>Do not share this code with anyone</li>
        </ul>
        <p>If you did not request this code, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated message from FarmEase. Please do not reply to this email.
        </p>
      </div>
    `,
  })
}
