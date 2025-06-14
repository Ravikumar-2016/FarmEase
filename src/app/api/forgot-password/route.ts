import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import crypto from "crypto"
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

    // Find user by email
    const user = await users.findOne({ email })

    // ❗ Explicit error if email doesn't exist
    if (!user) {
      return NextResponse.json(
        { message: "Email not found. Please register or check the address." },
        { status: 404 }
      )
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save reset token to DB
    await users.updateOne(
      { email },
      {
        $set: {
          passwordResetToken: resetToken,
          passwordResetExpiry: resetTokenExpiry,
          updatedAt: new Date(),
        },
      }
    )

    // Build reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    // Send email
    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json(
      { message: "Password reset instructions have been sent to your email address." },
      { status: 200 }
    )

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// 📧 Helper: Send password reset email
async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("SMTP environment variables are not set properly.")
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true = 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"FarmEase" <no-reply@farmease.com>',
    to: email,
    subject: "Password Reset Instructions",
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  })
}
