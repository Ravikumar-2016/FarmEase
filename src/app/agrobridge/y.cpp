"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastContainer } from "@/components/ui/toast-container"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { useToast } from "@/app/hooks/use-toast"
import { Briefcase, ArrowRight, Sun, Users, Clock, CheckCircle, Ban, Loader2, Calendar, MapPin } from "lucide-react"

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

interface WithdrawConfirmation {
  isOpen: boolean
  workId: string | null
  cropName: string
  workType: string
}

interface DashboardStats {
  activeApplications: number
  completedWorks: number
  availableJobs: number
}

export default function LabourDashboard() {
  const router = useRouter()
  const { toasts, removeToast, success, error } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeApplications, setActiveApplications] = useState<FarmWork[]>([])
  const [pastWorks, setPastWorks] = useState<FarmWork[]>([])
  const [withdrawing, setWithdrawing] = useState<string | null>(null)
  const [withdrawConfirmation, setWithdrawConfirmation] = useState<WithdrawConfirmation>({
    isOpen: false,
    workId: null,
    cropName: "",
    workType: "",
  })
  const [stats, setStats] = useState<DashboardStats>({
    activeApplications: 0,
    completedWorks: 0,
    availableJobs: 0,
  })

  const fetchLabourWorks = useCallback(
    async (userInfo: UserData) => {
      try {
        const response = await fetch(
          `/api/farm-works?area=${encodeURIComponent(userInfo.area)}&state=${encodeURIComponent(userInfo.state)}`,
        )
        if (!response.ok) throw new Error("Failed to fetch works")

        const data = await response.json()
        const allWorks = data.works || []

        const userAppliedWorks = allWorks.filter((work: FarmWork) =>
          work.labourApplications.some((app) => app.labourUsername === userInfo.username),
        )

        const active = userAppliedWorks.filter((work: FarmWork) => work.status === "active")
        const past = userAppliedWorks.filter(
          (work: FarmWork) => work.status === "completed" || work.status === "cancelled",
        )

        setActiveApplications(active)
        setPastWorks(past)

        const availableJobs = allWorks.filter(
          (work: FarmWork) =>
            work.status === "active" &&
            !work.labourApplications.some((app) => app.labourUsername === userInfo.username) &&
            work.labourApplications.length < work.laboursRequired,
        ).length

        setStats({
          activeApplications: active.length,
          completedWorks: past.length,
          availableJobs,
        })
      } catch (err) {
        console.error("Error fetching labour works:", err)
        error("Failed to load work history")
      }
    },
    [error],
  )

  const fetchUserData = useCallback(
    async (username: string) => {
      try {
        setLoading(true)

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

        await fetchLabourWorks(userInfo)
      } catch (err) {
        console.error("Error fetching user data:", err)
        error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    },
    [fetchLabourWorks, error],
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

  const canWithdrawFromWork = (workDate: string) => {
    const work = new Date(workDate)
    const oneDayBefore = new Date(work)
    oneDayBefore.setDate(oneDayBefore.getDate() - 1)
    oneDayBefore.setHours(23, 59, 59, 999)

    return new Date() <= oneDayBefore
  }

  const showWithdrawConfirmation = (workId: string, cropName: string, workType: string) => {
    setWithdrawConfirmation({
      isOpen: true,
      workId,
      cropName,
      workType,
    })
  }

  const handleWithdrawApplication = async () => {
    if (!user || !withdrawConfirmation.workId) return

    try {
      setWithdrawing(withdrawConfirmation.workId)

      const response = await fetch("/api/farm-works/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workId: withdrawConfirmation.workId,
          labourUsername: user.username,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to withdraw application")
      }

      success("Application withdrawn successfully. You can reapply if the deadline hasn't passed.")
      await fetchLabourWorks(user)
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to withdraw application")
    } finally {
      setWithdrawing(null)
      setWithdrawConfirmation({
        isOpen: false,
        workId: null,
        cropName: "",
        workType: "",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4 max-w-md px-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Briefcase className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading Dashboard</h3>
            <p className="text-gray-600 text-sm">Fetching your work information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts.map((toast: any) => ({
          id: toast.id,
          message: toast.message || toast.title || "",
          type: toast.type || toast.variant || "info",
          // add other properties if needed
        }))}
        onRemove={removeToast}
      />

      {/* Withdrawal Confirmation Modal */}
      <ConfirmationModal
        isOpen={withdrawConfirmation.isOpen}
        onClose={() =>
          setWithdrawConfirmation({
            isOpen: false,
            workId: null,
            cropName: "",
            workType: "",
          })
        }
        onConfirm={handleWithdrawApplication}
        title="Withdraw Application"
        description={`Are you sure you want to withdraw your application for "${withdrawConfirmation.cropName} - ${withdrawConfirmation.workType}"? You can reapply later if the deadline hasn't passed.`}
        type="withdraw"
        confirmText="Withdraw Application"
        isLoading={withdrawing === withdrawConfirmation.workId}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Labour Dashboard</h1>
            <p className="text-gray-600">Find farm work opportunities in your area</p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Location: {user.area}, {user.state}
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.activeApplications}</div>
                <div className="text-sm text-blue-800">Active Applications</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.completedWorks}</div>
                <div className="text-sm text-green-800">Completed Works</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.availableJobs}</div>
                <div className="text-sm text-purple-800">Available Jobs</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Work Opportunities */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  Work Opportunities
                  <Badge variant="secondary">Available</Badge>
                </CardTitle>
                <CardDescription>Browse and apply for farm work opportunities in your local area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Features:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Browse Local Farm Jobs</li>
                      <li>• Apply for Work Opportunities</li>
                      <li>• View Job Requirements</li>
                      <li>• Track Application Status</li>
                      <li>• Connect with Local Farmers</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full group-hover:bg-blue-600 transition-colors bg-blue-500 hover:bg-blue-600"
                    onClick={() => router.push("/work-opportunities")}
                  >
                    Find Work Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weather Services */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sun className="h-6 w-6 text-blue-600" />
                  Weather Forecast
                  <Badge variant="secondary">Real-time</Badge>
                </CardTitle>
                <CardDescription>Get detailed weather forecasts, alerts, and farming recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Features:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Current Weather Conditions</li>
                      <li>• 24-Hour Hourly Forecast</li>
                      <li>• 7-Day Weather Outlook</li>
                      <li>• Weather Alerts & Warnings</li>
                      <li>• Smart Farming Suggestions</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full group-hover:bg-blue-600 transition-colors bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      const userType = localStorage.getItem("userType")
                      const username = localStorage.getItem("username")

                      if (userType && username) {
                        router.push("/weather")
                      } else {
                        router.push("/login")
                      }
                    }}
                  >
                    View Weather Forecast
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-6 w-6 text-green-600" />
                  Community
                  <Badge variant="outline">Coming Soon</Badge>
                </CardTitle>
                <CardDescription>Connect with other farm workers and share experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Upcoming Features:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Worker Community Forum</li>
                      <li>• Experience Sharing</li>
                      <li>• Skill Development Resources</li>
                      <li>• Worker Reviews & Ratings</li>
                      <li>• Group Work Coordination</li>
                    </ul>
                  </div>
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                    Coming Soon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Active Applications */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-gray-900">My Active Applications ({stats.activeApplications})</span>
                  <CardDescription className="mt-1 text-sm">
                    Track your active work applications and manage them
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              {activeApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active applications</p>
                  <p className="text-sm text-gray-400">Apply for work opportunities to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeApplications.map((work) => (
                    <Card key={work._id} className="border border-blue-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {work.cropName} - {work.workType}
                              </h3>
                              <Badge className={getWorkTypeColor(work.workType)}>{work.workType}</Badge>
                              <Badge className={getStatusColor(work.status)}>{work.status}</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(work.workDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {work.labourApplications.length}/{work.laboursRequired} applied
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {work.area}, {work.state}
                              </span>
                            </div>

                            {work.additionalDetails && (
                              <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                                <strong>Details:</strong> {work.additionalDetails}
                              </p>
                            )}

                            <div className="text-xs text-gray-500">
                              Farmer: {work.farmerUsername} • Applied:{" "}
                              {formatDateTime(
                                work.labourApplications.find((app) => app.labourUsername === user?.username)
                                  ?.appliedAt || "",
                              )}
                            </div>
                          </div>

                          {/* Withdraw Button */}
                          {canWithdrawFromWork(work.workDate) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => showWithdrawConfirmation(work._id, work.cropName, work.workType)}
                              disabled={withdrawing === work._id}
                              className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              {withdrawing === work._id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Withdrawing...
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Withdraw
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Past Works */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
                </div>
                <div>
                  <span className="text-gray-900">My Past Works ({stats.completedWorks})</span>
                  <CardDescription className="mt-1 text-sm">
                    View your completed and cancelled work history
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              {pastWorks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No past works</p>
                  <p className="text-sm text-gray-400">Your completed and cancelled works will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastWorks.map((work) => (
                    <Card key={work._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {work.cropName} - {work.workType}
                              </h3>
                              <Badge className={getWorkTypeColor(work.workType)}>{work.workType}</Badge>
                              <Badge className={getStatusColor(work.status)}>{work.status}</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(work.workDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {work.labourApplications.length}/{work.laboursRequired} workers
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {work.area}, {work.state}
                              </span>
                            </div>

                            {work.additionalDetails && (
                              <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                                <strong>Details:</strong> {work.additionalDetails}
                              </p>
                            )}

                            <div className="text-xs text-gray-500">
                              Farmer: {work.farmerUsername} • {work.status === "completed" ? "Completed" : "Cancelled"}{" "}
                              on: {formatDate(work.workDate)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
