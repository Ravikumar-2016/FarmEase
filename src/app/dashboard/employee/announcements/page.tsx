"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

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

interface SuccessMessage {
  show: boolean
  message: string
}

export default function AnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState("")
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({ show: false, message: "" })

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    type: "info" as "warning" | "info" | "success" | "error",
    isActive: true,
  })
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    announcementId: string | null
    title: string
  }>({
    isOpen: false,
    announcementId: null,
    title: "",
  })

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/announcements")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error) {
      console.error("Error fetching announcements:", error)
      showSuccessMessage("Failed to fetch announcements. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "employee") {
      router.push("/login")
      return
    }

    setCurrentUser(username)
    fetchAnnouncements()
  }, [router, fetchAnnouncements])

  const showSuccessMessage = (message: string) => {
    setSuccessMessage({ show: true, message })
    setTimeout(() => {
      setSuccessMessage({ show: false, message: "" })
    }, 4000)
  }

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const method = editingAnnouncement ? "PUT" : "POST"
      const body = editingAnnouncement
        ? { ...announcementForm, announcementId: editingAnnouncement }
        : { ...announcementForm, createdBy: currentUser }

      const response = await fetch("/api/announcements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setAnnouncementForm({ title: "", message: "", type: "info", isActive: true })
      setEditingAnnouncement(null)
      fetchAnnouncements()
      showSuccessMessage(
        editingAnnouncement ? "Announcement updated successfully!" : "Announcement created successfully!",
      )
    } catch (error) {
      console.error("Error saving announcement:", error)
      showSuccessMessage("Failed to save announcement. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnnouncementEdit = (announcement: Announcement) => {
    setAnnouncementForm({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      isActive: announcement.isActive,
    })
    setEditingAnnouncement(announcement.announcementId)
  }

  const showDeleteConfirmation = (announcementId: string, title: string) => {
    setDeleteConfirmation({
      isOpen: true,
      announcementId,
      title,
    })
  }

  const handleAnnouncementDelete = async () => {
    if (!deleteConfirmation.announcementId) return

    try {
      const response = await fetch(`/api/announcements?announcementId=${deleteConfirmation.announcementId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchAnnouncements()
      showSuccessMessage("Announcement deleted successfully!")
    } catch (error) {
      console.error("Error deleting announcement:", error)
      showSuccessMessage("Failed to delete announcement. Please try again.")
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        announcementId: null,
        title: "",
      })
    }
  }

  const handleAnnouncementToggle = async (announcementId: string, isActive: boolean) => {
    try {
      const response = await fetch("/api/announcements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementId, isActive }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchAnnouncements()
      showSuccessMessage("Announcement status updated successfully!")
    } catch (error) {
      console.error("Error toggling announcement:", error)
      showSuccessMessage("Failed to update announcement status. Please try again.")
    }
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-6 w-6 md:h-5 md:w-5" />
      case "error":
        return <AlertTriangle className="h-6 w-6 md:h-5 md:w-5" />
      case "success":
        return <CheckCircle className="h-6 w-6 md:h-5 md:w-5" />
      default:
        return <Info className="h-6 w-6 md:h-5 md:w-5" />
    }
  }

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-orange-200 bg-orange-50 text-orange-800"
      case "error":
        return "border-red-200 bg-red-50 text-red-800"
      case "success":
        return "border-green-200 bg-green-50 text-green-800"
      default:
        return "border-blue-200 bg-blue-50 text-blue-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Success Message */}
      {successMessage.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage.message}</span>
        </div>
      )}

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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Megaphone className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Announcements Management</h1>
                <p className="text-gray-600">Create and manage platform announcements</p>
              </div>
            </div>
            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Header - Mobile */}
      <div className="md:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/employee")}
              className="flex items-center space-x-1 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>

            {/* Icon + Title */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Megaphone className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Announcements</h1>
            </div>
          </div>

          {/* Subtitle centered below */}
          <p className="text-sm text-gray-600 text-center mt-2">
            Create and manage announcements
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create/Edit Announcement Form */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Plus className="h-5 w-5" />
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </CardTitle>
              <CardDescription>
                {editingAnnouncement
                  ? "Update the announcement details"
                  : "Create announcements for farmers and laborers"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    placeholder="Enter announcement title"
                    className="mt-1 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={announcementForm.message}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                    placeholder="Enter announcement message"
                    rows={4}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                    Type *
                  </Label>
                  <Select
                    value={announcementForm.type}
                    onValueChange={(value: "warning" | "info" | "success" | "error") =>
                      setAnnouncementForm({ ...announcementForm, type: value })
                    }
                  >
                    <SelectTrigger className="mt-1 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <SelectValue placeholder="Select announcement type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                      <SelectItem value="info" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                        ℹ️ Info
                      </SelectItem>
                      <SelectItem value="warning" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
                        ⚠️ Warning
                      </SelectItem>
                      <SelectItem value="success" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                        ✅ Success
                      </SelectItem>
                      <SelectItem value="error" className="py-3 px-4 hover:bg-red-50 cursor-pointer">
                        ❌ Error
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Professional Toggle Switch */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      {announcementForm.isActive
                        ? "Make announcement visible to users"
                        : "Make announcement not visible to users"}
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      {announcementForm.isActive
                        ? "Users can see this announcement"
                        : "This announcement is hidden from users"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnnouncementForm({ ...announcementForm, isActive: !announcementForm.isActive })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      announcementForm.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        announcementForm.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 h-12">
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingAnnouncement ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingAnnouncement ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {editingAnnouncement ? "Update" : "Create"} Announcement
                      </>
                    )}
                  </Button>
                  {editingAnnouncement && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingAnnouncement(null)
                        setAnnouncementForm({ title: "", message: "", type: "info", isActive: true })
                      }}
                      className="h-12"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Announcements List */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
              <CardTitle className="text-xl">All Announcements ({announcements.length})</CardTitle>
              <CardDescription>Manage existing announcements</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 md:p-6 space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className={`p-4 rounded-lg border-2 ${getAnnouncementColor(announcement.type)} transition-all hover:shadow-md`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              {getAnnouncementIcon(announcement.type)}
                              <h4 className="font-semibold text-lg">{announcement.title}</h4>
                            </div>
                            <Badge variant={announcement.isActive ? "default" : "secondary"} className="text-xs w-fit">
                              {announcement.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3 leading-relaxed">{announcement.message}</p>
                          <p className="text-xs opacity-75">
                            Created: {new Date(announcement.createdAt).toLocaleDateString()} by {announcement.createdBy}
                          </p>
                        </div>
                        <div className="flex items-center justify-end md:justify-start gap-2 md:ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleAnnouncementToggle(announcement.announcementId, !announcement.isActive)
                            }
                            className="h-8 w-8 p-0"
                          >
                            {announcement.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAnnouncementEdit(announcement)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => showDeleteConfirmation(announcement.announcementId, announcement.title)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {announcements.length === 0 && (
                    <div className="text-center py-12">
                      <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No announcements yet</p>
                      <p className="text-sm text-gray-400">Create your first announcement to get started</p>
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
            announcementId: null,
            title: "",
          })
        }
        onConfirm={handleAnnouncementDelete}
        title="Delete Announcement"
        description={`Are you sure you want to delete the announcement "${deleteConfirmation.title}"? This action cannot be undone.`}
        type="delete"
        confirmText="Delete Announcement"
        isLoading={false}
      />
    </div>
  )
}