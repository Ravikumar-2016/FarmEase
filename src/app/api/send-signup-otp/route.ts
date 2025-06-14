import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

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
    const signupOtps = db.collection("signup_otps")

    // Check if email already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered. Please sign in instead." }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in temporary collection
    await signupOtps.updateOne(
      { email },
      {
        $set: {
          email,
          otp,
          otpExpiry,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    await sendSignupOtpEmail(email, otp)

    return NextResponse.json(
      { message: "Verification code sent to your email. It will expire in 10 minutes." },
      { status: 200 },
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Send signup OTP error:", errorMessage)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Send signup OTP email
async function sendSignupOtpEmail(email: string, otp: string): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || typeof SMTP_SECURE === "undefined") {
    console.log(`Signup verification OTP for ${email}: ${otp}`) // For development
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
    subject: "Welcome to FarmEase - Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to FarmEase!</h2>
        <p>Thank you for choosing FarmEase. To complete your registration, please verify your email address.</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #16a34a; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This verification code will expire in 10 minutes</li>
          <li>This code can only be used once</li>
          <li>Do not share this code with anyone</li>
        </ul>
        <p>If you did not request this verification, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated message from FarmEase. Please do not reply to this email.
        </p>
      </div>
    `,
  })
}
