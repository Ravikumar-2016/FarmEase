/**
 * Market Price Sync Logic
 * 
 * Core sync logic for the market price system.
 * This module is called by both the cron API and test API.
 * 
 * Flow:
 * 1. Read reference base prices
 * 2. Apply realistic daily variation (±2-4%)
 * 3. Write to MongoDB with bulkWrite (upsert)
 * 4. Return summary
 * 
 * Rules:
 * ✅ Idempotent (safe to run multiple times)
 * ✅ Uses bulkWrite with upsert (no duplicates)
 * ✅ Deterministic per day (same day = same prices)
 * ✅ Fast and reliable
 * ❌ No scraping
 * ❌ No external HTTP calls
 */

import clientPromise from "@/lib/mongodb"
import { REFERENCE_PRICES, type ReferencePrice } from "@/lib/referenceData"

/**
 * Result of a market sync operation
 */
export interface MarketSyncResult {
  success: boolean
  message: string
  stats: {
    total: number
    upserted: number
    modified: number
    errors: number
  }
  timestamp: string
  duration: number
}

/**
 * Database document structure
 */
export interface MarketPriceDocument {
  commodity: string
  market: string
  state: string
  district: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  unit: string
  category: string
  date: string // YYYY-MM-DD
  lastUpdated: Date
  source: string
}

/**
 * Generate a seeded random number based on date and identifier
 * This ensures the same input produces the same output
 */
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  // Convert to 0-1 range
  return Math.abs(Math.sin(hash)) 
}

/**
 * Apply daily price variation to a base price
 * Variation range: ±2-4%
 * 
 * @param basePrice - The reference base price
 * @param date - The date string (YYYY-MM-DD)
 * @param identifier - Unique identifier for the commodity/market combo
 * @returns Adjusted price with daily variation
 */
function applyDailyVariation(
  basePrice: number,
  date: string,
  identifier: string
): number {
  const seed = `${date}-${identifier}`
  const random = seededRandom(seed)
  
  // Variation between -4% and +4%
  const variationPercent = (random - 0.5) * 0.08
  const adjustedPrice = basePrice * (1 + variationPercent)
  
  // Round to nearest whole number
  return Math.round(adjustedPrice)
}

/**
 * Generate market prices with daily variation
 */
function generateDailyPrices(date: string): MarketPriceDocument[] {
  const now = new Date()
  
  return REFERENCE_PRICES.map((ref: ReferencePrice) => {
    // Create unique identifier for seeded variation
    const identifier = `${ref.commodity}-${ref.market}-${ref.state}`
    
    // Apply variation to each price component
    const minPrice = applyDailyVariation(ref.minPrice, date, `${identifier}-min`)
    const maxPrice = applyDailyVariation(ref.maxPrice, date, `${identifier}-max`)
    const modalPrice = applyDailyVariation(ref.modalPrice, date, `${identifier}-modal`)
    
    // Ensure min <= modal <= max
    const sortedPrices = [minPrice, modalPrice, maxPrice].sort((a, b) => a - b)
    
    return {
      commodity: ref.commodity,
      market: ref.market,
      state: ref.state,
      district: ref.district,
      minPrice: sortedPrices[0],
      maxPrice: sortedPrices[2],
      modalPrice: sortedPrices[1],
      unit: ref.unit,
      category: ref.category,
      date: date,
      lastUpdated: now,
      source: "agmarknet-reference",
    }
  })
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  const now = new Date()
  return now.toISOString().split("T")[0]
}

/**
 * Main sync function
 * 
 * This function:
 * 1. Generates prices with daily variation
 * 2. Writes to MongoDB using bulkWrite with upsert
 * 3. Returns a summary of the operation
 */
export async function runMarketSync(): Promise<MarketSyncResult> {
  const startTime = Date.now()
  const date = getTodayDate()
  
  console.log(`[MarketSync] Starting sync for date: ${date}`)
  
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("FarmEase")
    const collection = db.collection("market_prices")
    
    // Generate prices for today
    const prices = generateDailyPrices(date)
    console.log(`[MarketSync] Generated ${prices.length} price records`)
    
    // Create bulk write operations with upsert
    const operations = prices.map((price) => ({
      updateOne: {
        filter: {
          commodity: price.commodity,
          market: price.market,
          state: price.state,
        },
        update: {
          $set: price,
        },
        upsert: true,
      },
    }))
    
    // Execute bulk write
    const result = await collection.bulkWrite(operations, { ordered: false })
    
    const stats = {
      total: prices.length,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      errors: 0,
    }
    
    const duration = Date.now() - startTime
    
    console.log(`[MarketSync] Sync completed in ${duration}ms`)
    console.log(`[MarketSync] Stats: ${JSON.stringify(stats)}`)
    
    return {
      success: true,
      message: `Successfully synced ${stats.total} market prices`,
      stats,
      timestamp: new Date().toISOString(),
      duration,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    console.error(`[MarketSync] Error: ${errorMessage}`)
    
    return {
      success: false,
      message: `Sync failed: ${errorMessage}`,
      stats: {
        total: 0,
        upserted: 0,
        modified: 0,
        errors: 1,
      },
      timestamp: new Date().toISOString(),
      duration,
    }
  }
}

/**
 * Validate CRON_SECRET
 */
export function validateCronSecret(authHeader: string | null): boolean {
  if (!authHeader) return false
  
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    console.warn("[MarketSync] CRON_SECRET not configured")
    return false
  }
  
  // Support both "Bearer <token>" and just "<token>"
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7) 
    : authHeader
  
  return token === cronSecret
}
