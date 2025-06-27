"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/text-area"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Shield, Settings, FileText, Loader2, CheckCircle, Clock, Mail } from "lucide-react"

interface Ticket {
  _id: string
  ticketId: string
  submitterName: string
  submitterUsername: string
  subject: string
  message: string
  category: string
  priority: string
  status: "open" | "in-progress" | "resolved"
  response?: string
  submittedAt: string
  respondedAt?: string
}

export default function AdminContactPage() {
  const [incident, setIncident] = useState({
    subject: "",
    description: "",
    severity: "medium",
  })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [responseText, setResponseText] = useState("")
  const [responding, setResponding] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tickets")
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")
    setSubmitError("")

    try {
      // Simulate incident escalation
      await new Promise((res) => setTimeout(res, 1000))
      setSubmitMessage("Critical incident has been escalated to the appropriate teams.")
      setIncident({ subject: "", description: "", severity: "medium" })
    } catch (error) {
      setSubmitError("Failed to escalate incident. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTicketResponse = async (ticket: Ticket) => {
    if (!responseText.trim()) return

    setResponding(true)
    try {
      const response = await fetch("/api/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.ticketId,
          response: responseText,
          status: "resolved",
        }),
      })

      if (response.ok) {
        setSubmitMessage("Response sent successfully!")
        setResponseText("")
        setSelectedTicket(null)
        fetchTickets()
      } else {
        throw new Error("Failed to send response")
      }
    } catch (error) {
      setSubmitError("Failed to send response. Please try again.")
    } finally {
      setResponding(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Admin <span className="text-red-600">Control Center</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Critical incident escalation, employee ticket management, and external contact coordination.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="employee-tickets" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="employee-tickets">Employee Tickets ({tickets.length})</TabsTrigger>
              <TabsTrigger value="incident-escalation">Incident Escalation</TabsTrigger>
              <TabsTrigger value="external-contacts">External Contacts</TabsTrigger>
              <TabsTrigger value="internal-notices">Internal Notices</TabsTrigger>
            </TabsList>

            {/* Employee Tickets Tab */}
            <TabsContent value="employee-tickets" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Employee Support Tickets
                      </CardTitle>
                      <CardDescription>Manage internal employee tickets and issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : (
                        <ScrollArea className="h-96">
                          <div className="space-y-4">
                            {tickets.map((ticket) => (
                              <div
                                key={ticket._id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                  selectedTicket?._id === ticket._id
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold">{ticket.subject}</h4>
                                      {getStatusBadge(ticket.status)}
                                      {getPriorityBadge(ticket.priority)}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      From: {ticket.submitterName} (@{ticket.submitterUsername})
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">Category: {ticket.category}</p>
                                    <p className="text-sm text-gray-500 line-clamp-2">{ticket.message}</p>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">Submitted: {formatDate(ticket.submittedAt)}</div>
                              </div>
                            ))}

                            {tickets.length === 0 && (
                              <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No employee tickets</p>
                                <p className="text-sm text-gray-400">Employee tickets will appear here</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Ticket Response Panel */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Respond to Ticket</CardTitle>
                      <CardDescription>
                        {selectedTicket ? "Send response to employee" : "Select a ticket to respond"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {submitMessage && (
                        <Alert className="mb-4 border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">{submitMessage}</AlertDescription>
                        </Alert>
                      )}

                      {submitError && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                      )}

                      {selectedTicket ? (
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">{selectedTicket.subject}</h4>
                            <p className="text-sm text-gray-600 mb-2">From: {selectedTicket.submitterName}</p>
                            <p className="text-sm">{selectedTicket.message}</p>
                          </div>

                          {selectedTicket.response && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-900 mb-1">Previous Response:</p>
                              <p className="text-sm text-blue-800">{selectedTicket.response}</p>
                            </div>
                          )}

                          <div>
                            <Label htmlFor="response">Your Response</Label>
                            <Textarea
                              id="response"
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Type your response to the employee..."
                              rows={4}
                            />
                          </div>

                          <Button
                            onClick={() => handleTicketResponse(selectedTicket)}
                            disabled={!responseText.trim() || responding}
                            className="w-full"
                          >
                            {responding ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Response...
                              </>
                            ) : (
                              "Send Response"
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Select a ticket to respond</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Incident Escalation Tab */}
            <TabsContent value="incident-escalation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Critical Incident Escalation
                  </CardTitle>
                  <CardDescription>Escalate critical system issues to external teams and stakeholders</CardDescription>
                </CardHeader>
                <CardContent>
                  {submitMessage && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{submitMessage}</AlertDescription>
                    </Alert>
                  )}

                  {submitError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleIncidentSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="severity">Severity Level *</Label>
                      <Select
                        value={incident.severity}
                        onValueChange={(value) => setIncident({ ...incident, severity: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Minor issue</SelectItem>
                          <SelectItem value="medium">Medium - Service degradation</SelectItem>
                          <SelectItem value="high">High - Service outage</SelectItem>
                          <SelectItem value="critical">Critical - System down</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Incident Subject *</Label>
                      <Input
                        id="subject"
                        value={incident.subject}
                        onChange={(e) => setIncident({ ...incident, subject: e.target.value })}
                        placeholder="Brief description of the critical incident"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Detailed Description *</Label>
                      <Textarea
                        id="description"
                        rows={6}
                        value={incident.description}
                        onChange={(e) => setIncident({ ...incident, description: e.target.value })}
                        placeholder="Provide detailed information about the incident, impact, and immediate actions taken..."
                        required
                      />
                    </div>

                    <Button disabled={isSubmitting} type="submit" className="w-full bg-red-600 hover:bg-red-700">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Escalating Incident...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Escalate Critical Incident
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* External Contacts Tab */}
            <TabsContent value="external-contacts" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>External Service Providers</CardTitle>
                    <CardDescription>Critical external contacts for system issues</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Hosting Provider - Vercel</p>
                        <p className="text-sm text-gray-600">support@vercel.com</p>
                        <p className="text-sm text-gray-600">Emergency: +1-555-VERCEL</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Database - MongoDB Atlas</p>
                        <p className="text-sm text-gray-600">cloud-support@mongodb.com</p>
                        <p className="text-sm text-gray-600">Priority Support: Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Legal & Compliance</p>
                        <p className="text-sm text-gray-600">legal@farmease.in</p>
                        <p className="text-sm text-gray-600">Business Hours: Mon-Fri 9-6 IST</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">DevOps Emergency</p>
                        <p className="text-sm text-gray-600">devops@farmease.in</p>
                        <p className="text-sm text-gray-600">Emergency Hotline: +91 93920 00041</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Escalation Procedures</CardTitle>
                    <CardDescription>Step-by-step escalation guidelines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Assess Severity</p>
                          <p className="text-sm text-gray-600">Determine impact level and affected users</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Document Incident</p>
                          <p className="text-sm text-gray-600">Record all relevant details and timestamps</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Notify Stakeholders</p>
                          <p className="text-sm text-gray-600">Alert appropriate teams and management</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                          4
                        </div>
                        <div>
                          <p className="font-medium">Coordinate Response</p>
                          <p className="text-sm text-gray-600">Work with external teams for resolution</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Internal Notices Tab */}
            <TabsContent value="internal-notices" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Internal Notices & Updates</CardTitle>
                  <CardDescription>
                    Platform-wide memos and directives from Board of Directors and Lead Admins
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>System Maintenance Scheduled:</strong> Database optimization planned for next Sunday
                        2:00 AM - 4:00 AM IST. All services will be temporarily unavailable during this window.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Update:</strong> New authentication protocols will be implemented next month.
                        All employees must complete security training by month-end.
                      </AlertDescription>
                    </Alert>

                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p>Additional notices and updates will appear here</p>
                      <p className="text-sm">Check back regularly for important announcements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
