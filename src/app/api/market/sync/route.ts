/**
 * Market Sync API - Cron Endpoint
 * 
 * Endpoint: POST /api/market/sync
 * 
 * This API is called by the external cron job (cron-job.org)
 * to sync market prices once per day.
 * 
 * Security:
 * - Requires Authorization header with CRON_SECRET
 * - Logs all sync attempts
 * 
 * Flow:
 * 1. Validate cron secret
 * 2. Call runMarketSync()
 * 3. Return JSON summary
 */

import { NextRequest, NextResponse } from "next/server"
import { runMarketSync, validateCronSecret } from "@/lib/marketSync"

export const dynamic = "force-dynamic"
export const maxDuration = 60 // 60 second timeout

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  console.log("[API/market/sync] Received POST request")
  
  try {
    // Validate cron secret
    const authHeader = request.headers.get("authorization")
    
    if (!validateCronSecret(authHeader)) {
      console.warn("[API/market/sync] Unauthorized request")
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "Invalid or missing authorization token",
        },
        { status: 401 }
      )
    }
    
    console.log("[API/market/sync] Authorization validated, starting sync...")
    
    // Run the sync
    const result = await runMarketSync()
    
    const duration = Date.now() - startTime
    console.log(`[API/market/sync] Completed in ${duration}ms`)
    
    return NextResponse.json({
      ...result,
      apiDuration: duration,
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    console.error("[API/market/sync] Error:", errorMessage)
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        apiDuration: duration,
      },
      { status: 500 }
    )
  }
}

// Also support GET for easy testing (still requires auth)
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  console.log("[API/market/sync] Received GET request")
  
  try {
    // Validate cron secret
    const authHeader = request.headers.get("authorization")
    
    if (!validateCronSecret(authHeader)) {
      console.warn("[API/market/sync] Unauthorized GET request")
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: "Invalid or missing authorization token",
          hint: "Use: Authorization: Bearer YOUR_CRON_SECRET",
        },
        { status: 401 }
      )
    }
    
    console.log("[API/market/sync] Authorization validated, starting sync...")
    
    // Run the sync
    const result = await runMarketSync()
    
    const duration = Date.now() - startTime
    console.log(`[API/market/sync] Completed in ${duration}ms`)
    
    return NextResponse.json({
      ...result,
      apiDuration: duration,
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    console.error("[API/market/sync] Error:", errorMessage)
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        apiDuration: duration,
      },
      { status: 500 }
    )
  }
}
