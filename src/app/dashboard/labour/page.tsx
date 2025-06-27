"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToastContainer } from "@/components/ui/toast-container"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { useToast } from "@/app/hooks/use-toast"
import {
  Briefcase,
  ArrowRight,
  Sun,
  Users,
  Clock,
  CheckCircle,
  Handshake,
  Ban,
  Loader2,
  Calendar,
  MapPin,
  AlertTriangle,
  Info,
  Bell,
  CloudRain,
  Activity,
  Search,
  MessageSquare
} from "lucide-react"
import { NotificationBell } from "@/components/ui/notifications-bell"

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

interface Announcement {
  _id: string
  announcementId: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

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

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements?activeOnly=true")
      if (!response.ok) {
        throw new Error("Failed to fetch announcements")
      }
      const data = await response.json()
      const activeAnnouncements = (data.announcements || []).filter((ann: Announcement) => ann.isActive === true)
      setAnnouncements(activeAnnouncements)
    } catch (err) {
      console.error("Error fetching announcements:", err)
    }
  }, [])

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "labour") {
      router.push("/login")
      return
    }

    fetchUserData(username)
    fetchAnnouncements()
  }, [router, fetchUserData, fetchAnnouncements])

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

  const formatAnnouncementDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getAnnouncementStyle = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-900"
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-900"
      case "error":
        return "bg-red-50 border-red-200 text-red-900"
      default:
        return "bg-blue-50 border-blue-200 text-blue-900"
    }
  }

  const getAnnouncementBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Success</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">Alert</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Info</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="flex flex-col items-center gap-4 max-w-md px-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Briefcase className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Loading Dashboard</h3>
            <p className="text-gray-600">Fetching your work information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative">
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts.map((toast: any) => ({
          id: toast.id,
          message: toast.message || toast.title || "",
          type: toast.type || toast.variant || "info",
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

      {/* Professional Announcements Section */}
      {announcements.length > 0 && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Bell className="h-6 w-6 text-blue-600" />
                Announcements
              </h2>
              <p className="text-gray-600 mt-1">Important updates from the FarmEase team</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 max-w-4xl mx-auto">
              {announcements.map((announcement) => (
                <Alert
                  key={announcement.announcementId}
                  className={`${getAnnouncementStyle(announcement.type)} border-l-4 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">{getAnnouncementIcon(announcement.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-base">{announcement.title}</h4>
                        {getAnnouncementBadge(announcement.type)}
                      </div>
                      <AlertDescription className="text-sm leading-relaxed mb-2">
                        {announcement.message}
                      </AlertDescription>
                      <p className="text-xs opacity-75">{formatAnnouncementDate(announcement.createdAt)}</p>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-10">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-4xl font-bold text-gray-900">Labour Dashboard</h1>
              {user && <NotificationBell userId={user.username} userType="labour" />}
            </div>
            <p className="text-xl text-gray-600 mb-2">Find farm work opportunities in your area</p>
            {user && (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>
                  {user.area}, {user.state}
                </span>
              </div>
            )}
          </div>

          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="h-8 w-8 text-blue-100" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.activeApplications}</div>
                <div className="text-blue-100">Active Applications</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="h-8 w-8 text-green-100" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.completedWorks}</div>
                <div className="text-green-100">Completed Works</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Briefcase className="h-8 w-8 text-purple-100" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.availableJobs}</div>
                <div className="text-purple-100">Available Jobs</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Services Grid */}

    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
  {/* Work Opportunities */}
  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:bg-blue-600 transition-colors">
          <Briefcase className="h-8 w-8 text-white" />
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">Available</Badge>
      </div>
      <CardTitle className="text-xl font-bold text-gray-900">Work Opportunities</CardTitle>
      <CardDescription className="text-gray-600">
        Browse and apply for farm work in your region
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Search className="h-4 w-4 text-blue-600" />
            <span>Browse Local Jobs</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Apply for Work</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Activity className="h-4 w-4 text-blue-600" />
            <span>Track Applications</span>
          </div>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md group-hover:shadow-lg transition-all"
          onClick={() => router.push("/work-opportunities")}
        >
          Find Work
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Weather Services */}
  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:bg-green-600 transition-colors">
          <Sun className="h-8 w-8 text-white" />
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-300">Real-time</Badge>
      </div>
      <CardTitle className="text-xl font-bold text-gray-900">Weather Forecast</CardTitle>
      <CardDescription className="text-gray-600">Get weather updates and farming alerts</CardDescription>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CloudRain className="h-4 w-4 text-green-600" />
            <span>24-Hour Forecast</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4 text-green-600" />
            <span>5-Day Outlook</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <span>Weather Alerts</span>
          </div>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md group-hover:shadow-lg transition-all"
          onClick={() => router.push("/weather")}
        >
          View Weather
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Community Card */}
  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:bg-purple-600 transition-colors">
          <Users className="h-8 w-8 text-white" />
        </div>
        <Badge className="bg-purple-100 text-purple-800 border-purple-300">Coming Soon</Badge>
      </div>
      <CardTitle className="text-xl font-bold text-gray-900">Community</CardTitle>
      <CardDescription className="text-gray-600">
        Connect with other farm workers and share experiences
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="h-4 w-4 text-purple-600" />
            <span>Experience Sharing</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Activity className="h-4 w-4 text-purple-600" />
            <span>Skill Development Resources</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Handshake className="h-4 w-4 text-purple-600" />
            <span>Group Work Coordination</span>
          </div>
        </div>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md group-hover:shadow-lg transition-all"
          disabled
        >
          Coming Soon
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

          {/* My Active Applications */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <span className="text-gray-900">My Active Applications</span>
                  <CardDescription className="mt-2 text-base">
                    Track and manage your current work applications
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">{stats.activeApplications}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {activeApplications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Applications</h3>
                  <p className="text-gray-500 mb-6">Apply for work opportunities to see them here</p>
                  <Button onClick={() => router.push("/work-opportunities")} className="bg-blue-600 hover:bg-blue-700">
                    Find Work Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeApplications.map((work) => (
                    <Card
                      key={work._id}
                      className="border-2 border-blue-200 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-bold text-xl text-gray-900">
                                {work.cropName} - {work.workType}
                              </h3>
                              <Badge className={`${getWorkTypeColor(work.workType)} text-sm px-3 py-1`}>
                                {work.workType}
                              </Badge>
                              <Badge className={`${getStatusColor(work.status)} text-sm px-3 py-1`}>
                                {work.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">{formatDate(work.workDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-green-600" />
                                <span className="font-medium">
                                  {work.labourApplications.length}/{work.laboursRequired} applied
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-purple-600" />
                                <span className="font-medium">
                                  {work.area}, {work.state}
                                </span>
                              </div>
                            </div>

                            {work.additionalDetails && (
                              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <p className="text-sm text-gray-700">
                                  <strong className="text-gray-900">Work Details:</strong> {work.additionalDetails}
                                </p>
                              </div>
                            )}

                            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                              <div className="flex flex-wrap gap-4">
                                <span>
                                  <strong>Farmer:</strong> {work.farmerUsername}
                                </span>
                                <span>
                                  <strong>Applied:</strong>{" "}
                                  {formatDateTime(
                                    work.labourApplications.find((app) => app.labourUsername === user?.username)
                                      ?.appliedAt || "",
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {canWithdrawFromWork(work.workDate) && (
                            <div className="w-full lg:w-auto flex justify-center lg:block">
                              <Button
                                variant="outline"
                                size="lg"
                                onClick={() => showWithdrawConfirmation(work._id, work.cropName, work.workType)}
                                disabled={withdrawing === work._id}
                                className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 px-6 py-3"
                              >
                                {withdrawing === work._id ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Withdrawing...
                                  </>
                                ) : (
                                  <>
                                    <Ban className="mr-2 h-5 w-5" />
                                    Withdraw Application
                                  </>
                                )}
                              </Button>
                            </div>
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
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg border-b border-gray-100 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <span className="text-gray-900">Work History</span>
                  <CardDescription className="mt-2 text-base">
                    View your completed and cancelled work history
                  </CardDescription>
                </div>
                <Badge className="bg-gray-100 text-gray-800 text-lg px-3 py-1">{stats.completedWorks}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {pastWorks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Work History</h3>
                  <p className="text-gray-500">Your completed and cancelled works will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pastWorks.map((work) => (
                    <Card
                      key={work._id}
                      className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-bold text-xl text-gray-900">
                              {work.cropName} - {work.workType}
                            </h3>
                            <Badge className={`${getWorkTypeColor(work.workType)} text-sm px-3 py-1`}>
                              {work.workType}
                            </Badge>
                            <Badge className={`${getStatusColor(work.status)} text-sm px-3 py-1`}>{work.status}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              <span className="font-medium">{formatDate(work.workDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-green-600" />
                              <span className="font-medium">
                                {work.labourApplications.length}/{work.laboursRequired} workers
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-purple-600" />
                              <span className="font-medium">
                                {work.area}, {work.state}
                              </span>
                            </div>
                          </div>

                          {work.additionalDetails && (
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                              <p className="text-sm text-gray-700">
                                <strong className="text-gray-900">Work Details:</strong> {work.additionalDetails}
                              </p>
                            </div>
                          )}

                          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                            <div className="flex flex-wrap gap-4">
                              <span>
                                <strong>Farmer:</strong> {work.farmerUsername}
                              </span>
                              <span>
                                <strong>Status:</strong> {work.status === "completed" ? "Completed" : "Cancelled"}
                              </span>
                              <span>
                                <strong>Date:</strong> {formatDate(work.workDate)}
                              </span>
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
