"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sprout,
  ArrowRight,
  Sun,
  Users,
  TrendingUp,
  Brain,
  CloudRain,
  Handshake,
  AlertTriangle,
  Info,
  CheckCircle,
  Bell,
  MapPin,
  Calendar,
  Shield,
  Tractor,
  Sparkles,
  Activity,
  BarChart3,
  X,
  Clock,
  Leaf,
  Zap,
} from "lucide-react"
import { NotificationBell } from "@/components/ui/notifications-bell"

interface Announcement {
  _id: string
  announcementId: string
  title: string
  message: string
  type: "warning" | "info" | "success" | "error"
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface UserData {
  username: string
  userType: string
  area: string
  state: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3 }
  },
}

export default function FarmerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const fetchUserData = useCallback(async (username: string) => {
    try {
      const userResponse = await fetch(`/api/weather/location?username=${encodeURIComponent(username)}`)
      if (!userResponse.ok) throw new Error("Failed to fetch user data")

      const userData = await userResponse.json()
      const userInfo = {
        username,
        userType: "farmer",
        area: userData.area,
        state: userData.state,
      }
      setUser(userInfo)
    } catch (err) {
      console.error("Error fetching user data:", err)
    }
  }, [])

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements?activeOnly=true")
      if (!response.ok) {
        throw new Error("Failed to fetch announcements")
      }
      const data = await response.json()
      const activeAnnouncements = (data.announcements || []).filter((ann: Announcement) => ann.isActive === true)
      setAnnouncements(activeAnnouncements)
    } catch (err) {
      console.error("Error fetching announcements:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "farmer") {
      router.push("/login")
      return
    }

    fetchUserData(username)
    fetchAnnouncements()
  }, [router, fetchUserData, fetchAnnouncements])

  const dismissAnnouncement = (id: string) => {
    setDismissedAnnouncements(prev => [...prev, id])
  }

  const getAnnouncementConfig = (type: string) => {
    switch (type) {
      case "success":
        return { 
          icon: CheckCircle, 
          bg: "bg-gradient-to-r from-emerald-50 to-green-50", 
          border: "border-emerald-200",
          iconColor: "text-emerald-500",
          badge: "bg-emerald-100 text-emerald-700"
        }
      case "warning":
        return { 
          icon: AlertTriangle, 
          bg: "bg-gradient-to-r from-amber-50 to-orange-50", 
          border: "border-amber-200",
          iconColor: "text-amber-500",
          badge: "bg-amber-100 text-amber-700"
        }
      case "error":
        return { 
          icon: AlertTriangle, 
          bg: "bg-gradient-to-r from-red-50 to-rose-50", 
          border: "border-red-200",
          iconColor: "text-red-500",
          badge: "bg-red-100 text-red-700"
        }
      default:
        return { 
          icon: Info, 
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50", 
          border: "border-blue-200",
          iconColor: "text-blue-500",
          badge: "bg-blue-100 text-blue-700"
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const services = [
    {
      title: "Smart Crop Advisory",
      description: "AI-powered crop recommendations based on your soil and climate",
      icon: Sprout,
      path: "/crop-services",
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 via-green-50 to-emerald-100",
      iconBg: "bg-emerald-500",
      features: ["AI Recommendations", "Fertilizer Guide", "Crop Tracking"],
      badge: "AI Powered",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Weather Intelligence",
      description: "Real-time forecasts and weather alerts for your farm",
      icon: Sun,
      path: "/weather",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 via-sky-50 to-blue-100",
      iconBg: "bg-blue-500",
      features: ["24-Hour Forecast", "5-Day Outlook", "Weather Alerts"],
      badge: "Live Data",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      title: "Labor Connect",
      description: "Find and manage farm workers in your area",
      icon: Users,
      path: "/agrobridge",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 via-purple-50 to-violet-100",
      iconBg: "bg-violet-500",
      features: ["Post Jobs", "View Applicants", "Work History"],
      badge: "Active",
      badgeColor: "bg-violet-100 text-violet-700",
    },
    {
      title: "Market Insights",
      description: "Live mandi prices from official government sources",
      icon: TrendingUp,
      path: "/market-prices",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 via-orange-50 to-amber-100",
      iconBg: "bg-amber-500",
      features: ["Live Prices", "Regional Data", "Price Trends"],
      badge: "Govt Data",
      badgeColor: "bg-amber-100 text-amber-700",
    },
    {
      title: "Disease Detection",
      description: "AI-powered plant disease identification and treatment",
      icon: Shield,
      path: "/pesticide-ai",
      gradient: "from-teal-500 to-emerald-600",
      bgGradient: "from-teal-50 via-emerald-50 to-teal-100",
      iconBg: "bg-teal-500",
      features: ["Image Analysis", "Disease ID", "Treatment Guide"],
      badge: "AI Powered",
      badgeColor: "bg-teal-100 text-teal-700",
    },
    {
      title: "Equipment Rental",
      description: "Rent farm machinery from local providers",
      icon: Tractor,
      path: "/machinery-rental",
      gradient: "from-slate-500 to-gray-600",
      bgGradient: "from-slate-50 via-gray-50 to-slate-100",
      iconBg: "bg-slate-500",
      features: ["Tractors", "Harvesters", "Local Providers"],
      badge: "Beta",
      badgeColor: "bg-slate-100 text-slate-700",
    },
  ]

  const quickActions = [
    { icon: Brain, label: "Get Crop Advice", path: "/crop-services", color: "text-emerald-600", hoverBg: "hover:bg-emerald-50" },
    { icon: CloudRain, label: "Check Weather", path: "/weather", color: "text-blue-600", hoverBg: "hover:bg-blue-50" },
    { icon: Handshake, label: "Post Work", path: "/agrobridge", color: "text-violet-600", hoverBg: "hover:bg-violet-50" },
    { icon: Shield, label: "Scan Disease", path: "/pesticide-ai", color: "text-teal-600", hoverBg: "hover:bg-teal-50" },
    { icon: BarChart3, label: "View Prices", path: "/market-prices", color: "text-amber-600", hoverBg: "hover:bg-amber-50" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your dashboard</h2>
          <p className="text-gray-500">Please wait while we fetch your data...</p>
        </motion.div>
      </div>
    )
  }

  const visibleAnnouncements = announcements.filter(a => !dismissedAnnouncements.includes(a.announcementId))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Announcements Banner */}
      <AnimatePresence>
        {visibleAnnouncements.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-100 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-800">Announcements</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  {visibleAnnouncements.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {visibleAnnouncements.slice(0, 2).map((announcement) => {
                  const config = getAnnouncementConfig(announcement.type)
                  const IconComponent = config.icon
                  return (
                    <motion.div
                      key={announcement.announcementId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`${config.bg} ${config.border} border rounded-xl p-4 flex items-start gap-3`}
                    >
                      <IconComponent className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{announcement.title}</span>
                          <Badge className={`${config.badge} text-xs`}>
                            {announcement.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{announcement.message}</p>
                        <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(announcement.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => dismissAnnouncement(announcement.announcementId)}
                        className="p-1 hover:bg-gray-200/50 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Hero Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {getGreeting()}, <span className="text-emerald-600">{user?.username}</span>
                </h1>
                <div className="flex items-center gap-3 mt-1 text-gray-500">
                  {user && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.area}, {user.state}
                    </span>
                  )}
                  <span className="hidden sm:flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="flex items-center gap-3">
              {user && <NotificationBell userId={user.username} userType="farmer" />}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div variants={itemVariants} className="mb-10">
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(action.path)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 bg-white ${action.hoverBg} transition-all duration-200 group`}
                  >
                    <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors`}>
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Grid */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Farm Services</h2>
              <p className="text-gray-500 text-sm mt-1">Everything you need to manage your farm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <motion.div
                  key={service.title}
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="cursor-pointer"
                  onClick={() => router.push(service.path)}
                >
                  <Card className={`h-full border-0 shadow-lg bg-gradient-to-br ${service.bgGradient} overflow-hidden relative group`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-current"></div>
                      <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-current"></div>
                    </div>

                    <CardContent className="p-6 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${service.iconBg} shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={`${service.badgeColor} font-medium`}>
                          {service.badge}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-white/60 text-gray-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <Button
                        className={`w-full bg-gradient-to-r ${service.gradient} text-white shadow-md hover:shadow-lg transition-all duration-200`}
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(service.path)
                        }}
                      >
                        <span>Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')]"></div>
            </div>
            <CardContent className="p-6 lg:p-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Brain className="h-5 w-5" />
                    </div>
                    <span className="text-emerald-100 text-sm font-medium">AI Technology</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-1">Smart Recommendations</h3>
                  <p className="text-emerald-100 text-sm">Powered by advanced machine learning</p>
                </div>
                <div className="text-center border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Activity className="h-5 w-5" />
                    </div>
                    <span className="text-emerald-100 text-sm font-medium">Real-Time</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-1">Live Updates</h3>
                  <p className="text-emerald-100 text-sm">Weather, prices & opportunities</p>
                </div>
                <div className="text-center border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-emerald-100 text-sm font-medium">Community</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-1">Connected Network</h3>
                  <p className="text-emerald-100 text-sm">Farmers, laborers & providers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}