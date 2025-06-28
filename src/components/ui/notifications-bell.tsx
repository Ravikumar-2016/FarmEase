"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, CheckCheck, Clock, User, Briefcase, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/app/hooks/use-mobile"

interface Notification {
  _id: string
  notificationId: string
  userId: string
  type: "farmer" | "labour"
  eventType: "application" | "withdrawal" | "creation" | "completion" | "cancellation"
  workId: string
  cropName: string
  workName: string
  message: string
  timestamp: string
  isRead: boolean
  relatedUserId?: string
}

interface NotificationBellProps {
  userId: string
  userType: "farmer" | "labour"
}

export function NotificationBell({ userId, userType }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const isMobile = useIsMobile()

  const fetchNotifications = useCallback(async () => {
    try {
      const limit = showAll ? 50 : 30
      const response = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}&limit=${limit}`)
      if (!response.ok) throw new Error("Failed to fetch notifications")

      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }, [userId, showAll])

  useEffect(() => {
    if (userId) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [userId, fetchNotifications])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        setShowAll(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const markAsRead = async (notificationIds?: string[]) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          notificationIds,
          markAllAsRead: !notificationIds,
        }),
      })

      if (response.ok) {
        await fetchNotifications()
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  const markAllAsRead = () => markAsRead()

  const handleClose = () => {
    setIsOpen(false)
    setShowAll(false)
  }

  const handleViewAll = () => {
    setShowAll(true)
  }

  const getNotificationIcon = (eventType: string) => {
    switch (eventType) {
      case "application":
        return <User className="h-4 w-4 text-blue-600" />
      case "withdrawal":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "creation":
        return <Briefcase className="h-4 w-4 text-green-600" />
      case "cancellation":
        return <Clock className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return diffInDays === 1 ? "Yesterday" : `${diffInDays}d ago`
    }
  }

  const groupNotificationsByDay = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {}

    notifications.forEach((notification) => {
      const date = new Date(notification.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let groupKey: string
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday"
      } else {
        groupKey = "Older"
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(notification)
    })

    return groups
  }

  const NotificationHeader = () => (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-gray-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          {isMobile && (
            <span className="text-xs text-gray-500">{userType === "farmer" ? "Farmer" : "Labour"} Account</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {unreadCount} new
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs px-2 py-1 h-auto">
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleClose} className="p-1">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )

  const NotificationList = () => {
    const groupedNotifications = groupNotificationsByDay(notifications)

    return (
      <div className="space-y-4 p-4">
        {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
          <div key={group}>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 px-1">{group}</h4>
            <div className="space-y-2">
              {groupNotifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                    notification.isRead
                      ? "bg-white border-gray-200 hover:bg-gray-50"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead([notification.notificationId])
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.eventType)}</div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-relaxed ${
                          notification.isRead ? "text-gray-700" : "text-gray-900 font-medium"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimestamp(notification.timestamp)}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">You&apos;ll see updates about your work here</p>
          </div>
        )}
      </div>
    )
  }

  const NotificationFooter = () => (
    <>
      {notifications.length > 0 && !showAll && (
        <div className="border-t bg-gray-50 p-3 sticky bottom-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm text-gray-600 hover:text-gray-900 justify-center"
            onClick={handleViewAll}
          >
            View All Notifications
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </>
  )

  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100" onClick={() => setIsOpen(true)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col">
            <NotificationHeader />
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <NotificationList />
              </ScrollArea>
            </div>
            <NotificationFooter />
          </div>
        )}
      </>
    )
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={handleClose} aria-hidden="true" />
          <div className="absolute right-0 top-full mt-2 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]">
            <NotificationHeader />
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] w-full">
                <NotificationList />
              </ScrollArea>
            </div>
            <NotificationFooter />
          </div>
        </>
      )}
    </div>
  )
}
