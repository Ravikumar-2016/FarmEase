"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface Announcement {
  _id: string
  announcementId: string
  title: string
  message: string
  type: "warning" | "info" | "success" | "error"
  isActive: boolean
  createdAt: string
}

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([])

  useEffect(() => {
    fetchActiveAnnouncements()

    // Load dismissed announcements from localStorage
    const dismissed = localStorage.getItem("dismissedAnnouncements")
    if (dismissed) {
      setDismissedAnnouncements(JSON.parse(dismissed))
    }
  }, [])

  const fetchActiveAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements?activeOnly=true")
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error) {
      console.error("Error fetching announcements:", error)
    }
  }

  const dismissAnnouncement = (announcementId: string) => {
    const newDismissed = [...dismissedAnnouncements, announcementId]
    setDismissedAnnouncements(newDismissed)
    localStorage.setItem("dismissedAnnouncements", JSON.stringify(newDismissed))
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "warning":
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAnnouncementVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      default:
        return "default"
    }
  }

  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedAnnouncements.includes(announcement.announcementId),
  )

  if (visibleAnnouncements.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => (
        <Alert
          key={announcement.announcementId}
          variant={getAnnouncementVariant(announcement.type)}
          className="relative"
        >
          {getAnnouncementIcon(announcement.type)}
          <AlertDescription className="pr-8">
            <strong>{announcement.title}</strong>
            {announcement.title && announcement.message && " – "}
            {announcement.message}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 p-0"
            onClick={() => dismissAnnouncement(announcement.announcementId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  )
}
