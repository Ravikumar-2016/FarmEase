"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Sprout,
  ArrowRight,
  Sun,
  Users,
  TrendingUp,
  Brain,
  CloudRain,
  Handshake,
  BarChart3,
  AlertTriangle,
  Info,
  CheckCircle,
  Bell,
  MapPin,
  Calendar,
  Activity,
  Shield,
  Tractor,
} from "lucide-react"
import { NotificationBell } from "@/components/ui/notifications-bell"

interface Announcement {
  _id: string
  announcementId: string
  title: string
  message: string
  type: "warning" | "info" | "success" | "error"
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface UserData {
  username: string
  userType: string
  area: string
  state: string
}

export default function FarmerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async (username: string) => {
    try {
      const userResponse = await fetch(`/api/weather/location?username=${encodeURIComponent(username)}`)
      if (!userResponse.ok) throw new Error("Failed to fetch user data")

      const userData = await userResponse.json()
      const userInfo = {
        username,
        userType: "farmer",
        area: userData.area,
        state: userData.state,
      }
      setUser(userInfo)
    } catch (err) {
      console.error("Error fetching user data:", err)
    }
  }, [])

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
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "farmer") {
      router.push("/login")
      return
    }

    fetchUserData(username)
    fetchAnnouncements()
  }, [router, fetchUserData, fetchAnnouncements])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
                      <p className="text-xs opacity-75">{formatDate(announcement.createdAt)}</p>
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
              <h1 className="text-4xl font-bold text-gray-900">Farmer Dashboard</h1>
              {user && <NotificationBell userId={user.username} userType="farmer" />}
            </div>
            <p className="text-xl text-gray-600 mb-2">Manage your farm operations with AI-powered tools</p>
            {user && (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>
                  {user.area}, {user.state}
                </span>
              </div>
            )}
          </div>

          {/* Core Services - First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Crop Services */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:bg-green-600 transition-colors">
                    <Sprout className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">AI Powered</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Crop Services</CardTitle>
                <CardDescription className="text-gray-600">
                  AI-powered crop recommendations and fertilizer suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Brain className="h-4 w-4 text-green-600" />
                      <span>AI Crop Recommendations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span>Fertilizer Suggestions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <span>My Crops Management</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md group-hover:shadow-lg transition-all"
                    onClick={() => router.push("/crop-services")}
                  >
                    Access Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weather Forecast */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:bg-blue-600 transition-colors">
                    <Sun className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">Live Data</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Weather Forecast</CardTitle>
                <CardDescription className="text-gray-600">
                  Get Real-time weather updates and farming alerts daily
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CloudRain className="h-4 w-4 text-blue-600" />
                      <span>24-Hour Forecast</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>5-Day Weather Outlook</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <span>Weather Alerts</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md group-hover:shadow-lg transition-all"
                    onClick={() => router.push("/weather")}
                  >
                    View Forecast
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AgroBridge */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:bg-purple-600 transition-colors">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">Active</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">AgroBridge</CardTitle>
                <CardDescription className="text-gray-600">
                  Connect with farm laborers and manage work requests
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Handshake className="h-4 w-4 text-purple-600" />
                      <span>Post Work Opportunities</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>View Applicants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span>Work History</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md group-hover:shadow-lg transition-all"
                    onClick={() => router.push("/agrobridge")}
                  >
                    Manage Workers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Core Services - Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Market Prices */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-amber-500 rounded-xl shadow-lg group-hover:bg-amber-600 transition-colors">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">Govt Data</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Market Prices</CardTitle>
                <CardDescription className="text-gray-600">
                  Access real-time mandi prices from official sources
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <BarChart3 className="h-4 w-4 text-amber-600" />
                      <span>Live Market Rates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-amber-600" />
                      <span>Regional Price Data</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                      <span>Price Trends</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-amber-700 text-center font-medium">Official source: agmarknet.gov.in</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Pesticide Recommendation */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-emerald-500 rounded-xl shadow-lg group-hover:bg-emerald-600 transition-colors">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Coming Soon</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Pesticide AI</CardTitle>
                <CardDescription className="text-gray-600">
                  AI-powered pesticide recommendations for your crops
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Brain className="h-4 w-4 text-emerald-600" />
                      <span>Pest Identification</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      <span>Pesticide Suggestions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      <span>Dosage Calculator</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md group-hover:shadow-lg transition-all"
                    disabled
                  >
                    Coming Soon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Machinery Rental */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-cyan-500 rounded-xl shadow-lg group-hover:bg-cyan-600 transition-colors">
                    <Tractor className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300">Future Plan</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Machinery Rental</CardTitle>
                <CardDescription className="text-gray-600">
                  Easily rent and share farm equipment with other local farmers.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Tractor className="h-4 w-4 text-cyan-600" />
                      <span>Equipment Listings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Handshake className="h-4 w-4 text-cyan-600" />
                      <span>Rental Marketplace</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-cyan-600" />
                      <span>Local Providers</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-md group-hover:shadow-lg transition-all"
                    disabled
                  >
                    Future Feature
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-0">
  <div className="text-center mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
    <p className="text-gray-600">Access your most used features quickly</p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <Button
      variant="outline"
      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300 transition-all"
      onClick={() => router.push("/crop-services")}
    >
      <Brain className="h-6 w-6 text-green-600" />
      <span className="text-sm font-medium">Get AI Recommendations</span>
    </Button>

    <Button
      variant="outline"
      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
      onClick={() => router.push("/weather")}
    >
      <Sun className="h-6 w-6 text-blue-600" />
      <span className="text-sm font-medium">Check Weather</span>
    </Button>

    <Button
      variant="outline"
      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all"
      onClick={() => router.push("/agrobridge")}
    >
      <Users className="h-6 w-6 text-purple-600" />
      <span className="text-sm font-medium">Post Work</span>
    </Button>
  </div>
</div>
          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">AI-Powered</div>
                <div className="text-green-100">Crop Recommendations</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">Real-Time</div>
                <div className="text-blue-100">Weather Updates</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">Connected</div>
                <div className="text-purple-100">Labor Network</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}