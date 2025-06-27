import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Sprout,
  CloudRain,
  Users,
  TrendingUp,
  Bell,
  MessageSquare,
  BarChart3,
  Shield,
  FileText,
  Settings,
  Search,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Globe,
  Wrench,
  DollarSign,
  Camera,
} from "lucide-react"

export default function FeaturesPage() {
  const farmerFeatures = [
    {
      icon: Sprout,
      title: "AI Crop Services",
      description: "Intelligent crop and fertilizer recommendations based on environmental conditions",
      benefits: [
        "AI-generated crop suggestions",
        "Smart fertilizer recommendations",
        "Environmental condition analysis",
        "My Crops tracking system",
      ],
    },
    {
      icon: CloudRain,
      title: "Weather Forecast",
      description: "Comprehensive weather data with automatic location detection",
      benefits: [
        "24-hour detailed forecasts",
        "5-day weather predictions",
        "Sunrise/sunset times",
        "Wind speed, humidity, UV index",
        "Air pressure monitoring",
        "Search weather for any location",
      ],
    },
    {
      icon: Users,
      title: "AgroBridge Labor Platform",
      description: "Connect with laborers and manage work opportunities efficiently",
      benefits: [
        "Post work opportunities",
        "View job applicants",
        "Real-time notifications",
        "Work history tracking",
        "Cancel/modify postings",
      ],
    },
    {
      icon: TrendingUp,
      title: "Market Prices",
      description: "Access official government market data for informed decisions",
      benefits: [
        "Direct agmarket.gov.in integration",
        "Regional price comparisons",
        "Real-time market updates",
        "Crop-specific pricing",
      ],
    },
  ]

  const laborerFeatures = [
    {
      icon: Search,
      title: "Work Discovery",
      description: "Find and apply for agricultural work opportunities in your region",
      benefits: ["Regional work listings", "Application tracking", "Work withdrawal options", "Past work history"],
    },
    {
      icon: CloudRain,
      title: "Weather Access",
      description: "Same comprehensive weather forecasting tools as farmers",
      benefits: ["Location-based forecasts", "Work planning assistance", "Weather alerts", "Multi-location search"],
    },
    {
      icon: Bell,
      title: "Notifications & Announcements",
      description: "Stay informed with real-time updates and employee announcements",
      benefits: [
        "Work opportunity alerts",
        "Application status updates",
        "Employee announcements",
        "System notifications",
      ],
    },
    {
      icon: MessageSquare,
      title: "Query Support",
      description: "Raise issues and get assistance from the support team",
      benefits: ["Issue reporting system", "Query tracking", "Support team assistance", "Problem resolution"],
    },
  ]

  const employeeFeatures = [
    {
      icon: Bell,
      title: "Announcement Management",
      description: "Create, update, and manage platform-wide announcements",
      benefits: [
        "Create announcements",
        "Update existing content",
        "Delete outdated information",
        "Target specific user groups",
      ],
    },
    {
      icon: MessageSquare,
      title: "Query Resolution",
      description: "Handle and resolve user queries from farmers and laborers",
      benefits: ["Query categorization", "Response management", "Resolution tracking", "User communication"],
    },
    {
      icon: BarChart3,
      title: "Task Monitoring",
      description: "View and monitor all active user tasks across the platform",
      benefits: ["Real-time task overview", "User activity monitoring", "Performance tracking", "System health checks"],
    },
    {
      icon: FileText,
      title: "Internal Ticketing",
      description: "Raise tickets to higher authorities for complex issues",
      benefits: ["Escalation system", "Ticket management", "Authority communication", "Issue documentation"],
    },
  ]

  const adminFeatures = [
    {
      icon: BarChart3,
      title: "Platform Analytics",
      description: "Comprehensive analytics and statistics for the entire platform",
      benefits: ["User engagement metrics", "Platform performance data", "Usage statistics", "Growth analytics"],
    },
    {
      icon: Users,
      title: "User Management",
      description: "Add, update, or remove employees and partners",
      benefits: ["Employee administration", "Partner management", "Role assignments", "Access control"],
    },
    {
      icon: Shield,
      title: "System Oversight",
      description: "Monitor platform operations and resolve escalated tickets",
      benefits: ["System monitoring", "Ticket resolution", "Security oversight", "Performance optimization"],
    },
    {
      icon: Settings,
      title: "Strategic Planning",
      description: "Implement future features and platform expansion",
      benefits: ["Feature development", "Platform updates", "Database management", "Future roadmap planning"],
    },
  ]

  const futureFeatures = [
    {
      icon: Camera,
      title: "AI Disease Detection",
      description: "Advanced crop disease identification using computer vision",
    },
    {
      icon: Wrench,
      title: "Machinery Rental",
      description: "Agricultural equipment rental and booking system",
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Advanced market trend analysis and price predictions",
    },
    {
      icon: Shield,
      title: "Crop Protection",
      description: "Comprehensive crop protection and insurance modules",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Platform available in multiple regional languages",
    },
    {
      icon: DollarSign,
      title: "Financial Services",
      description: "Agricultural loans, insurance, and financial planning",
    },
    {
      icon: MessageSquare,
      title: "Community Forums",
      description: "Farmer communities and knowledge sharing platforms",
    },
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Native mobile app with offline capabilities",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Features for <span className="text-green-600">Modern Agriculture</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            FarmEase provides specialized tools for farmers, laborers, employees, and administrators, all powered by AI
            and integrated into one intelligent platform.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Farmer Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Farmer Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered crop management, weather forecasting, and labor coordination tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {farmerFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-600"
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-green-100 rounded-lg mr-4">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Laborer Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-4xl mb-4">🧑‍🏭</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Laborer Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Work discovery, weather access, and comprehensive support systems
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {laborerFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600"
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg mr-4">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Employee Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-4xl mb-4">🧑‍💼</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Employee Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Communication management, query resolution, and platform monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {employeeFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-600"
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg mr-4">
                        <IconComponent className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-4xl mb-4">🛡️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Administrator Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platform analytics, user management, and strategic oversight
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {adminFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-orange-600"
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-orange-100 rounded-lg mr-4">
                        <IconComponent className="h-8 w-8 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-orange-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Future Expansion Features</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Upcoming innovations to further revolutionize agricultural technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {futureFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="bg-white/10 border-white/20 text-white text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-white/20 rounded-full w-fit">
                      <IconComponent className="h-6 w-6 text-green-100" />
                    </div>
                    <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-green-100 text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience FarmEase?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the agricultural revolution with our comprehensive platform designed for modern farming needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                Get Started Today
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
