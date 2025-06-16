import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { sendEmail, generateOTP, getOTPExpiry } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email, username } = await request.json()
    console.log("Send email verification request:", { email, username })

    if (!email || !username) {
      return NextResponse.json({ message: "Email and username are required" }, { status: 400 })
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Additional validation for common invalid patterns
    const invalidPatterns = [
      /^[^@]+@[^@]+\.[a-z]{1}$/i, // Single letter TLD
      /^[^@]+@[^@]+\.cm$/i, // .cm domain (often used for spam)
      /^[^@]+@[^@]+\.tk$/i, // .tk domain (often used for spam)
      /^[^@]+@[^@]+\.ml$/i, // .ml domain (often used for spam)
      /^[^@]+@[^@]+\.ga$/i, // .ga domain (often used for spam)
      /^[^@]+@[^@]+\.cf$/i, // .cf domain (often used for spam)
    ]

    const isInvalidPattern = invalidPatterns.some((pattern) => pattern.test(email))
    if (isInvalidPattern) {
      return NextResponse.json(
        { message: "Please enter a valid email address from a recognized domain" },
        { status: 400 },
      )
    }

    // Check for valid TLD (at least 2 characters)
    const tld = email.split(".").pop()
    if (!tld || tld.length < 2) {
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    // Check if email is already used by another user
    const existingUser = await users.findOne({
      email,
      username: { $ne: username },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email is already used by another account" }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = getOTPExpiry()

    console.log("Generated OTP for email change:", otp)

    // Store OTP for email verification
    await users.updateOne(
      { username },
      {
        $set: {
          emailChangeOtp: otp,
          emailChangeOtpExpiry: otpExpiry,
          pendingEmail: email,
          updatedAt: new Date(),
        },
      },
    )

    console.log("OTP stored in database")

    // Create email template for email change verification
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">FarmEase Email Verification</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin-top: 0;">Verify Your New Email Address</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
            You requested to change your email address for your FarmEase account. Please use the verification code below to confirm this change:
          </p>
          
          <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #16a34a; letter-spacing: 4px;">
              ${otp}
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Important:</strong> This code expires in 10 minutes and can only be used once.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
          <p>This is an automated message from FarmEase. Please do not reply to this email.</p>
        </div>
      </div>
    `

    // Send verification email
    const emailSent = await sendEmail(email, "Verify Your New Email Address - FarmEase", emailTemplate)

    console.log("Email sent result:", emailSent)

    return NextResponse.json({
      message: "Verification code sent to your new email address",
    })
  } catch (error) {
    console.error("Send email verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
