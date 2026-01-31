import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const PLANTNET_API_KEY = process.env.PLANTNET_API_KEY

// Treatment document stored in MongoDB (curated, verified data)
interface TreatmentDocument {
  code: string              // EPPO code (primary key)
  name: string              // Disease name
  crop?: string             // Affected crop
  precautions: string[]
  pesticide: string | null
  dosage: string | null
  organicAlternative: string | null
  applicationMethod?: string | null
  safetyWarnings: string[]
  source: "verified" | "expert"
}

// General precautions for unknown diseases (honest fallback)
const GENERAL_PRECAUTIONS = [
  "Isolate affected plants to prevent spread to healthy plants",
  "Remove and safely destroy severely infected plant parts",
  "Improve air circulation around plants",
  "Avoid overhead watering to reduce humidity on leaves",
  "Consult a local agriculture officer for specific treatment",
  "Take multiple clear photos from different angles for better identification",
  "Monitor neighboring plants for early signs of infection"
]

const GENERAL_SAFETY_WARNINGS = [
  "Always read pesticide labels carefully before use",
  "Wear protective equipment during any chemical application",
  "Keep children and pets away from treated areas",
  "Follow recommended waiting period before harvest"
]

// GET - Fetch user's analysis history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required", history: [] },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const historyCollection = db.collection("pesticide_ai_history")

    const history = await historyCollection
      .find({ userId: username })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({ success: true, history })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch history", history: [] },
      { status: 500 }
    )
  }
}

// POST - Analyze image for disease (2-Layer Architecture: PlantNet + MongoDB)
// NO external AI APIs - fully database-driven for reliability
export async function POST(request: Request) {
  try {
    const { imageUrl, username } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400 }
      )
    }

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      )
    }

    if (!PLANTNET_API_KEY) {
      console.error("PlantNet API key not configured")
      return NextResponse.json(
        { success: false, error: "PlantNet API key not configured" },
        { status: 500 }
      )
    }

    console.log("=== PESTICIDE AI REQUEST ===")
    console.log("Image URL:", imageUrl)
    console.log("Username:", username)

    // ============================================
    // LAYER 1: PLANTNET DISEASE DETECTION
    // ============================================
    
    // Step 1.1: Fetch the image from Cloudinary
    let imageBlob: Blob
    try {
      console.log("Fetching image from Cloudinary...")
      const imageResponse = await fetch(imageUrl)
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`)
      }
      
      const arrayBuffer = await imageResponse.arrayBuffer()
      imageBlob = new Blob([arrayBuffer], { type: "image/jpeg" })
      console.log("Image fetched successfully, size:", arrayBuffer.byteLength, "bytes")
    } catch (fetchError) {
      console.error("Failed to fetch image from URL:", fetchError)
      return NextResponse.json(
        { success: false, error: "Failed to fetch image from URL" },
        { status: 400 }
      )
    }

    // Step 1.2: Call PlantNet Disease Identification API with retry logic
    let detectedDisease = ""
    let confidence = 0
    let eppoCode = ""
    let plantNetRawResponse: unknown = null
    let allResults: Array<{ disease: string; code: string; score: number }> = []

    const MAX_RETRIES = 3
    const TIMEOUT_MS = 30000

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`=== LAYER 1: PlantNet Detection (Attempt ${attempt}/${MAX_RETRIES}) ===`)
        
        const formData = new FormData()
        formData.append("images", imageBlob, "plant-disease.jpg")
        formData.append("organs", "leaf")

        const plantNetUrl = `https://my-api.plantnet.org/v2/diseases/identify?include-related-images=false&no-reject=true&nb-results=5&lang=en&api-key=${PLANTNET_API_KEY}`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

        const plantNetResponse = await fetch(plantNetUrl, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        console.log("PlantNet Response Status:", plantNetResponse.status)
        const responseText = await plantNetResponse.text()
        console.log("PlantNet Raw Response:", responseText.substring(0, 800))

        if (plantNetResponse.ok) {
          plantNetRawResponse = JSON.parse(responseText)
          
          const plantNetData = plantNetRawResponse as {
            results?: Array<{
              name?: string
              score?: number
              description?: string
            }>
            remainingIdentificationRequests?: number
          }

          console.log("Remaining PlantNet requests:", plantNetData.remainingIdentificationRequests)

          if (plantNetData.results && plantNetData.results.length > 0) {
            const topResult = plantNetData.results[0]
            confidence = topResult.score || 0
            eppoCode = topResult.name || ""  // EPPO code is the PRIMARY KEY
            detectedDisease = topResult.description || eppoCode || ""
            
            allResults = plantNetData.results.map(r => ({
              disease: r.description || r.name || "Unknown",
              code: r.name || "",
              score: r.score || 0
            }))

            console.log("✅ Disease Detected:", detectedDisease)
            console.log("✅ EPPO Code:", eppoCode)
            console.log("✅ Confidence:", confidence)
          }
          break // Success - exit retry loop
        } else {
          console.error("PlantNet API error:", responseText)
        }
      } catch (plantNetError) {
        const errorMessage = plantNetError instanceof Error ? plantNetError.message : String(plantNetError)
        const isNetworkError = errorMessage.includes("fetch failed") || errorMessage.includes("ENOTFOUND") || errorMessage.includes("ETIMEDOUT") || errorMessage.includes("abort")
        
        console.error(`PlantNet API failed (Attempt ${attempt}):`, errorMessage)
        
        if (isNetworkError) {
          console.error("🔴 Network error - cannot reach PlantNet server")
        }
        
        if (attempt < MAX_RETRIES) {
          const waitTime = Math.pow(2, attempt) * 1000
          console.log(`⏳ Waiting ${waitTime/1000}s before retry...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        } else {
          // All retries failed - log final error
          console.error("❌ PlantNet API unreachable after all retries. Network issue or PlantNet server down.")
        }
      }
    }

    // If PlantNet completely failed, return a user-friendly error
    if (!detectedDisease && !eppoCode) {
      console.log("⚠️ PlantNet detection failed - returning network error response")
      
      // Still save to history so user can see the attempt
      const client = await clientPromise
      const db = client.db("FarmEase")
      const historyCollection = db.collection("pesticide_ai_history")
      
      await historyCollection.insertOne({
        userId: username,
        imageUrl,
        disease: "Detection Failed - Network Error",
        eppoCode: null,
        confidence: 0,
        confidenceLevel: "unknown",
        dataSource: "general",
        plantNetResponse: null,
        treatment: {
          precautions: GENERAL_PRECAUTIONS,
          pesticide: null,
          dosage: null,
          organicAlternative: null,
          applicationMethod: null,
          safetyWarnings: GENERAL_SAFETY_WARNINGS,
          crop: null,
        },
        confidenceMessage: "Unable to analyze - please check your network connection and try again.",
        error: "PlantNet API unreachable",
        createdAt: new Date(),
      })
      
      return NextResponse.json({
        success: true,
        result: {
          diseaseName: "Unable to Analyze - Network Error",
          eppoCode: null,
          confidence: 0,
          confidenceLevel: "unknown",
          precautions: GENERAL_PRECAUTIONS,
          pesticide: null,
          dosage: null,
          organicAlternative: null,
          applicationMethod: null,
          safetyWarnings: GENERAL_SAFETY_WARNINGS,
          crop: null,
          dataSource: "general",
          isIdentified: false,
          alternativeResults: [],
          confidenceMessage: "⚠️ Unable to connect to disease detection service. Please check your internet connection and try again. If the problem persists, the PlantNet server may be temporarily unavailable.",
        }
      })
    }

    // ============================================
    // LAYER 2: MONGODB VERIFIED TREATMENT LOOKUP (with retry)
    // ============================================
    
    console.log("=== LAYER 2: MongoDB Treatment Lookup ===")
    
    let treatment: TreatmentDocument | null = null
    let dataSource: "verified" | "general" = "general"
    let mongoConnected = false
    
    // Retry MongoDB connection up to 3 times
    for (let mongoAttempt = 1; mongoAttempt <= 3; mongoAttempt++) {
      try {
        const client = await clientPromise
        const db = client.db("FarmEase")
        const treatmentsCollection = db.collection<TreatmentDocument>("disease_treatments")

        // Search by EPPO code ONLY (primary key - most accurate)
        if (eppoCode) {
          treatment = await treatmentsCollection.findOne({ code: eppoCode })
          if (treatment) {
            console.log("✅ Found VERIFIED treatment by EPPO code:", eppoCode)
            dataSource = "verified"
          }
        }

        // If not found by EPPO code, try disease name keywords as fallback
        if (!treatment && detectedDisease) {
          const searchTerms = detectedDisease.toLowerCase().split(/[\s\-−]+/).filter(word => 
            word.length > 3 && !["the", "and", "disease", "leaf", "plant", "spot"].includes(word)
          )
          
          for (const term of searchTerms) {
            treatment = await treatmentsCollection.findOne({
              name: { $regex: term, $options: "i" }
            })
            if (treatment) {
              console.log("✅ Found VERIFIED treatment by name:", term)
              dataSource = "verified"
              break
            }
          }
        }
        
        mongoConnected = true
        break // Success - exit retry loop
      } catch (mongoError) {
        const errorMsg = mongoError instanceof Error ? mongoError.message : String(mongoError)
        console.error(`MongoDB attempt ${mongoAttempt}/3 failed:`, errorMsg)
        
        if (mongoAttempt < 3) {
          console.log(`⏳ Waiting 2s before MongoDB retry...`)
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }
    
    if (!mongoConnected) {
      console.error("❌ MongoDB connection failed after all retries")
    }

    // ============================================
    // BUILD FINAL RESULT (Honest, No Fake Data)
    // ============================================
    
    console.log("=== BUILDING FINAL RESULT ===")
    console.log("Data Source:", dataSource)
    console.log("Treatment Found:", !!treatment)

    // Determine confidence level for UI
    let confidenceLevel: "high" | "medium" | "low" | "unknown" = "unknown"
    if (confidence >= 0.7) confidenceLevel = "high"
    else if (confidence >= 0.4) confidenceLevel = "medium"
    else if (confidence > 0) confidenceLevel = "low"

    // Build result - NEVER fake pesticide data for unknown diseases
    const result = {
      // Detection info
      diseaseName: detectedDisease || "Unable to identify disease",
      eppoCode: eppoCode || null,
      confidence,
      confidenceLevel,
      
      // Treatment info - ONLY from verified DB, or null
      precautions: treatment?.precautions || GENERAL_PRECAUTIONS,
      pesticide: treatment?.pesticide || null,  // NULL if not verified - never fake
      dosage: treatment?.dosage || null,
      organicAlternative: treatment?.organicAlternative || null,
      applicationMethod: treatment?.applicationMethod || null,
      safetyWarnings: treatment?.safetyWarnings || GENERAL_SAFETY_WARNINGS,
      crop: treatment?.crop || null,
      
      // Metadata - always indicate source honestly
      dataSource,
      isIdentified: !!detectedDisease && confidence > 0,
      alternativeResults: allResults.slice(1, 4),
      
      // User guidance based on confidence
      confidenceMessage: getConfidenceMessage(confidence, dataSource),
    }

    console.log("=== FINAL RESULT ===")
    console.log("Disease:", result.diseaseName)
    console.log("Data Source:", result.dataSource)
    console.log("Confidence:", result.confidence)
    console.log("Pesticide:", result.pesticide)

    // Save to history with FULL treatment data (with retry for unstable connections)
    try {
      const client = await clientPromise
      const db = client.db("FarmEase")
      const historyCollection = db.collection("pesticide_ai_history")
      
      await historyCollection.insertOne({
        userId: username,
        imageUrl,
        disease: result.diseaseName,
        eppoCode: result.eppoCode,
        confidence: result.confidence,
        confidenceLevel: result.confidenceLevel,
        dataSource: result.dataSource,
        plantNetResponse: plantNetRawResponse,
        // Save complete treatment for history retrieval
        treatment: {
          precautions: result.precautions,
          pesticide: result.pesticide,
          dosage: result.dosage,
          organicAlternative: result.organicAlternative,
          applicationMethod: result.applicationMethod,
          safetyWarnings: result.safetyWarnings,
          crop: result.crop,
        },
        confidenceMessage: result.confidenceMessage,
        createdAt: new Date(),
      })
      console.log("✅ History saved successfully")
    } catch (historyError) {
      console.error("⚠️ Failed to save history (non-critical):", historyError instanceof Error ? historyError.message : historyError)
      // Continue anyway - history save failure shouldn't block the response
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error("=== PESTICIDE AI ERROR ===")
    console.error("Error:", error instanceof Error ? error.message : String(error))
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to analyze image. Please try again.",
        result: {
          diseaseName: "Analysis Failed",
          confidence: 0,
          confidenceLevel: "unknown",
          dataSource: "general",
          isIdentified: false,
          precautions: GENERAL_PRECAUTIONS,
          pesticide: null,
          dosage: null,
          organicAlternative: null,
          safetyWarnings: GENERAL_SAFETY_WARNINGS,
          confidenceMessage: "Unable to process the image. Please try again with a clearer photo.",
        }
      },
      { status: 500 }
    )
  }
}

// Helper function to generate user-friendly confidence message
function getConfidenceMessage(confidence: number, dataSource: "verified" | "general"): string {
  if (confidence >= 0.7 && dataSource === "verified") {
    return "✅ High confidence detection with expert-recommended treatment."
  } else if (confidence >= 0.7 && dataSource === "general") {
    return "✅ High confidence detection. Follow the recommended precautions."
  } else if (confidence >= 0.4 && dataSource === "verified") {
    return "Moderate confidence detection with recommended treatment."
  } else if (confidence >= 0.4) {
    return "Moderate confidence detection. Follow the precautions carefully."
  } else if (confidence >= 0.2) {
    return "⚠️ Low confidence - please upload clearer images for better accuracy."
  } else if (confidence > 0) {
    return "⚠️ Very low confidence - try with a better quality, well-lit photo."
  }
  return "Could not identify the disease. Please try with a clearer photo."
}
