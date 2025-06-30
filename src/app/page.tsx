// src/app/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "@/components/loading"

export default function RootRedirect() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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