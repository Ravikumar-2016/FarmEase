import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const users = db.collection("users")

    const user = await users.findOne({ username })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.zipcode) {
      return NextResponse.json(
        { error: "User location not found. Please update your profile with zipcode information." },
        { status: 400 },
      )
    }

    return NextResponse.json({
      area: user.area || "",
      zipcode: user.zipcode,
      state: user.state || "",
    })
  } catch (error) {
    console.error("Location fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch location data" }, { status: 500 })
  }
}
