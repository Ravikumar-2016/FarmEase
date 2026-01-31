"use client"
import { useState } from "react"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Beaker,
  Thermometer,
  BarChart3,
  CheckCircle,
  Info,
  RefreshCw,
  AlertCircle,
  Sprout,
  Sparkles,
  FlaskConical,
  Droplets,
  Zap,
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
  Temparature: { min: 0, max: 55, unit: "°C", suggestion: "15-35°C for most crops", icon: "🌡️" },
  Humidity: { min: 10, max: 100, unit: "%", suggestion: "40-80% optimal range", icon: "💧" },
  Moisture: { min: 10, max: 100, unit: "%", suggestion: "20-80% soil moisture", icon: "💦" },
  Nitrogen: { min: 0, max: 300, unit: "kg/ha", suggestion: "50-200 kg/ha typical", icon: "🧪" },
  Phosphorous: { min: 0, max: 150, unit: "kg/ha", suggestion: "20-80 kg/ha typical", icon: "🔬" },
  Potassium: { min: 0, max: 200, unit: "kg/ha", suggestion: "30-120 kg/ha typical", icon: "⚡" },
}

const soilTypes = ["Sandy", "Loamy", "Black", "Red", "Clayey"]
const cropTypes = ["Wheat", "Barley", "Maize", "Rice", "Cotton", "Sugarcane", "Millets", "Oil seeds", "Pulses"]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

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
    <motion.div 
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Input Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Environmental Conditions Card */}
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <Thermometer className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Environment</h3>
                <p className="text-xs text-gray-500">Weather & moisture</p>
              </div>
            </div>
            <div className="space-y-5">
              {(["Temparature", "Humidity", "Moisture"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>{fertilizerInputRanges[field].icon}</span>
                    {field === "Temparature" ? "Temperature" : field}
                    <span className="text-gray-400 font-normal">({fertilizerInputRanges[field].unit})</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      name={field}
                      value={fertilizerData[field]}
                      onChange={handleFertilizerChange}
                      placeholder={`Enter ${field === "Temparature" ? "temperature" : field.toLowerCase()}`}
                      className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-orange-500/20 ${
                        validationErrors[field] 
                          ? "border-red-400 focus:border-red-500" 
                          : "border-orange-200 focus:border-orange-500"
                      }`}
                      min={fertilizerInputRanges[field].min}
                      max={fertilizerInputRanges[field].max}
                      step="1"
                    />
                    {validationErrors[field] && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors[field]}
                      </motion.p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    {fertilizerInputRanges[field].suggestion}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Soil & Crop Details Card */}
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Soil & Crop</h3>
                <p className="text-xs text-gray-500">Type selection</p>
              </div>
            </div>
            <div className="space-y-5">
              {/* Soil Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  🌍 Soil Type
                </Label>
                <Select value={fertilizerData.SoilType} onValueChange={handleSoilTypeChange}>
                  <SelectTrigger className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-green-500/20 ${
                    validationErrors.SoilType 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-green-200 focus:border-green-500"
                  }`}>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border border-green-100 shadow-xl rounded-xl">
                    {soilTypes.map((soil) => (
                      <SelectItem
                        key={soil}
                        value={soil}
                        className="hover:bg-green-50 focus:bg-green-50 cursor-pointer px-4 py-3 rounded-lg transition-colors"
                      >
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.SoilType && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{validationErrors.SoilType}
                  </motion.p>
                )}
              </div>

              {/* Crop Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  🌾 Crop Type
                </Label>
                <Select value={fertilizerData.CropType} onValueChange={handleCropTypeChange}>
                  <SelectTrigger className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-green-500/20 ${
                    validationErrors.CropType 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-green-200 focus:border-green-500"
                  }`}>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border border-green-100 shadow-xl rounded-xl">
                    {cropTypes.map((crop) => (
                      <SelectItem
                        key={crop}
                        value={crop}
                        className="hover:bg-green-50 focus:bg-green-50 cursor-pointer px-4 py-3 rounded-lg transition-colors"
                      >
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.CropType && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{validationErrors.CropType}
                  </motion.p>
                )}
              </div>

              {/* Info Card */}
              <div className="bg-green-100/50 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Droplets className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Tip</p>
                    <p className="text-xs text-green-700 mt-1">Select the most accurate soil and crop type for better fertilizer recommendations.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nutrient Levels Card */}
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Nutrients</h3>
                <p className="text-xs text-gray-500">NPK levels</p>
              </div>
            </div>
            <div className="space-y-5">
              {(["Nitrogen", "Phosphorous", "Potassium"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>{fertilizerInputRanges[field].icon}</span>
                    {field}
                    <span className="text-gray-400 font-normal">({fertilizerInputRanges[field].unit})</span>
                  </Label>
                  <Input
                    type="number"
                    name={field}
                    value={fertilizerData[field]}
                    onChange={handleFertilizerChange}
                    placeholder={`Enter ${field.toLowerCase()} level`}
                    className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-violet-500/20 ${
                      validationErrors[field] 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-violet-200 focus:border-violet-500"
                    }`}
                    min={fertilizerInputRanges[field].min}
                    max={fertilizerInputRanges[field].max}
                  />
                  {validationErrors[field] && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{validationErrors[field]}
                    </motion.p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Info className="h-3 w-3" />{fertilizerInputRanges[field].suggestion}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Service Wake-up Message */}
        <AnimatePresence>
          {isLoading && showRetryMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
            >
              <div className="p-2 bg-amber-100 rounded-lg">
                <RefreshCw className="h-4 w-4 text-amber-600 animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-amber-800">Service is waking up...</p>
                <p className="text-sm text-amber-700">Free tier services may take 30-60 seconds. Please wait.</p>
                {retryCount > 0 && <p className="text-xs text-amber-600 mt-1">Attempt {retryCount + 1}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="flex justify-center pt-2">
          <Button
            onClick={handleFertilizerSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] group"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {showRetryMessage ? "Connecting to AI..." : "Analyzing Soil Data..."}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Get AI Fertilizer Recommendation
                <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </span>
            )}
          </Button>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {showRecommendation && fertilizerResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Success Result */}
              {!fertilizerResult.includes("Error") && fertilizerResult !== "Unable to generate recommendation" && fertilizerResult !== "Something went wrong." ? (
                <motion.div 
                  className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-violet-100 text-sm font-medium">AI Recommendation</p>
                      <h3 className="text-2xl font-bold">Optimal Fertilizer Found!</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-violet-100 text-sm mb-1">Recommended Fertilizer</p>
                      <div className="flex items-center gap-3">
                        <Beaker className="h-7 w-7" />
                        <span className="text-2xl font-bold">{fertilizerResult}</span>
                      </div>
                    </div>
                    <Badge className="bg-white text-violet-700 px-4 py-2 text-sm font-semibold hover:bg-white">
                      Best Match
                    </Badge>
                  </div>

                  {/* Usage Tips */}
                  <div className="mt-5 bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-semibold">Application Tip</p>
                        <p className="text-sm text-violet-100 mt-1">Apply fertilizer during early morning or late evening for best absorption. Always follow recommended dosage guidelines.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Error Result */
                <motion.div 
                  className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-800">Unable to Generate Recommendation</h3>
                      <p className="text-red-600 mt-1">{errorMessage || "Please check your inputs and try again."}</p>
                      <Button
                        onClick={handleFertilizerSubmit}
                        variant="outline"
                        className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}