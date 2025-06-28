"use client"

import { useEffect} from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ContactPage() {
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username) {
      // Not logged in, redirect to login
      router.push("/login")
      return
    }

    // Redirect based on user type
    switch (userType) {
      case "farmer":
      case "labour":
        router.push("/contact/user")
        break
      case "employee":
        router.push("/contact/employee")
        break
      case "admin":
        router.push("/contact/admin")
        break
      default:
        // Unknown user type, redirect to login
        router.push("/login")
        break
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to contact page...</p>
      </div>
    </div>
  )
}
