// src/app/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "@/components/loading"

export default function RootRedirect() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    
    // If user is logged in → redirect to dashboard
    if (userType) {
      router.replace(`/dashboard/${userType.toLowerCase()}`)
      return
    }

    // If not logged-in → follow your existing logic
    const agreed = localStorage.getItem("termsAgreed")
    setIsLoading(false)

    if (agreed === "true") {
      router.replace("/home")
    } else {
      router.replace("/terms-banner")
    }
  }, [router])

  if (isLoading) {
    return <Loading />
  }

  return null
}
