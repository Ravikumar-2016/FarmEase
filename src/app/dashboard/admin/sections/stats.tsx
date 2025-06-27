"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Building, TrendingUp, Activity, Clock } from "lucide-react"

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

export function Stats({ stats }: StatsProps) {
  const queryResolutionRate =
    stats.totalQueries > 0 ? Math.round((stats.resolvedQueries / stats.totalQueries) * 100) : 0
  const activeUserRate = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{stats.newUsersThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{activeUserRate}% of total users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Farmers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.farmers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? Math.round((stats.farmers / stats.totalUsers) * 100) : 0}% of users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labourers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.labourers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? Math.round((stats.labourers / stats.totalUsers) * 100) : 0}% of users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">User support queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Queries</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedQueries}</div>
            <p className="text-xs text-muted-foreground">{queryResolutionRate}% resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Tickets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">Internal support tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>Detailed breakdown of platform usage and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Distribution */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">User Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Farmers</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{stats.farmers}</Badge>
                    <span className="text-xs text-gray-500">
                      {stats.totalUsers > 0 ? Math.round((stats.farmers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Labourers</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{stats.labourers}</Badge>
                    <span className="text-xs text-gray-500">
                      {stats.totalUsers > 0 ? Math.round((stats.labourers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Employees</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{stats.employees}</Badge>
                    <span className="text-xs text-gray-500">
                      {stats.totalUsers > 0 ? Math.round((stats.employees / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Metrics */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Support Metrics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Query Resolution Rate</span>
                  <Badge variant={queryResolutionRate >= 80 ? "default" : "secondary"}>{queryResolutionRate}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Queries</span>
                  <Badge variant={stats.totalQueries - stats.resolvedQueries > 10 ? "destructive" : "secondary"}>
                    {stats.totalQueries - stats.resolvedQueries}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Tickets</span>
                  <Badge variant={stats.openTickets > 5 ? "destructive" : "secondary"}>{stats.openTickets}</Badge>
                </div>
              </div>
            </div>

            {/* Activity Status */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Activity Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <Badge variant="default">{activeUserRate}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Users (Month)</span>
                  <Badge variant="secondary">+{stats.newUsersThisMonth}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Platform Health</span>
                  <Badge variant={queryResolutionRate >= 80 && stats.openTickets <= 5 ? "default" : "secondary"}>
                    {queryResolutionRate >= 80 && stats.openTickets <= 5 ? "Good" : "Needs Attention"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
