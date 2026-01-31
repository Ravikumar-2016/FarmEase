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
  Sparkles,
  Zap,
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
  Temperature: { min: 0, max: 55, unit: "°C", suggestion: "15-35°C optimal for most crops", icon: "🌡️" },
  Humidity: { min: 10, max: 100, unit: "%", suggestion: "40-80% ideal humidity range", icon: "💧" },
  Rainfall: { min: 0, max: 3000, unit: "mm", suggestion: "200-4000mm annual rainfall", icon: "🌧️" },
  PH: { min: 0, max: 14, unit: "", suggestion: "6.0-7.5 pH for most crops", icon: "⚗️" },
  Nitrogen: { min: 0, max: 300, unit: "kg/ha", suggestion: "50-200 kg/ha typical", icon: "🧪" },
  Phosphorous: { min: 0, max: 150, unit: "kg/ha", suggestion: "20-80 kg/ha typical", icon: "🔬" },
  Potassium: { min: 0, max: 200, unit: "kg/ha", suggestion: "30-120 kg/ha typical", icon: "⚡" },
  Carbon: { min: 0, max: 5, unit: "%", suggestion: "0.5-3% organic carbon", icon: "🌱" },
}

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
    <motion.div 
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Form Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Input Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Environmental Parameters Card */}
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
                <p className="text-xs text-gray-500">Weather conditions</p>
              </div>
            </div>
            <div className="space-y-5">
              {(["Temperature", "Humidity", "Rainfall"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>{cropInputRanges[field].icon}</span>
                    {field} 
                    <span className="text-gray-400 font-normal">({cropInputRanges[field].unit})</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      name={field}
                      value={cropData[field]}
                      onChange={handleCropChange}
                      placeholder={`Enter ${field.toLowerCase()}`}
                      className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-orange-500/20 ${
                        validationErrors[field] 
                          ? "border-red-400 focus:border-red-500" 
                          : "border-orange-200 focus:border-orange-500"
                      }`}
                      min={cropInputRanges[field].min}
                      max={cropInputRanges[field].max}
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
                    {cropInputRanges[field].suggestion}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Soil Conditions Card */}
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Soil Conditions</h3>
                <p className="text-xs text-gray-500">pH, carbon & type</p>
              </div>
            </div>
            <div className="space-y-5">
              {/* pH Level */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>{cropInputRanges.PH.icon}</span>
                  pH Level
                </Label>
                <Input
                  type="number"
                  name="PH"
                  value={cropData.PH}
                  onChange={handleCropChange}
                  placeholder="Enter pH level"
                  className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-500/20 ${
                    validationErrors.PH 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-blue-200 focus:border-blue-500"
                  }`}
                  min={cropInputRanges.PH.min}
                  max={cropInputRanges.PH.max}
                  step="0.1"
                />
                {validationErrors.PH && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{validationErrors.PH}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Info className="h-3 w-3" />{cropInputRanges.PH.suggestion}
                </p>
              </div>

              {/* Carbon */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>{cropInputRanges.Carbon.icon}</span>
                  Carbon <span className="text-gray-400 font-normal">(%)</span>
                </Label>
                <Input
                  type="number"
                  name="Carbon"
                  value={cropData.Carbon}
                  onChange={handleCropChange}
                  placeholder="Enter carbon level"
                  className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-blue-500/20 ${
                    validationErrors.Carbon 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-blue-200 focus:border-blue-500"
                  }`}
                  min={cropInputRanges.Carbon.min}
                  max={cropInputRanges.Carbon.max}
                  step="0.1"
                />
                {validationErrors.Carbon && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{validationErrors.Carbon}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Info className="h-3 w-3" />{cropInputRanges.Carbon.suggestion}
                </p>
              </div>

              {/* Soil Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  🌍 Soil Type
                </Label>
                <Select value={cropData.Soil} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full h-12 bg-white/80 backdrop-blur border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border border-blue-100 shadow-xl rounded-xl">
                    {["Loamy Soil", "Peaty Soil", "Acidic Soil", "Neutral Soil", "Alkaline Soil"].map((soil) => (
                      <SelectItem
                        key={soil}
                        value={soil}
                        className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer px-4 py-3 rounded-lg transition-colors"
                      >
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Nutrient Analysis Card */}
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Nutrients</h3>
                <p className="text-xs text-gray-500">NPK analysis</p>
              </div>
            </div>
            <div className="space-y-5">
              {(["Nitrogen", "Phosphorous", "Potassium"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>{cropInputRanges[field].icon}</span>
                    {field} 
                    <span className="text-gray-400 font-normal">({cropInputRanges[field].unit})</span>
                  </Label>
                  <Input
                    type="number"
                    name={field}
                    value={cropData[field]}
                    onChange={handleCropChange}
                    placeholder={`Enter ${field.toLowerCase()} level`}
                    className={`w-full h-12 bg-white/80 backdrop-blur border-2 rounded-xl transition-all focus:ring-2 focus:ring-emerald-500/20 ${
                      validationErrors[field] 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-emerald-200 focus:border-emerald-500"
                    }`}
                    min={cropInputRanges[field].min}
                    max={cropInputRanges[field].max}
                  />
                  {validationErrors[field] && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{validationErrors[field]}
                    </motion.p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Info className="h-3 w-3" />{cropInputRanges[field].suggestion}
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
            onClick={handleCropSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] group"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {showRetryMessage ? "Connecting to AI..." : "Analyzing Your Data..."}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Get AI Crop Recommendation
                <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </span>
            )}
          </Button>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {showRecommendation && cropResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Success Result */}
              {!cropResult.includes("Error") && cropResult !== "Unable to generate recommendation" && cropResult !== "Something went wrong." ? (
                <motion.div 
                  className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">AI Recommendation</p>
                      <h3 className="text-2xl font-bold">Perfect Crop Match Found!</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm mb-1">Recommended Crop</p>
                      <div className="flex items-center gap-3">
                        <Leaf className="h-7 w-7" />
                        <span className="text-3xl font-bold">{cropResult}</span>
                      </div>
                    </div>
                    <Badge className="bg-white text-emerald-700 px-4 py-2 text-sm font-semibold hover:bg-white">
                      Best Match
                    </Badge>
                  </div>

                  {/* Save Button */}
                  <div className="mt-5 flex justify-center">
                    {!cropSaved ? (
                      <Button
                        onClick={handleAddCropToDatabase}
                        disabled={isSaving}
                        className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        {isSaving ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
                            Adding to Collection...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Save to My Crops
                          </span>
                        )}
                      </Button>
                    ) : (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-3 rounded-xl"
                      >
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Saved to Your Collection!</span>
                      </motion.div>
                    )}
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
                        onClick={handleCropSubmit}
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

        {/* Saved Confirmation */}
        <AnimatePresence>
          {cropSaved && !showRecommendation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800">Crop Added Successfully!</p>
                <p className="text-sm text-emerald-600">{savedCropResult} has been saved to your collection.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}