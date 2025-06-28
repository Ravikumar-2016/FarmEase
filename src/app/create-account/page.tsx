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
} from "lucide-react"

const userTypes = [
  {
    value: "farmer",
    label: "Farmer",
    description: "Agricultural producer and land owner",
    icon: Sprout,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    selectedColor: "bg-green-100 border-green-500",
  },
  {
    value: "labour",
    label: "Labour",
    description: "Agricultural worker and field hand",
    icon: Hammer,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    selectedColor: "bg-orange-100 border-orange-500",
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
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
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
        }, 2000)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Access</CardTitle>
            <CardDescription>Please start the signup process from the beginning.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup">
              <Button className="w-full">Go to Sign Up</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Account Created Successfully!</CardTitle>
            <CardDescription>
              Welcome to FarmEase! Your account has been created and you&apos;re being redirected to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Redirecting to your {formData.userType} dashboard...</p>
              <Button onClick={() => router.push(`/dashboard/${formData.userType.toLowerCase()}`)}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">
            Complete your profile for <span className="font-semibold text-green-600">{email}</span>
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* User Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900">Choose Your Role *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userTypes.map((type) => {
                    const IconComponent = type.icon
                    const isSelected = formData.userType === type.value
                    return (
                      <div
                        key={type.value}
                        onClick={() => handleUserTypeSelect(type.value)}
                        className={`
                          relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                          ${isSelected ? type.selectedColor : type.color}
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`
                            flex h-10 w-10 items-center justify-center rounded-lg
                            ${isSelected ? "bg-white shadow-sm" : "bg-white/50"}
                          `}
                          >
                            <IconComponent className="h-5 w-5 text-gray-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a unique username"
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="pl-10 pr-12 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="pl-10 pr-12 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Your area/locality"
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Your state"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipcode">Zip Code</Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="pt-6">
                <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Your Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm border-t pt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}