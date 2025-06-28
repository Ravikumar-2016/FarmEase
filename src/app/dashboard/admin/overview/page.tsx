"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Sprout,
  Tractor,
  Globe,
} from "lucide-react"

export default function AdminOverviewPage() {
  // Demo data: Replace with real data as needed
  const recentActivities = [
    {
      type: "farmer",
      action: "New farmer registered",
      details: "Rajesh Kumar joined from Punjab region",
      time: "2 hours ago",
      icon: Sprout,
      color: "text-emerald-600",
    },
    {
      type: "labour",
      action: "Labour job completed",
      details: "Wheat harvesting job completed in Haryana",
      time: "4 hours ago",
      icon: Tractor,
      color: "text-amber-600",
    },
    {
      type: "query",
      action: "Support query resolved",
      details: "Crop recommendation query resolved for cotton farming",
      time: "6 hours ago",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      type: "weather",
      action: "Weather alert issued",
      details: "Heavy rainfall warning for Maharashtra region",
      time: "8 hours ago",
      icon: Globe,
      color: "text-orange-600",
    },
    {
      type: "system",
      action: "AI model updated",
      details: "Crop recommendation AI model updated with latest data",
      time: "1 day ago",
      icon: Activity,
      color: "text-purple-600",
    },
  ]

  const systemStatus = [
    { name: "Database", status: "operational", uptime: "99.9%", icon: "🛢" },
    { name: "AI Services", status: "operational", uptime: "99.8%", icon: "🧠" },
    { name: "Weather API", status: "operational", uptime: "99.7%", icon: "🌦️" },
    { name: "Market Data", status: "operational", uptime: "99.5%", icon: "📊" },
    { name: "Authentication", status: "operational", uptime: "99.9%", icon: "🔒" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Operational
          </Badge>
        )
      case "degraded":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        )
      case "down":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Down
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">FarmEase Admin Dashboard</h1>
          <p className="text-lg text-slate-600">Comprehensive platform management and insights</p>
        </div>

        {/* Welcome Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-500 to-blue-600 text-white overflow-hidden">
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
              <Activity className="h-8 w-8" />
              Platform Overview
            </CardTitle>
            <CardDescription className="text-sky-100 text-lg">
              Welcome to FarmEase admin panel. Monitor and manage your agricultural platform with comprehensive tools
              and real-time insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                <Calendar className="h-5 w-5 text-emerald-200" />
                <div>
                  <span className="font-medium text-emerald-100">Today:</span>
                  <div className="text-white font-semibold">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                <Clock className="h-5 w-5 text-blue-200" />
                <div>
                  <span className="font-medium text-blue-100">Last updated:</span>
                  <div className="text-white font-semibold">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                <TrendingUp className="h-5 w-5 text-purple-200" />
                <div>
                  <span className="font-medium text-purple-100">Status:</span>
                  <Badge className="bg-emerald-500 text-white border-emerald-400 ml-2">Active</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                <Shield className="h-5 w-5 text-orange-200" />
                <div>
                  <span className="font-medium text-orange-100">Security:</span>
                  <Badge className="bg-blue-500 text-white border-blue-400 ml-2">High</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Platform Activities
              </CardTitle>
              <CardDescription className="text-yellow-50">
                Latest activities and updates across FarmEase platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-white shadow-md group-hover:shadow-lg transition-shadow">
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {activity.action}
                        </div>
                        <div className="text-sm text-slate-600 mt-1 line-clamp-2">{activity.details}</div>
                        <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status - Updated for better mobile view */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Health Status
              </CardTitle>
              <CardDescription className="text-green-100">
                Real-time monitoring of platform services and infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {systemStatus.map((service, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <div className="font-medium text-slate-800">{service.name}</div>
                        <div className="text-xs text-slate-500">Uptime: {service.uptime}</div>
                      </div>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="font-medium text-emerald-800">All Systems Operational</div>
                    <div className="text-xs text-emerald-600 mt-1">
                      No issues detected. FarmEase platform running smoothly across all services.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="shadow-lg border-0 overflow-hidden group hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                Support Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Avg. Response Time</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">{"< 2 hours"}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Resolution Rate</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">94%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Farmer Satisfaction</span>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">4.8/5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 overflow-hidden group hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-emerald-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Server Uptime</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-emerald-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">API Response</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">{"< 200ms"}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-emerald-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Error Rate</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">{"< 0.1%"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 overflow-hidden group hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-orange-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">SSL Certificate</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">Valid</Badge>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-orange-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Firewall Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-orange-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Security Scan</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Today</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}