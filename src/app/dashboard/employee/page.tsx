"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Megaphone, Users, MessageSquare, Lightbulb, BarChart3, Settings, CalendarDays, User, ChevronRight } from "lucide-react"

interface DashboardStats {
  totalAnnouncements: number
  activeAnnouncements: number
  totalQueries: number
  pendingQueries: number
  inProgressQueries: number
  activeTasks: number
  totalTasks: number
}

interface Announcement {
  isActive: boolean
  [key: string]: unknown
}

interface Query {
  status: "pending" | "in-progress" | "resolved" | string
  [key: string]: unknown
}

interface FarmWork {
  status?: "active" | "open" | string
  [key: string]: unknown
}

export default function EmployeeDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState("")
  const [stats, setStats] = useState<DashboardStats>({
    totalAnnouncements: 0,
    activeAnnouncements: 0,
    totalQueries: 0,
    pendingQueries: 0,
    inProgressQueries: 0,
    activeTasks: 0,
    totalTasks: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "employee") {
      router.push("/login")
      return
    }

    setCurrentUser(username)
    fetchDashboardStats()
  }, [router])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      // Fetch announcements
      const announcementsRes = await fetch("/api/announcements")
      const announcementsData = await announcementsRes.json()
      const announcements: Announcement[] = announcementsData.announcements || []

      // Fetch queries
      const queriesRes = await fetch("/api/queries")
      const queriesData = await queriesRes.json()
      const queries: Query[] = queriesData.queries || []

      // Fetch farm works with proper parameter
      const farmWorksRes = await fetch("/api/farm-works?all=true")
      if (!farmWorksRes.ok) {
        throw new Error(`HTTP error! status: ${farmWorksRes.status}`)
      }
      const farmWorksData = await farmWorksRes.json()
      const farmWorks: FarmWork[] = farmWorksData.works || []

      // Count active tasks properly - check for both 'active' and 'open' status
      const activeTasks = farmWorks.filter(
        (work) => work.status === "active" || work.status === "open" || !work.status,
      ).length

      setStats({
        totalAnnouncements: announcements.length,
        activeAnnouncements: announcements.filter((a) => a.isActive).length,
        totalQueries: queries.length,
        pendingQueries: queries.filter((q) => q.status === "pending").length,
        inProgressQueries: queries.filter((q) => q.status === "in-progress").length,
        activeTasks: activeTasks,
        totalTasks: farmWorks.length,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      // Set fallback stats to show some data even if API fails
      setStats((prev) => ({
        ...prev,
        activeTasks: 0,
        totalTasks: 0,
      }))
    } finally {
      setLoading(false)
    }
  }

  const today = format(new Date(), "EEEE, MMMM d, yyyy")
  const dashboardSections = [
    {
      title: "Announcements",
      description: "Create and manage platform announcements",
      icon: Megaphone,
      path: "/dashboard/employee/announcements",
      color: "from-blue-500 to-blue-600",
      stats: `${stats.activeAnnouncements}/${stats.totalAnnouncements} Active`,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Query Resolution",
      description: "Respond to user queries and support requests",
      icon: MessageSquare,
      path: "/dashboard/employee/query-management",
      color: "from-green-500 to-green-600",
      stats: `${stats.pendingQueries} Pending, ${stats.inProgressQueries} In Progress`,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Active Tasks",
      description: "Monitor ongoing farm work activities",
      icon: Users,
      path: "/dashboard/employee/active-tasks",
      color: "from-purple-500 to-purple-600",
      stats: `${stats.activeTasks}/${stats.totalTasks} Active Works`,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Future Plans",
      description: "View platform roadmap and upcoming features",
      icon: Lightbulb,
      path: "/dashboard/employee/future-plans",
      color: "from-amber-500 to-amber-600",
      stats: "Strategic Planning",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6 lg:py-8">
            {/* Left - Date Widget */}
            <div className="flex items-center space-x-3 bg-blue-50 px-4 py-3 rounded-lg shadow-sm">
              <CalendarDays className="h-6 w-6 text-blue-600" />
              <span className="text-base font-semibold text-blue-800">{today}</span>
            </div>

            {/* Center - Dashboard Title */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                  <Settings className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">Employee Dashboard</h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">Manage platform operations and user support</p>
            </div>

            {/* Right - User Info Widget */}
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
              <User className="h-5 w-5 text-gray-500" />
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-bold text-gray-900">{currentUser}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Employee Dashboard</h1>
                <p className="text-sm text-gray-600">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{currentUser}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Overview Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.activeAnnouncements}</div>
              <div className="text-blue-100 text-sm lg:text-base">Active Announcements</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.pendingQueries}</div>
              <div className="text-green-100 text-sm lg:text-base">Pending Queries</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.activeTasks}</div>
              <div className="text-purple-100 text-sm lg:text-base">Active Tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.inProgressQueries}</div>
              <div className="text-amber-100 text-sm lg:text-base">In Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Sections */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Management Sections</h2>
            <p className="text-gray-600 text-sm lg:text-base">Access different areas of platform management</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {dashboardSections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white"
                  onClick={() => router.push(section.path)}
                >
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-4 ${section.bgColor} rounded-xl shadow-md group-hover:shadow-lg transition-shadow`}
                      >
                        <IconComponent className={`h-8 w-8 ${section.iconColor}`} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs lg:text-sm">
                          {section.stats}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{section.description}</p>
                    </div>

                    <div className="mt-6">
                      <Button
                        className={`w-full bg-gradient-to-r ${section.color} text-white shadow-md group-hover:shadow-lg transition-all`}
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(section.path)
                        }}
                      >
                        Access {section.title}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-gray-50 to-white border-0 shadow-lg">
            <CardContent className="p-6 lg:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Quick Actions</h3>
                <p className="text-gray-600 text-sm lg:text-base">Frequently used management tools</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-16 lg:h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
                  onClick={() => router.push("/dashboard/employee/announcements")}
                >
                  <Megaphone className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                  <span className="text-xs lg:text-sm font-medium">New Announcement</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 lg:h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-300 transition-all"
                  onClick={() => router.push("/dashboard/employee/query-management")}
                >
                  <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                  <span className="text-xs lg:text-sm font-medium">Resolve Queries</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 lg:h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  onClick={() => router.push("/dashboard/employee/active-tasks")}
                >
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                  <span className="text-xs lg:text-sm font-medium">Monitor Tasks</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 lg:h-20 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300 transition-all"
                  onClick={() => router.push("/dashboard/employee/future-plans")}
                >
                  <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-amber-600" />
                  <span className="text-xs lg:text-sm font-medium">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}