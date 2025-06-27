"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2,ArrowLeft, CheckCircle, FileText, Settings, Shield, HelpCircle, Ticket, User, X } from "lucide-react"

interface TicketData {
  _id: string
  ticketId: string
  subject: string
  message: string
  category: string
  priority: string
  status: "open" | "in-progress" | "resolved"
  response?: string
  submittedAt: string
  respondedAt?: string
}

interface UserData {
  username: string
  fullName: string
  email: string
  userType: string
}

export default function EmployeeContactPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
    category: "bug",
    priority: "normal",
  })
  const [formErrors, setFormErrors] = useState({
    subject: "",
    message: "",
  })

  useEffect(() => {
    const username = localStorage.getItem("username")
    const userType = localStorage.getItem("userType")

    if (!username || userType !== "employee") {
      router.push("/login")
      return
    }

    fetchUserData(username)
  }, [router])

  // Auto-hide success message after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchUserData = async (username: string) => {
    try {
      setLoading(true)
      const userResponse = await fetch(`/api/users?username=${encodeURIComponent(username)}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData(userData.user)
      }

      const ticketsResponse = await fetch(`/api/tickets?username=${encodeURIComponent(username)}`)
      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json()
        setTickets(ticketsData.tickets || [])
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    let isValid = true
    const errors = {
      subject: "",
      message: "",
    }

    if (ticketForm.subject.length < 5) {
      errors.subject = "Subject must be at least 5 characters long"
      isValid = false
    }

    if (ticketForm.message.length < 10) {
      errors.message = "Message must be at least 10 characters long"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userData) return

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setSuccessMessage("")

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitterName: userData.fullName,
          submitterUsername: userData.username,
          userType: userData.userType,
          subject: ticketForm.subject,
          message: ticketForm.message,
          category: ticketForm.category,
          priority: ticketForm.priority,
        }),
      })

      if (response.ok) {
        setSuccessMessage("Internal ticket submitted successfully! Admin will review and respond.")
        setTicketForm({ subject: "", message: "", category: "bug", priority: "normal" })
        fetchUserData(userData.username)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit ticket")
      }
    } catch (error) {
      // Now we'll show this error inline in the form
      setFormErrors(prev => ({
        ...prev,
        message: error instanceof Error ? error.message : "Failed to submit ticket. Please try again."
      }))
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Open</Badge>
      case "in-progress":
        return <Badge variant="outline">In Progress</Badge>
      case "resolved":
        return <Badge variant="default">Resolved</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            High
          </Badge>
        )
      case "normal":
        return <Badge variant="secondary">Normal</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Contact Information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-5">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="ml-2 hover:bg-green-600 rounded-full p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}


      {/* Header - Desktop */}
      <div className="hidden md:block bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center justify-between">
      
      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/employee")}
          className="flex items-center space-x-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      {/* Center Title with Icon */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <HelpCircle className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Employee Support</h1>
          <p className="text-gray-600">Submit tickets and access internal contacts</p>
        </div>
      </div>

      {/* Spacer for alignment */}
      <div className="w-32"></div>
    </div>
  </div>
</div>

      {/* Header - Mobile */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
  <div className="px-4 py-4">
    {/* Header Row Centered */}
    <div className="flex items-center justify-center space-x-3">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/employee")}
        className="flex items-center space-x-1 p-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back</span>
      </Button>

      {/* Icon and Title */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <HelpCircle className="h-5 w-5 text-blue-600" />
        </div>
        <h1 className="text-lg font-bold text-gray-900">Employee Support</h1>
      </div>
    </div>

    {/* Subtitle */}
    <p className="text-center text-sm text-gray-600 mt-2">
      Submit tickets and contacts
    </p>
  </div>
</div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Employee <span className="text-blue-600">Support</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Internal support system for employees. Submit tickets to admin, track issues, and access internal contacts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="new-ticket" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
              <TabsTrigger value="my-tickets">My Tickets ({tickets.length})</TabsTrigger>
              <TabsTrigger value="internal-contacts">Internal Contacts</TabsTrigger>
            </TabsList>

            {/* New Ticket Tab */}
            <TabsContent value="new-ticket" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Submit Internal Ticket
                  </CardTitle>
                  <CardDescription>Report bugs, request access, or escalate issues to admin</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTicketSubmit} className="space-y-6">
                    {/* Pre-filled Employee Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label>Employee Name</Label>
                        <Input value={userData?.fullName || ""} disabled />
                      </div>
                      <div>
                        <Label>Username</Label>
                        <Input value={userData?.username || ""} disabled />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={userData?.email || ""} disabled />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input value="Employee" disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                          Category *
                        </Label>
                        <Select
                          value={ticketForm.category}
                          onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                          required
                        >
                          <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                            <SelectValue placeholder="Select ticket category" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            <SelectItem value="bug" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              🐛 Bug Report
                            </SelectItem>
                            <SelectItem value="access" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              🔐 Access Issue
                            </SelectItem>
                            <SelectItem value="feature" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              ✨ Feature Request
                            </SelectItem>
                            <SelectItem value="user-report" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              👤 User Behavior Report
                            </SelectItem>
                            <SelectItem value="system" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              ⚙️ System Issue
                            </SelectItem>
                            <SelectItem value="other" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              📋 Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                          Priority *
                        </Label>
                        <Select
                          value={ticketForm.priority}
                          onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                          required
                        >
                          <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                            <SelectValue placeholder="Select priority level" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            <SelectItem value="low" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                              🟢 Low Priority
                            </SelectItem>
                            <SelectItem value="normal" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              🔵 Normal Priority
                            </SelectItem>
                            <SelectItem value="high" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
                              🟠 High Priority
                            </SelectItem>
                            <SelectItem value="urgent" className="py-3 px-4 hover:bg-red-50 cursor-pointer">
                              🔴 Urgent Priority
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
          Subject *
        </Label>
        <Input
          id="subject"
          value={ticketForm.subject}
          onChange={(e) => {
            setTicketForm({ ...ticketForm, subject: e.target.value })
            if (e.target.value.length >= 5) {
              setFormErrors({ ...formErrors, subject: "" })
            }
          }}
          placeholder="Brief description of the issue"
          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {formErrors.subject && (
          <p className="text-sm text-red-600 mt-1">{formErrors.subject}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
          Detailed Description *
        </Label>
        <Textarea
          id="message"
          value={ticketForm.message}
          onChange={(e) => {
            setTicketForm({ ...ticketForm, message: e.target.value })
            if (e.target.value.length >= 10) {
              setFormErrors({ ...formErrors, message: "" })
            }
          }}
          placeholder="Please provide detailed information about the issue, steps to reproduce, or request details..."
          rows={6}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
          required
        />
        {formErrors.message && (
          <p className="text-sm text-red-600 mt-1">{formErrors.message}</p>
        )}
      </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Ticket...
                        </>
                      ) : (
                        <>
                          <Ticket className="mr-2 h-4 w-4" />
                          Submit Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Tickets Tab */}
            <TabsContent value="my-tickets" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    My Support Tickets
                  </CardTitle>
                  <CardDescription>Track your internal tickets and admin responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket._id}
                          className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h4 className="font-semibold text-gray-900">{ticket.subject}</h4>
                                {getStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Category:</span> {ticket.category}
                              </p>
                              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{ticket.message}</p>
                              {ticket.response && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                  <p className="text-sm font-medium text-blue-900 mb-1">Admin Response:</p>
                                  <p className="text-sm text-blue-800 leading-relaxed">{ticket.response}</p>
                                  {ticket.respondedAt && (
                                    <p className="text-xs text-blue-600 mt-2">
                                      Responded: {formatDate(ticket.respondedAt)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>Submitted:</span>
                            <span className="font-medium">{formatDate(ticket.submittedAt)}</span>
                          </div>
                        </div>
                      ))}

                      {tickets.length === 0 && (
                        <div className="text-center py-12">
                          <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium mb-2">No tickets submitted yet</p>
                          <p className="text-sm text-gray-400">Your internal tickets will appear here</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Internal Contacts Tab */}
            <TabsContent value="internal-contacts" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Internal Contacts</CardTitle>
                    <CardDescription>Key contacts for employee support</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Admin Support</p>
                        <p className="text-sm text-gray-600">admin@farmease.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">IT Support</p>
                        <p className="text-sm text-gray-600">it-support@farmease.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">HR Department</p>
                        <p className="text-sm text-gray-600">hr@farmease.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">General Help</p>
                        <p className="text-sm text-gray-600">help@farmease.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common employee tasks and resources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                      <FileText className="mr-2 h-4 w-4" />
                      Employee Handbook
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                      <Settings className="mr-2 h-4 w-4" />
                      System Status
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Training Resources
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Guidelines
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
