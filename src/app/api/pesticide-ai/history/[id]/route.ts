import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single history item with full details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: "History ID is required" },
        { status: 400 }
      )
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid history ID format" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("FarmEase")
    const historyCollection = db.collection("pesticide_ai_history")
    const treatmentsCollection = db.collection("disease_treatments")

    // Fetch the history item
    const historyItem = await historyCollection.findOne({ _id: new ObjectId(id) })

    if (!historyItem) {
      return NextResponse.json(
        { success: false, error: "History item not found" },
        { status: 404 }
      )
    }

    // Try to fetch the cached treatment for more details
    let fullTreatment = null
    if (historyItem.eppoCode) {
      fullTreatment = await treatmentsCollection.findOne({ code: historyItem.eppoCode })
    }
    if (!fullTreatment && historyItem.disease) {
      fullTreatment = await treatmentsCollection.findOne({
        name: { $regex: historyItem.disease.split(" ")[0], $options: "i" }
      })
    }

    // Determine confidence level
    const confidence = historyItem.confidence || 0
    let confidenceLevel: "high" | "medium" | "low" | "unknown" = historyItem.confidenceLevel || "unknown"
    if (!historyItem.confidenceLevel) {
      if (confidence >= 0.7) confidenceLevel = "high"
      else if (confidence >= 0.4) confidenceLevel = "medium"
      else if (confidence > 0) confidenceLevel = "low"
    }

    // Use saved treatment data first, then fall back to cached treatments collection
    const savedTreatment = historyItem.treatment
    
    // Build full result object (same structure as fresh analysis)
    const result = {
      // Detection info
      diseaseName: historyItem.disease || "Unknown Disease",
      eppoCode: historyItem.eppoCode || null,
      confidence: historyItem.confidence || 0,
      confidenceLevel,
      
      // Treatment info - prioritize saved data from history
      precautions: savedTreatment?.precautions || fullTreatment?.precautions || [
        "Please consult a local agriculture officer for detailed precautions",
        "Monitor plant health closely",
        "Ensure proper sanitation practices"
      ],
      pesticide: savedTreatment?.pesticide || fullTreatment?.pesticide || null,
      dosage: savedTreatment?.dosage || fullTreatment?.dosage || null,
      organicAlternative: savedTreatment?.organicAlternative || fullTreatment?.organicAlternative || null,
      applicationMethod: savedTreatment?.applicationMethod || fullTreatment?.applicationMethod || null,
      safetyWarnings: savedTreatment?.safetyWarnings || fullTreatment?.safetyWarnings || [
        "Always read pesticide labels before use",
        "Wear protective equipment during application"
      ],
      
      // Metadata
      dataSource: historyItem.dataSource || (fullTreatment ? "verified" : "general"),
      isIdentified: !!(historyItem.disease && historyItem.confidence > 0),
      alternativeResults: [],
      crop: savedTreatment?.crop || fullTreatment?.crop || null,
      
      // Confidence message
      confidenceMessage: historyItem.confidenceMessage || getConfidenceMessage(confidence, historyItem.dataSource || "general"),
      
      // History metadata
      analyzedAt: historyItem.createdAt,
      imageUrl: historyItem.imageUrl,
    }

    return NextResponse.json({
      success: true,
      result,
      historyItem: {
        _id: historyItem._id.toString(),
        imageUrl: historyItem.imageUrl,
        createdAt: historyItem.createdAt,
      }
    })
  } catch (error) {
    console.error("Error fetching history item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch history details" },
      { status: 500 }
    )
  }
}

// Helper function to generate confidence message
function getConfidenceMessage(confidence: number, dataSource: string): string {
  if (confidence >= 0.7 && dataSource === "verified") {
    return "✅ High confidence detection with expert-recommended treatment."
  } else if (confidence >= 0.7) {
    return "✅ High confidence detection. Follow the recommended precautions."
  } else if (confidence >= 0.4 && dataSource === "verified") {
    return "Moderate confidence detection with recommended treatment."
  } else if (confidence >= 0.4) {
    return "Moderate confidence detection. Follow the precautions carefully."
  } else if (confidence >= 0.2) {
    return "⚠️ Low confidence - please upload clearer images for better accuracy."
  } else if (confidence > 0) {
    return "⚠️ Very low confidence - try with a better quality photo."
  }
  return "Could not identify the disease. Please try with a clearer photo."
}
