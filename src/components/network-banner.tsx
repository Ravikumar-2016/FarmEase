"use client"

import { useNetworkStatus } from "@/app/hooks/useNetworkStatus"
import { AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function NetworkBanner() {
  const isOnline = useNetworkStatus()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="network-banner"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-b border-yellow-400 text-yellow-900 flex items-center justify-center gap-2 text-sm font-medium py-2 shadow-md"
        >
          <AlertTriangle className="w-4 h-4 text-yellow-700" />
          <span>You are offline. Some features may not work until you're reconnected.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
