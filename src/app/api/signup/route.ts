import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { sendEmail, generateOTP, getOTPExpiry, emailTemplates } from "@/lib/email"
import { Db } from "mongodb"

interface SendOTPInput {
  email: string
}

interface VerifyOTPInput {
  email: string
  otp: string
}

interface CreateAccountInput {
  email: string
  username: string
  password: string
  userType: string
  fullName?: string
  mobile?: string
  area?: string
  state?: string
  zipcode?: string
}

// Utility to Title Case
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    const client = await clientPromise
    const db: Db = client.db("FarmEase")

    switch (action) {
      case "send-otp":
        return await handleSendOTP(db, data as SendOTPInput)
      case "verify-otp":
        return await handleVerifyOTP(db, data as VerifyOTPInput)
      case "create-account":
        return await handleCreateAccount(db, data as CreateAccountInput)
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error("Signup API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

async function handleSendOTP(db: Db, { email }: SendOTPInput) {
  if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return NextResponse.json({ message: "Invalid email format" }, { status: 400 })

  const users = db.collection("users")
  const signupOtps = db.collection("signup_otps")

  const existingUser = await users.findOne({ email })
  if (existingUser) {
    return NextResponse.json({ message: "Email already registered. Please sign in instead." }, { status: 400 })
  }

  const otp = generateOTP()
  const otpExpiry = getOTPExpiry()

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
    { upsert: true }
  )

  const emailSent = await sendEmail(email, "Verify Your FarmEase Account", emailTemplates.signupVerification(otp))

  if (!emailSent) {
    return NextResponse.json({ message: "Failed to send verification email" }, { status: 500 })
  }

  return NextResponse.json({
    message: "Verification code sent to your email. It will expire in 10 minutes.",
  })
}

async function handleVerifyOTP(db: Db, { email, otp }: VerifyOTPInput) {
  if (!email || !otp) {
    return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 })
  }

  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json({ message: "OTP must be 6 digits" }, { status: 400 })
  }

  const signupOtps = db.collection("signup_otps")
  const otpRecord = await signupOtps.findOne({ email })

  if (!otpRecord || otpRecord.otp !== otp || new Date(otpRecord.otpExpiry) < new Date()) {
    return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 })
  }

  await signupOtps.updateOne({ email }, { $set: { verified: true, verifiedAt: new Date() } })

  return NextResponse.json({ message: "Email verified successfully" })
}

async function handleCreateAccount(db: Db, accountData: CreateAccountInput) {
  let {
    email,
    username,
    password,
    userType,
    fullName = "",
    mobile = "",
    area = "",
    state = "",
    zipcode = "",
  } = accountData

  // Trim and format fields
  email = email.trim()
  username = username.trim()
  fullName = toTitleCase(fullName.trim())
  mobile = mobile.trim()
  area = toTitleCase(area.trim())
  state = toTitleCase(state.trim())
  zipcode = zipcode.trim()

  if (!email || !username || !password || !userType) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
  }

  if (mobile && !/^\d{10}$/.test(mobile)) {
    return NextResponse.json({ message: "Mobile number must be 10 digits" }, { status: 400 })
  }

  const users = db.collection("users")
  const signupOtps = db.collection("signup_otps")

  const otpRecord = await signupOtps.findOne({ email, verified: true })
  if (!otpRecord) {
    return NextResponse.json({ message: "Email not verified" }, { status: 400 })
  }

  const existingUser = await users.findOne({ $or: [{ username }, { email }] })
  if (existingUser) {
    return NextResponse.json(
      { message: existingUser.username === username ? "Username already exists" : "Email already exists" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser = {
    username,
    email,
    password: hashedPassword,
    userType,
    fullName,
    mobile,
    area,
    state,
    zipcode,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await users.insertOne(newUser)

  if (!result.insertedId) {
    return NextResponse.json({ message: "Failed to create account" }, { status: 500 })
  }

  await signupOtps.deleteOne({ email })

  return NextResponse.json({
    message: "Account created successfully!",
    userType,
    username,
  })
}
