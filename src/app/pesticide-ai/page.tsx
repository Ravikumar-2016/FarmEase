"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Upload,
  Camera,
  Loader2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Droplets,
  Info,
  X,
  ImageIcon,
  Bug,
  Pill,
  FlaskConical,
  Sprout,
  Database,
  HelpCircle,
  Sparkles,
} from "lucide-react"

interface AlternativeResult {
  disease: string
  code: string
  score: number
}

interface DiseaseResult {
  diseaseName: string
  confidence: number
  confidenceLevel: "high" | "medium" | "low" | "unknown"
  eppoCode?: string | null
  precautions: string[]
  pesticide?: string | null
  dosage?: string | null
  organicAlternative?: string | null
  applicationMethod?: string | null
  safetyWarnings?: string[]
  crop?: string | null
  dataSource: "verified" | "general"  // Database-driven, no AI
  isIdentified: boolean
  alternativeResults?: AlternativeResult[]
  confidenceMessage?: string
}

interface AnalysisHistory {
  _id: string
  imageUrl: string
  disease: string
  confidence: number
  dataSource?: string
  createdAt: string
}

export default function PesticideAIPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [user, setUser] = useState<{ username: string; userType: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<AnalysisHistory[]>([])

  // Cloudinary config
  const CLOUDINARY_CLOUD_NAME = "dmdyvkf2j"
  const CLOUDINARY_UPLOAD_PRESET = "plant_disease_upload"

  useEffect(() => {
    if (typeof window === "undefined") return

    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || userType !== "farmer") {
      router.push("/login")
      return
    }

    setUser({ userType, username: username || "" })
    setLoading(false)
    
    // Fetch history
    if (username) {
      fetchHistory(username)
    }
  }, [router])

  const fetchHistory = async (username: string) => {
    try {
      const response = await fetch(`/api/pesticide-ai?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.history || [])
      } else {
        console.error("Failed to fetch history:", data.error)
      }
    } catch (err) {
      console.error("Failed to fetch history:", err)
    }
  }

  // Load full details from history item (no re-processing)
  const loadHistoryItem = async (historyId: string, imageUrl: string) => {
    setLoadingHistory(true)
    setError(null)
    setResult(null)
    setSelectedImage(null)
    setImagePreview(null)
    
    try {
      const response = await fetch(`/api/pesticide-ai/history/${historyId}`)
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || "Failed to load history details")
        return
      }
      
      // Set the result from history (same structure as fresh analysis)
      setResult(data.result)
      setUploadedImageUrl(imageUrl)
    } catch (err) {
      console.error("Failed to load history item:", err)
      setError("Unable to load history details. Please try again.")
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (JPG, PNG, or WebP)")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB")
      return
    }

    setSelectedImage(file)
    setError(null)
    setResult(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    formData.append("folder", "plant-disease-images")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary")
    }

    const data = await response.json()
    return data.secure_url
  }

  const analyzeImage = async () => {
    if (!selectedImage || !user) return

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      // Step 1: Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(selectedImage)
      setUploadedImageUrl(imageUrl)
      setUploading(false)

      // Step 2: Analyze with backend API
      setAnalyzing(true)
      
      let data
      try {
        const response = await fetch("/api/pesticide-ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
            username: user.username,
          }),
        })

        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          console.error("Non-JSON response from API:", text.substring(0, 200))
          throw new Error("Server returned an invalid response. Please try again.")
        }

        data = await response.json()
      } catch (fetchError) {
        console.error("API fetch error:", fetchError)
        throw new Error("Unable to connect to AI service. Please check your connection and try again.")
      }

      // Check success flag
      if (!data.success) {
        throw new Error(data.error || "Unable to analyze disease. Please try again later.")
      }

      setResult(data.result)
      
      // Dynamically append to history (no refresh needed)
      if (data.result) {
        const newHistoryItem: AnalysisHistory = {
          _id: Date.now().toString(), // Temporary ID until refresh
          imageUrl,
          disease: data.result.diseaseName,
          confidence: data.result.confidence,
          dataSource: data.result.dataSource,
          createdAt: new Date().toISOString(),
        }
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)])
      }
      
      // Refresh history
      fetchHistory(user.username)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setUploadedImageUrl(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-100"
    if (confidence >= 0.5) return "text-amber-600 bg-amber-100"
    return "text-red-600 bg-red-100"
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence"
    if (confidence >= 0.5) return "Medium Confidence"
    return "Low Confidence"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors px-2 py-1 h-8"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="text-xs font-medium">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-full">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-center">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">Pesticide AI</h1>
                </div>
              </div>

              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 font-medium px-2 py-1 rounded-full text-xs"
              >
                {user?.username}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">AI-powered disease detection</p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block px-8 py-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Dashboard</span>
              </Button>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-sm">
                    <Shield className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Pesticide AI</h1>
                    <p className="text-gray-600">AI-powered crop disease detection & treatment</p>
                  </div>
                </div>
              </div>

              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm"
              >
                Welcome, {user?.username}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-emerald-600" />
                  Upload Crop Leaf Image
                </CardTitle>
                <CardDescription>
                  Take a clear photo of the affected leaf for accurate disease detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                    ${imagePreview 
                      ? "border-emerald-300 bg-emerald-50" 
                      : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Selected crop leaf"
                        width={300}
                        height={300}
                        className="mx-auto rounded-lg object-cover max-h-64"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          resetAnalysis()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          JPG, PNG, or WebP (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips */}
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Tips for best results:</strong>
                    <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                      <li>Use natural lighting</li>
                      <li>Focus on the affected area</li>
                      <li>Include the whole leaf if possible</li>
                      <li>Avoid blurry images</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Error Display */}
                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Analyze Button */}
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg"
                  onClick={analyzeImage}
                  disabled={!selectedImage || uploading || analyzing}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading Image...
                    </>
                  ) : analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Disease...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Analyze Crop Disease
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent History */}
            {history.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Analysis</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Click to view full details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingHistory && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600 mr-2" />
                      <span className="text-sm text-gray-600">Loading details...</span>
                    </div>
                  )}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {history.slice(0, 5).map((item) => (
                      <div
                        key={item._id}
                        onClick={() => loadHistoryItem(item._id, item.imageUrl)}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.disease}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.disease}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getConfidenceColor(item.confidence)}>
                          {Math.round(item.confidence * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Data Source Badge */}
                <div className="flex justify-center flex-wrap gap-2">
                  {result.dataSource === "verified" && (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 px-4 py-2 text-sm flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      ✅ Expert Treatment
                    </Badge>
                  )}
                  {result.dataSource === "general" && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 px-4 py-2 text-sm flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      ⚠️ Recommended Precautions
                    </Badge>
                  )}
                  {result.crop && (
                    <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm">
                      🌱 {result.crop}
                    </Badge>
                  )}
                </div>

                {/* Disease Detection Result */}
                <Card className={`border-0 shadow-lg border-l-4 ${
                  result.isIdentified ? "border-l-emerald-500" : "border-l-amber-500"
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Bug className="h-5 w-5 text-emerald-600" />
                        {result.isIdentified ? "Disease Detected" : "Analysis Result"}
                      </CardTitle>
                      <Badge className={`${getConfidenceColor(result.confidence)} px-3 py-1`}>
                        {getConfidenceLabel(result.confidence)} ({Math.round(result.confidence * 100)}%)
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900">{result.diseaseName}</h3>
                        {result.eppoCode && (
                          <p className="text-sm text-gray-600 mt-1">
                            EPPO Code: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{result.eppoCode}</span>
                          </p>
                        )}
                      </div>

                      {/* Confidence Message */}
                      {result.confidenceMessage && (
                        <Alert className={`${
                          result.confidenceLevel === "high" ? "bg-green-50 border-green-200" :
                          result.confidenceLevel === "medium" ? "bg-blue-50 border-blue-200" :
                          result.confidenceLevel === "low" ? "bg-amber-50 border-amber-200" :
                          "bg-gray-50 border-gray-200"
                        }`}>
                          <Info className={`h-4 w-4 ${
                            result.confidenceLevel === "high" ? "text-green-600" :
                            result.confidenceLevel === "medium" ? "text-blue-600" :
                            result.confidenceLevel === "low" ? "text-amber-600" :
                            "text-gray-600"
                          }`} />
                          <AlertDescription className="text-sm">
                            {result.confidenceMessage}
                          </AlertDescription>
                        </Alert>
                      )}

                      {uploadedImageUrl && (
                        <div className="rounded-lg overflow-hidden">
                          <Image
                            src={uploadedImageUrl}
                            alt="Analyzed image"
                            width={400}
                            height={300}
                            className="w-full object-cover max-h-48"
                          />
                        </div>
                      )}

                      {/* Alternative Results */}
                      {result.alternativeResults && result.alternativeResults.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Other possible conditions:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.alternativeResults.map((alt, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {alt.disease} ({Math.round(alt.score * 100)}%)
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Precautions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Precautions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.precautions.map((precaution, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommended Treatment - Only show if we have treatment data */}
                {(result.pesticide || result.organicAlternative) && (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5 text-emerald-600" />
                          Recommended Treatment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.pesticide && (
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <FlaskConical className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium text-gray-700">Pesticide</span>
                            </div>
                            <p className="text-lg font-semibold text-emerald-700">
                              {result.pesticide}
                            </p>
                          </div>
                        )}

                        {result.dosage && (
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Droplets className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-700">Dosage</span>
                            </div>
                            <p className="text-lg font-semibold text-blue-700">{result.dosage}</p>
                          </div>
                        )}
                      </div>

                      {result.organicAlternative && (
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Sprout className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-gray-700">Organic Alternative</span>
                          </div>
                          <p className="text-green-700">{result.organicAlternative}</p>
                        </div>
                      )}

                      {result.applicationMethod && (
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-gray-700">Application Method</span>
                          </div>
                          <p className="text-gray-700">{result.applicationMethod}</p>
                        </div>
                      )}

                      {result.safetyWarnings && result.safetyWarnings.length > 0 && (
                        <Alert className="bg-red-50 border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription>
                            <strong className="text-red-800">Safety Warnings:</strong>
                            <ul className="mt-2 space-y-1 text-sm text-red-700 list-disc list-inside">
                              {result.safetyWarnings.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Disclaimer */}
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Disclaimer:</strong> This is AI-assisted guidance based on image analysis. 
                    Please consult a local agriculture officer or expert before applying any treatment. 
                    Results may vary based on actual conditions.
                  </AlertDescription>
                </Alert>

                {/* New Analysis Button */}
                <Button
                  variant="outline"
                  className="w-full h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={resetAnalysis}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Analyze Another Image
                </Button>
              </>
            ) : (
              /* Placeholder when no result */
              <Card className="border-0 shadow-lg h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <Leaf className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    Upload a photo of your crop leaf to detect diseases and get AI-powered treatment recommendations
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Upload className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600">Upload</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Bug className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-600">Detect</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Pill className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">Treat</p>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left max-w-md mx-auto">
                    <p className="text-sm font-medium text-gray-700 mb-2">How it works:</p>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Upload a clear photo of the affected plant leaf</li>
                      <li>AI detects the disease using PlantNet technology</li>
                      <li>Get expert treatment recommendations</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
