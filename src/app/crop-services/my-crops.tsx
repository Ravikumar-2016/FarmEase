"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToastContainer } from "@/components/ui/toast-container"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { Leaf, Thermometer, BarChart3, Calendar, RefreshCw, AlertCircle, Sprout, Trash2, CheckCircle } from "lucide-react"
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
      <div className="w-full max-w-7xl mx-auto">
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
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Sprout className="h-7 w-7" />
              My Crops
            </CardTitle>
            <CardDescription className="text-green-100 text-base">Your saved crop recommendations</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="text-lg">Loading your crops...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (errorState) {
    return (
      <div className="w-full max-w-7xl mx-auto">
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
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Sprout className="h-7 w-7" />
              My Crops
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Error:</strong> {errorState}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-6">
              <Button onClick={fetchUserCrops} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
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

      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Sprout className="h-7 w-7" />
            My Crops
          </CardTitle>
          <CardDescription className="text-green-100 text-base">
            Your saved crop recommendations ({crops.length} {crops.length === 1 ? "crop" : "crops"})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {/* Success Alert for Deletion */}
          {showSuccessAlert && deletedCropName && (
            <Alert className="mb-6  bg-sky-300 animate-fade-in">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Success!</strong> {`"${deletedCropName}" has been removed from your collection.`}
              </AlertDescription>
            </Alert>
          )}

          {crops.length === 0 ? (
            <div className="text-center py-12">
              <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No crops saved yet</h3>
              <p className="text-gray-500 mb-6">
                Start by getting crop recommendations and save them to your collection.
              </p>
              <Button onClick={fetchUserCrops} variant="outline" className="flex items-center gap-2 mx-auto">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Your Crop Collection</h3>
                <Button onClick={fetchUserCrops} variant="outline" size="sm" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crops.map((crop) => (
                  <Card key={crop._id} className="border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                          <Leaf className="h-5 w-5" />
                          {crop.cropName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {crop.soilType}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showDeleteConfirmation(crop._id, crop.cropName)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingCropId === crop._id}
                          >
                            {deletingCropId === crop._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Added: {formatDate(crop.addedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          Environmental
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Temp:</span>
                            <span className="font-medium ml-1">{crop.environmentalParameters.temperature}°C</span>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Humidity:</span>
                            <span className="font-medium ml-1">{crop.environmentalParameters.humidity}%</span>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Rainfall:</span>
                            <span className="font-medium ml-1">{crop.environmentalParameters.rainfall}mm</span>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">pH:</span>
                            <span className="font-medium ml-1">{crop.environmentalParameters.ph}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          Nutrients
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-gray-600">N:</span>
                            <span className="font-medium ml-1">{crop.nutrientLevels.nitrogen} kg/ha</span>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-gray-600">P:</span>
                            <span className="font-medium ml-1">{crop.nutrientLevels.phosphorous} kg/ha</span>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-gray-600">K:</span>
                            <span className="font-medium ml-1">{crop.nutrientLevels.potassium} kg/ha</span>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-gray-600">C:</span>
                            <span className="font-medium ml-1">{crop.nutrientLevels.carbon}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}