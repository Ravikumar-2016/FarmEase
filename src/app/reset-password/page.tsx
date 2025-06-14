"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Loader2, CheckCircle, KeyRound, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  })

  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
      setIsPageLoading(false)
    } else {
      // If no email in URL, redirect to forgot password after a short delay
      setTimeout(() => {
        router.push("/forgot-password")
      }, 1000)
    }
  }, [searchParams, router])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // For OTP field, only allow digits and limit to 6 characters
    if (name === "otp") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6)
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    if (error) setError("")
  }

  const validateForm = (): boolean => {
    const { otp, password, confirmPassword } = formData

    if (!otp || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return false
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits")
      return false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return
    if (!email) {
      setError("Email not found. Please start from forgot password page.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: formData.otp,
          password: formData.password,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(data.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Reset password error:", err)
      setError("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (response.ok) {
        setError("New OTP sent to your email!")
        setTimeout(() => setError(""), 3000)
      } else {
        setError(data.message || "Failed to resend OTP")
      }
    } catch (err) {
      console.error("Resend OTP error:", err)
      setError("Failed to resend OTP. Please try again.")
    }
  }

  // Loading state while checking for email parameter
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

  // Show error if no email parameter
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Access</CardTitle>
            <CardDescription>Please start the password reset process from the beginning.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/forgot-password">
              <Button className="w-full">Go to Forgot Password</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been successfully reset. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Continue to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit OTP sent to <strong>{email}</strong> and your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className="pl-10 text-center text-lg tracking-widest"
                  required
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>
              <p className="text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant={error.includes("sent") ? "default" : "destructive"}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button variant="outline" onClick={handleResendOtp} className="w-full text-sm">
              Didn&apos;t receive OTP? Send again
            </Button>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800 hover:underline block">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
