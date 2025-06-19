export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeather {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  weather: WeatherCondition[]
}

export interface HourlyWeather {
  dt: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  weather: WeatherCondition[]
  pop: number
}

export interface DailyWeather {
  dt: number
  sunrise: number
  sunset: number
  moonrise: number
  moonset: number
  moon_phase: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  weather: WeatherCondition[]
  clouds: number
  pop: number
  uvi: number
}

export interface WeatherAlert {
  sender_name: string
  event: string
  start: number
  end: number
  description: string
  tags: string[]
}

export interface WeatherResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: CurrentWeather
  hourly: HourlyWeather[]
  daily: DailyWeather[]
  alerts?: WeatherAlert[]
}

export const getWeatherIconUrl = (icon: string, size: "2x" | "4x" = "2x") => {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`
}

export const getUVIndexLevel = (uvi: number): { level: string; color: string } => {
  if (uvi <= 2) return { level: "Low", color: "text-green-600" }
  if (uvi <= 5) return { level: "Moderate", color: "text-yellow-600" }
  if (uvi <= 7) return { level: "High", color: "text-orange-600" }
  if (uvi <= 10) return { level: "Very High", color: "text-red-600" }
  return { level: "Extreme", color: "text-purple-600" }
}

export const getWindDirection = (degrees: number): string => {
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

export const formatTemperature = (temp: number, unit: "C" | "F" = "F"): string => {
  return `${Math.round(temp)}°${unit}`
}

export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`
}

export const formatWindSpeed = (speed: number, unit: "mph" | "kmh" = "mph"): string => {
  if (unit === "kmh") {
    return `${Math.round(speed * 3.6)} km/h`
  }
  return `${Math.round(speed)} mph`
}

export const getWeatherAdvice = (weather: CurrentWeather): string[] => {
  const advice: string[] = []

  // Temperature advice
  if (weather.temp > 85) {
    advice.push("🌡️ Very hot weather - ensure adequate irrigation and shade for crops")
  } else if (weather.temp < 32) {
    advice.push("❄️ Freezing temperatures - protect sensitive crops from frost")
  }

  // Rain advice
  const rainCondition = weather.weather[0].main.toLowerCase()
  if (rainCondition.includes("rain")) {
    advice.push("🌧️ Rainy conditions - good for soil moisture but monitor for waterlogging")
  } else if (weather.humidity < 30) {
    advice.push("🏜️ Low humidity - increase irrigation frequency")
  }

  // Wind advice
  if (weather.wind_speed > 15) {
    advice.push("💨 Strong winds - secure loose structures and check for crop damage")
  }

  // UV advice
  if (weather.uvi > 8) {
    advice.push("☀️ High UV levels - good for photosynthesis but ensure adequate water supply")
  }

  return advice
}
