"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, MessageSquare, Users, Headphones, UserPlus, AlertCircle } from 'lucide-react'
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [/* userInfo */, /* setUserInfo */] = useState<{ username: string; email: string } | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("username")
    const userType = localStorage.getItem("userType")
    let storedEmail = "";

    if (username && userType) {
      setIsLoggedIn(true)
      // In a real app, you'd fetch the user's email from the API
      // For now, we'll use a placeholder or stored email
      storedEmail = localStorage.getItem("userEmail") || ""
      // setUserInfo({ username, email: storedEmail })

      // Pre-fill form with user data
      setFormData((prev) => ({
        ...prev,
        name: username,
        email: storedEmail,
      }))
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (submitMessage || submitError) {
      setSubmitMessage("")
      setSubmitError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      setSubmitError("Please sign up or log in to send your query.")
      return
    }

    setIsSubmitting(true)
    setSubmitMessage("")
    setSubmitError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType: localStorage.getItem("userType"),
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitMessage("Thank you for your message! We&apos;ll get back to you within 24 hours.")
        setFormData((prev) => ({ ...prev, subject: "", message: "" })) // Keep name and email
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error: unknown) {
      console.error("Contact form submission error:", error)
      setSubmitError("Something went wrong. Please try again or contact us directly at farmeaseinfo@gmail.com")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "farmeaseinfo@gmail.com",
      description: "Send us an email anytime for support and inquiries",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 93920 00041",
      description: "Mon-Fri from 9am to 6pm IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "IIITDM Jabalpur, Madhya Pradesh, 482005",
      description: "Our main office location",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 9:00 AM - 6:00 PM IST",
      description: "We're here to help during business hours",
    },
  ]

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "General Inquiries",
      description: "Questions about FarmEase platform and agricultural services",
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Help with using FarmEase features and troubleshooting",
    },
    {
      icon: Users,
      title: "Partnership & Business",
      description: "Collaboration opportunities and business inquiries",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="text-green-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about FarmEase? Need support with our agricultural platform? We&apos;re here to help farmers,
            laborers, employees, and administrators succeed.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    {isLoggedIn
                      ? "Fill out the form below and we'll respond within 24 hours"
                      : "Please sign up or log in to send your query"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isLoggedIn && (
                    <Alert className="mb-6 border-orange-200 bg-orange-50">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <div className="flex flex-col space-y-3">
                          <span>You need to be logged in to send a message. Join our agricultural community!</span>
                          <div className="flex space-x-3">
                            <Link href="/signup">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Sign Up
                              </Button>
                            </Link>
                            <Link href="/login">
                              <Button size="sm" variant="outline">
                                Log In
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

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

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          required
                          disabled={!isLoggedIn}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          required
                          disabled={!isLoggedIn}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="What's this about?"
                        required
                        disabled={!isLoggedIn}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                        disabled={!isLoggedIn}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !isLoggedIn}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{info.title}</h3>
                          <p className="text-green-600 font-medium">{info.details}</p>
                          <p className="text-gray-600 text-sm">{info.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Support Options */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">How Can We Help?</h3>
                <div className="space-y-4">
                  {supportOptions.map((option, index) => {
                    const IconComponent = option.icon
                    return (
                      <Card key={index} className="border-l-4 border-l-green-600">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{option.title}</h4>
                              <p className="text-gray-600 text-sm">{option.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/features" className="block text-green-700 hover:text-green-800 hover:underline">
                      → Explore Platform Features
                    </Link>
                    <Link href="/about" className="block text-green-700 hover:text-green-800 hover:underline">
                      → Learn About FarmEase
                    </Link>
                    <Link href="/signup" className="block text-green-700 hover:text-green-800 hover:underline">
                      → Join Our Community
                    </Link>
                    <Link href="/privacy" className="block text-green-700 hover:text-green-800 hover:underline">
                      → Privacy Policy
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Quick answers to common questions about FarmEase platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Who can use FarmEase?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  FarmEase is designed for farmers, agricultural laborers, employees, and administrators. Each user type
                  has specialized features tailored to their needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is FarmEase free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, FarmEase offers free access to core features. Premium features and advanced analytics may be
                  available in future updates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get market price updates?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Market prices are updated daily and available to all registered farmers. You can view regional prices
                  and trends in your dashboard.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I use FarmEase on mobile?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Currently, FarmEase is web-based and mobile-responsive. A dedicated Android app with offline
                  capabilities is in development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
