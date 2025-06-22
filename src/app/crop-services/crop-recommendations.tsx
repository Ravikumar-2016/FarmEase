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
  Leaf,
  Thermometer,
  Droplets,
  BarChart3,
  CheckCircle,
  TrendingUp,
  Plus,
  Info,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"

type CropFormData = {
  Temperature: string
  Humidity: string
  Rainfall: string
  PH: string
  Nitrogen: string
  Phosphorous: string
  Potassium: string
  Carbon: string
  Soil: string
}

const cropInputRanges = {
  Temperature: { min: 0, max: 55, unit: "°C", suggestion: "15-35°C optimal for most crops" },
  Humidity: { min: 10, max: 100, unit: "%", suggestion: "40-80% ideal humidity range" },
  Rainfall: { min: 0, max: 3000, unit: "mm", suggestion: "200-4000mm annual rainfall" },
  PH: { min: 0, max: 14, unit: "", suggestion: "6.0-7.5 pH for most crops" },
  Nitrogen: { min: 0, max: 300, unit: "kg/ha", suggestion: "50-200 kg/ha typical" },
  Phosphorous: { min: 0, max: 150, unit: "kg/ha", suggestion: "20-80 kg/ha typical" },
  Potassium: { min: 0, max: 200, unit: "kg/ha", suggestion: "30-120 kg/ha typical" },
  Carbon: { min: 0, max: 5, unit: "%", suggestion: "0.5-3% organic carbon" },
}

export default function CropRecommendation() {
  const {success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showRetryMessage, setShowRetryMessage] = useState(false)
  const [cropSaved, setCropSaved] = useState(false)
  const [savedCropResult, setSavedCropResult] = useState<string>("")
  const [cropData, setCropData] = useState<CropFormData>({
    Temperature: "",
    Humidity: "",
    Rainfall: "",
    PH: "",
    Nitrogen: "",
    Phosphorous: "",
    Potassium: "",
    Carbon: "",
    Soil: "Loamy Soil",
  })
  const [cropResult, setCropResult] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showRecommendation, setShowRecommendation] = useState(false)

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    const requiredFields = [
      { key: "Temperature", label: "Temperature" },
      { key: "Humidity", label: "Humidity" },
      { key: "Rainfall", label: "Rainfall" },
      { key: "PH", label: "pH Level" },
      { key: "Nitrogen", label: "Nitrogen" },
      { key: "Phosphorous", label: "Phosphorous" },
      { key: "Potassium", label: "Potassium" },
      { key: "Carbon", label: "Carbon" },
    ]

    requiredFields.forEach(({ key, label }) => {
      const value = cropData[key as keyof CropFormData]
      if (!value || value.trim() === "") {
        errors[key] = `${label} is required`
      } else {
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) {
          errors[key] = `${label} must be a valid number`
        } else {
          const range = cropInputRanges[key as keyof typeof cropInputRanges]
          if (numValue < range.min || numValue > range.max) {
            errors[key] = `${label} must be between ${range.min} and ${range.max}`
          }
        }
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCropData({ ...cropData, [name]: value })
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
      setValidationErrors(newErrors)
    }
    // Reset states when form changes
    if (cropSaved || showRecommendation) {
      setCropSaved(false)
      setShowRecommendation(false)
      setSavedCropResult("")
      setCropResult("")
    }
  }

  const handleSelectChange = (value: string) => {
    setCropData({ ...cropData, Soil: value })
    // Reset states when form changes
    if (cropSaved || showRecommendation) {
      setCropSaved(false)
      setShowRecommendation(false)
      setSavedCropResult("")
      setCropResult("")
    }
  }

  const handleCropSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setShowRetryMessage(false)
    setCropSaved(false)
    setErrorMessage(null)
    setShowRecommendation(false)

    const retryTimer = setTimeout(() => setShowRetryMessage(true), 5000)
    try {
      const response = await fetch("https://croprecommendation-api.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: Number.parseFloat(cropData.Temperature),
          humidity: Number.parseFloat(cropData.Humidity),
          rainfall: Number.parseFloat(cropData.Rainfall),
          ph: Number.parseFloat(cropData.PH),
          nitrogen: Number.parseInt(cropData.Nitrogen),
          phosphorous: Number.parseInt(cropData.Phosphorous),
          potassium: Number.parseInt(cropData.Potassium),
          carbon: Number.parseFloat(cropData.Carbon),
          soil: cropData.Soil,
        }),
      })
      clearTimeout(retryTimer)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setCropResult(data.crop || "Unable to generate recommendation")
      setShowRecommendation(true)

      if (data.crop) {
        setRetryCount(0)
      } else {
        setErrorMessage("Unable to generate crop recommendation. Please check your inputs and try again.")
      }
    } catch (err) {
      clearTimeout(retryTimer)
      console.error("Crop API Error:", err)
      setCropResult("Something went wrong.")
      setRetryCount((prev) => prev + 1)
      setErrorMessage("Failed to get crop recommendation. The service might be sleeping - please try again.")
      error("Failed to get crop recommendation. The service might be sleeping - please try again.")

      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    } finally {
      setIsLoading(false)
      setShowRetryMessage(false)
    }
  }

  const handleAddCropToDatabase = async () => {
    if (!cropResult || cropResult.includes("Error") || cropResult === "Unable to generate recommendation") {
      error("No valid crop recommendation to save.")
      return
    }
    const username = localStorage.getItem("username")
    if (!username) {
      error("User not logged in.")
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch("/api/user-crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          username: username,
          cropName: cropResult,
          soilType: cropData.Soil,
          temperature: cropData.Temperature,
          humidity: cropData.Humidity,
          rainfall: cropData.Rainfall,
          ph: cropData.PH,
          nitrogen: cropData.Nitrogen,
          phosphorous: cropData.Phosphorous,
          potassium: cropData.Potassium,
          carbon: cropData.Carbon,
        }),
      })
      const result = await response.json()
      if (result.success) {
        setCropSaved(true)
        setSavedCropResult(cropResult)
        setShowRecommendation(false)
        success("Crop added to your collection successfully!")
      } else {
        throw new Error(result.error || "Failed to save crop")
      }
    } catch (err) {
      console.error("Save crop error:", err)
      setErrorMessage("Failed to add crop to your collection.")
      error("Failed to add crop to your collection.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
            <Leaf className="h-6 w-6 sm:h-7 sm:w-7" />
            Crop Recommendation
          </CardTitle>
          <CardDescription className="text-blue-100 text-sm sm:text-base">
            Discover the best crops for your soil and environmental conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Environmental Parameters */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg border-b border-gray-200 pb-2">
                <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                Environmental Parameters
              </h3>
              {(["Temperature", "Humidity", "Rainfall"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field.toLowerCase()} className="text-sm font-semibold text-gray-700">
                    {field} ({cropInputRanges[field].unit}) *
                  </Label>
                  <Input
                    id={field.toLowerCase()}
                    type="number"
                    name={field}
                    value={cropData[field]}
                    onChange={handleCropChange}
                    placeholder={`Enter ${field.toLowerCase()}`}
                    className={`w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                      validationErrors[field] ? "border-red-500" : ""
                    }`}
                    min={cropInputRanges[field].min}
                    max={cropInputRanges[field].max}
                    step="1"
                    required
                  />
                  {validationErrors[field] && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
                  )}
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>{cropInputRanges[field].suggestion}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Soil Conditions */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg border-b border-gray-200 pb-2">
                <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                Soil Conditions
              </h3>

              {/* pH Level */}
              <div className="space-y-2">
                <Label htmlFor="ph" className="text-sm font-semibold text-gray-700">
                  pH Level ({cropInputRanges.PH.unit}) *
                </Label>
                <Input
                  id="ph"
                  type="number"
                  name="PH"
                  value={cropData.PH}
                  onChange={handleCropChange}
                  placeholder="Enter pH level"
                  className={`w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                    validationErrors.PH ? "border-red-500" : ""
                  }`}
                  min={cropInputRanges.PH.min}
                  max={cropInputRanges.PH.max}
                  step="0.1"
                  required
                />
                {validationErrors.PH && <p className="text-red-500 text-xs mt-1">{validationErrors.PH}</p>}
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>{cropInputRanges.PH.suggestion}</span>
                </div>
              </div>

              {/* Carbon */}
              <div className="space-y-2">
                <Label htmlFor="carbon" className="text-sm font-semibold text-gray-700">
                  Carbon (%) ({cropInputRanges.Carbon.unit}) *
                </Label>
                <Input
                  id="carbon"
                  type="number"
                  name="Carbon"
                  value={cropData.Carbon}
                  onChange={handleCropChange}
                  placeholder="Enter carbon level"
                  className={`w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                    validationErrors.Carbon ? "border-red-500" : ""
                  }`}
                  min={cropInputRanges.Carbon.min}
                  max={cropInputRanges.Carbon.max}
                  step="0.1"
                  required
                />
                {validationErrors.Carbon && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.Carbon}</p>
                )}
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>{cropInputRanges.Carbon.suggestion}</span>
                </div>
              </div>

              {/* Soil Type */}
              <div className="space-y-2 pb-4">
                <Label htmlFor="soil-type-crop" className="text-sm font-semibold text-gray-700">
                  Soil Type *
                </Label>
                <Select value={cropData.Soil} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors bg-white">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto rounded-lg">
                    {["Loamy Soil", "Peaty Soil", "Acidic Soil", "Neutral Soil", "Alkaline Soil"].map((soil) => (
                      <SelectItem
                        key={soil}
                        value={soil}
                        className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer px-4 py-3 text-sm font-medium transition-colors"
                      >
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nutrient Analysis */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg border-b border-gray-200 pb-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                Nutrient Analysis
              </h3>
              {(["Nitrogen", "Phosphorous", "Potassium"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field.toLowerCase() + "-crop"} className="text-sm font-semibold text-gray-700">
                    {field} ({cropInputRanges[field].unit}) *
                  </Label>
                  <Input
                    id={field.toLowerCase() + "-crop"}
                    type="number"
                    name={field}
                    value={cropData[field]}
                    onChange={handleCropChange}
                    placeholder={`Enter ${field.toLowerCase()} level`}
                    className={`w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                      validationErrors[field] ? "border-red-500" : ""
                    }`}
                    min={cropInputRanges[field].min}
                    max={cropInputRanges[field].max}
                    required
                  />
                  {validationErrors[field] && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
                  )}
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>{cropInputRanges[field].suggestion}</span>
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
              onClick={handleCropSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
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
                  Get Crop Recommendation
                </>
              )}
            </Button>
          </div>

          {showRecommendation && cropResult && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <Alert className="border-blue-200 bg-blue-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm sm:text-base">
                  <strong className="text-base sm:text-lg">Recommended Crop:</strong>
                  <Badge
                    variant="secondary"
                    className="ml-2 sm:ml-3 bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold"
                  >
                    {cropResult}
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

              {!cropResult.includes("Error") && cropResult !== "Unable to generate recommendation" && (
                <div className="flex justify-center pt-2">
                  {!cropSaved ? (
                    <Button
                      onClick={handleAddCropToDatabase}
                      disabled={isSaving}
                      variant="outline"
                      className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-green-600 mr-2"></div>
                          Adding to My Crops...
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Add This Crop to My Crops
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Crop Added to Your Collection</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {cropSaved && (
            <Alert className="mt-6 border-green-200 bg-green-50 animate-fade-in">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Success!</strong> {savedCropResult} has been added to your crop collection.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}