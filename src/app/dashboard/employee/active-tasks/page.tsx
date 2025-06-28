"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Activity,
} from "lucide-react"

interface LabourApplication {
  labourId: string
  status: string
  appliedAt: string
  [key: string]: unknown
}

interface FarmWork {
  _id: string
  workId: string
  farmerUsername: string
  cropName: string
  workType: string
  laboursRequired: number
  workDate: string
  area: string
  state: string
  status: string
  labourApplications: LabourApplication[]
  createdAt: string
}

export default function ActiveTasksPage() {
  const router = useRouter()
  const [farmWorks, setFarmWorks] = useState<FarmWork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "employee") {
      router.push("/login")
      return
    }

    fetchFarmWorks()
  }, [router])

  const fetchFarmWorks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/farm-works?all=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Farm works data:", data)

      if (data.works) {
        setFarmWorks(data.works)
      } else {
        setFarmWorks([])
      }
    } catch (error) {
      console.error("Error fetching farm works:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch farm works")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
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

  const activeTasks = farmWorks.filter((work) => work.status === "active")
  const completedTasks = farmWorks.filter((work) => work.status === "completed")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Active Tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">Error loading tasks</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchFarmWorks} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - Desktop */}
      <div className="hidden md:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/employee")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Active Tasks Monitor</h1>
                <p className="text-gray-600">Monitor ongoing farm work activities and applications</p>
              </div>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Header - Mobile */}
      <div className="md:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/employee")}
              className="flex items-center space-x-1 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Active Tasks</h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Monitor farm work activities
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{activeTasks.length}</div>
              <div className="text-green-100">Active Tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{completedTasks.length}</div>
              <div className="text-blue-100">Completed Tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{farmWorks.length}</div>
              <div className="text-gray-100">Total Tasks</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Tasks */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-5 w-5" />
              Active Farm Works ({activeTasks.length})
            </CardTitle>
            <CardDescription>Currently ongoing farm work requests and applications</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-6 space-y-4">
                {activeTasks.map((work) => (
                  <div
                    key={work._id}
                    className="p-6 border-2 border-green-200 rounded-lg bg-green-50 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-bold text-lg text-gray-900">
                            {work.cropName} - {work.workType}
                          </h4>
                          <Badge className={`${getWorkTypeColor(work.workType)} text-sm`}>{work.workType}</Badge>
                          {getStatusBadge(work.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            <span>
                              <strong>Work ID:</strong> {work.workId || work._id.slice(-6)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>
                              <strong>Work Date:</strong> {formatDate(work.workDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span>
                              <strong>Required:</strong> {work.laboursRequired} laborers
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CheckCircle className="h-4 w-4 text-orange-600" />
                            <span>
                              <strong>Applications:</strong> {work.labourApplications?.length || 0}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4 text-indigo-600" />
                            <span>
                              <strong>Farmer:</strong> {work.farmerUsername}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-red-600" />
                            <span>
                              <strong>Location:</strong> {work.area}, {work.state}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 bg-white p-3 rounded-lg border">
                          <strong>Created:</strong> {formatDateTime(work.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTasks.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No active farm works</p>
                    <p className="text-sm text-gray-400">Active farm work requests will appear here</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* All Tasks Overview */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="h-5 w-5" />
              All Farm Works ({farmWorks.length})
            </CardTitle>
            <CardDescription>Complete overview of all farm work activities</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-6 space-y-4">
                {farmWorks.map((work) => (
                  <div key={work._id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-base text-gray-900">
                            {work.cropName} - {work.workType}
                          </h4>
                          <Badge className={`${getWorkTypeColor(work.workType)} text-xs`}>{work.workType}</Badge>
                          {getStatusBadge(work.status)}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-600">
                          <div>
                            <strong>Work ID:</strong> {work.workId || work._id.slice(-6)}
                          </div>
                          <div>
                            <strong>Date:</strong> {formatDate(work.workDate)}
                          </div>
                          <div>
                            <strong>Required:</strong> {work.laboursRequired}
                          </div>
                          <div>
                            <strong>Applications:</strong> {work.labourApplications?.length || 0}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs text-gray-500">
                          <div>
                            <strong>Farmer:</strong> {work.farmerUsername}
                          </div>
                          <div>
                            <strong>Location:</strong> {work.area}, {work.state}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {farmWorks.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No farm works found</p>
                    <p className="text-sm text-gray-400">Farm work requests will appear here</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}