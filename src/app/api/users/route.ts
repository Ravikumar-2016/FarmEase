import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("FarmEase")
  return { db }
}

// GET user data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ username })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
