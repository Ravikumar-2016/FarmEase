"use client"

import Image from "next/image"

interface FarmEaseLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function FarmEaseLogo({ className = "", size = "md" }: FarmEaseLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image src="/FarmEaseLogo.png" alt="FarmEase Logo" fill className="object-contain rounded-full" priority />
    </div>
  )
}
