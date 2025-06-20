import { type NextRequest, NextResponse } from "next/server"

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

interface WeatherCondition {
  text: string
  icon: string
  code: number
}

interface WeatherAPIHour {
  time_epoch: number
  time: string
  temp_c: number
  temp_f: number
  is_day: number
  condition: WeatherCondition
  wind_mph: number
  wind_kph: number
  wind_degree: number
  wind_dir: string
  pressure_mb: number
  pressure_in: number
  precip_mm: number
  precip_in: number
  humidity: number
  cloud: number
  feelslike_c: number
  feelslike_f: number
  windchill_c: number
  windchill_f: number
  heatindex_c: number
  heatindex_f: number
  dewpoint_c: number
  dewpoint_f: number
  will_it_rain: number
  chance_of_rain: number
  will_it_snow: number
  chance_of_snow: number
  vis_km: number
  vis_miles: number
  gust_mph: number
  gust_kph: number
  uv: number
}

interface WeatherAPIDay {
  maxtemp_c: number
  maxtemp_f: number
  mintemp_c: number
  mintemp_f: number
  avgtemp_c: number
  avgtemp_f: number
  maxwind_mph: number
  maxwind_kph: number
  totalprecip_mm: number
  totalprecip_in: number
  totalsnow_cm: number
  avgvis_km: number
  avgvis_miles: number
  avghumidity: number
  daily_will_it_rain: number
  daily_chance_of_rain: number
  daily_will_it_snow: number
  daily_chance_of_snow: number
  condition: WeatherCondition
  uv: number
}

interface WeatherAPIAstro {
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
  moon_phase: string
  moon_illumination: string
  is_moon_up: number
  is_sun_up: number
}

interface WeatherAPIForecastDay {
  date: string
  date_epoch: number
  day: WeatherAPIDay
  astro: WeatherAPIAstro
  hour: WeatherAPIHour[]
}

interface WeatherAPILocation {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime_epoch: number
  localtime: string
}

interface WeatherAPICurrent {
  last_updated_epoch: number
  last_updated: string
  temp_c: number
  temp_f: number
  is_day: number
  condition: WeatherCondition
  wind_mph: number
  wind_kph: number
  wind_degree: number
  wind_dir: string
  pressure_mb: number
  pressure_in: number
  precip_mm: number
  precip_in: number
  humidity: number
  cloud: number
  feelslike_c: number
  feelslike_f: number
  vis_km: number
  vis_miles: number
  uv: number
  gust_mph: number
  gust_kph: number
}

interface WeatherAPIResponse {
  location: WeatherAPILocation
  current: WeatherAPICurrent
  forecast: {
    forecastday: WeatherAPIForecastDay[]
  }
}

interface OpenWeatherMapWeather {
  id: number
  main: string
  description: string
  icon: string
}

interface OpenWeatherMapMain {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

interface OpenWeatherMapWind {
  speed: number
  deg: number
}

interface OpenWeatherMapSys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}

interface OpenWeatherMapCurrent {
  coord: { lon: number; lat: number }
  weather: OpenWeatherMapWeather[]
  base: string
  main: OpenWeatherMapMain
  visibility: number
  wind: OpenWeatherMapWind
  clouds: { all: number }
  dt: number
  sys: OpenWeatherMapSys
  timezone: number
  id: number
  name: string
  cod: number
}

interface OpenWeatherMapForecastItem {
  dt: number
  main: OpenWeatherMapMain
  weather: OpenWeatherMapWeather[]
  clouds: { all: number }
  wind: OpenWeatherMapWind
  visibility: number
  pop: number
  sys: { pod: string }
  dt_txt: string
}

interface OpenWeatherMapForecast {
  cod: string
  message: number
  cnt: number
  list: OpenWeatherMapForecastItem[]
  city: {
    id: number
    name: string
    coord: { lat: number; lon: number }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

interface DailyData {
  dt: number
  temps: number[]
  weather: OpenWeatherMapWeather
  pop: number
  humidity: number
  wind_speed: number
  sunrise: number
  sunset: number
  hourly: Array<{
    dt: number
    temp: number
    weather: OpenWeatherMapWeather
    pop: number
    humidity: number
    wind_speed: number
  }>
}

// Helper function to parse time string to minutes since midnight
function parseTimeString(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return 360 // Default to 6:00 AM if parsing fails

  let hours = Number.parseInt(match[1])
  const minutes = Number.parseInt(match[2])
  const period = match[3].toUpperCase()

  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0

  return hours * 60 + minutes
}

// Helper function to convert minutes since midnight to time string
function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60

  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const period = hours < 12 ? "AM" : "PM"

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Helper function to add minutes to a time string
function addMinutesToTimeString(timeStr: string, minutesToAdd: number): string {
  const totalMinutes = parseTimeString(timeStr) + minutesToAdd
  return minutesToTimeString(totalMinutes)
}

// Helper function to format local time from timestamp
function formatLocalTime(timestamp: number, timezone: number): string {
  const localTime = toLocalTime(timestamp, timezone)
  return to12Hour(localTime)
}

// Helper function to convert OpenWeatherMap UTC time to local time (from your working example)
function toLocalTime(utcSeconds: number, timezoneOffsetSeconds: number): string {
  // Get time in milliseconds and adjust to location's local time
  const date = new Date((utcSeconds + timezoneOffsetSeconds) * 1000)
  const hours = date.getUTCHours().toString().padStart(2, "0")
  const minutes = date.getUTCMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

// Helper function to convert 24-hour to 12-hour format
function to12Hour(timeStr: string): string {
  const [hour, minute] = timeStr.split(":").map(Number)
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
}

// Helper function to get wind direction
function getWindDirection(degrees: number): string {
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

// Helper function to process daily forecast from OpenWeatherMap
function getDailyForecast(
  forecastList: OpenWeatherMapForecastItem[],
  currentSunrise: number,
  currentSunset: number,
  timezone: number,
) {
  const dailyData: Record<string, DailyData> = {}

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString()

    if (!dailyData[date]) {
      dailyData[date] = {
        dt: item.dt,
        temps: [],
        weather: item.weather[0],
        pop: item.pop || 0,
        humidity: item.main.humidity,
        wind_speed: item.wind?.speed || 0,
        sunrise: 0,
        sunset: 0,
        hourly: [],
      }
    }

    dailyData[date].hourly.push({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather[0],
      pop: item.pop || 0,
      humidity: item.main.humidity,
      wind_speed: item.wind?.speed || 0,
    })

    dailyData[date].temps.push(item.main.temp)
    if (item.pop > dailyData[date].pop) {
      dailyData[date].pop = item.pop
    }

    dailyData[date].humidity = Math.round((dailyData[date].humidity + item.main.humidity) / 2)

    if (item.wind?.speed > dailyData[date].wind_speed) {
      dailyData[date].wind_speed = item.wind.speed
    }
  })

  // Get the base local time strings for Day 1
  const baseSunriseLocal = formatLocalTime(currentSunrise, timezone)
  const baseSunsetLocal = formatLocalTime(currentSunset, timezone)

  return Object.values(dailyData)
    .slice(0, 5)
    .map((day, index) => {
      let sunriseTime: string
      let sunsetTime: string
      let isEstimated = false

      if (index === 0) {
        // Day 1: Use actual current weather data (local time)
        sunriseTime = baseSunriseLocal
        sunsetTime = baseSunsetLocal
      } else {
        // Days 2-5: Use estimation strategy for OpenWeatherMap-only case
        isEstimated = true

        if (index === 1) {
          // Day 2: Same as day 1
          sunriseTime = baseSunriseLocal
          sunsetTime = baseSunsetLocal
        } else if (index === 2) {
          // Day 3: Same sunrise as day 2, sunset + 1 minute
          sunriseTime = baseSunriseLocal
          sunsetTime = addMinutesToTimeString(baseSunsetLocal, 1)
        } else if (index === 3) {
          // Day 4: sunrise + 1 minute, sunset + 1 minute from day 3
          sunriseTime = addMinutesToTimeString(baseSunriseLocal, 1)
          sunsetTime = addMinutesToTimeString(baseSunsetLocal, 2)
        } else {
          // Day 5: sunrise + 1 minute, sunset + 1 minute from day 4
          sunriseTime = addMinutesToTimeString(baseSunriseLocal, 2)
          sunsetTime = addMinutesToTimeString(baseSunsetLocal, 3)
        }
      }

      return {
        dt: day.dt,
        temp: {
          min: Math.min(...day.temps),
          max: Math.max(...day.temps),
        },
        weather: [
          {
            ...day.weather,
            icon: `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`,
          },
        ],
        pop: day.pop,
        humidity: day.humidity,
        wind_speed: day.wind_speed,
        sunrise: currentSunrise + index * 60, // For compatibility
        sunset: currentSunset + index * 60, // For compatibility
        // Use local time format for all days
        sunrise_time: sunriseTime,
        sunset_time: sunsetTime,
        sunrise_estimated: isEstimated,
        sunset_estimated: isEstimated,
        hourly: day.hourly,
        source: "openweathermap",
      }
    })
}

// Helper function to get OpenWeatherMap data
async function getOpenWeatherMapData(location: string, apiKey: string) {
  try {
    let currentWeatherUrl = ""
    let forecastUrl = ""

    // Check if location is a zipcode (numeric) or city name
    if (/^\d+$/.test(location)) {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${location},IN&appid=${apiKey}&units=metric`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${location},IN&appid=${apiKey}&units=metric`
    } else {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    }

    const [currentResponse, forecastResponse] = await Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])

    if (!currentResponse.ok || !forecastResponse.ok) {
      return null
    }

    const currentData: OpenWeatherMapCurrent = await currentResponse.json()
    const forecastData: OpenWeatherMapForecast = await forecastResponse.json()

    // Get current time to filter future hours
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(now)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    // Filter hourly data to only include today and tomorrow
    const filteredHourly = forecastData.list.filter((item) => {
      const itemDate = new Date(item.dt * 1000)
      return itemDate < dayAfterTomorrow
    })

    // Convert sunrise/sunset to local time using your working method
    const sunriseLocal = toLocalTime(currentData.sys.sunrise, currentData.timezone)
    const sunsetLocal = toLocalTime(currentData.sys.sunset, currentData.timezone)

    // Get daily forecast with estimation strategy using local times
    const dailyForecast = getDailyForecast(
      forecastData.list,
      currentData.sys.sunrise,
      currentData.sys.sunset,
      currentData.timezone,
    )

    return {
      source: "openweathermap",
      timezone: currentData.timezone,
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        uvi: 0,
        wind_speed: currentData.wind?.speed || 0,
        wind_deg: currentData.wind?.deg || 0,
        wind_dir: getWindDirection(currentData.wind?.deg || 0),
        weather: [
          {
            main: currentData.weather[0].main,
            description: currentData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
          },
        ],
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
        // Add formatted time strings for OpenWeatherMap
        sunrise_time: to12Hour(sunriseLocal),
        sunset_time: to12Hour(sunsetLocal),
      },
      hourly: filteredHourly.map((item) => ({
        dt: item.dt,
        temp: item.main.temp,
        weather: [
          {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          },
        ],
        pop: item.pop || 0,
        humidity: item.main.humidity,
        wind_speed: item.wind?.speed || 0,
        wind_deg: item.wind?.deg || 0,
      })),
      daily: dailyForecast,
      location: {
        name: currentData.name,
        country: currentData.sys.country,
      },
    }
  } catch (error) {
    console.error("OpenWeatherMap error:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zipcode = searchParams.get("zipcode")
    const query = searchParams.get("query")

    if (!zipcode && !query) {
      return NextResponse.json({ error: "Zipcode or search query is required" }, { status: 400 })
    }

    // Try WeatherAPI first
    if (WEATHER_API_KEY) {
      try {
        const location = query || zipcode
        const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location!)}&days=3&aqi=no&alerts=no`

        console.log("Trying WeatherAPI for location:", location)
        const weatherApiResponse = await fetch(weatherApiUrl)

        if (weatherApiResponse.ok) {
          const weatherApiData: WeatherAPIResponse = await weatherApiResponse.json()
          console.log("WeatherAPI success")

          // Get current time to filter future hours
          const now = new Date()
          const currentHour = now.getHours()
          const today = now.toDateString()

          // Transform WeatherAPI data to our format
          const transformedData = {
            source: "weatherapi",
            timezone: weatherApiData.location.tz_id,
            current: {
              temp: weatherApiData.current.temp_c,
              feels_like: weatherApiData.current.feelslike_c,
              humidity: weatherApiData.current.humidity,
              pressure: weatherApiData.current.pressure_mb,
              uvi: weatherApiData.current.uv,
              wind_speed: weatherApiData.current.wind_kph / 3.6, // Convert to m/s
              wind_deg: weatherApiData.current.wind_degree,
              wind_dir: weatherApiData.current.wind_dir,
              weather: [
                {
                  main: weatherApiData.current.condition.text,
                  description: weatherApiData.current.condition.text,
                  icon: weatherApiData.current.condition.icon.replace("64x64", "128x128"),
                },
              ],
              // WeatherAPI provides local time strings directly - store as strings
              sunrise_time: weatherApiData.forecast.forecastday[0].astro.sunrise,
              sunset_time: weatherApiData.forecast.forecastday[0].astro.sunset,
              sunrise: 0, // Placeholder for compatibility
              sunset: 0, // Placeholder for compatibility
            },
            hourly: weatherApiData.forecast.forecastday.flatMap((day) =>
              day.hour
                .filter((hour) => {
                  const hourDate = new Date(hour.time_epoch * 1000)
                  // Only include future hours (including current hour)
                  return hourDate >= now || (hourDate.toDateString() === today && hourDate.getHours() >= currentHour)
                })
                .map((hour) => ({
                  dt: hour.time_epoch,
                  temp: hour.temp_c,
                  weather: [
                    {
                      main: hour.condition.text,
                      description: hour.condition.text,
                      icon: hour.condition.icon.replace("64x64", "128x128"),
                    },
                  ],
                  pop: hour.chance_of_rain / 100,
                  humidity: hour.humidity,
                  wind_speed: hour.wind_kph / 3.6, // Convert to m/s
                  wind_deg: hour.wind_degree,
                  uv: hour.uv,
                })),
            ),
            daily: weatherApiData.forecast.forecastday.map((day) => ({
              dt: day.date_epoch,
              temp: {
                min: day.day.mintemp_c,
                max: day.day.maxtemp_c,
              },
              weather: [
                {
                  main: day.day.condition.text,
                  description: day.day.condition.text,
                  icon: day.day.condition.icon.replace("64x64", "128x128"),
                },
              ],
              pop: day.day.daily_chance_of_rain / 100,
              humidity: day.day.avghumidity,
              wind_speed: day.day.maxwind_kph / 3.6, // Convert to m/s
              // WeatherAPI provides accurate local time strings directly
              sunrise_time: day.astro.sunrise,
              sunset_time: day.astro.sunset,
              sunrise: 0, // Placeholder for compatibility
              sunset: 0, // Placeholder for compatibility
              uv: day.day.uv,
              source: "weatherapi", // Mark as WeatherAPI source
            })),
            location: {
              name: weatherApiData.location.name,
              country: weatherApiData.location.country,
              region: weatherApiData.location.region,
              timezone: weatherApiData.location.tz_id,
            },
          }

          // If we have less than 5 days, try to get additional days from OpenWeatherMap
          if (transformedData.daily.length < 5 && OPENWEATHER_API_KEY) {
            try {
              console.log("Getting additional days from OpenWeatherMap")
              const openWeatherData = await getOpenWeatherMapData(location!, OPENWEATHER_API_KEY)

              if (openWeatherData) {
                // Get the last day's sunrise/sunset from WeatherAPI (day 3)
                const lastWeatherAPIDay = transformedData.daily[transformedData.daily.length - 1]

                // Add days 4 and 5 with estimation strategy
                const additionalDays = []

                // Day 4: Same sunrise as day 3, sunset + 1 minute
                if (transformedData.daily.length === 3) {
                  additionalDays.push({
                    ...(openWeatherData.daily[3] || openWeatherData.daily[openWeatherData.daily.length - 1]),
                    sunrise_time: lastWeatherAPIDay.sunrise_time,
                    sunset_time: addMinutesToTimeString(lastWeatherAPIDay.sunset_time || "6:30 PM", 1),
                    sunrise_estimated: true,
                    sunset_estimated: true,
                    source: "estimated",
                    uv: 0,
                  })

                  // Day 5: Same sunrise as day 3, sunset + 2 minutes from day 3
                  additionalDays.push({
                    ...(openWeatherData.daily[4] || openWeatherData.daily[openWeatherData.daily.length - 1]),
                    sunrise_time: lastWeatherAPIDay.sunrise_time,
                    sunset_time: addMinutesToTimeString(lastWeatherAPIDay.sunset_time || "6:30 PM", 2),
                    sunrise_estimated: true,
                    sunset_estimated: true,
                    source: "estimated",
                    uv: 0,
                  })
                }

                transformedData.daily = [...transformedData.daily, ...additionalDays]
              }
            } catch (error) {
              console.log("Failed to get additional days from OpenWeatherMap:", error)
            }
          }

          return NextResponse.json(transformedData)
        }
      } catch (error) {
        console.log("WeatherAPI failed:", error)
      }
    }

    // Fallback to OpenWeatherMap
    console.log("Falling back to OpenWeatherMap")
    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json({ error: "Weather API keys not configured" }, { status: 500 })
    }

    const openWeatherData = await getOpenWeatherMapData(query || zipcode!, OPENWEATHER_API_KEY)

    if (openWeatherData) {
      return NextResponse.json({
        ...openWeatherData,
        source: "openweathermap",
      })
    }

    // If both APIs fail
    return NextResponse.json(
      {
        error: "⚠️ Weather data not found for this area or ZIP code. Please enter a nearby city or valid postal code.",
        noData: true,
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("Weather fetch error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch weather data" },
      { status: 500 },
    )
  }
}
