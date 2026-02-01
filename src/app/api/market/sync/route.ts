import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// =======================
// COMMODITY DATA
// =======================
const COMMODITY_DATA: Array<{
  commodity: string
  market: string
  state: string
  price: number
  unit: string
}> = [
  // Add your commodity data here, for example:
  // { commodity: "Rice", market: "Delhi", state: "Delhi", price: 2500, unit: "quintal" },
]

// =======================
// SECURITY CONFIG
// =======================
// Allowed callers:
// 1. cron-job.org (Authorization header)
// 2. (Optional) Vercel cron (user-agent check)

export async function GET(request: Request) {
  try {
    // ---------- AUTH START ----------
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    const userAgent = request.headers.get("user-agent") || ""

    const isExternalCron = authHeader === `Bearer ${cronSecret}`
    const isVercelCron = userAgent.includes("vercel-cron")

    if (!cronSecret) {
      console.error("❌ CRON_SECRET not configured")
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 })
    }

    if (!isExternalCron && !isVercelCron) {
      console.log("⚠️ Unauthorized sync attempt blocked")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // ---------- AUTH END ----------

    console.log("=== MARKET PRICES SYNC STARTED ===")
    console.log("Time:", new Date().toISOString())

    const client = await clientPromise
    const db = client.db("FarmEase")
    const collection = db.collection("market_prices")

    const now = new Date()
    let upsertCount = 0

    for (const item of COMMODITY_DATA) {
      const updatedItem = {
        ...item,
        date: now,
        lastUpdated: now,
      }

      await collection.updateOne(
        { commodity: item.commodity, market: item.market, state: item.state },
        { $set: updatedItem },
        { upsert: true }
      )

      upsertCount++
    }

    console.log(`✅ Sync completed: ${upsertCount} records`)
    console.log("=== MARKET PRICES SYNC ENDED ===")

    return NextResponse.json({
      success: true,
      upserted: upsertCount,
      syncedAt: now.toISOString(),
    })
  } catch (error) {
    console.error("❌ SYNC ERROR", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
