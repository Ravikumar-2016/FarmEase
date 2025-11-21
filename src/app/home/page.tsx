"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FarmEaseLogo } from "@/components/logos/farmease-logo"
import {
  Sprout,
  CloudRain,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Bot,
  MapPin,
  Bell,
  Briefcase,
  Handshake,
  BarChart3,
  Smartphone,
} from "lucide-react"

export default function HomePage() {
  const coreServices = [
    {
      icon: Sprout,
      title: "Crop Services",
      description: "AI-powered crop and fertilizer recommendations based on environmental conditions",
    },
    {
      icon: CloudRain,
      title: "Weather Forecast",
      description: "Real-time weather updates with 24-hour and 5-day forecasts for informed farming decisions",
    },
    {
      icon: Users,
      title: "AgroBridge",
      description: "Connect farmers with laborers through job postings and real-time notifications",
    },
    {
      icon: TrendingUp,
      title: "Market Prices",
      description: "Access official government market prices across different regions in India",
    },
  ]

  const userRoles = [
    {
      title: "Farmers",
      icon: "👨‍🌾",
      description: "Complete agricultural management with AI recommendations and labor coordination",
      features: ["AI Crop Recommendations", "Weather Forecasts", "Labor Management", "Market Price Access"],
    },
    {
      title: "Laborers",
      icon: "🧑‍🏭",
      description: "Find work opportunities and stay informed with weather and announcements",
      features: ["Work Discovery", "Weather Updates", "Application Tracking", "Query Support"],
    },
    {
      title: "Employees",
      icon: "🧑‍💼",
      description: "Manage communications, resolve queries, and monitor platform activities",
      features: ["Announcement Management", "Query Resolution", "Task Monitoring", "Internal Ticketing"],
    },
    {
      title: "Administrators",
      icon: "🛡️",
      description: "Platform oversight with analytics, user management, and strategic planning",
      features: ["Platform Analytics", "User Management", "System Oversight", "Future Planning"],
    },
  ]

  const keyFeatures = [
    "AI-powered crop and fertilizer recommendations",
    "Real-time weather forecasting with location detection",
    "Seamless farmer-laborer connection platform",
    "Official government market price integration",
    "Comprehensive notification system",
    "Multi-role platform serving entire agricultural ecosystem",
  ]

  const futureFeatures = [
    {
      icon: Bot,
      title: "AI Disease Detection",
      description: "Advanced crop disease identification and treatment recommendations",
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Comprehensive market trend analysis and price predictions",
    },
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Native mobile app with offline capabilities and sync features",
    },
  ]

  const [userType, setUserType] = useState<string | null>(null)
const [isLoggedIn, setIsLoggedIn] = useState(false)

useEffect(() => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("userType")

    if (user) {
      setUserType(user)
      setIsLoggedIn(true)
    } else {
      setUserType(null)
      setIsLoggedIn(false)
    }
  }
}, [])


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-8">
                <FarmEaseLogo size="lg" className="w-20 h-20" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-green-600">FarmEase</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
                Comprehensive Agricultural Platform with AI-Powered Solutions
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Connecting farmers, laborers, employees, and administrators through intelligent crop management, weather
                forecasting, and seamless agricultural coordination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!isLoggedIn ? (
  <Link href="/signup">
    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
      Start Your Journey
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </Link>
) : (
  <Link href={`/dashboard/${userType?.toLowerCase()}`}>
    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
      Go to Dashboard
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </Link>
)}
                <Link href="/features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
                  >
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/HeroImgForHomepage.jpg"
                  alt="FarmEase Agricultural Technology Platform"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Agricultural Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intelligent solutions designed to address modern farming challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-green-600"
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Agricultural Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FarmEase serves four distinct user roles with specialized features and capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userRoles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{role.icon}</div>
                    <div>
                      <CardTitle className="text-2xl">{role.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Highlight */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose FarmEase?</h2>
              <p className="text-lg text-gray-600 mb-8">
                FarmEase addresses critical agricultural challenges through intelligent technology, seamless
                connectivity, and comprehensive platform integration.
              </p>

              <div className="space-y-4">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/about">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 bg-green-50">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <Bot className="h-8 w-8 mx-auto mb-2" />
                  AI-Powered
                </div>
                <div className="text-gray-600">Recommendations</div>
              </Card>
              <Card className="text-center p-6 bg-blue-50">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <CloudRain className="h-8 w-8 mx-auto mb-2" />
                  Real-Time
                </div>
                <div className="text-gray-600">Weather Data</div>
              </Card>
              <Card className="text-center p-6 bg-purple-50">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  <Bell className="h-8 w-8 mx-auto mb-2" />
                  Smart
                </div>
                <div className="text-gray-600">Notifications</div>
              </Card>
              <Card className="text-center p-6 bg-orange-50">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  Location-Based
                </div>
                <div className="text-gray-600">Services</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      {userType?.toLowerCase() !== "admin" && (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Become part of the FarmEase ecosystem through career opportunities or strategic partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Career Opportunities</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Join our mission to revolutionize agriculture
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Be part of building the future of agricultural technology and help farmers across India.
                  </p>
                  <Link href="/jobs">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Job Openings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <Handshake className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Strategic Partnerships</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Collaborate to expand agricultural innovation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Partner with FarmEase to create sustainable agricultural solutions and reach new markets.
                  </p>
                  <Link href="/partnerships">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Explore Partnerships
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      )}

      {/* Future Vision Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Future of FarmEase</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Continuous innovation to bring advanced agricultural technology to farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {futureFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="bg-white/10 border-white/20 text-white text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-white/20 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-green-100" />
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-green-100">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-green-100 mb-6">
              Additional upcoming features: Machinery Rental, Financial Services, Community Forums, and Multilingual
              Support
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isLoggedIn && (
  <section className="py-20 bg-emerald-700 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Ready to Transform Your Agricultural Journey?
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Join thousands of farmers, laborers, and agricultural professionals who trust FarmEase for their daily
        operations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/signup">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
)}
    </div>
  )
}
