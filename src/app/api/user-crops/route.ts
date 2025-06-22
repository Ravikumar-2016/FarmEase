import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("FarmEase")
    const data = await request.json()

    if (data.action !== "add") {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    // Verify user exists
    const user = await db.collection("users").findOne({ username: data.username })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Prepare crop data
    const cropData = {
      username: data.username,
      cropName: data.cropName,
      soilType: data.soilType,
      environmentalParameters: {
        temperature: data.temperature,
        humidity: data.humidity,
        rainfall: data.rainfall,
        ph: data.ph,
      },
      nutrientLevels: {
        nitrogen: data.nitrogen,
        phosphorous: data.phosphorous,
        potassium: data.potassium,
        carbon: data.carbon,
      },
      addedAt: new Date(),
      lastModified: new Date(),
    }

    // Insert into userCrops collection
    const result = await db.collection("userCrops").insertOne(cropData)

    return NextResponse.json(
      {
        success: true,
        insertedId: result.insertedId,
        message: "Crop added successfully to your collection!",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in user-crops API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("FarmEase")

    // Get username from query parameters
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const uniqueOnly = searchParams.get("unique") === "true"

    if (!username) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    if (uniqueOnly) {
      // Return only unique crop names using aggregation pipeline
      const uniqueCrops = await db
        .collection("userCrops")
        .aggregate([
          { $match: { username } },
          { $group: { _id: "$cropName" } },
          { $sort: { _id: 1 } },
          { $project: { cropName: "$_id", _id: 0 } },
        ])
        .toArray()

      return NextResponse.json({
        success: true,
        crops: uniqueCrops.map((crop) => crop.cropName),
        totalCrops: uniqueCrops.length,
      })
    } else {
      // Return all crops with full details (original GET functionality)
      const crops = await db
        .collection("userCrops")
        .find({ username: username })
        .sort({ addedAt: -1 }) // Sort by newest first
        .toArray()

      return NextResponse.json(
        {
          success: true,
          crops: crops,
          count: crops.length,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error fetching user crops:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("FarmEase")
    const data = await request.json()

    if (!data.cropId || !data.username) {
      return NextResponse.json({ success: false, error: "Crop ID and username are required" }, { status: 400 })
    }

    // Verify the crop belongs to the user before deleting
    const crop = await db.collection("userCrops").findOne({
      _id: new ObjectId(data.cropId),
      username: data.username,
    })

    if (!crop) {
      return NextResponse.json({ success: false, error: "Crop not found or unauthorized" }, { status: 404 })
    }

    // Delete the crop
    const result = await db.collection("userCrops").deleteOne({
      _id: new ObjectId(data.cropId),
      username: data.username,
    })

    if (result.deletedCount === 1) {
      return NextResponse.json(
        {
          success: true,
          message: "Crop deleted successfully",
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json({ success: false, error: "Failed to delete crop" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting crop:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
