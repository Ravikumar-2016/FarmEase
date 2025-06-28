"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToastContainer } from "@/components/ui/toast-container"
import { useToast } from "@/app/hooks/use-toast"
import { NotificationBell } from "@/components/ui/notifications-bell"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  User,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Search,
  Clock,
  X,
} from "lucide-react"

interface LabourApplication {
  name: string
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

interface UserInfo {
  username: string
  userType: string
  area: string
  state: string
}

type Toast = {
  id: string;
  message?: string;
  title?: string;
  type?: string;
  variant?: string;
  // add other properties you might need
};

export default function WorkOpportunitiesPage() {
  const router = useRouter()
  const { toasts, removeToast, success, error } = useToast()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [availableWorks, setAvailableWorks] = useState<FarmWork[]>([])
  const [appliedWorks, setAppliedWorks] = useState<string[]>([])
  const [applying, setApplying] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchAvailableWorks = useCallback(async (userInfo: UserInfo) => {
    try {
      const response = await fetch(
        `/api/farm-works?area=${encodeURIComponent(userInfo.area)}&state=${encodeURIComponent(userInfo.state)}`,
      )
      if (!response.ok) throw new Error("Failed to fetch available works")

      const data = await response.json()
      const works = data.works || []

      // Filter only active works that are not from the current user (if they're also a farmer)
      const activeWorks = works.filter(
        (work: FarmWork) => work.status === "active" && work.farmerUsername !== userInfo.username,
      )

      setAvailableWorks(activeWorks)

      // Track which works the user has already applied to
      const applied = activeWorks
        .filter((work: FarmWork) => work.labourApplications.some((app) => app.labourUsername === userInfo.username))
        .map((work: FarmWork) => work._id)

      setAppliedWorks(applied)
    } catch (err) {
      console.error("Error fetching available works:", err)
      setErrorMessage("Failed to load available works")
    }
  }, [])

  const fetchUserData = useCallback(
    async (username: string) => {
      try {
        setLoading(true)
        setErrorMessage(null)

        // Fetch user details
        const userResponse = await fetch(`/api/weather/location?username=${encodeURIComponent(username)}`)
        if (!userResponse.ok) throw new Error("Failed to fetch user data")

        const userData = await userResponse.json()
        const userInfo = {
          username,
          userType: "labour",
          area: userData.area,
          state: userData.state,
        }
        setUser(userInfo)

        // Fetch available works
        await fetchAvailableWorks(userInfo)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setErrorMessage(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    },
    [fetchAvailableWorks],
  )

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "labour") {
      router.push("/login")
      return
    }

    fetchUserData(username)
  }, [router, fetchUserData])

  const canApplyToWork = (work: FarmWork) => {
    const workDate = new Date(work.workDate)
    const dayBefore = new Date(workDate)
    dayBefore.setDate(dayBefore.getDate() - 1)
    dayBefore.setHours(23, 0, 0, 0) // 11 PM day before

    const currentTime = new Date()
    return currentTime <= dayBefore
  }

  const getApplicationDeadlineMessage = (work: FarmWork) => {
    const workDate = new Date(work.workDate)
    const dayBefore = new Date(workDate)
    dayBefore.setDate(dayBefore.getDate() - 1)
    dayBefore.setHours(23, 0, 0, 0) // 11 PM day before

    const currentTime = new Date()

    if (currentTime > dayBefore) {
      return "Applications closed at 11:00 PM the day before"
    }

    return `Applications close at 11:00 PM on ${dayBefore.toLocaleDateString()}`
  }

  const handleApply = async (workId: string) => {
    if (!user) return

    try {
      setApplying(workId)
      setErrorMessage(null)

      const response = await fetch("/api/farm-works/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workId,
          labourUsername: user.username,
          name: user.username,
          mobile: "9876543210", // This should come from user profile
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to apply for work")
      }

      // Show success message
      success("Work applied successfully! The farmer will contact you soon.")

      // Update applied works state
      setAppliedWorks((prev) => [...prev, workId])

      // Refresh available works to get updated application count
      await fetchAvailableWorks(user)
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to apply for work")
    } finally {
      setApplying(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  const clearErrorMessage = () => {
    setErrorMessage(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4 max-w-md px-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Briefcase className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading Work Opportunities</h3>
            <p className="text-gray-600 text-sm">Finding jobs in your area...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
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
                // add other properties if needed
              }))}
              onRemove={removeToast}
            />

      {/* Header */}
      <div className="relative z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/labour")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors px-2 py-1 h-8"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="text-xs font-medium">Back</span>
              </Button>
               <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-900 mb-1">Work Opportunities</h1>
                    <p className="text-xs text-gray-600">Find farm work in your area</p>
                </div>
              {user && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-full text-xs border border-blue-200"
                >
                  {user.username}
                </Badge>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block px-8 py-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/labour")}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Dashboard</span>
              </Button>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Work Opportunities</h1>
                    <p className="text-gray-600">Find farm work in your area</p>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-3 mb-1">
                    <NotificationBell userId={user.username} userType="labour" />
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm border border-blue-200"
                    >
                      Welcome, {user.username}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Labour Account</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-3 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex justify-between items-center">
                <span>{errorMessage}</span>
                <Button variant="ghost" size="sm" onClick={clearErrorMessage} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Location Info */}
          {user && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Work Location</p>
                    <p className="text-sm">
                      Showing opportunities in: {user.area}, {user.state}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Works */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-gray-900">Available Work Opportunities ({availableWorks.length})</span>
                  <CardDescription className="mt-1 text-sm">
                    Farm work opportunities in your area that match your location
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              {availableWorks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Opportunities Available</h3>
                  <p className="text-gray-500 mb-2">There are currently no active work opportunities in your area</p>
                  <p className="text-sm text-gray-400">Check back later for new opportunities</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {availableWorks.map((work) => {
                    const hasApplied = appliedWorks.includes(work._id)
                    const spotsLeft = work.laboursRequired - work.labourApplications.length
                    const canApply = canApplyToWork(work)
                    const deadlineMessage = getApplicationDeadlineMessage(work)

                    return (
                      <Card key={work._id} className="border border-blue-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-3">
                                <h3 className="font-semibold text-lg lg:text-xl text-gray-900 break-words">
                                  <span className="break-all">{work.cropName}</span> -{" "}
                                  <span className="break-all">{work.workType}</span>
                                </h3>
                                <Badge className={`${getWorkTypeColor(work.workType)} flex-shrink-0`} variant="outline">
                                  <span className="truncate max-w-[100px] sm:max-w-none">{work.workType}</span>
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
                                    <strong>Spots Left:</strong> {spotsLeft} of {work.laboursRequired}
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

                              {/* Application Deadline Info */}
                              <div className="text-xs text-gray-500 mb-3 bg-blue-50 p-2 rounded border border-blue-200">
                                <Clock className="h-3 w-3 inline mr-1 text-blue-600" />
                                <strong>Application Deadline:</strong> {deadlineMessage}
                              </div>

                              <div className="text-xs text-gray-500">
                                <strong>Posted by:</strong> {work.farmerUsername} • <strong>Applications:</strong>{" "}
                                {work.labourApplications.length}/{work.laboursRequired}
                              </div>
                            </div>

                            <div className="flex-shrink-0 w-full lg:w-auto">
                              {hasApplied ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200 w-full lg:w-auto justify-center py-2 px-4">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Application Submitted
                                </Badge>
                              ) : !canApply ? (
                                <div className="text-center">
                                  <Badge
                                    variant="secondary"
                                    className="bg-red-100 text-red-800 border-red-200 mb-2 w-full lg:w-auto justify-center py-2 px-4"
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Application Deadline Passed
                                  </Badge>
                                  <p className="text-xs text-red-600">
                                    Applications closed at 11:00 PM the day before work date
                                  </p>
                                </div>
                              ) : spotsLeft > 0 ? (
                                <Button
                                  onClick={() => handleApply(work._id)}
                                  disabled={applying === work._id}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-6 w-full lg:w-auto shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                  {applying === work._id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Applying...
                                    </>
                                  ) : (
                                    <>
                                      <User className="mr-2 h-4 w-4" />
                                      Apply Now
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-800 border-orange-200 w-full lg:w-auto justify-center py-2 px-4"
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  All Positions Filled
                                </Badge>
                              )}
                            </div>
                          </div>

                          {work.labourApplications.length > 0 && (
                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  Current Applicants ({work.labourApplications.length})
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min((work.labourApplications.length / work.laboursRequired) * 100, 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {Math.round((work.labourApplications.length / work.laboursRequired) * 100)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
