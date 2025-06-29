"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Users,
  UserCheck,
  Sprout,
  TrendingUp,
  Clock,
  BarChart3,
  Target,
  Zap,
  Tractor,
  MessageSquare,
  Award,
  Briefcase,
} from "lucide-react"

interface UserStats {
  totalUsers: number
  farmers: number
  labourers: number
  employees: number
  activeUsers: number
  newUsersThisMonth: number
  totalQueries: number
  resolvedQueries: number
  totalTickets: number
  openTickets: number
}

export default function AdminQuickStatsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Demo data - replace with real API data
  const stats: UserStats = {
    totalUsers: 15420,
    farmers: 8950,
    labourers: 5200,
    employees: 1270,
    activeUsers: 12340,
    newUsersThisMonth: 890,
    totalQueries: 2450,
    resolvedQueries: 2301,
    totalTickets: 156,
    openTickets: 23,
  }

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "admin") { 
      router.push("/login")
      return
    }

    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  const queryResolutionRate =
    stats.totalQueries > 0 ? Math.round((stats.resolvedQueries / stats.totalQueries) * 100) : 0
  const activeUserRate = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">FarmEase Platform Statistics</h1>
          <p className="text-sm sm:text-base text-slate-600">Real-time insights and performance metrics</p>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              bg: "from-blue-500 to-blue-600",
              secondary: `+${stats.newUsersThisMonth} this month`,
              iconColor: "text-blue-200"
            },
            {
              title: "Active Users",
              value: stats.activeUsers,
              icon: UserCheck,
              bg: "from-emerald-500 to-emerald-600",
              secondary: `${activeUserRate}% engagement`,
              iconColor: "text-emerald-200"
            },
            {
              title: "Farmers",
              value: stats.farmers,
              icon: Sprout,
              bg: "from-orange-500 to-orange-600",
              secondary: `${Math.round((stats.farmers / stats.totalUsers) * 100)}% of users`,
              iconColor: "text-orange-200"
            },
            {
              title: "Labourers",
              value: stats.labourers,
              icon: Tractor,
              bg: "from-purple-500 to-purple-600",
              secondary: `${Math.round((stats.labourers / stats.totalUsers) * 100)}% of users`,
              iconColor: "text-purple-200"
            }
          ].map((stat, index) => (
            <Card key={index} className={`shadow-lg border-0 bg-gradient-to-br ${stat.bg} text-white`}>
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs mt-1 opacity-90">{stat.secondary}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Activity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Queries",
              value: stats.totalQueries,
              icon: MessageSquare,
              bg: "from-indigo-500 to-indigo-600",
              secondary: "User support requests",
              iconColor: "text-indigo-200"
            },
            {
              title: "Resolved Queries",
              value: stats.resolvedQueries,
              icon: Award,
              bg: "from-teal-500 to-teal-600",
              secondary: `${queryResolutionRate}% resolved`,
              iconColor: "text-teal-200"
            },
            {
              title: "Employee Tickets",
              value: stats.totalTickets,
              icon: Briefcase,
              bg: "from-rose-500 to-rose-600",
              secondary: "Internal support",
              iconColor: "text-rose-200"
            },
            {
              title: "Open Tickets",
              value: stats.openTickets,
              icon: Clock,
              bg: "from-amber-500 to-amber-600",
              secondary: "Require attention",
              iconColor: "text-amber-200"
            }
          ].map((stat, index) => (
            <Card key={index} className={`shadow-lg border-0 bg-gradient-to-br ${stat.bg} text-white`}>
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs mt-1 opacity-90">{stat.secondary}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analytics */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
              Platform Analytics
            </CardTitle>
            <CardDescription className="text-slate-200 text-sm">
              Detailed breakdown of platform usage and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Distribution */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Users className="h-5 w-5 text-blue-600" />
                  User Distribution
                </h4>
                <div className="space-y-2">
                  {[
                    { name: "Farmers", value: stats.farmers, icon: Sprout, color: "blue" },
                    { name: "Labourers", value: stats.labourers, icon: Tractor, color: "emerald" },
                    { name: "Employees", value: stats.employees, icon: Briefcase, color: "purple" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-4 w-4 text-${item.color}-600`} />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`bg-${item.color}-100 text-${item.color}-800 border-${item.color}-200 text-xs`}>
                          {item.value.toLocaleString()}
                        </Badge>
                        <span className={`text-xs font-bold text-${item.color}-600`}>
                          {Math.round((item.value / stats.totalUsers) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Metrics */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Support Metrics
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Resolution Rate</span>
                    <div className="flex items-center gap-1">
                      <Badge className={queryResolutionRate >= 80 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-red-100 text-red-800 border-red-200"} variant="outline">
                        {queryResolutionRate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Pending Queries</span>
                    <Badge className={stats.totalQueries - stats.resolvedQueries > 10 ? "bg-red-100 text-red-800 border-red-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"} variant="outline">
                      {stats.totalQueries - stats.resolvedQueries}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Open Tickets</span>
                    <Badge className={stats.openTickets > 5 ? "bg-red-100 text-red-800 border-red-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"} variant="outline">
                      {stats.openTickets}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Activity Status */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Activity Status
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Active Users</span>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
                        {activeUserRate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">New Users</span>
                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200" variant="outline">
                      +{stats.newUsersThisMonth}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Platform Health</span>
                    <Badge className={queryResolutionRate >= 80 && stats.openTickets <= 5 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"} variant="outline">
                      {queryResolutionRate >= 80 && stats.openTickets <= 5 ? "Excellent" : "Good"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                Growth Trends
              </CardTitle>
              <CardDescription className="text-emerald-100 text-sm">
                Monthly growth metrics and engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {[
                  { label: "User Growth Rate", value: "+12% MoM", color: "emerald" },
                  { label: "Engagement Rate", value: `${activeUserRate}%`, color: "blue" },
                  { label: "Retention Rate", value: "87%", color: "purple" },
                  { label: "Daily Active Users", value: "8,450", color: "orange" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <Badge className={`bg-${item.color}-100 text-${item.color}-800 border-${item.color}-200`} variant="outline">
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                Key Indicators
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm">
                Critical metrics for platform success
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {[
                  { label: "Avg Response Time", value: "< 2 hours", color: "emerald" },
                  { label: "Farmer Satisfaction", value: "4.8/5", color: "emerald" },
                  { label: "Platform Uptime", value: "99.9%", color: "emerald" },
                  { label: "AI Accuracy Rate", value: "96.2%", color: "purple" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <Badge className={`bg-${item.color}-100 text-${item.color}-800 border-${item.color}-200`} variant="outline">
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}