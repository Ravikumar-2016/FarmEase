import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FarmEaseLogo } from "@/components/logos/farmease-logo"
import { Sprout, BarChart3, Users, MapPin, ArrowRight, CheckCircle, TrendingUp, MessageSquare, Globe, Smartphone } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Sprout,
      title: "Smart Crop Management",
      description: "Add, track, and manage crops with fertilizer & pesticide suggestions based on government data",
    },
    {
      icon: BarChart3,
      title: "Real-Time Market Data",
      description: "Daily regional market prices and geo-based market information for informed decisions",
    },
    {
      icon: Users,
      title: "Labor Management",
      description: "Connect farmers with laborers, manage hiring, and track work history efficiently",
    },
    {
      icon: MapPin,
      title: "Geo-Based Services",
      description: "Location-based matching for nearby markets, laborers, and agricultural services",
    },
  ]

  const userRoles = [
    {
      title: "Farmers",
      icon: "👨‍🌾",
      description: "Manage crops, get market prices, hire laborers, and receive expert agricultural advice",
      features: ["Crop Management", "Market Price Updates", "Labor Hiring", "Issue Reporting"]
    },
    {
      title: "Laborers", 
      icon: "👷‍♂️",
      description: "Find work opportunities, connect with farmers, and manage job applications",
      features: ["Job Discovery", "Geo-Based Matching", "Work Notifications", "Support Center"]
    },
    {
      title: "Employees",
      icon: "🧑‍💼", 
      description: "Manage queries, update market data, and monitor platform activities",
      features: ["Query Management", "Market Updates", "Work Monitoring", "Notification Management"]
    },
    {
      title: "Administrators",
      icon: "🛠️",
      description: "Oversee platform operations, manage users, and analyze agricultural trends",
      features: ["Platform Oversight", "Database Management", "Analytics", "Employee Management"]
    }
  ]

  const benefits = [
    "Centralized agricultural platform for all stakeholders",
    "Real-time market data and crop recommendations",
    "Efficient labor hiring and management system",
    "Geo-based services for nearby resources",
    "Multilingual support (coming soon)",
    "Enhanced transparency and operational efficiency",
  ]

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
                From soil to sale, FarmEase brings clarity, connectivity, and convenience to agriculture.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A comprehensive digital ecosystem connecting farmers, laborers, employees, and administrators 
                for smarter agricultural management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                    Join FarmEase Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
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
                  alt="Smart Agricultural Technology Platform"
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

      {/* Core Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to address key agricultural challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for Every Agricultural Stakeholder</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FarmEase serves four distinct user roles, each with specialized features and capabilities
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

      {/* Why FarmEase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose FarmEase?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Traditional agriculture faces challenges like lack of timely advice, inaccessible market data, 
                and poor coordination. FarmEase solves these with a unified digital platform.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Start Your Agricultural Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  Real-Time
                </div>
                <div className="text-gray-600">Market Data</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  4 User
                </div>
                <div className="text-gray-600">Role Types</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  Geo-Based
                </div>
                <div className="text-gray-600">Services</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <Globe className="h-8 w-8 mx-auto mb-2" />
                  Multilingual
                </div>
                <div className="text-gray-600">Support</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Future Vision</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              FarmEase is continuously evolving to bring more advanced features to agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-100" />
                <CardTitle className="text-lg">Mobile App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 text-sm">Android app with offline mode and sync capabilities</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-100" />
                <CardTitle className="text-lg">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 text-sm">Real-time dashboards for comprehensive yield statistics</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-green-100" />
                <CardTitle className="text-lg">Blockchain Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 text-sm">Secure contracts for labor agreements and transactions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-100" />
                <CardTitle className="text-lg">Enhanced Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 text-sm">Advanced messaging and notification systems</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Agriculture?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the digital agricultural revolution and connect with a comprehensive ecosystem designed for modern farming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
              >
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
