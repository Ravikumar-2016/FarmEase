"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Lock,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Sprout,
  Hammer,
  Sparkles,
  ArrowRight,
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

export default function CreateAccountPage() {
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

  const [email, setEmail] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
      setIsPageLoading(false)
    } else {
      setTimeout(() => {
        router.push("/signup")
      }, 1000)
    }
  }, [searchParams, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errorMessage) setErrorMessage("")
  }

  const handleUserTypeSelect = (userType: string) => {
    setFormData({ ...formData, userType })
    if (errorMessage) setErrorMessage("")
  }

  const toTitleCase = (str: string) => {
    if (!str) return ""
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .trim()
  }

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.userType) {
      setErrorMessage("Please fill in all required fields")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match")
      return false
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long")
      return false
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      setErrorMessage("Mobile number must be 10 digits")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!validateForm()) return
    if (!email) {
      setErrorMessage("Email not found. Please start from signup.")
      return
    }

    setIsLoading(true)

    try {
      const processedData = {
        ...formData,
        email: email,
        fullName: toTitleCase(formData.fullName.trim()),
        area: toTitleCase(formData.area.trim()),
        state: toTitleCase(formData.state.trim()),
      }

      const response = await fetch("/api/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        localStorage.setItem("userType", formData.userType)
        localStorage.setItem("username", formData.username)

        setTimeout(() => {
          router.push(`/dashboard/${formData.userType.toLowerCase()}`)
        }, 3000)
      } else {
        setErrorMessage(data.message || "Error creating account")
      }
    } catch (error) {
      console.error("Create account error:", error)
      setErrorMessage("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl opacity-20 animate-pulse"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Loading Account Setup</h3>
                <p className="text-slate-600">Please wait while we prepare your account creation...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-6 text-center pb-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-slate-800">Access Denied</CardTitle>
                <CardDescription className="text-slate-600">
                  Please start the signup process from the beginning to continue.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/signup">
                  <Sprout className="mr-2 h-5 w-5" />
                  Go to Sign Up
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-6 text-center pb-6">
              <div className="mx-auto relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl opacity-20 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold text-slate-800">Welcome to FarmEase!</CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Your account has been created successfully. You&apos;re being redirected to your {formData.userType}{" "}
                  dashboard.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                <span className="text-emerald-700 font-semibold text-lg">Preparing your dashboard...</span>
              </div>
              <Button
                onClick={() => router.push(`/dashboard/${formData.userType.toLowerCase()}`)}
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Go to Dashboard
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
            <form onSubmit={handleSubmit} className="space-y-8">
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
                        onClick={() => handleUserTypeSelect(type.value)}
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
                        onChange={handleChange}
                        placeholder="Choose a unique username"
                        className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-xl font-bold text-slate-800">Contact Information</h3>
                  <p className="text-slate-600 mt-1">How can we reach you?</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mobile" className="text-sm font-semibold text-slate-700">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-xl font-bold text-slate-800">Location Information</h3>
                  <p className="text-slate-600 mt-1">Where are you located?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="area" className="text-sm font-semibold text-slate-700">
                      Area
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Your area/locality"
                        className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="state" className="text-sm font-semibold text-slate-700">
                      State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Your state"
                      className="h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="zipcode" className="text-sm font-semibold text-slate-700">
                      Zip Code
                    </Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      className="h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
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
                    Creating Your Account...
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
