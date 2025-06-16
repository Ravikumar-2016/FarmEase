"use client"

import Image from "next/image"

interface UserLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  userName?: string
}

export function UserLogo({ className = "", size = "md", userName = "User" }: UserLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="/userLogo.png"
        alt={`${userName} Profile`}
        fill
        className="object-cover rounded-full border-2 border-white shadow-lg"
      />
    </div>
  )
}
