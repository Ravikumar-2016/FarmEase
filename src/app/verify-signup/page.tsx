"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react"

export default function VerifySignupPage() {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isResending, setIsResending] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!otp) {
      setError("Please enter the verification code")
      return
    }

    if (otp.length !== 6) {
      setError("Verification code must be 6 digits")
      return
    }

    if (!email) {
      setError("Email not found. Please start from signup page.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/verify-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push(`/create-account?email=${encodeURIComponent(email)}`)
        }, 2000)
      } else {
        setError(data.message || "Invalid verification code. Please try again.")
      }
    } catch (err) {
      console.error("Email verification error:", err)
      setError("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setIsResending(true)

    try {
      const response = await fetch("/api/send-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (response.ok) {
        setError("New verification code sent to your email!")
        setTimeout(() => setError(""), 3000)
      } else {
        setError(data.message || "Failed to resend verification code. Please try again.")
      }
    } catch (err) {
      console.error("Resend OTP error:", err)
      setError("Something went wrong. Please try again later.")
    } finally {
      setIsResending(false)
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
            <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. Now let&apos;s create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Redirecting you to account creation...</p>
              <Button onClick={() => router.push(`/create-account?email=${encodeURIComponent(email)}`)}>
                Continue to Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a 6-digit verification code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={handleChange}
                  className="pl-10 text-center text-lg tracking-widest"
                  required
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>
              <p className="text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
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
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Button variant="outline" onClick={handleResendOtp} disabled={isResending} className="w-full">
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Code
                </>
              )}
            </Button>
            <Link href="/signup" className="text-sm text-gray-600 hover:text-gray-800 hover:underline block">
              Back to Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
