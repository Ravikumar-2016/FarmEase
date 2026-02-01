import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Read-only API for frontend to fetch market prices from MongoDB
// This should be fast (<200ms) as it reads from cached data

interface MarketPriceDocument {
  commodity: string
  market: string
  state: string
  district?: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  unit?: string
  category?: string
  date: Date
  source: string
  lastUpdated: Date
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filter parameters
    const commodity = searchParams.get("commodity")
    const market = searchParams.get("market")
    const state = searchParams.get("state")
    const category = searchParams.get("category")
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")
    
    console.log("=== MARKET PRICES API ===")
    console.log("Filters:", { commodity, market, state, category, limit, page })

    const client = await clientPromise
    const db = client.db("FarmEase")
    const collection = db.collection<MarketPriceDocument>("market_prices")

    // Build query filter
    const filter: Record<string, unknown> = {}
    
    if (commodity) {
      filter.commodity = { $regex: commodity, $options: "i" }
    }
    if (market) {
      filter.market = { $regex: market, $options: "i" }
    }
    if (state) {
      filter.state = { $regex: state, $options: "i" }
    }
    if (category) {
      filter.category = category
    }

    // Get total count for pagination
    const totalCount = await collection.countDocuments(filter)

    // Fetch data sorted by latest update
    const skip = (page - 1) * limit
    const prices = await collection
      .find(filter)
      .sort({ lastUpdated: -1, commodity: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get metadata
    const lastSync = prices.length > 0 
      ? prices.reduce((latest, p) => 
          new Date(p.lastUpdated) > new Date(latest.lastUpdated) ? p : latest
        ).lastUpdated
      : null

    // Get unique values for filters
    const uniqueCommodities = await collection.distinct("commodity")
    const uniqueStates = await collection.distinct("state")
    const uniqueMarkets = await collection.distinct("market")
    const uniqueCategories = await collection.distinct("category")

    console.log(`✅ Returning ${prices.length} of ${totalCount} records`)

    return NextResponse.json({
      success: true,
      data: prices.map(p => ({
        _id: p._id?.toString(),
        commodity: p.commodity,
        market: p.market,
        state: p.state,
        district: p.district || null,
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        modalPrice: p.modalPrice,
        unit: p.unit || "quintal",
        category: p.category || "other",
        date: p.date,
        source: p.source,
        lastUpdated: p.lastUpdated,
      })),
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        commodities: uniqueCommodities.sort(),
        states: uniqueStates.sort(),
        markets: uniqueMarkets.sort(),
        categories: uniqueCategories.sort(),
      },
      metadata: {
        lastSync,
        source: "agmarknet.gov.in",
        disclaimer: "Prices are indicative and sourced from official government data.",
      }
    })
  } catch (error) {
    console.error("=== MARKET PRICES API ERROR ===")
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch market prices",
        data: [],
        metadata: {
          lastSync: null,
          source: "agmarknet.gov.in",
          message: "Data is being updated. Please check back later.",
        }
      },
      { status: 500 }
    )
  }
}
