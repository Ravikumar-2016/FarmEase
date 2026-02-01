import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// =======================
// SEED DATA (same as yours)
// =======================
const COMMODITY_DATA = [
  { commodity: "Rice (Paddy)", market: "Karnal", state: "Haryana", district: "Karnal", minPrice: 2150, maxPrice: 2350, modalPrice: 2250 },
  { commodity: "Rice (Paddy)", market: "Guntur", state: "Andhra Pradesh", district: "Guntur", minPrice: 2100, maxPrice: 2280, modalPrice: 2180 },
  { commodity: "Wheat", market: "Indore", state: "Madhya Pradesh", district: "Indore", minPrice: 2275, maxPrice: 2450, modalPrice: 2350 },
  { commodity: "Onion", market: "Lasalgaon", state: "Maharashtra", district: "Nashik", minPrice: 1200, maxPrice: 1800, modalPrice: 1500 },
  { commodity: "Tomato", market: "Kolar", state: "Karnataka", district: "Kolar", minPrice: 1500, maxPrice: 2500, modalPrice: 2000 },
  { commodity: "Cotton", market: "Nagpur", state: "Maharashtra", district: "Nagpur", minPrice: 6700, maxPrice: 7300, modalPrice: 7000 },
]

// =======================
// API
// =======================
export async function GET(request: Request) {
  try {
    // ---------- AUTH ----------
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      return NextResponse.json({ error: "CRON_SECRET missing" }, { status: 500 })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // --------------------------

    const client = await clientPromise
    const db = client.db("FarmEase")
    const collection = db.collection("market_prices")

    const now = new Date()

    // 🔥 GUARANTEED INSERT USING BULKWRITE
    const ops = COMMODITY_DATA.map(item => ({
      updateOne: {
        filter: {
          commodity: item.commodity,
          market: item.market,
          state: item.state,
        },
        update: {
          $set: {
            ...item,
            date: now,
            lastUpdated: now,
            source: "agmarknet",
          }
        },
        upsert: true
      }
    }))

    const result = await collection.bulkWrite(ops)

    const total = await collection.countDocuments()

    console.log("UPSERTED:", result.upsertedCount)
    console.log("MODIFIED:", result.modifiedCount)
    console.log("TOTAL DOCS IN DB:", total)

    return NextResponse.json({
      success: true,
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
      totalInDb: total,
      syncedAt: now.toISOString()
    })
  } catch (error) {
    console.error("SYNC ERROR:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
