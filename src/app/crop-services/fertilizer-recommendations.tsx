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
  const { toast } = useToast()
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
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Validate form data
  const validateForm = (): boolean => {
    const errors: string[] = []
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
        errors.push(`${label} is required`)
      } else {
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) {
          errors.push(`${label} must be a valid number`)
        } else {
          const range = fertilizerInputRanges[key as keyof typeof fertilizerInputRanges]
          if (numValue < range.min || numValue > range.max) {
            errors.push(`${label} must be between ${range.min} and ${range.max}`)
          }
        }
      }
    })

    // Check if soil type and crop type are selected
    if (!fertilizerData.SoilType) {
      errors.push("Soil Type is required")
    }
    if (!fertilizerData.CropType) {
      errors.push("Crop Type is required")
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleFertilizerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFertilizerData({ ...fertilizerData, [name]: value })
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleSoilTypeChange = (value: string) => {
    setFertilizerData({ ...fertilizerData, SoilType: value })
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleCropTypeChange = (value: string) => {
    setFertilizerData({ ...fertilizerData, CropType: value })
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleFertilizerSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly for best recommendations.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setShowRetryMessage(false)
    setErrorMessage(null)
    setValidationErrors([])

    // Show retry message after 8 seconds instead of 5 to give more time
    const retryTimer = setTimeout(() => setShowRetryMessage(true), 8000)

    try {
      // Prepare the request payload exactly as the working API expects
      const requestPayload = {
        Temparature: Number.parseFloat(fertilizerData.Temparature), // Note: misspelled as per API
        Humidity: Number.parseFloat(fertilizerData.Humidity),
        Moisture: Number.parseFloat(fertilizerData.Moisture),
        "Soil Type": fertilizerData.SoilType, // Note: with space as per API
        "Crop Type": fertilizerData.CropType, // Note: with space as per API
        Nitrogen: Number.parseInt(fertilizerData.Nitrogen),
        Phosphorous: Number.parseInt(fertilizerData.Phosphorous),
        Potassium: Number.parseInt(fertilizerData.Potassium),
      }

      console.log("Making fertilizer API request with data:", requestPayload)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      // Use the correct API URL from the working example
      const response = await fetch("https://fertilizer-api-pi50.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      clearTimeout(retryTimer)

      console.log("Fertilizer API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Fertilizer API error response:", errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log("Fertilizer API response data:", data)

      setFertilizerResult(data.fertilizer || "Unable to generate recommendation")

      if (data.fertilizer) {
        toast({
          title: "Success!",
          description: "Fertilizer recommendation generated successfully.",
          duration: 2000,
        })
        setRetryCount(0)
      } else {
        setErrorMessage("Unable to generate fertilizer recommendation. Please check your inputs and try again.")
      }
    } catch (error) {
      clearTimeout(retryTimer)
      console.error("Fertilizer API Error:", error)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setErrorMessage("Request timed out. The service might be sleeping - please try again.")
        } else {
          setErrorMessage(`Failed to get fertilizer recommendation: ${error.message}`)
        }
      } else {
        setErrorMessage("Failed to get fertilizer recommendation. The service might be sleeping - please try again.")
      }

      setFertilizerResult("Something went wrong.")
      setRetryCount((prev) => prev + 1)

      toast({
        title: "Error",
        description: "Failed to get fertilizer recommendation. The service might be sleeping - please try again.",
        variant: "destructive",
        duration: 2000,
      })

      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    } finally {
      setIsLoading(false)
      setShowRetryMessage(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
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
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Please fill in all required fields for best recommendations:</strong>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

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
                    className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-emerald-500 rounded-lg transition-colors"
                    min={fertilizerInputRanges[field].min}
                    max={fertilizerInputRanges[field].max}
                    step="1"
                    required
                  />
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

              {/* Soil Type */}
              <div className="space-y-2 pb-4">
                <Label htmlFor="soil-type-fertilizer" className="text-sm font-semibold text-gray-700">
                  Soil Type *
                </Label>
                <Select value={fertilizerData.SoilType} onValueChange={handleSoilTypeChange}>
                  <SelectTrigger className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-emerald-500 rounded-lg transition-colors">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {soilTypes.map((soil) => (
                      <SelectItem
                        key={soil}
                        value={soil}
                        className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer px-3 py-2"
                      >
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Crop Type */}
              <div className="space-y-2 pb-4">
                <Label htmlFor="crop-type-fertilizer" className="text-sm font-semibold text-gray-700">
                  Crop Type *
                </Label>
                <Select value={fertilizerData.CropType} onValueChange={handleCropTypeChange}>
                  <SelectTrigger className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-emerald-500 rounded-lg transition-colors">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {cropTypes.map((crop) => (
                      <SelectItem
                        key={crop}
                        value={crop}
                        className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer px-3 py-2"
                      >
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-emerald-500 rounded-lg transition-colors"
                    min={fertilizerInputRanges[field].min}
                    max={fertilizerInputRanges[field].max}
                    required
                  />
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

          {fertilizerResult && (
            <div className="mt-6 space-y-4">
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

              {/* Error message */}
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
