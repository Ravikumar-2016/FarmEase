"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Mail,
  Loader2,
  CheckCircle,
  KeyRound,
  User,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Sprout,
  Hammer,
  AlertCircle,
  ChevronLeft,
  Shield,
  Sparkles,
} from "lucide-react"

const userTypes = [
  {
    value: "farmer",
    label: "Farmer",
    description: "Agricultural producer and land owner",
    icon: Sprout,
    color: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:from-emerald-100 hover:to-green-100",
    selectedColor: "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-400 shadow-lg",
    iconBg: "bg-emerald-500",
  },
  {
    value: "labour",
    label: "Labour",
    description: "Agricultural worker and field hand",
    icon: Hammer,
    color: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:from-orange-100 hover:to-amber-100",
    selectedColor: "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-400 shadow-lg",
    iconBg: "bg-orange-500",
  },
]

export default function SignupPage() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Account Details
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    userType: "",
    fullName: "",
    mobile: "",
    area: "",
    state: "",
    zipcode: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
        setError("")
      } else {
        setError(data.message || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!otp) {
      setError("Please enter the verification code")
      setIsLoading(false)
      return
    }

    if (otp.length !== 6) {
      setError("Verification code must be 6 digits")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(3)
        setError("")
      } else {
        setError(data.message || "Invalid verification code")
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.username || !formData.password || !formData.userType) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-account",
          email,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("userType", data.userType)
        localStorage.setItem("username", data.username)
        router.push(`/dashboard/${data.userType.toLowerCase()}`)
      } else {
        setError(data.message || "Failed to create account")
      }
    } catch (error) {
      console.error("Create account error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email }),
      })

      const data = await response.json()

      if (response.ok) {
        setError("New verification code sent!")
        setTimeout(() => setError(""), 3000)
      } else {
        setError(data.message || "Failed to resend code")
      }
    } catch (error) {
      setError("Failed to resend code")
      console.error("Resend OTP error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 1: Email Input
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg mb-4">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              FarmEase
            </h1>
            <p className="text-slate-600 mt-2">Join the agricultural revolution</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-800">Create Your Account</CardTitle>
              <CardDescription className="text-slate-600">
                Enter your email to get started with FarmEase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Already have an account?</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Sign in to your account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step 2: OTP Verification
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              FarmEase
            </h1>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-800">Verify Your Email</CardTitle>
              <CardDescription className="text-slate-600">
                Enter the 6-digit code sent to <span className="font-semibold text-blue-600">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="otp" className="text-sm font-semibold text-slate-700">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        setError("")
                      }}
                      className="pl-10 h-12 text-center text-xl tracking-widest font-bold border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <Alert
                    variant={error.includes("sent") ? "default" : "destructive"}
                    className={error.includes("sent") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className={error.includes("sent") ? "text-green-700" : "text-red-700"}>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Verify Email
                    </>
                  )}
                </Button>

                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="w-full h-12 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-transparent"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Code
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="w-full h-12 text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Email
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step 3: Account Creation
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Complete Your Profile
          </h1>
          <p className="text-slate-600 text-lg">
            Set up your account for <span className="font-semibold text-blue-600">{email}</span>
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleCreateAccount} className="space-y-8">
              {/* User Type Selection */}
              <div className="space-y-6">
                <div className="text-center">
                  <Label className="text-xl font-bold text-slate-800">Choose Your Role</Label>
                  <p className="text-slate-600 mt-2">Select the option that best describes you</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userTypes.map((type) => {
                    const IconComponent = type.icon
                    const isSelected = formData.userType === type.value
                    return (
                      <button
                        type="button"
                        key={type.value}
                        onClick={() => {
                          setFormData({ ...formData, userType: type.value })
                          setError("")
                        }}
                        className={`
                          relative text-left rounded-2xl border-2 p-6 transition-all duration-300 transform hover:scale-105
                          ${isSelected ? type.selectedColor : type.color}
                          focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        `}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`
                              flex h-12 w-12 items-center justify-center rounded-xl shadow-lg
                              ${isSelected ? type.iconBg : "bg-white"}
                            `}
                          >
                            <IconComponent className={`h-6 w-6 ${isSelected ? "text-white" : "text-slate-700"}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-900">{type.label}</h3>
                            <p className="text-slate-600 mt-1 text-sm leading-relaxed">{type.description}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-lg">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-xl font-bold text-slate-800">Basic Information</h3>
                  <p className="text-slate-600 mt-1">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                      Username *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={(e) => {
                          setFormData({ ...formData, username: e.target.value })
                          setError("")
                        }}
                        placeholder="Choose a unique username"
                        className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name"
                        className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Password *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value })
                          setError("")
                        }}
                        placeholder="Create a strong password"
                        className="pl-10 pr-12 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, confirmPassword: e.target.value })
                          setError("")
                        }}
                        placeholder="Confirm your password"
                        className="pl-10 pr-12 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-xl font-bold text-slate-800">Contact & Location</h3>
                  <p className="text-slate-600 mt-1">Help us connect with you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="mobile" className="text-sm font-semibold text-slate-700">
                      Mobile Number *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="area" className="text-sm font-semibold text-slate-700">
                      Area *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="Your area/locality"
                        className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="state" className="text-sm font-semibold text-slate-700">
                      State *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Your state"
                      className="h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="zipcode" className="text-sm font-semibold text-slate-700">
                      Zip Code *
                    </Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      value={formData.zipcode}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^\d{0,6}$/.test(value)) {
                          setFormData({ ...formData, zipcode: value })
                        }
                      }}
                      placeholder="6-digit postal code"
                      className="h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-6 w-6" />
                    Create My Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-slate-200 pt-8">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
