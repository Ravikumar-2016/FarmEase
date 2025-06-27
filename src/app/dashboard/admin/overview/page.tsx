"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building,
  MessageSquare,
  BarChart3,
  UserPlus,
  Plus,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Star,
  Info,
} from "lucide-react"

interface OverviewProps {
  onTabChange: (tab: string) => void
}

export default function Overview({ onTabChange }: OverviewProps) {
  // Demo data: Replace with real data as needed
  const recentActivities = [
    {
      type: "employee",
      action: "New employee registered",
      details: "Joseph joined as Employee",
      time: "2 hours ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      type: "partner",
      action: "Partner profile updated",
      details: "Admin profile information updated",
      time: "4 hours ago",
      icon: Building,
      color: "text-green-600",
    },
    {
      type: "ticket",
      action: "Support ticket resolved",
      details: "Employee query about dashboard access resolved",
      time: "6 hours ago",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      type: "application",
      action: "New job application",
      details: "Software Developer position application received",
      time: "8 hours ago",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      type: "system",
      action: "System maintenance completed",
      details: "Database optimization and backup completed successfully",
      time: "1 day ago",
      icon: Activity,
      color: "text-gray-600",
    },
  ]

  const systemStatus = [
    { name: "Database", status: "operational", uptime: "99.9%", color: "text-green-600" },
    { name: "API Services", status: "operational", uptime: "99.8%", color: "text-green-600" },
    { name: "File Storage", status: "operational", uptime: "99.7%", color: "text-green-600" },
    { name: "Email Service", status: "operational", uptime: "99.5%", color: "text-green-600" },
    { name: "Authentication", status: "operational", uptime: "99.9%", color: "text-green-600" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Operational
          </Badge>
        )
      case "degraded":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        )
      case "down":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Down
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Activity className="h-6 w-6 text-blue-600" />
            Admin Dashboard Overview
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome to the FarmEase admin panel. Manage your platform efficiently with these comprehensive tools and insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Today:</span> {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium">Last updated:</span> {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Platform Status:</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Security Level:</span>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">High</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription className="text-gray-100">Latest platform activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`p-4 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-white shadow-sm">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{activity.action}</div>
                      <div className="text-xs text-gray-600 mt-1">{activity.details}</div>
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
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

        {/* System Status */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle>System Status</CardTitle>
            <CardDescription className="text-green-100">
              Current status of platform services and infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{service.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Uptime: {service.uptime}</div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="text-sm font-medium text-green-800">All Systems Operational</div>
              </div>
              <div className="text-xs text-green-600 mt-1">
                No issues detected across all services. Platform running smoothly.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" /> Support Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Response Time</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Less than 2 hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">94%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">4.8/5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Uptime</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">99.9%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Response</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Less than 200ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Error Rate</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Less than 0.1%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" /> Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SSL Certificate</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Valid</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Firewall Status</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Security Scan</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}