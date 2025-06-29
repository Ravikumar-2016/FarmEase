"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const agreed = localStorage.getItem("termsAgreed")
    if (agreed === "true") {
      router.replace("/home")
    } else {
      router.replace("/terms-banner")
    }
  }, [router])

  return null
}
