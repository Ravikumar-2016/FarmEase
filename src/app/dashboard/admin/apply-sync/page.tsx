"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import {
  Users,
  Building,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  RefreshCw,
  ExternalLink,
  Building2,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  ClipboardList,
} from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

interface JobApplication {
  _id: string
  fullName: string
  email: string
  mobile: string
  position: string
  jobType: string
  department: string
  location: string
  zipcode: string
  resumeLink: string
  status: string
  submittedAt: string
}

interface PartnershipRequest {
  _id: string
  fullName: string
  organizationName: string
  email: string
  mobile: string
  type: string
  contactPerson: string
  location: string
  zipcode: string
  areaOfCollaboration: string
  termsSummary: string
  status: string
  submittedAt: string
}

interface DeleteConfirmation {
  isOpen: boolean
  id: string | null
  type: "job" | "partnership" | null
  title: string
}

export default function ApplySync() {
  const router = useRouter()
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    id: null,
    type: null,
    title: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "admin") { 
      router.push("/login")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/apply-sync")
      const result = await response.json()

      if (result.success) {
        setJobApplications(result.data.jobApplications)
        setPartnershipRequests(result.data.partnershipRequests)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const showDeleteConfirmation = (id: string, type: "job" | "partnership", title: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      type,
      title,
    })
  }

  const handleDelete = async () => {
    if (!deleteConfirmation.id || !deleteConfirmation.type) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/apply-sync?id=${deleteConfirmation.id}&type=${deleteConfirmation.type}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: `${deleteConfirmation.type === "job" ? "Job application" : "Partnership request"} deleted successfully`,
        })
        fetchData() // Refresh data
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteConfirmation({
        isOpen: false,
        id: null,
        type: null,
        title: "",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      approved: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
      review: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPartnershipTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      ngo: "bg-green-100 text-green-800 border-green-200",
      logistics: "bg-blue-100 text-blue-800 border-blue-200",
      technology: "bg-purple-100 text-purple-800 border-purple-200",
      financial: "bg-yellow-100 text-yellow-800 border-yellow-200",
      government: "bg-red-100 text-red-800 border-red-200",
      research: "bg-indigo-100 text-indigo-800 border-indigo-200",
    }

    return (
      <Badge className={`${colors[type.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"} border`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="space-y-6 p-4 md:p-6">
        {/* Desktop Header - visible only on md+ screens */}
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Application Sync</h1>
            <p className="text-gray-600 mt-1">Manage job applications and partnership requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Mobile Header - visible only on small screens */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-indigo-600" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">Apply Sync</h1>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-2">
              Review labour job applications and partner requests
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Job Applications</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-900">{jobApplications.length}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {jobApplications.length > 0 ? "Applications received" : "No applications yet"}
                  </p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Partnership Requests</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-900">{partnershipRequests.length}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {partnershipRequests.length > 0 ? "Organizations interested" : "No requests yet"}
                  </p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <Building className="h-6 w-6 md:h-8 md:w-8 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Job Applications */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Users className="h-5 w-5" />
                Job Applications ({jobApplications.length})
              </CardTitle>
              <CardDescription className="text-sky-50">
                Career applications submitted through the website
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] md:h-[600px]">
                <div className="space-y-0">
                  {jobApplications.map((application, index) => (
                    <div
                      key={application._id}
                      className={`p-4 md:p-6 border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">{application.fullName}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {getStatusBadge(application.status)}
                              <Badge variant="outline" className="text-xs">
                                {application.jobType}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              showDeleteConfirmation(application._id, "job", `${application.fullName}'s application`)
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">Position:</span>
                            <span className="truncate">{application.position}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <span className="font-medium">Department:</span>
                            <span className="truncate">{application.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="font-medium">Location:</span>
                            <span className="truncate">{application.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">Email:</span>
                            <span className="truncate">{application.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="font-medium">Mobile:</span>
                            <span>{application.mobile}</span>
                          </div>
                          {application.resumeLink && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FileText className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <span className="font-medium">Resume:</span>
                              <a
                                href={application.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Applied: {formatDate(application.submittedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {jobApplications.length === 0 && (
                    <div className="text-center py-12 md:py-16">
                      <Users className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium text-lg">No job applications yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Applications submitted through the careers page will appear here
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Partnership Requests */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Building className="h-5 w-5" />
                Partnership Requests ({partnershipRequests.length})
              </CardTitle>
              <CardDescription className="text-green-100">Partnership applications from organizations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] md:h-[600px]">
                <div className="space-y-0">
                  {partnershipRequests.map((request, index) => (
                    <div
                      key={request._id}
                      className={`p-4 md:p-6 border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-green-50 transition-colors`}
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">{request.organizationName}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {getStatusBadge(request.status)}
                              {getPartnershipTypeBadge(request.type)}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              showDeleteConfirmation(
                                request._id,
                                "partnership",
                                `${request.organizationName}'s partnership request`,
                              )
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">Contact:</span>
                            <span className="truncate">{request.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <span className="font-medium">Contact Person:</span>
                            <span className="truncate">{request.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">Email:</span>
                            <span className="truncate">{request.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="font-medium">Mobile:</span>
                            <span>{request.mobile}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                            <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="font-medium">Location:</span>
                            <span className="truncate">{request.location}</span>
                          </div>
                        </div>

                        {/* Collaboration Details */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Area of Collaboration:</p>
                            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                              {request.areaOfCollaboration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Terms Summary:</p>
                            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">{request.termsSummary}</p>
                          </div>
                        </div>

                        <Separator />

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Requested: {formatDate(request.submittedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {partnershipRequests.length === 0 && (
                    <div className="text-center py-12 md:py-16">
                      <Building className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium text-lg">No partnership requests yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Partnership applications will appear here when submitted
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({
            isOpen: false,
            id: null,
            type: null,
            title: "",
          })
        }
        onConfirm={handleDelete}
        title={`Delete ${deleteConfirmation.type === "job" ? "Job Application" : "Partnership Request"}`}
        description={`Are you sure you want to delete ${deleteConfirmation.title}? This action cannot be undone.`}
        type="delete"
        confirmText={`Delete ${deleteConfirmation.type === "job" ? "Application" : "Request"}`}
        isLoading={isDeleting}
      />
    </div>
  )
}