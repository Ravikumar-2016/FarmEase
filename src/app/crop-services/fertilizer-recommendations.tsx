"use client"
import { useState } from "react"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Beaker,
  Thermometer,
  BarChart3,
  CheckCircle,
  TrendingUp,
  Info,
  RefreshCw,
  AlertCircle,
  Sprout,
} from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"

type FertilizerFormData = {
  Temparature: string // Note: API expects this misspelling
  Humidity: string
  Moisture: string
  SoilType: string
  CropType: string
  Nitrogen: string
  Phosphorous: string
  Potassium: string
}

const fertilizerInputRanges = {
  Temparature: { min: 0, max: 55, unit: "°C", suggestion: "15-35°C for most crops" },
  Humidity: { min: 10, max: 100, unit: "%", suggestion: "40-80% optimal range" },
  Moisture: { min: 10, max: 100, unit: "%", suggestion: "20-80% soil moisture" },
  Nitrogen: { min: 0, max: 300, unit: "kg/ha", suggestion: "50-200 kg/ha typical" },
  Phosphorous: { min: 0, max: 150, unit: "kg/ha", suggestion: "20-80 kg/ha typical" },
  Potassium: { min: 0, max: 200, unit: "kg/ha", suggestion: "30-120 kg/ha typical" },
}

const soilTypes = ["Sandy", "Loamy", "Black", "Red", "Clayey"]
const cropTypes = ["Wheat", "Barley", "Maize", "Rice", "Cotton", "Sugarcane", "Millets", "Oil seeds", "Pulses"]

export default function FertilizerRecommendation() {
  const {error } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showRetryMessage, setShowRetryMessage] = useState(false)
  const [fertilizerData, setFertilizerData] = useState<FertilizerFormData>({
    Temparature: "",
    Humidity: "",
    Moisture: "",
    SoilType: "Sandy",
    CropType: "Wheat",
    Nitrogen: "",
    Phosphorous: "",
    Potassium: "",
  })
  const [fertilizerResult, setFertilizerResult] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showRecommendation, setShowRecommendation] = useState(false)

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    const requiredFields = [
      { key: "Temparature", label: "Temperature" },
      { key: "Humidity", label: "Humidity" },
      { key: "Moisture", label: "Moisture" },
      { key: "Nitrogen", label: "Nitrogen" },
      { key: "Phosphorous", label: "Phosphorous" },
      { key: "Potassium", label: "Potassium" },
    ]

    requiredFields.forEach(({ key, label }) => {
      const value = fertilizerData[key as keyof FertilizerFormData]
      if (!value || value.trim() === "") {
        errors[key] = `${label} is required`
      } else {
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) {
          errors[key] = `${label} must be a valid number`
        } else {
          const range = fertilizerInputRanges[key as keyof typeof fertilizerInputRanges]
          if (numValue < range.min || numValue > range.max) {
            errors[key] = `${label} must be between ${range.min} and ${range.max}`
          }
        }
      }
    })

    if (!fertilizerData.SoilType) errors.SoilType = "Soil Type is required"
    if (!fertilizerData.CropType) errors.CropType = "Crop Type is required"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFertilizerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFertilizerData({ ...fertilizerData, [name]: value })
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
      setValidationErrors(newErrors)
    }
    if (showRecommendation) {
      setShowRecommendation(false)
      setFertilizerResult("")
    }
  }

  const handleSoilTypeChange = (value: string) => {
    setFertilizerData({ ...fertilizerData, SoilType: value })
    if (validationErrors.SoilType) {
      const newErrors = { ...validationErrors }
      delete newErrors.SoilType
      setValidationErrors(newErrors)
    }
    if (showRecommendation) {
      setShowRecommendation(false)
      setFertilizerResult("")
    }
  }

  const handleCropTypeChange = (value: string) => {
    setFertilizerData({ ...fertilizerData, CropType: value })
    if (validationErrors.CropType) {
      const newErrors = { ...validationErrors }
      delete newErrors.CropType
      setValidationErrors(newErrors)
    }
    if (showRecommendation) {
      setShowRecommendation(false)
      setFertilizerResult("")
    }
  }

  const handleFertilizerSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setShowRetryMessage(false)
    setErrorMessage(null)
    setShowRecommendation(false)

    const retryTimer = setTimeout(() => setShowRetryMessage(true), 8000)

    try {
      const requestPayload = {
        Temparature: Number.parseFloat(fertilizerData.Temparature),
        Humidity: Number.parseFloat(fertilizerData.Humidity),
        Moisture: Number.parseFloat(fertilizerData.Moisture),
        "Soil Type": fertilizerData.SoilType,
        "Crop Type": fertilizerData.CropType,
        Nitrogen: Number.parseInt(fertilizerData.Nitrogen),
        Phosphorous: Number.parseInt(fertilizerData.Phosphorous),
        Potassium: Number.parseInt(fertilizerData.Potassium),
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch("https://fertilizer-api-pi50.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      clearTimeout(retryTimer)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      setFertilizerResult(data.fertilizer || "Unable to generate recommendation")
      setShowRecommendation(true)
      setRetryCount(0)
    } catch (err) {
      clearTimeout(retryTimer)
      console.error("Fertilizer API Error:", err)

      let errorMsg = "Failed to get fertilizer recommendation. The service might be sleeping - please try again."
      if (err instanceof Error) {
        errorMsg = err.name === "AbortError" 
          ? "Request timed out. Please try again." 
          : `Failed to get recommendation: ${err.message}`
      }

      setErrorMessage(errorMsg)
      setFertilizerResult("Something went wrong.")
      setRetryCount((prev) => prev + 1)
      error(errorMsg)

      setTimeout(() => setErrorMessage(null), 4000)
    } finally {
      setIsLoading(false)
      setShowRetryMessage(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
            <Beaker className="h-6 w-6 sm:h-7 sm:w-7" />
            Fertilizer Recommendation
          </CardTitle>
          <CardDescription className="text-emerald-100 text-sm sm:text-base">
            Get personalized fertilizer recommendations based on your soil and crop conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Environmental Conditions */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg border-b border-gray-200 pb-2">
                <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                Environmental Conditions
              </h3>
              {(["Temparature", "Humidity", "Moisture"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field.toLowerCase()} className="text-sm font-semibold text-gray-700">
                    {field === "Temparature" ? "Temperature" : field} ({fertilizerInputRanges[field].unit}) *
                  </Label>
                  <Input
                    id={field.toLowerCase()}
                    type="number"
                    name={field}
                    value={fertilizerData[field]}
                    onChange={handleFertilizerChange}
                    placeholder={`Enter ${field === "Temparature" ? "temperature" : field.toLowerCase()}`}
                    className={`w-full h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg transition-colors ${
                      validationErrors[field] ? "border-red-500" : ""
                    }`}
                    min={fertilizerInputRanges[field].min}
                    max={fertilizerInputRanges[field].max}
                    step="1"
                    required
                  />
                  {validationErrors[field] && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
                  )}
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>{fertilizerInputRanges[field].suggestion}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Soil & Crop Details */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg border-b border-gray-200 pb-2">
                <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                Soil & Crop Details
              </h3>

              <div className="space-y-2 pb-4">
                <Label htmlFor="soil-type-fertilizer" className="text-sm font-semibold text-gray-700">
                  Soil Type *
                </Label>
                <Select value={fertilizerData.SoilType} onValueChange={handleSoilTypeChange}>
                  <SelectTrigger className={`w-full h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg transition-colors bg-white ${
                    validationErrors.SoilType ? "border-red-500" : ""
                  }`}>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto rounded-lg">
                    {soilTypes.map((soil) => (
                      <SelectItem
                        key={soil}
                        value={soil}
                        className="hover:bg-emerald-50 focus:bg-emerald-50 cursor-pointer px-4 py-3 text-sm font-medium transition-colors"
                      >
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.SoilType && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.SoilType}</p>
                )}
              </div>

              <div className="space-y-2 pb-4">
                <Label htmlFor="crop-type-fertilizer" className="text-sm font-semibold text-gray-700">
                  Crop Type *
                </Label>
                <Select value={fertilizerData.CropType} onValueChange={handleCropTypeChange}>
                  <SelectTrigger className={`w-full h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg transition-colors bg-white ${
                    validationErrors.CropType ? "border-red-500" : ""
                  }`}>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto rounded-lg">
                    {cropTypes.map((crop) => (
                      <SelectItem
                        key={crop}
                        value={crop}
                        className="hover:bg-emerald-50 focus:bg-emerald-50 cursor-pointer px-4 py-3 text-sm font-medium transition-colors"
                      >
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.CropType && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.CropType}</p>
                )}
              </div>
            </div>

            {/* Nutrient Levels */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg border-b border-gray-200 pb-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                Nutrient Levels
              </h3>
              {(["Nitrogen", "Phosphorous", "Potassium"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field.toLowerCase() + "-fertilizer"} className="text-sm font-semibold text-gray-700">
                    {field} ({fertilizerInputRanges[field].unit}) *
                  </Label>
                  <Input
                    id={field.toLowerCase() + "-fertilizer"}
                    type="number"
                    name={field}
                    value={fertilizerData[field]}
                    onChange={handleFertilizerChange}
                    placeholder={`Enter ${field.toLowerCase()} level`}
                    className={`w-full h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg transition-colors ${
                      validationErrors[field] ? "border-red-500" : ""
                    }`}
                    min={fertilizerInputRanges[field].min}
                    max={fertilizerInputRanges[field].max}
                    required
                  />
                  {validationErrors[field] && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
                  )}
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>{fertilizerInputRanges[field].suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6 sm:my-8" />

          {isLoading && showRetryMessage && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <RefreshCw className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Service is starting up...</strong> Render free tier services may take 30-60 seconds to wake up.
                Please wait or try again if it takes too long.
                {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center mb-6">
            <Button
              onClick={handleFertilizerSubmit}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  {showRetryMessage ? "Waking up service..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Get Fertilizer Recommendation
                </>
              )}
            </Button>
          </div>

          {showRecommendation && fertilizerResult && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <Alert className="border-emerald-200 bg-emerald-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <AlertDescription className="text-emerald-800 text-sm sm:text-base">
                  <strong className="text-base sm:text-lg">Recommended Fertilizer:</strong>
                  <Badge
                    variant="secondary"
                    className="ml-2 sm:ml-3 bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold"
                  >
                    {fertilizerResult}
                  </Badge>
                </AlertDescription>
              </Alert>

              {errorMessage && (
                <Alert className="border-red-200 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm sm:text-base">
                    <strong>Error:</strong> {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}