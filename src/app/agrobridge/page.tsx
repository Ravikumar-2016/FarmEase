"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToastContainer } from "@/components/ui/toast-container"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { useToast } from "@/app/hooks/use-toast"
import { NotificationBell } from "@/components/ui/notifications-bell"
import {
  ArrowLeft,
  Plus,
  Users,
  Calendar,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sprout,
  TrendingUp,
  Activity,
  FileText,
  Trash2,
  X,
  Ban,
  Sparkles,
  ChevronRight,
} from "lucide-react"

interface LabourApplication {
  name: string
  fullName?: string
  mobile: string
  labourUsername: string
  appliedAt: string
}

interface FarmWork {
  _id: string
  farmerUsername: string
  cropName: string
  workType: string
  laboursRequired: number
  workDate: string
  additionalDetails: string
  area: string
  state: string
  status: string
  labourApplications: LabourApplication[]
  createdAt: string
}

interface UserData {
  username: string
  userType: string
  area: string
  state: string
}

interface DashboardStats {
  totalWorks: number
  activeWorks: number
  completedWorks: number
  totalApplications: number
}

interface ConfirmationState {
  isOpen: boolean
  type: "delete" | "cancel" | null
  workId: string | null
  title: string
  description: string
}

interface FormData {
  cropName: string
  workType: string
  laboursRequired: string
  workDate: string
  additionalDetails: string
}

type Toast = {
  id: string;
  message?: string;
  title?: string;
  type?: string;
  variant?: string;
  // add other properties you might need
};

export default function AgroBridgePage() {
  const router = useRouter()
  const { toasts, removeToast, success, error } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [crops, setCrops] = useState<string[]>([])
  const [activeWorks, setActiveWorks] = useState<FarmWork[]>([])
  const [pastWorks, setPastWorks] = useState<FarmWork[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: null,
    workId: null,
    title: "",
    description: "",
  })
  const [stats, setStats] = useState<DashboardStats>({
    totalWorks: 0,
    activeWorks: 0,
    completedWorks: 0,
    totalApplications: 0,
  })

  const tabsRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>({
    cropName: "",
    workType: "",
    laboursRequired: "",
    workDate: "",
    additionalDetails: "",
  })

  const fetchFarmWorks = useCallback(async (username: string) => {
    try {
      const response = await fetch(`/api/farm-works?username=${encodeURIComponent(username)}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch farm works")
      }

      const data = await response.json()
      const works = data.works || []

      const active = works.filter((work: FarmWork) => work.status === "active")
      const past = works.filter((work: FarmWork) => work.status === "completed" || work.status === "cancelled")

      setActiveWorks(active)
      setPastWorks(past)

      const totalApplications = works.reduce((sum: number, work: FarmWork) => sum + work.labourApplications.length, 0)

      setStats({
        totalWorks: works.length,
        activeWorks: active.length,
        completedWorks: past.length,
        totalApplications,
      })
    } catch (err) {
      console.error("Error fetching farm works:", err)
      setErrorMessage("Failed to load work requests")
    }
  }, [])

  const fetchUserData = useCallback(
    async (username: string) => {
      try {
        setLoading(true)
        setErrorMessage(null)

        const userResponse = await fetch(`/api/weather/location?username=${encodeURIComponent(username)}`)
        if (!userResponse.ok) {
          const errorData = await userResponse.json()
          throw new Error(errorData.error || "Failed to fetch user data")
        }

        const userData = await userResponse.json()
        setUser({
          username,
          userType: "farmer",
          area: userData.area,
          state: userData.state,
        })

        const cropsResponse = await fetch(`/api/user-crops?username=${encodeURIComponent(username)}&unique=true`)
        if (!cropsResponse.ok) {
          const errorData = await cropsResponse.json()
          throw new Error(errorData.error || "Failed to fetch crops")
        }

        const cropsData = await cropsResponse.json()
        setCrops(cropsData.crops || [])

        await fetchFarmWorks(username)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setErrorMessage(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    },
    [fetchFarmWorks],
  )

  // Add this state near your other state declarations
const [statusUpdateCompleted, setStatusUpdateCompleted] = useState(false);

// Modify the updateExpiredWorks function
const updateExpiredWorks = useCallback(async () => {
  if (statusUpdateCompleted) return;
  
  try {
    const response = await fetch('/api/farm-works/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to update work statuses');
    }
    setStatusUpdateCompleted(true);
  } catch (err) {
    console.error('Error updating work statuses:', err);
    // Try again next time
    setStatusUpdateCompleted(false);
  }
}, [statusUpdateCompleted]);

// Update the useEffect hook
useEffect(() => {
  const userType = localStorage.getItem("userType");
  const username = localStorage.getItem("username");

  if (!userType || !username || userType !== "farmer") {
    router.push("/login");
    return;
  }

  const initialize = async () => {
    try {
      await updateExpiredWorks();
      await fetchUserData(username);
    } catch (error) {
      console.error("Initialization error:", error);
    }
  };

  initialize();

  // Optional: Add cleanup if needed
  return () => {
    // Any cleanup code
  };
}, [router, fetchUserData, updateExpiredWorks]);

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const canCancelWork = (workDate: string) => {
    const work = new Date(workDate)
    const oneDayBefore = new Date(work)
    oneDayBefore.setDate(oneDayBefore.getDate() - 1)
    oneDayBefore.setHours(23, 59, 59, 999)

    return new Date() <= oneDayBefore
  }

  const navigateToAddWork = () => {
    const addWorkTab = document.querySelector('[data-value="add-work"]') as HTMLElement
    if (addWorkTab) {
      addWorkTab.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSubmitting(true)
      setErrorMessage(null)

      if (!formData.cropName || !formData.workType || !formData.laboursRequired || !formData.workDate) {
        throw new Error("Please fill in all required fields")
      }

      const labourCount = Number.parseInt(formData.laboursRequired)
      if (labourCount < 1 || labourCount > 50) {
        throw new Error("Number of laborers must be between 1 and 50")
      }

      const workDate = new Date(formData.workDate)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      if (workDate < tomorrow) {
        throw new Error("Work date must be tomorrow or later")
      }

      const response = await fetch("/api/farm-works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmerUsername: user.username,
          ...formData,
          area: user.area,
          state: user.state,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to post work")
      }

      success("Work request posted successfully! Laborers in your area can now apply.")

      setFormData({
        cropName: "",
        workType: "",
        laboursRequired: "",
        workDate: "",
        additionalDetails: "",
      })

      await fetchFarmWorks(user.username)
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to post work")
    } finally {
      setSubmitting(false)
    }
  }

  const showDeleteConfirmation = (workId: string, cropName: string, workType: string) => {
    setConfirmation({
      isOpen: true,
      type: "delete",
      workId,
      title: "Delete Work Request",
      description: `Are you sure you want to delete "${cropName} - ${workType}"? This action cannot be undone and will permanently remove this work request from your records.`,
    })
  }

  const showCancelConfirmation = (workId: string, cropName: string, workType: string) => {
    setConfirmation({
      isOpen: true,
      type: "cancel",
      workId,
      title: "Cancel Work Request",
      description: `Are you sure you want to cancel "${cropName} - ${workType}"? All applicants will be notified and this work will be moved to your past works.`,
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmation.workId || !confirmation.type || !user) return

    try {
      if (confirmation.type === "delete") {
        setDeleting(confirmation.workId)
        const response = await fetch("/api/farm-works/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workId: confirmation.workId,
            farmerUsername: user.username,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete work")
        }

        success("Work request deleted successfully.")
      } else if (confirmation.type === "cancel") {
        setCancelling(confirmation.workId)
        const response = await fetch("/api/farm-works/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workId: confirmation.workId,
            farmerUsername: user.username,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to cancel work")
        }

        success("Work cancelled successfully. All applicants have been notified.")
      }

      await fetchFarmWorks(user.username)
    } catch (err) {
      error(err instanceof Error ? err.message : `Failed to ${confirmation.type} work`)
    } finally {
      setDeleting(null)
      setCancelling(null)
      setConfirmation({
        isOpen: false,
        type: null,
        workId: null,
        title: "",
        description: "",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getWorkTypeColor = (workType: string) => {
    const colors: Record<string, string> = {
      planting: "bg-green-100 text-green-800 border-green-200",
      harvesting: "bg-yellow-100 text-yellow-800 border-yellow-200",
      weeding: "bg-blue-100 text-blue-800 border-blue-200",
      irrigation: "bg-cyan-100 text-cyan-800 border-cyan-200",
      fertilizing: "bg-purple-100 text-purple-800 border-purple-200",
      "pest-control": "bg-red-100 text-red-800 border-red-200",
      "land-preparation": "bg-orange-100 text-orange-800 border-orange-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[workType] || colors.other
  }

  const clearMessages = () => {
    setErrorMessage(null)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  const statsCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <motion.div 
          className="flex flex-col items-center gap-4 max-w-md px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <Users className="absolute inset-0 m-auto h-6 w-6 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading AgroBridge</h3>
            <p className="text-gray-600 text-sm">Connecting farmers with laborers...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative">
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts.map((toast: Toast) => ({
          id: toast.id,
          message: toast.message || toast.title || "",
          type:
            toast.type === "success" ||
            toast.type === "error" ||
            toast.type === "warning" ||
            toast.type === "info" ||
            toast.type === "destructive"
              ? toast.type
              : toast.variant === "success" ||
                toast.variant === "error" ||
                toast.variant === "warning" ||
                toast.variant === "info" ||
                toast.variant === "destructive"
              ? toast.variant
              : "info",
        }))}
        onRemove={removeToast}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() =>
          setConfirmation({
            isOpen: false,
            type: null,
            workId: null,
            title: "",
            description: "",
          })
        }
        onConfirm={handleConfirmAction}
        title={confirmation.title}
        description={confirmation.description}
        type={confirmation.type || "default"}
        confirmText={confirmation.type === "delete" ? "Delete Work" : "Cancel Work"}
        isLoading={deleting === confirmation.workId || cancelling === confirmation.workId}
      />

      {/* Header */}
      <motion.div 
        className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-1 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors px-2 py-1 h-8"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="text-xs font-medium">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                <motion.div 
                  className="p-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full"
                  whileHover={{ scale: 1.1 }}
                >
                  <Users className="h-4 w-4 text-green-600" />
                </motion.div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
                  AgroBridge
                </h1>
              </div>

              {user && (
                <div className="flex items-center gap-2">
                  {user && <NotificationBell userId={user.username} userType="farmer" />}
                  {user && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full text-xs border border-green-200"
                    >
                      {user.username}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Connect with farm laborers</p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block px-8 py-6">
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ x: -5 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/farmer")}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:border-green-300 hover:bg-green-50 transition-all duration-200 shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-medium">Back to Dashboard</span>
                </Button>
              </motion.div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Users className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                      AgroBridge
                    </h1>
                    <p className="text-gray-600">Connect farmers with skilled laborers</p>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-3 mb-1">
                    <NotificationBell userId={user.username} userType="farmer" />
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm border border-green-200"
                    >
                      Welcome, {user.username}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Farmer Account</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-3 sm:px-6 lg:px-8">
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dashboard Stats */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
            variants={containerVariants}
          >
            <motion.div variants={statsCardVariants} whileHover={{ scale: 1.03, y: -3 }}>
              <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
                <CardContent className="p-3 lg:p-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs lg:text-sm font-medium">Total Works</p>
                      <p className="text-2xl lg:text-3xl font-bold text-white">{stats.totalWorks}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={statsCardVariants} whileHover={{ scale: 1.03, y: -3 }}>
              <Card className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
                <CardContent className="p-3 lg:p-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs lg:text-sm font-medium">Active Works</p>
                      <p className="text-2xl lg:text-3xl font-bold text-white">{stats.activeWorks}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Activity className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={statsCardVariants} whileHover={{ scale: 1.03, y: -3 }}>
              <Card className="bg-gradient-to-br from-purple-500 via-purple-600 to-violet-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
                <CardContent className="p-3 lg:p-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs lg:text-sm font-medium">Completed</p>
                      <p className="text-2xl lg:text-3xl font-bold text-white">{stats.completedWorks}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={statsCardVariants} whileHover={{ scale: 1.03, y: -3 }}>
              <Card className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
                <CardContent className="p-3 lg:p-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs lg:text-sm font-medium">Applications</p>
                      <p className="text-2xl lg:text-3xl font-bold text-white">{stats.totalApplications}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive" className="border-red-200 bg-red-50 shadow-md">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span>{errorMessage}</span>
                    <Button variant="ghost" size="sm" onClick={clearMessages} className="h-6 w-6 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="add-work" className="w-full" ref={tabsRef}>
              <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-xl border border-gray-200 rounded-xl h-auto p-1.5 mb-6">
                <TabsTrigger
                  value="add-work"
                  data-value="add-work"
                  className="flex items-center gap-1 lg:gap-2 py-2.5 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-green-50"
                >
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Add New Work</span>
                  <span className="sm:hidden">Add</span>
                </TabsTrigger>
                <TabsTrigger
                  value="active-works"
                  data-value="active-works"
                  className="flex items-center gap-1 lg:gap-2 py-2.5 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50"
                >
                  <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Active ({stats.activeWorks})</span>
                  <span className="sm:hidden">Active</span>
                </TabsTrigger>
                <TabsTrigger
                  value="past-works"
                  data-value="past-works"
                  className="flex items-center gap-1 lg:gap-2 py-2.5 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
                >
                  <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Past ({stats.completedWorks})</span>
                  <span className="sm:hidden">Past</span>
                </TabsTrigger>
              </TabsList>

            {/* Add New Work Tab */}
            <TabsContent value="add-work" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-green-50/30 to-white overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-t-lg border-b border-green-100">
                    <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                      <motion.div 
                        className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Plus className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-gray-900">Post New Work Request</span>
                        <CardDescription className="mt-1 text-sm">
                          Create a work request for laborers in your area
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                  {crops.length === 0 ? (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Sprout className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <div className="space-y-2">
                          <p className="font-medium">No crops found in your profile</p>
                          <p className="text-sm">
                            You must add crops to your profile before posting work requests. Please visit the Crop
                            Services section to add your crops first.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/crop-services")}
                            className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            <Sprout className="h-4 w-4 mr-2" />
                            Add Crops Now
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="cropName" className="text-sm font-medium text-gray-700">
                            Select Crop *
                          </Label>
                          <Select
                            value={formData.cropName}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, cropName: value }))}
                            required
                          >
                            <SelectTrigger className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                              <SelectValue placeholder="Choose a crop from your collection" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                              {crops.map((crop, index) => (
                                <SelectItem
                                  key={`crop-${index}-${crop}`}
                                  value={crop}
                                  className="py-3 px-4 hover:bg-green-50 cursor-pointer"
                                >
                                  {crop}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="workType" className="text-sm font-medium text-gray-700">
                            Work Type *
                          </Label>
                          <Select
                            value={formData.workType}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, workType: value }))}
                            required
                          >
                            <SelectTrigger className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                              <SelectValue placeholder="Select type of work" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                              <SelectItem value="planting" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                                🌱 Planting
                              </SelectItem>
                              <SelectItem value="harvesting" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                                🌾 Harvesting
                              </SelectItem>
                              <SelectItem value="weeding" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                                🌿 Weeding
                              </SelectItem>
                              <SelectItem value="irrigation" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                                💧 Irrigation
                              </SelectItem>
                              <SelectItem value="fertilizing" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                                🧪 Fertilizing
                              </SelectItem>
                              <SelectItem value="pest-control" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                                🐛 Pest Control
                              </SelectItem>
                              <SelectItem
                                value="land-preparation"
                                className="py-3 px-4 hover:bg-green-50 cursor-pointer"
                              >
                                🚜 Land Preparation
                              </SelectItem>
                              <SelectItem value="other" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                                📋 Other
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="laboursRequired" className="text-sm font-medium text-gray-700">
                            Laborers Required *
                          </Label>
                          <Input
                            id="laboursRequired"
                            type="number"
                            min="1"
                            max="50"
                            value={formData.laboursRequired}
                            onChange={(e) => setFormData((prev) => ({ ...prev, laboursRequired: e.target.value }))}
                            placeholder="Number of laborers needed"
                            className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                          <p className="text-xs text-gray-500">Maximum 50 laborers per work request</p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="workDate" className="text-sm font-medium text-gray-700">
                            Work Date *
                          </Label>
                          <Input
                            id="workDate"
                            type="date"
                            min={getMinDate()}
                            value={formData.workDate}
                            onChange={(e) => setFormData((prev) => ({ ...prev, workDate: e.target.value }))}
                            className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                            required
                          />
                          <p className="text-xs text-gray-500">Select tomorrow or a future date</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="additionalDetails" className="text-sm font-medium text-gray-700">
                          Additional Details
                        </Label>
                        <Textarea
                          id="additionalDetails"
                          value={formData.additionalDetails}
                          onChange={(e) => setFormData((prev) => ({ ...prev, additionalDetails: e.target.value }))}
                          placeholder="Specify work timings, special requirements, tools needed, payment details, or any other important information..."
                          rows={4}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                        />
                        <p className="text-xs text-gray-500">
                          Provide clear instructions to help laborers understand the work requirements
                        </p>
                      </div>

                      {user && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 text-blue-800">
                            <MapPin className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Work Location</p>
                              <p className="text-sm">
                                {user.area}, {user.state}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Only laborers in this area will see your work request
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={submitting || crops.length === 0}
                        className="w-full bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 hover:from-green-700 hover:via-green-700 hover:to-emerald-700 text-white font-medium py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Posting Work Request...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Post Work Request
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            </TabsContent>

            {/* Active Works Tab */}
            <TabsContent value="active-works" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-white overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-t-lg border-b border-blue-100">
                    <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                      <motion.div 
                        className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-gray-900">Active Work Requests ({stats.activeWorks})</span>
                        <CardDescription className="mt-1 text-sm">
                          Track applications and manage your active work requests
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    <AnimatePresence mode="wait">
                      {activeWorks.length === 0 ? (
                        <motion.div 
                          className="text-center py-12"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <motion.div 
                            className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Clock className="h-8 w-8 text-blue-600" />
                          </motion.div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Work Requests</h3>
                          <p className="text-gray-500 mb-4">You haven&apos;t posted any work requests yet</p>
                          <Button
                            variant="outline"
                            onClick={navigateToAddWork}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 shadow-md"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Post Your First Work Request
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="space-y-6"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {activeWorks.map((work, index) => (
                            <motion.div
                              key={work._id}
                              variants={itemVariants}
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-50/50">
                          <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-3">
                                  <h3 className="font-semibold text-lg lg:text-xl text-gray-900 break-words">
                                    <span className="break-all">{work.cropName}</span> -{" "}
                                    <span className="break-all">{work.workType}</span>
                                  </h3>
                                  <Badge
                                    className={`${getWorkTypeColor(work.workType)} flex-shrink-0`}
                                    variant="outline"
                                  >
                                    <span className="truncate max-w-[100px] sm:max-w-none">{work.workType}</span>
                                  </Badge>
                                  <Badge className={`${getStatusColor(work.status)} flex-shrink-0`} variant="outline">
                                    {work.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                    <span className="truncate">
                                      <strong>Work Date:</strong> {formatDate(work.workDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="truncate">
                                      <strong>Laborers:</strong> {work.laboursRequired} needed
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 min-w-0 sm:col-span-2 lg:col-span-1">
                                    <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                    <span className="truncate">
                                      <strong>Location:</strong> {work.area}, {work.state}
                                    </span>
                                  </div>
                                </div>

                                {work.additionalDetails && (
                                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-gray-700 break-words">
                                      <strong>Additional Details:</strong> {work.additionalDetails}
                                    </p>
                                  </div>
                                )}

                                <div className="text-xs text-gray-500">Posted on: {formatDateTime(work.createdAt)}</div>
                              </div>

                              {/* Cancel Button */}
                              {canCancelWork(work.workDate) && (
                                <div className="flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => showCancelConfirmation(work._id, work.cropName, work.workType)}
                                    disabled={cancelling === work._id}
                                    className="border-red-300 text-red-700 hover:bg-red-50 w-full lg:w-auto"
                                  >
                                    {cancelling === work._id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cancelling...
                                      </>
                                    ) : (
                                      <>
                                        <Ban className="mr-2 h-4 w-4" />
                                        Cancel Work
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="border-t pt-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                <h4 className="font-medium text-gray-900">
                                  Applications ({work.labourApplications.length}/{work.laboursRequired})
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min((work.labourApplications.length / work.laboursRequired) * 100, 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 flex-shrink-0">
                                    {Math.round((work.labourApplications.length / work.laboursRequired) * 100)}%
                                  </span>
                                </div>
                              </div>

                              {work.labourApplications.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500">No applications yet</p>
                                  <p className="text-xs text-gray-400">
                                    Laborers in your area will see this work request
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {work.labourApplications.map((application, applicationIndex) => (
                                    <div
                                      key={`${work._id}-application-${applicationIndex}-${application.labourUsername}`}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 gap-3"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <User className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-medium text-gray-900 break-words">
                                            {application.fullName || application.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Applied: {formatDateTime(application.appliedAt)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                                        <Phone className="h-4 w-4 text-blue-500" />
                                        <span className="font-medium">{application.mobile}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Past Works Tab */}
            <TabsContent value="past-works" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50/30 to-white overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 rounded-t-lg border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                      <motion.div 
                        className="p-2.5 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </motion.div>
                    <div>
                      <span className="text-gray-900">Past Works ({stats.completedWorks})</span>
                      <CardDescription className="mt-1 text-sm">
                        View your completed and cancelled work requests
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <AnimatePresence mode="wait">
                    {pastWorks.length === 0 ? (
                      <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <motion.div 
                          className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
                          whileHover={{ scale: 1.1 }}
                        >
                          <CheckCircle className="h-8 w-8 text-gray-600" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Past Works</h3>
                        <p className="text-gray-500">Your completed and cancelled work requests will appear here</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {pastWorks.map((work, index) => (
                          <motion.div
                            key={work._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card className="border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50/50">
                              <CardContent className="p-4 lg:p-6">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-3">
                                      <h3 className="font-semibold text-lg lg:text-xl text-gray-900 break-words">
                                        <span className="break-all">{work.cropName}</span> -{" "}
                                        <span className="break-all">{work.workType}</span>
                                      </h3>
                                      <Badge
                                        className={`${getWorkTypeColor(work.workType)} flex-shrink-0`}
                                        variant="outline"
                                      >
                                        <span className="truncate max-w-[100px] sm:max-w-none">{work.workType}</span>
                                      </Badge>
                                      <Badge className={`${getStatusColor(work.status)} flex-shrink-0`} variant="outline">
                                        {work.status}
                                      </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 text-sm text-gray-600 mb-4">
                                      <div className="flex items-center gap-2 min-w-0 p-2 bg-blue-50 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        <span className="truncate">
                                          <strong>Work Date:</strong> {formatDate(work.workDate)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 min-w-0 p-2 bg-green-50 rounded-lg">
                                    <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="truncate">
                                      <strong>Workers:</strong> {work.labourApplications.length}/{work.laboursRequired}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 min-w-0 sm:col-span-2 lg:col-span-1">
                                    <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                    <span className="truncate">
                                      <strong>Location:</strong> {work.area}, {work.state}
                                    </span>
                                  </div>
                                </div>

                                {work.additionalDetails && (
                                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-gray-700 break-words">
                                      <strong>Work Details:</strong> {work.additionalDetails}
                                    </p>
                                  </div>
                                )}

                                <div className="text-xs text-gray-500">
                                  {work.status === "completed" ? "Completed" : "Cancelled"} on:{" "}
                                  {formatDate(work.workDate)} • Posted: {formatDateTime(work.createdAt)}
                                </div>
                              </div>

                              {/* Delete Button */}
                              <div className="flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => showDeleteConfirmation(work._id, work.cropName, work.workType)}
                                  disabled={deleting === work._id}
                                  className="border-red-300 text-red-700 hover:bg-red-50 w-full lg:w-auto"
                                >
                                  {deleting === work._id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {work.labourApplications.length > 0 && (
                              <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Workers ({work.labourApplications.length})
                                </h4>
                                <div className="space-y-3">
                                  {work.labourApplications.map((application, applicationIndex) => (
                                    <div
                                      key={`${work._id}-past-application-${applicationIndex}-${application.labourUsername}`}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200 gap-3"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-medium text-gray-900 break-words">
                                            {application.fullName || application.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Applied: {formatDateTime(application.appliedAt)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                                        <Phone className="h-4 w-4 text-blue-500" />
                                        <span className="font-medium">{application.mobile}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
      </motion.div>
    </main>
  </div>
)

}
