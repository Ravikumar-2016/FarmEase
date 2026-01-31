"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Bell,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react"

interface Announcement {
  _id: string
  announcementId: string
  title: string
  message: string
  type: "warning" | "info" | "success" | "error"
  priority?: "high" | "medium" | "low"
  isActive: boolean
  createdAt: string
}

interface AnnouncementBannerProps {
  maxVisible?: number
  showViewAll?: boolean
  onViewAll?: () => void
  compact?: boolean
}

export function AnnouncementBanner({ 
  maxVisible = 2, 
  showViewAll = true,
  onViewAll,
  compact = false 
}: AnnouncementBannerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([])
  const [readAnnouncements, setReadAnnouncements] = useState<string[]>([])
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    fetchActiveAnnouncements()

    // Load dismissed and read announcements from localStorage
    const dismissed = localStorage.getItem("dismissedAnnouncements")
    const read = localStorage.getItem("readAnnouncements")
    if (dismissed) setDismissedAnnouncements(JSON.parse(dismissed))
    if (read) setReadAnnouncements(JSON.parse(read))
  }, [])

  const fetchActiveAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements?activeOnly=true")
      const data = await response.json()
      // Sort by priority and date
      const sorted = (data.announcements || []).sort((a: Announcement, b: Announcement) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        const aPriority = priorityOrder[a.priority || "medium"]
        const bPriority = priorityOrder[b.priority || "medium"]
        if (aPriority !== bPriority) return aPriority - bPriority
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setAnnouncements(sorted)
    } catch (error) {
      console.error("Error fetching announcements:", error)
    }
  }

  const dismissAnnouncement = (announcementId: string) => {
    const newDismissed = [...dismissedAnnouncements, announcementId]
    setDismissedAnnouncements(newDismissed)
    localStorage.setItem("dismissedAnnouncements", JSON.stringify(newDismissed))
  }

  const markAsRead = (announcementId: string) => {
    if (!readAnnouncements.includes(announcementId)) {
      const newRead = [...readAnnouncements, announcementId]
      setReadAnnouncements(newRead)
      localStorage.setItem("readAnnouncements", JSON.stringify(newRead))
    }
  }

  const toggleExpanded = (announcementId: string) => {
    markAsRead(announcementId)
    setExpandedAnnouncements(prev => 
      prev.includes(announcementId) 
        ? prev.filter(id => id !== announcementId)
        : [...prev, announcementId]
    )
  }

  const getAnnouncementIcon = (type: string, priority?: string) => {
    const iconClass = priority === "high" ? "animate-pulse" : ""
    switch (type) {
      case "error":
        return <AlertCircle className={`h-4 w-4 ${iconClass}`} />
      case "warning":
        return <AlertTriangle className={`h-4 w-4 ${iconClass}`} />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAnnouncementStyles = (type: string, priority?: string, isRead?: boolean) => {
    const baseStyles = isRead ? "opacity-80" : ""
    const priorityRing = priority === "high" ? "ring-2 ring-offset-1" : ""
    
    switch (type) {
      case "error":
        return `bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 ${priorityRing} ring-red-300 ${baseStyles}`
      case "warning":
        return `bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 ${priorityRing} ring-amber-300 ${baseStyles}`
      case "success":
        return `bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800 ${baseStyles}`
      default:
        return `bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 ${baseStyles}`
    }
  }

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "error": return "bg-red-100 text-red-600"
      case "warning": return "bg-amber-100 text-amber-600"
      case "success": return "bg-emerald-100 text-emerald-600"
      default: return "bg-blue-100 text-blue-600"
    }
  }

  const getPriorityBadge = (priority?: string) => {
    if (!priority || priority === "low") return null
    return (
      <Badge 
        variant="outline" 
        className={`text-[10px] px-1.5 py-0 ${
          priority === "high" 
            ? "border-red-300 text-red-700 bg-red-50" 
            : "border-amber-300 text-amber-700 bg-amber-50"
        }`}
      >
        {priority === "high" ? "URGENT" : "Important"}
      </Badge>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedAnnouncements.includes(announcement.announcementId)
  )

  const displayedAnnouncements = visibleAnnouncements.slice(0, maxVisible)
  const remainingCount = visibleAnnouncements.length - maxVisible
  const unreadCount = visibleAnnouncements.filter(a => !readAnnouncements.includes(a.announcementId)).length

  if (visibleAnnouncements.length === 0) return null

  return (
    <div className="w-full">
      {/* Header Bar - Collapsible */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-2"
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <div className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <span>Notifications</span>
          <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-gray-100">
            {visibleAnnouncements.length}
          </Badge>
          {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </button>

        {showViewAll && remainingCount > 0 && !isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2"
          >
            View all ({visibleAnnouncements.length})
          </Button>
        )}
      </motion.div>

      {/* Announcements List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {displayedAnnouncements.map((announcement, index) => {
              const isExpanded = expandedAnnouncements.includes(announcement.announcementId)
              const isRead = readAnnouncements.includes(announcement.announcementId)
              const shouldTruncate = announcement.message.length > 80 && !isExpanded

              return (
                <motion.div
                  key={announcement.announcementId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative rounded-xl border p-3 ${getAnnouncementStyles(
                    announcement.type, 
                    announcement.priority,
                    isRead
                  )} ${compact ? "p-2" : "p-3"}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-1.5 rounded-lg ${getIconBgColor(announcement.type)} flex-shrink-0`}>
                      {getAnnouncementIcon(announcement.type, announcement.priority)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-semibold text-sm ${compact ? "text-xs" : "text-sm"}`}>
                          {announcement.title}
                        </span>
                        {getPriorityBadge(announcement.priority)}
                        {!isRead && (
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${compact ? "text-xs" : "text-sm"} ${isRead ? "opacity-75" : ""}`}>
                        {shouldTruncate 
                          ? `${announcement.message.slice(0, 80)}...` 
                          : announcement.message
                        }
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-gray-500">
                          {formatTimeAgo(announcement.createdAt)}
                        </span>
                        {announcement.message.length > 80 && (
                          <button
                            onClick={() => toggleExpanded(announcement.announcementId)}
                            className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>Show less <ChevronUp className="h-3 w-3" /></>
                            ) : (
                              <>Read more <ChevronDown className="h-3 w-3" /></>
                            )}
                          </button>
                        )}
                        {!isRead && (
                          <button
                            onClick={() => markAsRead(announcement.announcementId)}
                            className="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" /> Mark read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full flex-shrink-0"
                      onClick={() => dismissAnnouncement(announcement.announcementId)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}

            {/* View More Indicator */}
            {remainingCount > 0 && showViewAll && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onViewAll}
                className="w-full py-2 text-center text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                +{remainingCount} more notification{remainingCount > 1 ? "s" : ""}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
