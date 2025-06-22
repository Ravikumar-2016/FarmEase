import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { ObjectId } from "mongodb"

// Helper to get db from clientPromise
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(); // optionally pass your db name here
  return { db };
}

interface FarmWork {
  _id?: ObjectId
  farmerUsername: string
  cropName: string
  workType: string
  laboursRequired: number
  workDate: string
  additionalDetails: string
  area: string
  state: string
  status: string
  labourApplications: Array<{
    name: string
    mobile: string
    labourUsername: string
    appliedAt: string
  }>
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const area = searchParams.get("area")
    const state = searchParams.get("state")

    const { db } = await connectToDatabase()

    let query: Record<string, unknown> = {}

    if (username) {
      // Farmer requesting their own works
      query = { farmerUsername: username }
    } else if (area && state) {
      // Labour requesting works in their area
      query = {
        area: { $regex: new RegExp(area, "i") },
        state: { $regex: new RegExp(state, "i") },
        status: "active",
        workDate: { $gte: new Date().toISOString().split("T")[0] },
      }
    } else {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const works = await db.collection("farmWorks").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ works })
  } catch (error) {
    console.error("Error fetching farm works:", error)
    return NextResponse.json({ error: "Failed to fetch farm works" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { farmerUsername, cropName, workType, laboursRequired, workDate, additionalDetails, area, state } = body

    // Validation
    if (!farmerUsername || !cropName || !workType || !laboursRequired || !workDate || !area || !state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const labourCount = Number.parseInt(laboursRequired)
    if (labourCount < 1 || labourCount > 50) {
      return NextResponse.json({ error: "Number of laborers must be between 1 and 50" }, { status: 400 })
    }

    // Validate work date
    const workDateObj = new Date(workDate)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    if (workDateObj < tomorrow) {
      return NextResponse.json({ error: "Work date must be tomorrow or later" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const farmWork: FarmWork = {
      farmerUsername,
      cropName,
      workType,
      laboursRequired: labourCount,
      workDate,
      additionalDetails: additionalDetails || "",
      area,
      state,
      status: "active",
      labourApplications: [],
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("farmWorks").insertOne(farmWork)

    return NextResponse.json({ success: true, workId: result.insertedId })
  } catch (error) {
    console.error("Error creating farm work:", error)
    return NextResponse.json({ error: "Failed to create farm work" }, { status: 500 })
  }
}
