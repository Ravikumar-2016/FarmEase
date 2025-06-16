import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Sprout,
  BarChart3,
  Users,
  MapPin,
  TrendingUp,
  Shield,
  Bell,
  Calendar,
  MessageSquare,
  Zap,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  Database,
  Settings,
  Search,
  FileText,
  Target,
} from "lucide-react"

export default function FeaturesPage() {
  const farmerFeatures = [
    {
      icon: Sprout,
      title: "Crop Management",
      description: "Add, update, and track crops with comprehensive management tools",
      benefits: ["Crop lifecycle tracking", "Planting and harvest schedules", "Growth monitoring", "Yield predictions"],
    },
    {
      icon: Target,
      title: "Fertilizer & Pesticide Suggestions",
      description: "Government-backed recommendations for optimal crop treatment",
      benefits: [
        "Government data integration",
        "Crop-specific recommendations",
        "Application timing guidance",
        "Cost-effective solutions",
      ],
    },
    {
      icon: BarChart3,
      title: "Market Price Updates",
      description: "Daily regional market prices for informed selling decisions",
      benefits: [
        "Real-time price data",
        "Regional market trends",
        "Price comparison tools",
        "Historical data analysis",
      ],
    },
    {
      icon: Users,
      title: "Labor Management",
      description: "Hire laborers, view profiles, and track work history efficiently",
      benefits: ["Laborer profile browsing", "Work history tracking", "Rating and review system", "Payment management"],
    },
  ]

  const laborerFeatures = [
    {
      icon: Search,
      title: "Work Discovery",
      description: "Browse and apply for job posts from nearby farmers",
      benefits: ["Job search filters", "Application tracking", "Work preferences", "Skill-based matching"],
    },
    {
      icon: Bell,
      title: "Notifications & Alerts",
      description: "Real-time alerts for new opportunities and updates",
      benefits: ["New job notifications", "Application status updates", "Payment confirmations", "Work reminders"],
    },
    {
      icon: MapPin,
      title: "Geo-Based Matching",
      description: "Find work opportunities near your location",
      benefits: [
        "Location-based job search",
        "Distance calculations",
        "Travel time estimates",
        "Local market insights",
      ],
    },
    {
      icon: MessageSquare,
      title: "Support Center",
      description: "Raise issues and get assistance from our support team",
      benefits: ["24/7 support access", "Issue tracking", "FAQ resources", "Direct communication"],
    },
  ]

  const employeeFeatures = [
    {
      icon: FileText,
      title: "Query Management",
      description: "View and resolve user queries efficiently",
      benefits: ["Query categorization", "Priority management", "Response tracking", "Resolution analytics"],
    },
    {
      icon: Database,
      title: "Market & Crop Updates",
      description: "Enter new price and crop information into the system",
      benefits: ["Data entry tools", "Validation systems", "Bulk upload features", "Update notifications"],
    },
    {
      icon: TrendingUp,
      title: "Work Monitoring",
      description: "Track work engagement and labor assignments",
      benefits: ["Activity dashboards", "Performance metrics", "Assignment tracking", "Progress reports"],
    },
    {
      icon: Bell,
      title: "Notification Management",
      description: "Push alerts and updates to farmers and laborers",
      benefits: ["Broadcast messaging", "Targeted notifications", "Scheduling tools", "Delivery tracking"],
    },
  ]

  const adminFeatures = [
    {
      icon: Shield,
      title: "Platform Oversight",
      description: "Manage users, employees, and platform performance",
      benefits: ["User management", "System monitoring", "Security controls", "Performance analytics"],
    },
    {
      icon: Database,
      title: "Database Management",
      description: "Control datasets of crops, pesticides, fertilizers, and prices",
      benefits: ["Data validation", "Content moderation", "Backup management", "System optimization"],
    },
    {
      icon: BarChart3,
      title: "Analytics & Trends",
      description: "View platform-wide market trend analytics",
      benefits: ["Usage statistics", "Market trend analysis", "User behavior insights", "Performance reports"],
    },
    {
      icon: Settings,
      title: "Employee Management",
      description: "Add, remove, or edit employee details and manage operations",
      benefits: ["Staff administration", "Role management", "Performance tracking", "Salary management"],
    },
  ]

  const additionalFeatures = [
    {
      icon: MapPin,
      title: "Geo-Based Services",
      description: "Location-based matching for markets and services",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Platform available in multiple regional languages (coming soon)",
    },
    {
      icon: Calendar,
      title: "Issue Reporting",
      description: "Submit problems and get responses from support team",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Live data synchronization across all platform features",
    },
  ]

  const futureFeatures = [
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Android app with offline mode and sync capabilities",
    },
    {
      icon: TrendingUp,
      title: "Advanced Dashboards",
      description: "Real-time dashboards for comprehensive yield statistics",
    },
    {
      icon: Shield,
      title: "Blockchain Integration",
      description: "Secure contracts for labor agreements and transactions",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Features for <span className="text-green-600">Every Agricultural Stakeholder</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            FarmEase provides specialized tools and capabilities for farmers, laborers, employees, and administrators,
            all integrated into one powerful platform.
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
              Comprehensive tools for crop management, market access, and labor coordination
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {farmerFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
            <div className="text-4xl mb-4">👷‍♂️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Laborer Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Job discovery, geo-based matching, and comprehensive support systems
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {laborerFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
              Query management, data updates, and platform monitoring capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {employeeFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
            <div className="text-4xl mb-4">🛠️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Administrator Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete platform oversight, analytics, and management capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {adminFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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

      {/* Additional Platform Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Additional Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cross-platform capabilities that benefit all user types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
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

      {/* Future Features */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Exciting new features in development for the future of FarmEase
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience FarmEase?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of agricultural stakeholders who are already benefiting from our comprehensive platform.
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
