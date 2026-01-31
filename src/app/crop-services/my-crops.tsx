"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastContainer } from "@/components/ui/toast-container"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { 
  Leaf, 
  Thermometer, 
  BarChart3, 
  Calendar, 
  RefreshCw, 
  AlertCircle, 
  Sprout, 
  Trash2, 
  CheckCircle,
  Droplets,
  CloudRain,
  FlaskConical,
  Database,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"

type UserCrop = {
  _id: string
  username: string
  cropName: string
  soilType: string
  environmentalParameters: {
    temperature: string
    humidity: string
    rainfall: string
    ph: string
  }
  nutrientLevels: {
    nitrogen: string
    phosphorous: string
    potassium: string
    carbon: string
  }
  addedAt: string
  lastModified: string
}

interface DeleteConfirmation {
  isOpen: boolean
  cropId: string | null
  cropName: string
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
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2 }
  }
}

export default function MyCrops() {
  const { toasts, dismiss, error } = useToast()
  const [crops, setCrops] = useState<UserCrop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [deletingCropId, setDeletingCropId] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    cropId: null,
    cropName: "",
  })
  const [deletedCropName, setDeletedCropName] = useState<string | null>(null) // New state for deleted crop name
  const [showSuccessAlert, setShowSuccessAlert] = useState(false) // New state for success alert visibility

  const fetchUserCrops = async () => {
    const username = localStorage.getItem("username")
    if (!username) {
      setErrorState("User not logged in")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/user-crops?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      if (data.success) {
        setCrops(data.crops)
        setErrorState(null)
      } else {
        setErrorState(data.error || "Failed to fetch crops")
      }
    } catch (err) {
      console.error("Error fetching user crops:", err)
      setErrorState("Failed to load your crops")
      error("Failed to load your crops. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const showDeleteConfirmation = (cropId: string, cropName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      cropId,
      cropName,
    })
  }

  const handleDeleteCrop = async () => {
    const username = localStorage.getItem("username")
    if (!username || !deleteConfirmation.cropId) return

    setDeletingCropId(deleteConfirmation.cropId)
    try {
      const response = await fetch("/api/user-crops", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropId: deleteConfirmation.cropId, username }),
      })

      const result = await response.json()
      if (result.success) {
        setDeletedCropName(deleteConfirmation.cropName) // Store the deleted crop name
        setShowSuccessAlert(true) // Show the success alert
        setCrops((prev) => prev.filter((crop) => crop._id !== deleteConfirmation.cropId))
        
        // Hide the success alert after 5 seconds
        setTimeout(() => {
          setShowSuccessAlert(false)
          setDeletedCropName(null)
        }, 3000)
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error deleting crop:", err)
      error("Failed to delete crop.")
    } finally {
      setDeletingCropId(null)
      setDeleteConfirmation({
        isOpen: false,
        cropId: null,
        cropName: "",
      })
    }
  }

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== "undefined" && window.localStorage) {
      fetchUserCrops()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <ToastContainer
          toasts={toasts.map((toast) => ({
            id: toast.id,
            message: toast.description || toast.title || "",
            type:
              toast.variant === "default"
                ? "info"
                : (toast.variant as "success" | "error" | "warning" | "info" | "destructive"),
          }))}
          onRemove={dismiss}
        />
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
            <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading your crops...</p>
          <p className="text-gray-400 text-sm">Fetching your saved recommendations</p>
        </div>
      </div>
    )
  }

  if (errorState) {
    return (
      <div className="w-full">
        <ToastContainer
          toasts={toasts.map((toast) => ({
            id: toast.id,
            message: toast.description || toast.title || "",
            type:
              toast.variant === "default"
                ? "info"
                : (toast.variant as "success" | "error" | "warning" | "info" | "destructive"),
          }))}
          onRemove={dismiss}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800">Failed to Load Crops</h3>
              <p className="text-red-600 mt-1">{errorState}</p>
              <Button
                onClick={fetchUserCrops}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ToastContainer
        toasts={toasts.map((toast) => ({
          id: toast.id,
          message: toast.description || toast.title || "",
          type:
            toast.variant === "default"
              ? "info"
              : (toast.variant as "success" | "error" | "warning" | "info" | "destructive"),
        }))}
        onRemove={dismiss}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({
            isOpen: false,
            cropId: null,
            cropName: "",
          })
        }
        onConfirm={handleDeleteCrop}
        title="Delete Crop"
        description={`Are you sure you want to delete "${deleteConfirmation.cropName}"? This action cannot be undone and will permanently remove this crop from your collection.`}
        type="delete"
        confirmText="Delete Crop"
        isLoading={deletingCropId === deleteConfirmation.cropId}
      />

      {/* Success Alert for Deletion */}
      <AnimatePresence>
        {showSuccessAlert && deletedCropName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">Crop Deleted Successfully!</p>
              <p className="text-sm text-emerald-600">{`"${deletedCropName}" has been removed from your collection.`}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Header */}
      <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Saved Crops</p>
            <p className="text-2xl font-bold text-gray-900">{crops.length}</p>
          </div>
        </div>
        <Button 
          onClick={fetchUserCrops} 
          variant="outline"
          className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl px-4 py-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* Empty State */}
      {crops.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No crops saved yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Start by getting AI-powered crop recommendations and save them to build your personalized crop collection.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Sparkles className="h-4 w-4" />
            <span>Use the &ldquo;Crop Recommendations&rdquo; tab to get started</span>
          </div>
        </motion.div>
      ) : (
        /* Crop Grid */
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {crops.map((crop, index) => (
            <motion.div
              key={crop._id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{crop.cropName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-white/20 text-white text-xs hover:bg-white/30">
                          {crop.soilType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => showDeleteConfirmation(crop._id, crop.cropName)}
                    className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/20 rounded-lg"
                    disabled={deletingCropId === crop._id}
                  >
                    {deletingCropId === crop._id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-3 text-white/80 text-sm">
                  <Calendar className="h-4 w-4" />
                  Added: {formatDate(crop.addedAt)}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-4">
                {/* Environmental Parameters */}
                <div>
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3 text-sm">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <Thermometer className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    Environmental
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-xl border border-orange-100">
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="font-bold text-gray-800">{crop.environmentalParameters.temperature}°C</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <p className="text-xs text-gray-500">Humidity</p>
                      </div>
                      <p className="font-bold text-gray-800">{crop.environmentalParameters.humidity}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-3 rounded-xl border border-sky-100">
                      <div className="flex items-center gap-1">
                        <CloudRain className="h-3 w-3 text-sky-500" />
                        <p className="text-xs text-gray-500">Rainfall</p>
                      </div>
                      <p className="font-bold text-gray-800">{crop.environmentalParameters.rainfall}mm</p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-3 rounded-xl border border-violet-100">
                      <div className="flex items-center gap-1">
                        <FlaskConical className="h-3 w-3 text-violet-500" />
                        <p className="text-xs text-gray-500">pH Level</p>
                      </div>
                      <p className="font-bold text-gray-800">{crop.environmentalParameters.ph}</p>
                    </div>
                  </div>
                </div>

                {/* Nutrient Levels */}
                <div>
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3 text-sm">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <BarChart3 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    Nutrients (NPK + C)
                  </h4>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gradient-to-br from-emerald-50 to-green-50 p-2.5 rounded-xl border border-emerald-100 text-center">
                      <p className="text-xs text-gray-500">N</p>
                      <p className="font-bold text-emerald-700 text-sm">{crop.nutrientLevels.nitrogen}</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-2.5 rounded-xl border border-blue-100 text-center">
                      <p className="text-xs text-gray-500">P</p>
                      <p className="font-bold text-blue-700 text-sm">{crop.nutrientLevels.phosphorous}</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-amber-50 to-yellow-50 p-2.5 rounded-xl border border-amber-100 text-center">
                      <p className="text-xs text-gray-500">K</p>
                      <p className="font-bold text-amber-700 text-sm">{crop.nutrientLevels.potassium}</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-slate-50 p-2.5 rounded-xl border border-gray-200 text-center">
                      <p className="text-xs text-gray-500">C</p>
                      <p className="font-bold text-gray-700 text-sm">{crop.nutrientLevels.carbon}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}