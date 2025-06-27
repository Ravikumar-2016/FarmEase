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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Phone, MapPin, Clock,ArrowLeft,PhoneCall, Send, Loader2, CheckCircle, MessageSquare, FileText } from "lucide-react"

interface Query {
  _id: string
  queryId: string
  submitterName: string
  submitterUsername: string
  userType: string
  subject: string
  message: string
  status: "pending" | "in-progress" | "resolved"
  response?: string
  submittedAt: string
  respondedAt?: string
}

interface UserData {
  username: string
  fullName: string
  email: string
  userType: string
  area?: string
  state?: string
  mobile?: string
}

export default function UserContactPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<string>("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [queries, setQueries] = useState<Query[]>([])

  // Form state
  const [queryForm, setQueryForm] = useState({
    subject: "",
    message: "",
    priority: "normal",
  })

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!storedUserType || !username || !["farmer", "labour"].includes(storedUserType)) {
      router.push("/login")
      return
    }

    setUserType(storedUserType)
    fetchUserData(username, storedUserType)
  }, [router])

  const fetchUserData = async (username: string, userType: string) => {
    try {
      setLoading(true)

      // Fetch user data from users collection
      const userResponse = await fetch(`/api/users?username=${encodeURIComponent(username)}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData(userData.user)
      }

      // Fetch user's queries
      const queriesResponse = await fetch(`/api/queries?username=${encodeURIComponent(username)}`)
      if (queriesResponse.ok) {
        const queriesData = await queriesResponse.json()
        setQueries(queriesData.queries || [])
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userData) return

    setSubmitting(true)
    setSubmitMessage("")
    setSubmitError("")

    try {
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitterName: userData.fullName,
          submitterUsername: userData.username,
          userType: userData.userType,
          subject: queryForm.subject,
          message: queryForm.message,
          area: userData.area,
          state: userData.state,
          mobile: userData.mobile,
          email: userData.email,
        }),
      })

      if (response.ok) {
        setSubmitMessage("Your query has been submitted successfully! We'll respond within 24 hours.")
        setQueryForm({ subject: "", message: "", priority: "normal" })
        // Refresh queries
        fetchUserData(userData.username, userData.userType)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit query")
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit query. Please try again or contact us directly.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "in-progress":
        return <Badge variant="outline">In Progress</Badge>
      case "resolved":
        return <Badge variant="default">Resolved</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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

    <div className="min-h-screen bg-gray-50">

     {/* ✅ Desktop Header */}
<div className="hidden md:block bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center justify-between">
      
      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Button
  variant="ghost"
  onClick={() => router.push(`/dashboard/${userType}`)}
  className="flex items-center space-x-2 hover:bg-gray-100"
>
  <ArrowLeft className="h-4 w-4" />
  <span>Back to Dashboard</span>
</Button>

      </div>

      {/* Center Title with Icon */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
           <PhoneCall className="h-6 w-6 text-rose-600" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
            <p className="text-gray-600">Reach out for support or queries</p>
        </div>
      </div>
      
      {/* Spacer for alignment */}
      <div className="w-32"></div>
    </div>
  </div>
</div>

{/* ✅ Mobile Header */}
<div className="md:hidden bg-white shadow-sm border-b border-gray-200">
  <div className="px-4 py-4">
    <div className="flex items-center justify-center space-x-3">
      <Button
        variant="ghost"
         onClick={() => router.push(`/dashboard/${userType}`)}
        className="flex items-center space-x-1 p-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back</span>
      </Button>

      <div className="flex items-center space-x-2">
        <div className="p-2 bg-rose-100 rounded-lg">
          <PhoneCall className="h-5 w-5 text-rose-600" />
        </div>
        <h1 className="text-lg font-bold text-gray-900">Contact Us</h1>
      </div>
    </div>

    <p className="text-center text-sm text-gray-600 mt-2">
      Reach out for support or queries
    </p>
  </div>
</div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get <span className="text-green-600">Support</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Need help with FarmEase? Submit a query, check your support status, or find our contact information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="new-query" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new-query">New Query</TabsTrigger>
              <TabsTrigger value="my-queries">My Queries ({queries.length})</TabsTrigger>
              <TabsTrigger value="contact-info">Contact Info</TabsTrigger>
            </TabsList>

            {/* New Query Tab */}
            <TabsContent value="new-query" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Submit New Query
                  </CardTitle>
                  <CardDescription>
                    Describe your issue or question and we'll get back to you within 24 hours
                  </CardDescription>
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

                  <form onSubmit={handleQuerySubmit} className="space-y-6">
                    {/* Pre-filled User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label>Full Name</Label>
                        <Input value={userData?.fullName || ""} disabled />
                      </div>
                      <div>
                        <Label>User Type</Label>
                        <Input value={userData?.userType || ""} disabled className="capitalize" />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={`${userData?.area || ""}, ${userData?.state || ""}`} disabled />
                      </div>
                      <div>
                        <Label>Mobile</Label>
                        <Input value={userData?.mobile || "Not provided"} disabled />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={queryForm.subject}
                        onChange={(e) => setQueryForm({ ...queryForm, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Detailed Message *</Label>
                      <Textarea
                        id="message"
                        value={queryForm.message}
                        onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                        placeholder="Please provide detailed information about your query or issue..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700">
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Query...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Query
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Queries Tab */}
            <TabsContent value="my-queries" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    My Support Queries
                  </CardTitle>
                  <CardDescription>Track the status of your submitted queries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {queries.map((query) => (
                        <div key={query._id} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{query.subject}</h4>
                                {getStatusBadge(query.status)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{query.message}</p>
                              {query.response && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm font-medium text-blue-900 mb-1">Response:</p>
                                  <p className="text-sm text-blue-800">{query.response}</p>
                                  {query.respondedAt && (
                                    <p className="text-xs text-blue-600 mt-2">
                                      Responded: {formatDate(query.respondedAt)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">Submitted: {formatDate(query.submittedAt)}</div>
                        </div>
                      ))}

                      {queries.length === 0 && (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No queries submitted yet</p>
                          <p className="text-sm text-gray-400">Your support queries will appear here</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Info Tab */}
            <TabsContent value="contact-info" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Get in touch with our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">farmeaseinfo@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">+91 93920 00041</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Office Address</p>
                        <p className="text-sm text-gray-600">IIITDM Jabalpur, Madhya Pradesh, 482005</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-sm text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Quick answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">How do I find work opportunities?</h4>
                      <p className="text-sm text-gray-600">
                        Visit the Work Opportunities section in your dashboard to browse and apply for jobs.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">How do I check weather forecasts?</h4>
                      <p className="text-sm text-gray-600">
                        Access real-time weather data through the Weather Forecast section.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">How do I update my profile?</h4>
                      <p className="text-sm text-gray-600">
                        Profile updates can be made through your dashboard settings.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">What if I forgot my password?</h4>
                      <p className="text-sm text-gray-600">
                        Contact support with your registered email for password reset assistance.
                      </p>
                    </div>
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
