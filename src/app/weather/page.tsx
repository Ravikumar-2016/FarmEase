"use client"

import type React from "react"
import Image from "next/image"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

interface WeatherData {
  source?: string
  current: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    uvi: number
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
  }
}

interface LocationData {
  area: string
  zipcode: string
  state: string
}

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

    if (userType !== "farmer" && userType !== "admin") {
      router.push("/login")
      return
    }

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
      "bg-blue-50 border-blue-100", // Day 1 - Light blue
      "bg-green-50 border-green-100", // Day 2 - Light green
      "bg-purple-50 border-purple-100", // Day 3 - Light purple
      "bg-orange-50 border-orange-100", // Day 4 - Light orange
      "bg-pink-50 border-pink-100", // Day 5 - Light pink
    ]
    return backgrounds[index % backgrounds.length]
  }

  if (loading) {
  return (
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
          <h3 className="text-lg font-semibold text-gray-800">
            Fetching Weather Data
          </h3>
          <p className="text-gray-500 text-sm">
            Gathering forecast for your location...
          </p>
        </div>

        {/* Animated Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full animate-progress"
            style={{ width: '0%' }}
          />
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
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors px-2 py-1 h-8"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="text-xs font-medium">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <Sun className="h-4 w-4 text-blue-600" />
                </div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Weather</h1>
              </div>

              {user && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-full text-xs"
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
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Dashboard</span>
              </Button>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                    <Sun className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Weather Forecast</h1>
                    <p className="text-gray-600">Real-time weather updates</p>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex flex-col items-end">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm"
                  >
                    Welcome, {user.username}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{user.userType} Account</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-3 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by city name (e.g., Delhi, Mumbai, Bangalore)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={handleRefresh} disabled={loading} className="border-gray-200">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Smart Suggestions */}
          {weatherData && getSmartSuggestions().length > 0 && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  Farming Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getSmartSuggestions().map((suggestion, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/70">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {weatherData && (
            <>
              {/* Current Weather */}
              <Card className="shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm opacity-90">
                        {weatherData.location?.name ||
                          (locationData ? `${locationData.area}, ${locationData.state}` : "Current Location")}
                        {weatherData.location?.region && `, ${weatherData.location.region}`}
                      </span>
                    </div>
                    <span className="text-sm opacity-90">Now</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-6xl font-bold mb-2">{Math.round(weatherData.current.temp)}°C</div>
                      <div className="text-lg opacity-90 capitalize mb-1">
                        {weatherData.current.weather[0].description}
                      </div>
                      <div className="text-sm opacity-75">
                        Feels like {Math.round(weatherData.current.feels_like)}°C
                      </div>
                      <div className="text-sm opacity-75 mt-2">
                        High: {Math.round(weatherData.daily[0]?.temp.max || weatherData.current.temp)}° • Low:{" "}
                        {Math.round(weatherData.daily[0]?.temp.min || weatherData.current.temp)}°
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-center">
                      {renderWeatherIcon(
                        weatherData.current.weather[0].icon,
                        weatherData.current.weather[0].description,
                        "h-16 w-16",
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Conditions */}
              <Card className="shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Current Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Wind */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Wind</span>
                        <Wind className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {Math.round(weatherData.current.wind_speed)} m/s
                      </div>
                      <div className="text-sm text-gray-600">
                        {weatherData.current.wind_dir ||
                          (weatherData.current.wind_deg ? getWindDirection(weatherData.current.wind_deg) : "Variable")}
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Humidity</span>
                        <Droplets className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{weatherData.current.humidity}%</div>
                      <div className="text-sm text-gray-600">{getHumidityLevel(weatherData.current.humidity)}</div>
                    </div>

                    {/* Pressure */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Pressure</span>
                        <Gauge className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {Math.round(weatherData.current.pressure)}
                      </div>
                      <div className="text-sm text-gray-600">hPa</div>
                    </div>

                    {/* UV Index */}
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">UV Index</span>
                        <Sun className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {Math.round(weatherData.current.uvi || 0)}
                      </div>
                      <div className={`text-sm ${getUVLevel(weatherData.current.uvi || 0).color}`}>
                        {getUVLevel(weatherData.current.uvi || 0).level}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sunrise & Sunset */}
              <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Sunrise className="h-5 w-5 text-orange-600" />
                    Sunrise & Sunset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Sunrise className="h-6 w-6 text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-600">Sunrise</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatTime(weatherData.current.sunrise)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sunset className="h-6 w-6 text-pink-500" />
                      <div>
                        <div className="text-sm text-gray-600">Sunset</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatTime(weatherData.current.sunset)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next 24 Hours Forecast */}
              <Card className="bg-indigo-50 border-indigo-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Thermometer className="h-5 w-5 text-orange-600" />
                    Next 24 Hours Forecast
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 pb-2 min-w-max">
                      {getNext24Hours().map((hour, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center min-w-[80px] p-3 rounded-lg bg-white border border-indigo-100 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="text-xs text-gray-600 mb-2 font-medium">
                            {index === 0 ? "Now" : formatTime(hour.dt)}
                          </div>
                          <div className="mb-2">
                            {renderWeatherIcon(hour.weather[0].icon, hour.weather[0].description, "h-6 w-6")}
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1">{Math.round(hour.temp)}°</div>
                          {hour.pop > 0 && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Umbrella className="h-3 w-3" />
                              {Math.round(hour.pop * 100)}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Eye className="h-5 w-5 text-blue-600" />
                    5-Day Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherData.daily.slice(0, 5).map((day, index) => (
                      <div key={index} className={`rounded-lg border overflow-hidden ${getDayCardBackground(index)}`}>
                        <div
                          className="flex items-center p-4 hover:bg-white/50 transition-colors cursor-pointer min-h-[80px]"
                          onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                        >
                          {/* Left side - Date and Weather with fixed width */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-24 sm:w-32 flex-shrink-0">
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                {formatShortDate(day.dt)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 leading-tight break-words">
                                {day.weather[0].description}
                              </div>
                            </div>

                            {/* Weather Icon - fixed size */}
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                              {renderWeatherIcon(day.weather[0].icon, day.weather[0].description, "h-8 w-8")}
                            </div>
                          </div>

                          {/* Right side - Temperature and Controls with fixed layout */}
                          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            {/* Precipitation - hidden on very small screens */}
                            {day.pop > 0 && (
                              <div className="hidden sm:flex items-center gap-1 text-blue-600 w-12 justify-center">
                                <Umbrella className="h-3 w-3" />
                                <span className="text-xs">{Math.round(day.pop * 100)}%</span>
                              </div>
                            )}

                            {/* Temperature - fixed width */}
                            <div className="text-right w-16 sm:w-20">
                              <div className="flex items-center justify-end gap-1">
                                <span className="font-bold text-lg text-gray-900">{Math.round(day.temp.max)}°</span>
                                <span className="text-gray-500 text-sm">/{Math.round(day.temp.min)}°</span>
                              </div>
                              {/* Mobile precipitation */}
                              {day.pop > 0 && (
                                <div className="sm:hidden flex items-center justify-end gap-1 text-xs text-blue-600 mt-1">
                                  <Umbrella className="h-3 w-3" />
                                  {Math.round(day.pop * 100)}%
                                </div>
                              )}
                            </div>

                            {/* Expand button - fixed size */}
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
                            <div className="flex items-center gap-2">
                              <Sunrise className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Sunrise</div>
                                <div className="font-semibold text-gray-900 truncate">{formatTime(day.sunrise)}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sunset className="h-4 w-4 text-pink-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs text-gray-600">Sunset</div>
                                <div className="font-semibold text-gray-900 truncate">{formatTime(day.sunset)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Hourly Details - Only show if expanded */}
                          {expandedDay === index && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <h4 className="font-semibold mb-3 text-gray-900">Hourly Temperature Details</h4>
                              <div className="overflow-x-auto">
                                <div className="flex gap-2 pb-2 min-w-max">
                                  {getDayHourlyData(index).map((hour, hourIndex) => (
                                    <div
                                      key={hourIndex}
                                      className="flex flex-col items-center min-w-[70px] p-2 rounded-lg bg-white border border-gray-100"
                                    >
                                      <div className="text-xs text-gray-600 mb-1">{formatTime(hour.dt)}</div>
                                      {renderWeatherIcon(
                                        Array.isArray(hour.weather) ? hour.weather[0]?.icon : hour.weather.icon,
                                        Array.isArray(hour.weather)
                                          ? hour.weather[0]?.description
                                          : hour.weather.description,
                                        "h-5 w-5",
                                      )}
                                      <div className="font-semibold text-sm text-gray-900 mt-1">
                                        {Math.round(hour.temp)}°
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
