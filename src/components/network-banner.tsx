// src/components/network-banner.tsx
"use client"

import { useNetworkStatus } from  "@/app/hooks/useNetworkStatus"

export function NetworkBanner() {
  const isOnline = useNetworkStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center text-sm py-2 shadow-md">
      ⚠️ You are offline. Some features may not work until the connection is restored.
    </div>
  )
}
