"use client"

import type React from "react"
import Image from "next/image"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  MapPin,
  Search,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Umbrella,
  Cloud,
  CloudRain,
  Snowflake,
  Zap,
  Sparkles,
} from "lucide-react"

interface WeatherData {
  source?: string
  timezone?: string | number | null
  current: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    uvi?: number;
    wind_speed: number
    wind_deg?: number
    wind_dir?: string
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    sunrise: number
    sunset: number
    sunrise_time?: string // Formatted time string
    sunset_time?: string // Formatted time string
  }
  hourly: Array<{
    dt: number
    temp: number
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    pop: number
    humidity: number
    wind_speed: number
    wind_deg?: number
    uv?: number
  }>
  daily: Array<{
    dt: number
    temp: {
      min: number
      max: number
    }
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    pop: number
    humidity: number
    wind_speed: number
    sunrise: number
    sunset: number
    sunrise_time?: string // Formatted time string
    sunset_time?: string // Formatted time string
    sunrise_utc?: boolean // Flag to indicate if time is in UTC
    sunset_utc?: boolean // Flag to indicate if time is in UTC
    sunrise_estimated?: boolean // Flag to indicate if time is estimated
    sunset_estimated?: boolean // Flag to indicate if time is estimated
    uv?: number
    source?: string
    hourly?: Array<{
      dt: number
      temp: number
      weather: {
        main: string
        description: string
        icon: string
      }
      pop: number
      humidity: number
      wind_speed: number
    }>
  }>
  location?: {
    name: string
    country: string
    region?: string
    timezone?: string
  }
}

interface LocationData {
  area: string
  zipcode: string
  state: string
}

// Add this right after your imports but before the main component
const WeatherLoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-6 max-w-md px-4">
      {/* Animated Weather Illustration */}
      <div className="relative w-40 h-40">
        {/* Sun */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-yellow-300 rounded-full shadow-lg animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-2 bg-yellow-400 rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateX(24px)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Cloud */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-32 h-12 bg-white rounded-full shadow-md" />
            <div className="absolute -top-4 left-4 w-10 h-10 bg-white rounded-full" />
            <div className="absolute -top-4 right-4 w-8 h-8 bg-white rounded-full" />
            {/* Falling rain animation */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-1 h-6 bg-blue-300 rounded-full animate-rain"
                style={{
                  left: `${10 + i * 20}px`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Fetching Weather Data</h3>
        <p className="text-gray-500 text-sm">Gathering forecast for your location...</p>
      </div>

      {/* Animated Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full animate-progress" style={{ width: "0%" }} />
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes rain {
          0% { transform: translateY(0) scaleY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40px) scaleY(1); opacity: 0; }
        }
        .animate-rain {
          animation: rain 1.5s linear infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  </div>
);

export default function WeatherPage() {
  const router = useRouter()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [user, setUser] = useState<{ username: string; userType: string } | null>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [fallbackIcon, setFallbackIcon] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username) {
      router.push("/login")
      return
    }

    // if (userType !== "farmer" && userType !== "admin") {
    //   router.push("/login")
    //   return
    // }

    setUser({ username, userType })
    fetchUserLocationAndWeather(username)
  }, [router])

  const fetchUserLocationAndWeather = async (username: string) => {
    try {
      setLoading(true)
      setError(null)
      setWeatherData(null)
      setFallbackIcon({})

      const locationResponse = await fetch(`/api/weather/location?username=${encodeURIComponent(username)}`)
      if (!locationResponse.ok) {
        const errorData = await locationResponse.json()
        throw new Error(errorData.error || "Failed to fetch location data")
      }

      const location = await locationResponse.json()
      setLocationData(location)

      let weatherResponse = await fetch(`/api/weather/forecast?query=${encodeURIComponent(location.area)}`)

      if (!weatherResponse.ok && location.zipcode) {
        weatherResponse = await fetch(`/api/weather/forecast?zipcode=${location.zipcode}`)
      }

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json()
        if (errorData.noData) {
          setError(errorData.error)
          return
        }
        throw new Error(errorData.error || "Failed to fetch weather data")
      }

      const weather = await weatherResponse.json()
      setWeatherData(weather)
    } catch (err) {
      console.error("Weather fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      setError(null)
      setWeatherData(null)
      setFallbackIcon({})
      setExpandedDay(null)

      const response = await fetch(`/api/weather/forecast?query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.noData) {
          setError(errorData.error)
          return
        }
        throw new Error(errorData.error || "Failed to fetch weather data for the searched location")
      }

      const weather = await response.json()
      setWeatherData(weather)
      setLocationData({
        area: weather.location?.name || searchQuery,
        zipcode: "",
        state: weather.location?.region || "",
      })
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setIsSearching(false)
    }
  }

  const handleRefresh = () => {
    if (user) {
      setExpandedDay(null)
      fetchUserLocationAndWeather(user.username)
    }
  }

  const handleImageError = (iconUrl: string) => {
    setFallbackIcon((prev) => ({ ...prev, [iconUrl]: true }))
  }

  const getWeatherIcon = (iconCode: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-16 w-16",
    }

    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      "01d": Sun,
      "01n": Sun,
      "02d": Cloud,
      "02n": Cloud,
      "03d": Cloud,
      "03n": Cloud,
      "04d": Cloud,
      "04n": Cloud,
      "09d": CloudRain,
      "09n": CloudRain,
      "10d": CloudRain,
      "10n": CloudRain,
      "11d": Zap,
      "11n": Zap,
      "13d": Snowflake,
      "13n": Snowflake,
      "50d": Cloud,
      "50n": Cloud,
    }

    let code = iconCode
    if (iconCode.includes("openweathermap.org")) {
      const match = iconCode.match(/\/([^/]+)@2x\.png$/)
      code = match ? match[1] : "01d"
    }

    const IconComponent = iconMap[code] || Cloud
    const colorClass = code.includes("01")
      ? "text-yellow-500"
      : code.includes("09") || code.includes("10")
        ? "text-blue-500"
        : code.includes("11")
          ? "text-purple-500"
          : code.includes("13")
            ? "text-blue-200"
            : "text-gray-500"

    return <IconComponent className={`${sizeClasses[size]} ${colorClass}`} />
  }

  const renderWeatherIcon = (iconUrl: string, description: string, size = "h-8 w-8") => {
    if (fallbackIcon[iconUrl]) {
      if (iconUrl.includes("openweathermap.org")) {
        const match = iconUrl.match(/\/([^/]+)@2x\.png$/)
        const code = match ? match[1] : "01d"
        return getWeatherIcon(code, "md")
      }

      const condition = iconUrl.toLowerCase()
      if (condition.includes("sunny") || condition.includes("clear")) {
        return <Sun className={`${size} text-yellow-500`} />
      } else if (condition.includes("rain")) {
        return <CloudRain className={`${size} text-blue-500`} />
      } else if (condition.includes("snow")) {
        return <Snowflake className={`${size} text-blue-200`} />
      } else if (condition.includes("thunder")) {
        return <Zap className={`${size} text-purple-500`} />
      } else {
        return <Cloud className={`${size} text-gray-500`} />
      }
    }

    return (
      <Image
        src={iconUrl || "/placeholder.svg"}
        alt={description}
        width={32}
        height={32}
        className={size}
        onError={() => handleImageError(iconUrl)}
        unoptimized
      />
    )
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
  }

  const formatShortDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const getWindDirection = (degrees: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  const getUVLevel = (uvi: number) => {
    if (uvi <= 2) return { level: "Low", color: "text-green-600" }
    if (uvi <= 5) return { level: "Moderate", color: "text-yellow-600" }
    if (uvi <= 7) return { level: "High", color: "text-orange-600" }
    if (uvi <= 10) return { level: "Very High", color: "text-red-600" }
    return { level: "Extreme", color: "text-purple-600" }
  }

  const getHumidityLevel = (humidity: number) => {
    if (humidity <= 30) return "Low"
    if (humidity <= 60) return "Moderate"
    return "High"
  }

  const getSmartSuggestions = () => {
    if (!weatherData) return []

    const suggestions = []
    const current = weatherData.current

    if (current.weather[0].main.toLowerCase().includes("rain")) {
      suggestions.push("🌧️ Rainy weather - good for soil moisture!")
    }

    if (current.temp > 35) {
      suggestions.push("🌡️ Very hot weather - ensure adequate irrigation!")
    }

    if (current.wind_speed > 5) {
      suggestions.push("💨 Windy conditions - check crop support structures!")
    }

    if (current.temp < 10) {
      suggestions.push("❄️ Cold weather - protect sensitive crops!")
    }

    if (current.humidity > 80) {
      suggestions.push("💧 High humidity - monitor for fungal diseases!")
    }

    if (current.weather[0].main.toLowerCase().includes("clear")) {
      suggestions.push("☀️ Clear skies - perfect for outdoor farm work!")
    }

    return suggestions
  }

  const getDayHourlyData = (dayIndex: number) => {
    if (!weatherData) return []

    const day = weatherData.daily[dayIndex]

    if (day.hourly && day.hourly.length > 0) {
      return day.hourly
    }

    const dayStart = day.dt
    const dayEnd = dayStart + 24 * 60 * 60

    return weatherData.hourly.filter((hour) => hour.dt >= dayStart && hour.dt < dayEnd)
  }

  const getNext24Hours = () => {
    if (!weatherData) return []

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59)

    return weatherData.hourly
      .filter((hour) => {
        const hourDate = new Date(hour.dt * 1000)
        return hourDate <= tomorrow
      })
      .slice(0, 24)
  }

  // Get distinct background colors for each day card
  const getDayCardBackground = (index: number) => {
    const backgrounds = [
      "bg-sky-100 border-sky-300", // Day 1 - Soothing blue
      "bg-emerald-100 border-emerald-300", // Day 2 - Fresh green
      "bg-indigo-100 border-indigo-300", // Day 3 - Soft purple
      "bg-amber-100 border-amber-300", // Day 4 - Warm orange
      "bg-rose-100 border-rose-300", // Day 5 - Gentle pink
    ]
    return backgrounds[index % backgrounds.length]
  }

  // Helper function to render sunrise/sunset time with UTC or estimated badge if needed
  const renderSunTime = (
    time: string | undefined,
    isUTC: boolean | undefined,
    isEstimated: boolean | undefined,
    icon: React.ReactNode,
    isMobile = false,
  ) => {
    if (!time) return null

    const showBadge = isUTC || isEstimated
    const badgeText = isEstimated ? "EST" : "UTC"
    const badgeColor = isEstimated ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"

    return (
      <div className="flex items-center gap-2">
        {icon}
        <div className="min-w-0 flex-1">
          <div className={`font-semibold text-gray-900 ${isMobile ? "flex flex-col" : "flex items-center gap-1"}`}>
            <span className="truncate">{time}</span>
            {showBadge && (
              <Badge
                variant="secondary"
                className={`${badgeColor} text-xs px-1 py-0 h-4 ${isMobile ? "self-start mt-0.5" : ""}`}
              >
                {badgeText}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading || isSearching) {
  return <WeatherLoadingScreen />;
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
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const cardHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <motion.div 
        className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(user?.userType === "labour" ? "/dashboard/labour" : "/dashboard/farmer")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors px-2 py-1 h-8"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="text-xs font-medium">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                <motion.div 
                  className="p-1.5 bg-gradient-to-br from-blue-100 to-sky-200 rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sun className="h-4 w-4 text-blue-600" />
                </motion.div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent leading-tight">
                  Weather
                </h1>
              </div>

              {user && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-full text-xs shadow-sm"
                >
                  {user.username}
                </Badge>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Real-time weather updates</p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block px-8 py-6">
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ x: -5 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push(user?.userType === "labour" ? "/dashboard/labour" : "/dashboard/farmer")}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-medium">Back to Dashboard</span>
                </Button>
              </motion.div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-blue-100 to-sky-200 rounded-xl shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sun className="h-8 w-8 text-blue-600" />
                  </motion.div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent mb-1">
                      Weather Forecast
                    </h1>
                    <p className="text-gray-600">Real-time weather updates</p>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex flex-col items-end">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-100 to-sky-200 text-blue-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm"
                  >
                    Welcome, {user.username}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{user.userType} Account</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-3 sm:px-6 lg:px-8">
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Search Bar */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by city name (e.g., Delhi, Mumbai, Bangalore)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching} className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-md">
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" onClick={handleRefresh} disabled={loading} className="border-gray-200 hover:bg-blue-50 hover:border-blue-300">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive" className="shadow-md">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Suggestions */}
          {weatherData && getSmartSuggestions().length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-0 shadow-xl overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 font-medium text-slate-800">
                    <motion.div
                      className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="h-5 w-5 text-white" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Farming Suggestions
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {getSmartSuggestions().map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge
                          className="bg-white border border-amber-200/80 text-slate-700 hover:bg-amber-50/90 hover:text-amber-700 transition-colors shadow-sm py-1.5 px-3"
                        >
                          {suggestion}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {weatherData && (
            <>
              {/* Current Weather */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-2xl bg-gradient-to-br from-sky-100 via-white to-blue-50 border-0 overflow-hidden relative">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-sky-200/30 rounded-full blur-3xl" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-sky-100 rounded-lg">
                          <MapPin className="h-4 w-4 text-sky-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {weatherData.location?.name ||
                            (locationData ? `${locationData.area}, ${locationData.state}` : "Current Location")}
                          {weatherData.location?.region && `, ${weatherData.location.region}`}
                        </span>
                      </div>
                      <Badge className="bg-sky-100 text-sky-700 border-sky-200 shadow-sm">Now</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <motion.div 
                          className="text-6xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, type: "spring" }}
                        >
                          {Math.round(weatherData.current.temp)}°C
                        </motion.div>
                        <div className="text-lg font-medium text-gray-700 capitalize mb-1">
                          {weatherData.current.weather[0].description}
                        </div>
                        <div className="text-sm text-gray-600">
                          Feels like {Math.round(weatherData.current.feels_like)}°C
                        </div>
                        <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-50 rounded-lg text-red-600 font-medium">
                            H: {Math.round(weatherData.daily[0]?.temp.max || weatherData.current.temp)}°
                          </span>
                          <span className="px-2 py-1 bg-blue-50 rounded-lg text-blue-600 font-medium">
                            L: {Math.round(weatherData.daily[0]?.temp.min || weatherData.current.temp)}°
                          </span>
                        </div>
                      </div>
                      <motion.div 
                        className="text-right flex flex-col items-center"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {renderWeatherIcon(
                          weatherData.current.weather[0].icon,
                          weatherData.current.weather[0].description,
                          "h-24 w-24 text-sky-500 drop-shadow-lg",
                        )}
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sunrise & Sunset */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-r from-orange-50 via-pink-50 to-rose-50 border-0 shadow-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Sunrise className="h-5 w-5 text-white" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        Sunrise & Sunset
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <motion.div 
                        className="flex items-center gap-3 p-4 bg-white/60 rounded-xl shadow-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="p-2 bg-orange-100 rounded-xl">
                          <Sunrise className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Sunrise</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {weatherData.current.sunrise_time || formatTime(weatherData.current.sunrise)}
                          </div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-3 p-4 bg-white/60 rounded-xl shadow-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="p-2 bg-pink-100 rounded-xl">
                          <Sunset className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Sunset</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {weatherData.current.sunset_time || formatTime(weatherData.current.sunset)}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Next 24 Hours Forecast */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-0 shadow-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Thermometer className="h-5 w-5 text-white" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Next 24 Hours Forecast
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="flex gap-3 pb-2 min-w-max">
                        {getNext24Hours().map((hour, index) => (
                          <motion.div
                            key={index}
                            className="flex flex-col items-center min-w-[80px] p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-indigo-100 hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                          >
                            <div className="text-xs text-gray-600 mb-2 font-medium">
                              {index === 0 ? "Now" : formatTime(hour.dt)}
                            </div>
                            <div className="mb-2">
                              {renderWeatherIcon(hour.weather[0].icon, hour.weather[0].description, "h-14 w-14")}
                            </div>
                            <div className="text-lg font-bold text-gray-900 mb-1">{Math.round(hour.temp)}°</div>
                            {hour.pop > 0 && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                <Umbrella className="h-3 w-3" />
                                {Math.round(hour.pop * 100)}%
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 5-Day Forecast */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-0 shadow-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Eye className="h-5 w-5 text-white" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {`${weatherData.daily.length}-Day Weather Forecast`}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weatherData.daily.slice(0, 5).map((day, index) => (
                        <motion.div 
                          key={index} 
                          className={`rounded-xl border-2 overflow-hidden ${getDayCardBackground(index)} hover:shadow-lg transition-all`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                        <div
                          className="flex items-center p-4 hover:bg-white/50 transition-colors cursor-pointer min-h-[80px]"
                          onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                        >
                          {/* Left side - Date and Weather */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-24 sm:w-32 flex-shrink-0">
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                {formatShortDate(day.dt)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                                {day.weather[0].description}
                              </div>
                            </div>

                            {/* Weather Icon */}
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                              {renderWeatherIcon(day.weather[0].icon, day.weather[0].description, "h-14 w-14")}
                            </div>
                          </div>

                          {/* Right side - Temperature and Controls */}
                          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            {/* Precipitation - consistent umbrella size */}
                            {day.pop > 0 && (
                              <div className="hidden sm:flex items-center gap-1 text-blue-600 w-12 justify-center">
                                <Umbrella className="h-10 w-10" />
                                <span className="text-xs">{Math.round(day.pop * 100)}%</span>
                              </div>
                            )}

                            {/* Temperature */}
                            <div className="text-right w-16 sm:w-20">
                              <div className="flex items-center justify-end gap-1">
                                <span className="font-bold text-lg text-gray-900">{Math.round(day.temp.max)}°</span>
                                <span className="text-gray-500 text-sm">/{Math.round(day.temp.min)}°</span>
                              </div>
                              {/* Mobile precipitation - same umbrella size */}
                              {day.pop > 0 && (
                                <div className="sm:hidden flex items-center justify-end gap-1 text-xs text-blue-600 mt-1">
                                  <Umbrella className="h-10 w-10" />
                                  {Math.round(day.pop * 100)}%
                                </div>
                              )}
                            </div>

                            {/* Expand button */}
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                              {expandedDay === index ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Daily Summary - Always visible */}
                        <div className="border-t bg-white/60 p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Max Wind</div>
                                <div className="font-semibold text-gray-900 truncate">
                                  {Math.round(day.wind_speed)} m/s
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Humidity</div>
                                <div className="font-semibold text-gray-900 truncate">{day.humidity}%</div>
                              </div>
                            </div>

                            {/* Mobile-optimized sunrise/sunset layout */}
                            <div className="md:hidden col-span-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Sunrise</div>
                                  {renderSunTime(
                                    day.sunrise_time,
                                    day.sunrise_utc,
                                    day.sunrise_estimated,
                                    <Sunrise className="h-4 w-4 text-orange-600 flex-shrink-0" />,
                                    true,
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Sunset</div>
                                  {renderSunTime(
                                    day.sunset_time,
                                    day.sunset_utc,
                                    day.sunset_estimated,
                                    <Sunset className="h-4 w-4 text-pink-600 flex-shrink-0" />,
                                    true,
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Desktop sunrise/sunset layout */}
                            <div className="hidden md:flex items-center gap-2">
                              <Sunrise className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Sunrise</div>
                                {renderSunTime(day.sunrise_time, day.sunrise_utc, day.sunrise_estimated, null)}
                              </div>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                              <Sunset className="h-4 w-4 text-pink-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Sunset</div>
                                {renderSunTime(day.sunset_time, day.sunset_utc, day.sunset_estimated, null)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hourly Details - Only show if expanded */}
                        <AnimatePresence>
                          {expandedDay === index && (
                            <motion.div 
                              className="mt-6 pt-4 border-t border-gray-200"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <h4 className="font-semibold mb-3 text-gray-900">Temperature Details</h4>
                              <div className="overflow-x-auto">
                                <div className="flex gap-2 pb-2 min-w-max">
                                  {getDayHourlyData(index).map((hour, hourIndex) => (
                                    <motion.div
                                      key={hourIndex}
                                      className="flex flex-col items-center min-w-[70px] p-2 rounded-xl bg-white/80 border border-gray-100 hover:shadow-md transition-all"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: hourIndex * 0.05 }}
                                    >
                                      <div className="text-xs text-gray-600 mb-1">{formatTime(hour.dt)}</div>
                                      {renderWeatherIcon(
                                        Array.isArray(hour.weather) ? hour.weather[0]?.icon : hour.weather.icon,
                                        Array.isArray(hour.weather)
                                          ? hour.weather[0]?.description
                                          : hour.weather.description,
                                        "h-14 w-14",
                                      )}
                                      <div className="font-semibold text-sm text-gray-900 mt-1">
                                        {Math.round(hour.temp)}°
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </motion.div>
                      ))}

                    {/* Show UTC note if any times are UTC */}
                    {weatherData.daily.some(
                      (day) => day.sunrise_utc || day.sunset_utc || day.sunrise_estimated || day.sunset_estimated,
                    ) && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-amber-800">
                            <span className="font-medium">Note:</span> Times marked with 
                            <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs px-1 py-0 h-4 mx-1">
                              EST
                            </Badge>
                             are approximate estimations, derived from typical daily sunrise and sunset drift patterns, based on analysis using data from OpenWeatherMap.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              </motion.div>

              {/* Current Conditions */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-slate-50 via-white to-gray-50 border-0 shadow-xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Gauge className="h-5 w-5 text-white" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                        Current Conditions
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Wind */}
                      <motion.div 
                        className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50 shadow-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Wind</span>
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Wind className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {Math.round(weatherData.current.wind_speed)} m/s
                        </div>
                        <div className="text-sm text-gray-600">
                          {weatherData.current.wind_dir ||
                            (weatherData.current.wind_deg ? getWindDirection(weatherData.current.wind_deg) : "Variable")}
                        </div>
                      </motion.div>

                      {/* Humidity */}
                      <motion.div 
                        className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl p-4 border border-cyan-200/50 shadow-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Humidity</span>
                          <div className="p-2 bg-cyan-100 rounded-lg">
                            <Droplets className="h-5 w-5 text-cyan-600" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{weatherData.current.humidity}%</div>
                        <div className="text-sm text-gray-600">{getHumidityLevel(weatherData.current.humidity)}</div>
                      </motion.div>

                      {/* Pressure */}
                      <motion.div 
                        className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50 shadow-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Pressure</span>
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Gauge className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {Math.round(weatherData.current.pressure)}
                        </div>
                        <div className="text-sm text-gray-600">hPa</div>
                      </motion.div>

                      {/* UV Index */}
                      <motion.div 
                        className="bg-gradient-to-br from-yellow-50 to-amber-100/50 rounded-xl p-4 border border-yellow-200/50 shadow-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">UV Index</span>
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Sun className="h-5 w-5 text-yellow-600" />
                          </div>
                        </div>
                        {weatherData.current.uvi !== undefined ? (
                          <>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {Math.round(weatherData.current.uvi)}
                            </div>
                            <div className={`text-sm ${getUVLevel(weatherData.current.uvi).color}`}>
                              {getUVLevel(weatherData.current.uvi).level}
                            </div>
                          </>
                        ) : (
                          <div className="group relative">
                            <div className="text-2xl font-bold text-gray-900 mb-1">N/A</div>
                            <div className="text-sm text-gray-600">Not available</div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}
