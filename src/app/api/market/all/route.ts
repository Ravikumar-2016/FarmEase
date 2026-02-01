/**
 * Market Prices Read API
 * 
 * Endpoint: GET /api/market/all
 * 
 * This API fetches market prices from the database.
 * It is used by the frontend to display prices to users.
 * 
 * Features:
 * - No authentication required (public read)
 * - Sorted by lastUpdated (newest first)
 * - Supports filtering by commodity, state, category
 * - Returns all prices if no filters applied
 * 
 * Query Parameters:
 * - commodity: Filter by commodity name
 * - state: Filter by state
 * - category: Filter by category
 * - limit: Maximum number of results (default: 100)
 */

import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const commodity = searchParams.get("commodity")
    const state = searchParams.get("state")
    const category = searchParams.get("category")
    const limit = parseInt(searchParams.get("limit") || "100", 10)
    
    // Build query filter
    const filter: Record<string, string> = {}
    
    if (commodity) {
      filter.commodity = commodity
    }
    if (state) {
      filter.state = state
    }
    if (category) {
      filter.category = category
    }
    
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("FarmEase")
    const collection = db.collection("market_prices")
    
    // Fetch prices from database
    const prices = await collection
      .find(filter)
      .sort({ lastUpdated: -1 })
      .limit(limit)
      .toArray()
    
    // Get total count for pagination info
    const totalCount = await collection.countDocuments(filter)
    
    // Get unique values for filters
    const [commodities, states, categories] = await Promise.all([
      collection.distinct("commodity"),
      collection.distinct("state"),
      collection.distinct("category"),
    ])
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      data: prices,
      meta: {
        count: prices.length,
        totalCount,
        limit,
        filters: {
          commodity,
          state,
          category,
        },
        available: {
          commodities,
          states,
          categories,
        },
      },
      duration,
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    console.error("[API/market/all] Error:", errorMessage)
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        data: [],
        duration,
      },
      { status: 500 }
    )
  }
}
