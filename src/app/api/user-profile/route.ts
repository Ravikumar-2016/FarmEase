import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ message: "Username is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    const user = await users.findOne(
      { username },
      {
        projection: {
          password: 0,
          resetOtp: 0,
          resetOtpExpiry: 0,
          emailVerificationOtp: 0,
          emailVerificationExpiry: 0,
          emailChangeOtp: 0,
          emailChangeOtpExpiry: 0,
        },
      },
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    console.log("Found user:", {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      mobile: user.mobile,
      area: user.area,
      state: user.state,
      zipcode: user.zipcode,
      userType: user.userType,
    })

    return NextResponse.json({
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName || "",
        mobile: user.mobile || "",
        area: user.area || "",
        state: user.state || "",
        zipcode: user.zipcode || "",
        userType: user.userType,
      },
    })
  } catch (error) {
    console.error("User profile fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
