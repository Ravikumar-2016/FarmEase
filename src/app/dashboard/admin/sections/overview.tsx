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
} from "lucide-react"

interface OverviewProps {
  onTabChange: (tab: string) => void
}

export function Overview({ onTabChange }: OverviewProps) {
  const quickActions = [
    {
      title: "Add Employee",
      description: "Add a new employee to the platform",
      icon: UserPlus,
      action: () => onTabChange("employees"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Add Partner",
      description: "Register a new partnership",
      icon: Plus,
      action: () => onTabChange("partners"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "View Stats",
      description: "View platform statistics and analytics",
      icon: BarChart3,
      action: () => onTabChange("stats"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "View Tickets",
      description: "Manage employee support tickets",
      icon: MessageSquare,
      action: () => onTabChange("tickets"),
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  const recentActivities = [
    {
      type: "employee",
      action: "New employee registered",
      details: "Ravikumar Gunti joined as Employee",
      time: "2 hours ago",
      icon: Users,
    },
    {
      type: "partner",
      action: "Partner updated",
      details: "Admin profile information updated",
      time: "4 hours ago",
      icon: Building,
    },
    {
      type: "ticket",
      action: "Support ticket created",
      details: "New ticket submitted by employee",
      time: "6 hours ago",
      icon: MessageSquare,
    },
    {
      type: "system",
      action: "System maintenance",
      details: "Database optimization completed",
      time: "1 day ago",
      icon: Activity,
    },
  ]

  const systemStatus = [
    { name: "Database", status: "operational", uptime: "99.9%" },
    { name: "API Services", status: "operational", uptime: "99.8%" },
    { name: "File Storage", status: "operational", uptime: "99.7%" },
    { name: "Email Service", status: "operational", uptime: "99.5%" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge variant="default" className="bg-green-500">
            Operational
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Degraded
          </Badge>
        )
      case "down":
        return <Badge variant="destructive">Down</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Admin Dashboard Overview
          </CardTitle>
          <CardDescription>
            Welcome to the FarmEase admin panel. Manage your platform efficiently with these tools and insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Today: {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Platform Status: Active
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="p-2 rounded-full bg-white">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.details}</div>
                    <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of platform services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500">Uptime: {service.uptime}</div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">All Systems Operational</div>
              <div className="text-xs text-green-600">No issues detected across all services</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Insights</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,250</div>
              <div className="text-sm text-blue-800">Total Users</div>
              <div className="text-xs text-blue-600 mt-1">↑ 12% from last month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">850</div>
              <div className="text-sm text-green-800">Active Farmers</div>
              <div className="text-xs text-green-600 mt-1">↑ 8% from last month</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">320</div>
              <div className="text-sm text-purple-800">Labour Workers</div>
              <div className="text-xs text-purple-600 mt-1">↑ 15% from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
