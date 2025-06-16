"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { UserLogo } from "@/components/logos/user-logo"
import { User, Mail, Phone, MapPin, Loader2, CheckCircle, AlertCircle, Save, ArrowLeft, X, Edit } from "lucide-react"

interface UserData {
  username: string
  email: string
  fullName: string
  mobile: string
  area: string
  state: string
  zipcode: string
  userType: string
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    fullName: "",
    mobile: "",
    area: "",
    state: "",
    zipcode: "",
    userType: "",
  })

  const [originalEmail, setOriginalEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Email verification states
  const [emailChanged, setEmailChanged] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [emailOtp, setEmailOtp] = useState("")
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [canEditEmail, setCanEditEmail] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username) {
      router.push("/login")
      return
    }

    fetchUserData(username)
  }, [router])

  useEffect(() => {
    console.log("UserData state updated:", userData)
  }, [userData])

  const fetchUserData = async (username: string) => {
    try {
      console.log("Fetching data for username:", username)
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("API Response:", data)
        console.log("User data received:", data.user)

        // Ensure all fields are properly set
        const userData = {
          username: data.user.username || "",
          email: data.user.email || "",
          fullName: data.user.fullName || "",
          mobile: data.user.mobile || "",
          area: data.user.area || "",
          state: data.user.state || "",
          zipcode: data.user.zipcode || "",
          userType: data.user.userType || "",
        }

        console.log("Setting userData to:", userData)
        setUserData(userData)
        setOriginalEmail(data.user.email || "")
      } else {
        console.error("Failed to fetch user data:", response.status)
        setError("Failed to load user data")
      }
    } catch (error) {
      console.error("Fetch user data error:", error)
      setError("Something went wrong while loading your data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))

    if (field === "email") {
      if (value !== originalEmail) {
        setEmailChanged(true)
      } else {
        setEmailChanged(false)
        setShowEmailVerification(false)
        setEmailOtp("")
        setCanEditEmail(true)
      }
    }

    if (message || error) {
      setMessage("")
      setError("")
    }
  }

  const sendEmailVerification = async () => {
    if (!userData.email || userData.email === originalEmail) return

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(userData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Check for invalid patterns
    const invalidPatterns = [
      /^[^@]+@[^@]+\.[a-z]{1}$/i, // Single letter TLD
      /^[^@]+@[^@]+\.cm$/i, // .cm domain
      /^[^@]+@[^@]+\.tk$/i, // .tk domain
      /^[^@]+@[^@]+\.ml$/i, // .ml domain
      /^[^@]+@[^@]+\.ga$/i, // .ga domain
      /^[^@]+@[^@]+\.cf$/i, // .cf domain
    ]

    const isInvalidPattern = invalidPatterns.some((pattern) => pattern.test(userData.email))
    if (isInvalidPattern) {
      setError("Please enter a valid email address from a recognized domain")
      return
    }

    // Check TLD length
    const tld = userData.email.split(".").pop()
    if (!tld || tld.length < 2) {
      setError("Please enter a valid email address")
      return
    }

    setIsSendingOtp(true)
    setError("")

    try {
      console.log("Sending verification to:", userData.email)

      const response = await fetch("/api/send-email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
        }),
      })

      const data = await response.json()
      console.log("Send verification response:", data)

      if (response.ok) {
        setShowEmailVerification(true)
        setCanEditEmail(false)
        setMessage("Verification code sent to your new email address")
      } else {
        setError(data.message || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Send verification error:", error)
      setError("Failed to send verification code")
    } finally {
      setIsSendingOtp(false)
    }
  }

  const cancelEmailChange = () => {
    setUserData((prev) => ({ ...prev, email: originalEmail }))
    setEmailChanged(false)
    setShowEmailVerification(false)
    setEmailOtp("")
    setCanEditEmail(true)
    setMessage("")
    setError("")
  }

  const editEmailAgain = () => {
    setShowEmailVerification(false)
    setEmailOtp("")
    setCanEditEmail(true)
    setMessage("")
    setError("")
  }

  const verifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsVerifyingEmail(true)
    try {
      const response = await fetch("/api/verify-email-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          newEmail: userData.email,
          otp: emailOtp,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setOriginalEmail(userData.email)
        setEmailChanged(false)
        setShowEmailVerification(false)
        setEmailOtp("")
        setCanEditEmail(true)
        setMessage("Email verified and updated successfully!")
        return true
      } else {
        setError(data.message || "Invalid verification code")
        return false
      }
    } catch (error) {
      console.error("Email verification error:", error)
      setError("Failed to verify email")
      return false
    } finally {
      setIsVerifyingEmail(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    setError("")

    try {
      // If email changed, verify it first
      if (emailChanged && showEmailVerification) {
        const emailVerified = await verifyEmailOtp()
        if (!emailVerified) {
          setIsSaving(false)
          return
        }
      }

      // Update user data (excluding email if not verified)
      const updateData = { ...userData }
      if (emailChanged && !showEmailVerification) {
        // Don't update email if it's changed but not verified
        updateData.email = originalEmail
      }

      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()
      if (response.ok) {
        if (emailChanged && !showEmailVerification) {
          setMessage("Profile updated successfully! Email was not changed as it requires verification.")
          setUserData((prev) => ({ ...prev, email: originalEmail }))
          setEmailChanged(false)
        } else {
          setMessage("Profile updated successfully!")
        }
      } else {
        console.error(error)
        setError(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error(error)
      setError("Something went wrong while updating your profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 hover:bg-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center space-x-4">
            <UserLogo userName={userData.username} size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600">Manage your profile information and preferences</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={userData.username} disabled className="bg-gray-50" />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={userData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="userType">Account Type</Label>
                  <Input id="userType" value={userData.userType} disabled className="bg-gray-50 capitalize" />
                  <p className="text-xs text-gray-500 mt-1">Account type cannot be changed</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Update your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address"
                      disabled={!canEditEmail}
                      className={!canEditEmail ? "bg-gray-50" : ""}
                    />
                    {!canEditEmail && (
                      <Button variant="outline" size="sm" onClick={editEmailAgain} className="shrink-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {emailChanged && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-yellow-800 mb-2">Email verification required for this change&nbsp;(&apos;Save Changes&apos; won&apos;t update email until verified)</p>
                          {!showEmailVerification ? (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                We&apos;ll send a verification code to: <strong>{userData.email}</strong>
                              </p>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={sendEmailVerification}
                                  disabled={isSendingOtp}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                  {isSendingOtp ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Sending Code...
                                    </>
                                  ) : (
                                    "Send Verification Code"
                                  )}
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEmailChange} disabled={isSendingOtp}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm text-green-700 mb-2">
                                ✓ Verification code sent to {userData.email}
                              </p>
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="Enter 6-digit code"
                                  value={emailOtp}
                                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                  className="flex-1"
                                  maxLength={6}
                                />
                                <Button
                                  size="sm"
                                  onClick={verifyEmailOtp}
                                  disabled={isVerifyingEmail || emailOtp.length !== 6}
                                >
                                  {isVerifyingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                                </Button>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={sendEmailVerification}
                                  disabled={isSendingOtp}
                                  className="text-xs"
                                >
                                  Resend Code
                                </Button>
                                <Button variant="ghost" size="sm" onClick={editEmailAgain} className="text-xs">
                                  Change Email
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={cancelEmailChange} className="ml-2 p-1 h-auto">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="mobile"
                      value={userData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Address Information
                </CardTitle>
                <CardDescription>Update your location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="area">Area/Locality</Label>
                  <Input
                    id="area"
                    value={userData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="Enter your area or locality"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={userData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="Enter your state"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipcode">Zip Code</Label>
                    <Input
                      id="zipcode"
                      value={userData.zipcode}
                      onChange={(e) => handleInputChange("zipcode", e.target.value)}
                      placeholder="Enter zip code"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Changes */}
            <Card>
              <CardHeader>
                <CardTitle>Save Changes</CardTitle>
                <CardDescription>Save your updated profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSave} disabled={isSaving} className="w-full bg-green-600 hover:bg-green-700">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium capitalize">{userData.userType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{userData.username}</span>
                </div>
                <Separator />
                <p className="text-xs text-gray-500">
                  Some information like username and account type cannot be changed for security reasons.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
