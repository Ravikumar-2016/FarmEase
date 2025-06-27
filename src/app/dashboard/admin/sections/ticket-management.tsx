"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Trash2, Clock, Activity, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

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

interface Employee {
  _id: string
  fullName: string
  designation: string
  status: "active" | "inactive"
}

interface TicketManagementProps {
  tickets: Ticket[]
  employees: Employee[]
  onRefresh: () => void
  onShowDeleteConfirmation: (type: string, id: string, name: string) => void
  submitting: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function TicketManagement({
  tickets,
  employees,
  onRefresh,
  onShowDeleteConfirmation,
  submitting,
  onSuccess,
  onError,
}: TicketManagementProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [ticketResponse, setTicketResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTicketResponse = async () => {
    if (!selectedTicket || !ticketResponse.trim()) return

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
        onSuccess("Ticket response sent successfully!")
        setSelectedTicket(null)
        setTicketResponse("")
        onRefresh()
      } else {
        onError(data.error || "Failed to send response")
      }
    } catch (error) {
      console.error("Error responding to ticket:", error)
      onError("Failed to send response. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Open
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Employee Tickets ({tickets.length})
          </CardTitle>
          <CardDescription>Monitor and manage employee support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.ticketId}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTicket?.ticketId === ticket.ticketId
                      ? "border-blue-500 bg-blue-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{ticket.subject}</h4>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {ticket.userType}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>From: {ticket.submitterName}</span>
                    <span>{formatDate(ticket.submittedAt)}</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Category: {ticket.category}
                    </Badge>
                  </div>
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
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ticket Response Panel */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedTicket ? "Respond to Ticket" : "Select a Ticket"}</CardTitle>
          <CardDescription>
            {selectedTicket ? "Provide response and manage the selected ticket" : "Click on a ticket to respond"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTicket ? (
            <div className="space-y-4">
              {/* Ticket Details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{selectedTicket.subject}</h4>
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{selectedTicket.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    From: {selectedTicket.submitterName} ({selectedTicket.userType})
                  </span>
                  <span>{formatDate(selectedTicket.submittedAt)}</span>
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Category: {selectedTicket.category}
                  </Badge>
                </div>
                {selectedTicket.response && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm font-medium text-gray-700">Previous Response:</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedTicket.response}</p>
                    {selectedTicket.respondedAt && (
                      <p className="text-xs text-gray-500 mt-2">Responded: {formatDate(selectedTicket.respondedAt)}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Response Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ticketResponse">Response Message</Label>
                  <Textarea
                    id="ticketResponse"
                    value={ticketResponse}
                    onChange={(e) => setTicketResponse(e.target.value)}
                    placeholder="Type your response here..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleTicketResponse}
                    disabled={isSubmitting || submitting || !ticketResponse.trim()}
                    className="flex-1"
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
                    variant="outline"
                    onClick={() => onShowDeleteConfirmation("ticket", selectedTicket.ticketId, selectedTicket.subject)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {selectedTicket.status === "open" && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <p className="text-sm font-medium text-orange-800">Attention Required</p>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      This ticket is open and requires a response from admin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a ticket to respond</p>
              <p className="text-sm text-gray-400">Click on any ticket from the list to start responding</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
