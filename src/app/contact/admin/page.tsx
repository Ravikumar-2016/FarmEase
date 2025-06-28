"use client"

import type React from "react"

import { useState} from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/text-area"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Shield,
  Settings,
  FileText,
  Loader2,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Building,
  AlertCircle,
  X,
} from "lucide-react"

export default function AdminContactPage() {
  const [incident, setIncident] = useState({
    subject: "",
    description: "",
    severity: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 4000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(""), 4000)
  }

  const handleIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate incident escalation
      await new Promise((res) => setTimeout(res, 1500))
      showSuccess("Critical incident has been escalated to the appropriate teams and stakeholders.")
      setIncident({ subject: "", description: "", severity: "medium" })
    } catch (error) {
      console.error("Error escalating incident:", error);
      showError("Failed to escalate incident. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
          <CheckCircle className="h-4 w-4" />
          {successMessage}
          <button onClick={() => setSuccessMessage("")} className="ml-2 text-white hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
          <button onClick={() => setErrorMessage("")} className="ml-2 text-white hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Admin <span className="text-red-600">Control Center</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Critical incident escalation and external contact coordination for platform administrators.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="incident-escalation" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto">
              <TabsTrigger value="incident-escalation" className="flex flex-col items-center gap-1 h-16">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Incident Escalation</span>
              </TabsTrigger>
              <TabsTrigger value="external-contacts" className="flex flex-col items-center gap-1 h-16">
                <Building className="h-4 w-4" />
                <span className="text-xs">External Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="internal-notices" className="flex flex-col items-center gap-1 h-16">
                <Settings className="h-4 w-4" />
                <span className="text-xs">Internal Notices</span>
              </TabsTrigger>
            </TabsList>

            {/* Incident Escalation Tab */}
            <TabsContent value="incident-escalation" className="mt-6">
              <Card className="shadow-lg border-0 max-w-4xl mx-auto">
                <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Critical Incident Escalation
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    Escalate critical system issues to external teams and stakeholders
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleIncidentSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="severity" className="text-sm font-medium">
                        Severity Level *
                      </Label>
                      <Select
  value={incident.severity}
  onValueChange={(value) => setIncident({ ...incident, severity: value })}
>
  <SelectTrigger className="h-12 mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
    <SelectValue placeholder="Select severity level" />
  </SelectTrigger>
  <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
    <SelectItem value="low" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
      🟢 Low - Minor issue
    </SelectItem>
    <SelectItem value="medium" className="py-3 px-4 hover:bg-yellow-50 cursor-pointer">
      🟡 Medium - Service degradation
    </SelectItem>
    <SelectItem value="high" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
      🟠 High - Service outage
    </SelectItem>
    <SelectItem value="critical" className="py-3 px-4 hover:bg-red-50 cursor-pointer">
      🔴 Critical - System down
    </SelectItem>
  </SelectContent>
</Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Incident Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={incident.subject}
                        onChange={(e) => setIncident({ ...incident, subject: e.target.value })}
                        placeholder="Brief description of the critical incident"
                        className="h-12 mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="description"
                        rows={6}
                        value={incident.description}
                        onChange={(e) => setIncident({ ...incident, description: e.target.value })}
                        placeholder="Provide detailed information about the incident, impact, and immediate actions taken..."
                        className="mt-1"
                        required
                      />
                    </div>

                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium"
                    >
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                    <CardTitle>External Service Providers</CardTitle>
                    <CardDescription className="text-purple-100">
                      Critical external contacts for system issues
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Hosting Provider - Vercel</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          support@vercel.com
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Emergency: +1-555-VERCEL
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Settings className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Database - MongoDB Atlas</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          cloud-support@mongodb.com
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Priority Support: Available 24/7
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Building className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Legal & Compliance</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          legal@farmease.in
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Business Hours: Mon-Fri 9-6 IST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">DevOps Emergency</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          devops@farmease.in
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Emergency Hotline: +91 93920 00041
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                    <CardTitle>Escalation Procedures</CardTitle>
                    <CardDescription className="text-orange-100">Step-by-step escalation guidelines</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Assess Severity</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Determine impact level and affected users. Document all relevant details immediately.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Document Incident</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Record all relevant details, timestamps, and initial response actions taken.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Notify Stakeholders</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Alert appropriate teams, management, and external service providers as needed.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                          4
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Coordinate Response</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Work with external teams for resolution and maintain communication with all stakeholders.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Internal Notices Tab */}
            <TabsContent value="internal-notices" className="mt-6">
              <Card className="shadow-lg border-0 max-w-4xl mx-auto">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                  <CardTitle>Internal Notices & Updates</CardTitle>
                  <CardDescription className="text-indigo-100">
                    Platform-wide memos and directives from Board of Directors and Lead Admins
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <Alert className="border-blue-200 bg-blue-50">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>System Maintenance Scheduled:</strong> Database optimization planned for next Sunday
                        2:00 AM - 4:00 AM IST. All services will be temporarily unavailable during this window. Please
                        inform all stakeholders in advance.
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-green-200 bg-green-50">
                      <Shield className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Security Update:</strong> New authentication protocols will be implemented next month.
                        All employees must complete security training by month-end. Training materials are available in
                        the employee portal.
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-purple-200 bg-purple-50">
                      <Settings className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        <strong>Platform Enhancement:</strong> New AI-powered features will be rolled out gradually over
                        the next quarter. Beta testing will begin with selected farmer groups next week.
                      </AlertDescription>
                    </Alert>

                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Additional notices and updates will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Check back regularly for important announcements and platform updates
                      </p>
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