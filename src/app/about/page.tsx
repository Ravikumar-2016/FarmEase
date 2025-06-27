import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FarmEaseLogo } from "@/components/logos/farmease-logo"
import { Users, Target, Award, Heart, Bot, Globe, TrendingUp, Smartphone, CloudRain, Sprout } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Bot,
      title: "AI Innovation",
      description: "Leveraging artificial intelligence for smart crop and fertilizer recommendations",
    },
    {
      icon: Heart,
      title: "Connectivity",
      description: "Seamlessly connecting farmers, laborers, employees, and administrators",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong agricultural ecosystem for all stakeholders",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making advanced agricultural tools accessible to everyone",
    },
  ]

  const challenges = [
    {
      problem: "Lack of timely and accurate crop advice",
      solution: "AI-powered crop and fertilizer recommendations based on environmental conditions",
    },
    {
      problem: "Inaccessible real-time weather data",
      solution: "Comprehensive weather forecasting with automatic location detection and detailed metrics",
    },
    {
      problem: "Unstructured labor availability and coordination",
      solution: "AgroBridge platform connecting farmers with laborers through real-time notifications",
    },
    {
      problem: "Poor coordination among agricultural stakeholders",
      solution: "Unified platform serving farmers, laborers, employees, and administrators with specialized features",
    },
  ]

  const platformServices = [
    {
      icon: Sprout,
      title: "Crop Services",
      description: "AI-generated crop suggestions, fertilizer recommendations, and My Crops tracking system",
      features: ["Environmental analysis", "Smart recommendations", "Crop lifecycle tracking"],
    },
    {
      icon: CloudRain,
      title: "Weather Forecast",
      description: "Comprehensive weather data with 24-hour and 5-day forecasts",
      features: ["Automatic location detection", "Detailed metrics", "Multi-location search"],
    },
    {
      icon: Users,
      title: "AgroBridge",
      description: "Labor management platform with job postings and real-time notifications",
      features: ["Work opportunity posting", "Application tracking", "Notification system"],
    },
    {
      icon: TrendingUp,
      title: "Market Integration",
      description: "Direct access to official government market prices via agmarket.gov.in",
      features: ["Real-time pricing", "Regional data", "Government integration"],
    },
  ]

  const userRoles = [
    {
      icon: "👨‍🌾",
      title: "Farmers",
      description: "Complete agricultural management with AI recommendations and labor coordination",
      capabilities: ["AI crop recommendations", "Weather forecasting", "Labor management", "Market price access"],
    },
    {
      icon: "🧑‍🏭",
      title: "Laborers",
      description: "Work discovery platform with weather access and comprehensive support",
      capabilities: ["Regional work discovery", "Weather forecasting", "Application tracking", "Query support"],
    },
    {
      icon: "🧑‍💼",
      title: "Employees",
      description: "Communication management and platform monitoring capabilities",
      capabilities: ["Announcement management", "Query resolution", "Task monitoring", "Internal ticketing"],
    },
    {
      icon: "🛡️",
      title: "Administrators",
      description: "Platform oversight with analytics and strategic management",
      capabilities: ["Platform analytics", "User management", "System oversight", "Strategic planning"],
    },
  ]

  const futureVision = [
    {
      icon: Bot,
      title: "AI Disease Detection",
      description: "Advanced crop disease identification using computer vision technology",
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      description: "Comprehensive market trend analysis and price prediction algorithms",
    },
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Native mobile app with offline capabilities and seamless synchronization",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Platform availability in multiple regional languages across India",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <FarmEaseLogo size="lg" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-green-600">FarmEase</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            FarmEase is a comprehensive agricultural platform that leverages AI technology to empower farmers, laborers,
            employees, and administrators through intelligent crop management, weather forecasting, and seamless
            agricultural coordination.
          </p>
          <div className="bg-green-100 border-l-4 border-green-600 p-6 max-w-3xl mx-auto rounded-r-lg">
            <p className="text-lg font-medium text-green-800 italic">
              &quot;Transforming agriculture through AI-powered solutions and seamless stakeholder connectivity.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Target className="mr-3 h-6 w-6 text-green-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To revolutionize agriculture through AI-powered solutions that provide intelligent crop
                  recommendations, comprehensive weather forecasting, and seamless connectivity between all agricultural
                  stakeholders, ultimately improving productivity and sustainability in farming.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Award className="mr-3 h-6 w-6 text-blue-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become the leading agricultural technology platform in India, where every farmer has access to
                  AI-driven insights, real-time weather data, and efficient labor coordination, creating a connected and
                  prosperous agricultural ecosystem.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Platform Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive agricultural solutions powered by AI and real-time data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-t-4 border-t-green-600">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-green-100 rounded-lg mr-4">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
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

      {/* Problems We Solve */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Agricultural Challenges We Address</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              FarmEase tackles critical problems facing modern agriculture with innovative solutions
            </p>
          </div>

          <div className="space-y-8">
            {challenges.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-red-600 mb-3">❌ Challenge</h3>
                      <p className="text-gray-700 text-lg">{item.problem}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-600 mb-3">✅ Our Solution</h3>
                      <p className="text-gray-700 text-lg">{item.solution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Agricultural Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              FarmEase serves four distinct user roles with specialized features and capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userRoles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
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
                  <div className="grid grid-cols-1 gap-2">
                    {role.capabilities.map((capability, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that drive our mission to transform agriculture through technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Future Vision & Expansion</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upcoming innovations to further revolutionize agricultural technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {futureVision.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center border-2 border-dashed border-green-300 bg-green-50">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-lg text-green-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-green-700 text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Additional planned features include Machinery Rental Services, Financial Services, Community Forums, and
              Crop Protection Modules.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Impact */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-xl text-green-100">Comprehensive features for modern agricultural management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">AI</div>
              <div className="text-green-100">Powered Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">Real-Time</div>
              <div className="text-green-100">Weather & Market Data</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4</div>
              <div className="text-green-100">User Role Types</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-green-100">Platform Access</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
