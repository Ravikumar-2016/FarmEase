"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Send,
  Eye,
  Trash2,
  PlayCircle,
  Filter,
} from "lucide-react"

interface Ticket {
  _id: string
  ticketId: string
  submitterName: string
  submitterUsername: string
  userType: "employee" | "admin"
  subject: string
  message: string
  category: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved"
  response?: string
  submittedAt: string
  respondedAt?: string
}

interface SuccessMessage {
  show: boolean
  message: string
  type: "success" | "error"
}

interface DeleteConfirmation {
  isOpen: boolean
  ticketId: string | null
  title: string
}

export default function TicketManagement() {
  const mobileFormRef = useRef<HTMLDivElement>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [ticketResponse, setTicketResponse] = useState("")
  const [ticketStatus, setTicketStatus] = useState<"open" | "in-progress" | "resolved">("in-progress")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({ show: false, message: "", type: "success" })
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    ticketId: null,
    title: "",
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    // Fetch only employee tickets for admin
    const params = new URLSearchParams()
    params.append("userType", "employee")
    const res = await fetch(`/api/tickets?${params.toString()}`)
    const data = await res.json()
    setTickets(data.tickets || [])
  }

  const showMessage = (message: string, type: "success" | "error" = "success") => {
    setSuccessMessage({ show: true, message, type })
    setTimeout(() => {
      setSuccessMessage({ show: false, message: "", type: "success" })
    }, 4000)
  }

  const handleTicketResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket) return

    // Validation: Check response length
    if (ticketResponse.length < 10) {
      showMessage("Response must be at least 10 characters long", "error")
      return
    }

    // Validation: Only allow submission if status is "resolved"
    if (ticketStatus !== "resolved") {
      showMessage("Cannot submit response. Please mark the ticket as resolved before submitting.", "error")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.ticketId,
          response: ticketResponse,
          status: "resolved",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success !== false) {
        showMessage("Ticket response sent successfully!")
        setSelectedTicket(null)
        setTicketResponse("")
        setTicketStatus("in-progress")
        fetchTickets()
      } else {
        showMessage(data.error || "Failed to send response", "error")
      }
    } catch (error) {
      console.error("Error responding to ticket:", error)
      showMessage("Failed to send response. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMobileRespond = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setTicketResponse(ticket.response || "")
    setTicketStatus(ticket.status)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const handleMoveToInProgress = async (ticket: Ticket) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.ticketId,
          status: "in-progress",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchTickets()
      showMessage("Ticket moved to in-progress successfully!", "success")
    } catch (err) {
      console.error("Error updating ticket:", err)
      showMessage("Failed to update ticket status. Please try again.", "error")
    }
  }

  const showDeleteConfirmation = (ticketId: string, title: string) => {
    setDeleteConfirmation({
      isOpen: true,
      ticketId,
      title,
    })
  }

  const handleDeleteTicket = async () => {
    if (!deleteConfirmation.ticketId) return

    try {
      const response = await fetch(`/api/tickets?ticketId=${deleteConfirmation.ticketId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchTickets()
      showMessage("Ticket deleted successfully!", "success")
    } catch (err) {
      console.error("Error deleting ticket:", err)
      showMessage("Failed to delete ticket. Please try again.", "error")
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        ticketId: null,
        title: "",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
            <Clock className="h-3 w-3 mr-1" />
            Open
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTicketActions = (ticket: Ticket) => {
    switch (ticket.status) {
      case "open":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleMoveToInProgress(ticket)
            }}
            className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            Start Progress
          </Button>
        )
      case "in-progress":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              if (window.innerWidth < 1024) {
                handleMobileRespond(ticket)
              } else {
                setSelectedTicket(ticket)
                setTicketResponse(ticket.response || "")
                setTicketStatus(ticket.status)
              }
            }}
            className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
          >
            <Send className="h-4 w-4 mr-1" />
            Respond
          </Button>
        )
      case "resolved":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              showDeleteConfirmation(ticket.ticketId, ticket.subject)
            }}
            className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )
      default:
        return null
    }
  }

  const canEditTicket = (ticket: Ticket) => {
    return ticket.status === "in-progress"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = statusFilter === "all" || ticket.status === statusFilter
    const priorityMatch = priorityFilter === "all" || ticket.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {successMessage.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            successMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {successMessage.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{successMessage.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="h-5 w-5" />
                Employee Tickets ({filteredTickets.length})
              </CardTitle>
              <CardDescription>Click on a ticket to respond or manage</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <Label className="text-sm font-medium">Filters:</Label>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                      <SelectItem value="all" className="py-3 px-4 hover:bg-gray-50 cursor-pointer">
                        All Status
                      </SelectItem>
                      <SelectItem value="open" className="py-3 px-4 hover:bg-red-50 cursor-pointer">
                        🔴 Open
                      </SelectItem>
                      <SelectItem value="in-progress" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                        🔄 In Progress
                      </SelectItem>
                      <SelectItem value="resolved" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                        ✅ Resolved
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32 h-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                      <SelectItem value="all" className="py-3 px-4 hover:bg-gray-50 cursor-pointer">
                        All Priority
                      </SelectItem>
                      <SelectItem value="urgent" className="py-3 px-4 hover:bg-red-50 cursor-pointer">
                        🚨 Urgent
                      </SelectItem>
                      <SelectItem value="high" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
                        ⚡ High
                      </SelectItem>
                      <SelectItem value="normal" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                        📋 Normal
                      </SelectItem>
                      <SelectItem value="low" className="py-3 px-4 hover:bg-gray-50 cursor-pointer">
                        📝 Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="p-6 space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTicket?.ticketId === ticket.ticketId
                          ? "border-blue-500 bg-blue-50"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => {
                        if (canEditTicket(ticket)) {
                          setSelectedTicket(ticket)
                          setTicketResponse(ticket.response || "")
                          setTicketStatus(ticket.status)
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-base">{ticket.subject}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTicketActions(ticket)}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{ticket.message}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{ticket.submitterName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(ticket.submittedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredTickets.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No tickets found</p>
                      <p className="text-sm text-gray-400">
                        {tickets.length === 0 ? "Support tickets will appear here" : "Try adjusting your filters"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Ticket Response Form */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-xl">{selectedTicket ? "Respond to Ticket" : "Select a Ticket"}</CardTitle>
              <CardDescription>
                {selectedTicket
                  ? "Provide a response to the selected ticket"
                  : "Click on an in-progress ticket to respond"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedTicket ? (
                <div className="space-y-6">
                  {/* Ticket Details */}
                  <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{selectedTicket.subject}</h4>
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{selectedTicket.message}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <strong>From:</strong> {selectedTicket.submitterName} ({selectedTicket.userType})
                      </div>
                      <div>
                        <strong>Category:</strong> {selectedTicket.category}
                      </div>
                      <div>
                        <strong>Priority:</strong> {selectedTicket.priority}
                      </div>
                      <div>
                        <strong>Submitted:</strong> {formatDate(selectedTicket.submittedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Existing Response (if any) */}
                  {selectedTicket.response && (
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-semibold text-green-900 mb-2">Previous Response:</h5>
                      <p className="text-sm text-green-800 mb-2">{selectedTicket.response}</p>
                      {selectedTicket.respondedAt && (
                        <p className="text-xs text-green-600">Responded on: {formatDate(selectedTicket.respondedAt)}</p>
                      )}
                    </div>
                  )}

                  {/* Response Form - Only show for in-progress tickets */}
                  {canEditTicket(selectedTicket) ? (
                    <form onSubmit={handleTicketResponse} className="space-y-4">
                      <div>
                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                          Status
                        </Label>
                        <Select
                          value={ticketStatus}
                          onValueChange={(value: "open" | "in-progress" | "resolved") => setTicketStatus(value)}
                        >
                          <SelectTrigger className="mt-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                            <SelectItem value="in-progress" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              🔄 In Progress
                            </SelectItem>
                            <SelectItem value="resolved" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                              ✅ Resolved
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {ticketStatus !== "resolved" && (
                          <p className="text-xs text-amber-600 mt-1">
                            ⚠️ Response can only be submitted when status is &quot;Resolved&quot;
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="response" className="text-sm font-medium text-gray-700">
                          Response *
                        </Label>
                        <Textarea
                          id="response"
                          value={ticketResponse}
                          onChange={(e) => setTicketResponse(e.target.value)}
                          placeholder="Enter your response to the ticket"
                          rows={6}
                          className="mt-1"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || ticketStatus !== "resolved"}
                        className={`w-full ${ticketStatus === "resolved" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Response...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Response
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">
                        {selectedTicket.status === "resolved" ? "Ticket Resolved" : "Ticket View Only"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedTicket.status === "resolved"
                          ? "This ticket has been resolved and cannot be edited."
                          : "Only in-progress tickets can be edited."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <p className="text-gray-500 text-lg font-medium">Select a ticket to manage</p>
                  <p className="text-sm text-gray-400">Click on any ticket from the list to start managing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Mobile Response Form - Show at top when ticket is selected */}
          {selectedTicket && canEditTicket(selectedTicket) && (
            <div ref={mobileFormRef}>
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="text-lg">Respond to Ticket</CardTitle>
                  <CardDescription className="text-sm">Provide your response</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Ticket Details */}
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-semibold text-sm mb-2">{selectedTicket.subject}</h4>
                      <p className="text-sm text-gray-700 mb-2">{selectedTicket.message}</p>
                      <p className="text-xs text-gray-500">
                        From: {selectedTicket.submitterName} ({selectedTicket.userType})
                      </p>
                    </div>

                    {/* Response Form */}
                    <form onSubmit={handleTicketResponse} className="space-y-4">
                      <div>
                        <Label htmlFor="mobile-status" className="text-sm font-medium text-gray-700">
                          Status
                        </Label>
                        <Select
                          value={ticketStatus}
                          onValueChange={(value: "open" | "in-progress" | "resolved") => setTicketStatus(value)}
                        >
                          <SelectTrigger className="mt-1 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                            <SelectItem value="in-progress" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              🔄 In Progress
                            </SelectItem>
                            <SelectItem value="resolved" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                              ✅ Resolved
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {ticketStatus !== "resolved" && (
                          <p className="text-xs text-amber-600 mt-1">
                            ⚠️ Response can only be submitted when status is &quot;Resolved&quot;
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="mobile-response" className="text-sm font-medium text-gray-700">
                          Response *
                        </Label>
                        <Textarea
                          id="mobile-response"
                          value={ticketResponse}
                          onChange={(e) => setTicketResponse(e.target.value)}
                          placeholder="Enter your response"
                          rows={4}
                          className="mt-1"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting || ticketStatus !== "resolved"}
                          className={`flex-1 ${ticketStatus === "resolved" ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Response
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedTicket(null)}
                          className="px-4"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tickets List */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Employee Tickets ({tickets.length})
              </CardTitle>
              <CardDescription className="text-sm">Tap on a ticket to manage</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-sm">{ticket.subject}</h4>
                      {getStatusBadge(ticket.status)}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.message}</p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-1000">{ticket.submitterName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs text-gray-500">{formatDate(ticket.submittedAt)}</span>
                    </div>

                    <div className="flex justify-end">{getTicketActions(ticket)}</div>
                  </div>
                ))}

                {tickets.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No tickets yet</p>
                    <p className="text-sm text-gray-400">Employee tickets will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Ticket</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the ticket &quot;{deleteConfirmation.title}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmation({ isOpen: false, ticketId: null, title: "" })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleDeleteTicket} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Delete Ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}