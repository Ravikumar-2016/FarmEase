"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserCheck,
  Building,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  Target,
  Zap,
  Info,
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

interface StatsProps {
  stats: UserStats
}

export default function Stats({ stats }: StatsProps) {
  const queryResolutionRate =
    stats.totalQueries > 0 ? Math.round((stats.resolvedQueries / stats.totalQueries) * 100) : 0
  const activeUserRate = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0

  const getPerformanceBadge = (value: number, threshold: number) => {
    if (value >= threshold) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>
    } else if (value >= threshold * 0.8) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Good</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Needs Attention</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />+{stats.newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Users</CardTitle>
            <UserCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-2">{activeUserRate}% of total users</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Farmers</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{stats.farmers.toLocaleString()}</div>
            <p className="text-xs text-purple-600 mt-2">
              {stats.totalUsers > 0 ? Math.round((stats.farmers / stats.totalUsers) * 100) : 0}% of users
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Labourers</CardTitle>
            <Building className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{stats.labourers.toLocaleString()}</div>
            <p className="text-xs text-orange-600 mt-2">
              {stats.totalUsers > 0 ? Math.round((stats.labourers / stats.totalUsers) * 100) : 0}% of users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">Total Queries</CardTitle>
            <Activity className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">{stats.totalQueries}</div>
            <p className="text-xs text-indigo-600 mt-2">User support queries</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-50 to-teal-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Resolved Queries</CardTitle>
            <UserCheck className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-900">{stats.resolvedQueries}</div>
            <p className="text-xs text-teal-600 mt-2">{queryResolutionRate}% resolution rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-rose-50 to-rose-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700">Employee Tickets</CardTitle>
            <Clock className="h-5 w-5 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-900">{stats.totalTickets}</div>
            <p className="text-xs text-rose-600 mt-2">Internal support tickets</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Open Tickets</CardTitle>
            <Activity className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">{stats.openTickets}</div>
            <p className="text-xs text-yellow-600 mt-2">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription className="text-gray-100">
            Detailed breakdown of platform usage and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* User Distribution */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Distribution
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium">Farmers</span>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">{stats.farmers}</Badge>
                    <span className="text-xs text-blue-600 font-medium">
                      {stats.totalUsers > 0 ? Math.round((stats.farmers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium">Labourers</span>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800 border-green-200">{stats.labourers}</Badge>
                    <span className="text-xs text-green-600 font-medium">
                      {stats.totalUsers > 0 ? Math.round((stats.labourers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium">Employees</span>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">{stats.employees}</Badge>
                    <span className="text-xs text-purple-600 font-medium">
                      {stats.totalUsers > 0 ? Math.round((stats.employees / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Metrics */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Support Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium">Query Resolution Rate</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        queryResolutionRate >= 80
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {queryResolutionRate}%
                    </Badge>
                    {getPerformanceBadge(queryResolutionRate, 80)}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-sm font-medium">Pending Queries</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        stats.totalQueries - stats.resolvedQueries > 10
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }
                    >
                      {stats.totalQueries - stats.resolvedQueries}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="text-sm font-medium">Open Tickets</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        stats.openTickets > 5
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }
                    >
                      {stats.openTickets}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Status */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Activity Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium">Active Users</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">{activeUserRate}%</Badge>
                    {getPerformanceBadge(activeUserRate, 70)}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="text-sm font-medium">New Users (Month)</span>
                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">+{stats.newUsersThisMonth}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <span className="text-sm font-medium">Platform Health</span>
                  <Badge
                    className={
                      queryResolutionRate >= 80 && stats.openTickets <= 5
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {queryResolutionRate >= 80 && stats.openTickets <= 5 ? "Excellent" : "Good"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Trends
            </CardTitle>
            <CardDescription className="text-emerald-100">Monthly growth and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Growth Rate</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">+12% MoM</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">{activeUserRate}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">87%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
            <CardDescription className="text-amber-100">Critical metrics for platform success</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">&lt; 2 hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">4.8/5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Platform Uptime</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">99.9%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}