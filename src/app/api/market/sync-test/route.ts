import { NextResponse } from "next/server"
import { runMarketSync } from "@/lib/marketSync"

/**
 * Manual test endpoint for market sync
 * 
 * This allows testing the sync without cron authentication.
 * ONLY available in development mode for safety.
 * 
 * Usage: GET /api/market/sync-test
 * 
 * ✅ Correct: Direct function call (no HTTP self-call)
 * ❌ Wrong: fetch("/api/market/sync") - causes timeout/loop
 */
export async function GET() {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === "development"
  
  if (!isDev) {
    return NextResponse.json(
      { error: "Test endpoint only available in development" },
      { status: 403 }
    )
  }
  
  try {
    // Direct function call - no HTTP, no timeout, no loop
    const result = await runMarketSync()
    
    return NextResponse.json({
      testMode: true,
      ...result,
    })
  } catch (error) {
    console.error("[Sync Test] Error:", error)
    return NextResponse.json(
      { 
        error: "Sync failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
