import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" 
import { FarmEaseLogo } from "@/components/logos/farmease-logo"
import { Users, Target, Award, Heart, Lightbulb, Globe, TrendingUp, Smartphone } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Leveraging technology to solve real agricultural challenges",
    },
    {
      icon: Heart,
      title: "Connectivity",
      description: "Bringing together all agricultural stakeholders under one platform",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong network of farmers, laborers, and agricultural experts",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making agricultural tools and data accessible to everyone",
    },
  ]

  const challenges = [
    {
      problem: "Lack of timely crop advice",
      solution: "Expert recommendations and government-backed agricultural guidance"
    },
    {
      problem: "Inaccessible real-time market data", 
      solution: "Daily regional market prices and geo-based market information"
    },
    {
      problem: "Unstructured labor availability",
      solution: "Organized labor management and geo-based matching system"
    },
    {
      problem: "Poor coordination among stakeholders",
      solution: "Centralized platform connecting farmers, laborers, employees, and admins"
    }
  ]

  const userRoles = [
    {
      icon: "👨‍🌾",
      title: "Farmers",
      description: "Comprehensive crop management, market data access, and labor hiring capabilities",
      features: ["Crop Management", "Market Price Updates", "Labor Hiring", "Issue Reporting"]
    },
    {
      icon: "👷‍♂️", 
      title: "Laborers",
      description: "Job discovery platform with geo-based matching and work notifications",
      features: ["Work Discovery", "Geo-Based Matching", "Notifications", "Support Center"]
    },
    {
      icon: "🧑‍💼",
      title: "Employees", 
      description: "Query management, market updates, and platform monitoring tools",
      features: ["Query Management", "Market Updates", "Work Monitoring", "Notifications"]
    },
    {
      icon: "🛠️",
      title: "Administrators",
      description: "Complete platform oversight with analytics and user management",
      features: ["Platform Oversight", "Database Management", "Analytics", "Employee Management"]
    }
  ]

  const futureFeatures = [
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Android app with offline mode and sync capabilities"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics", 
      description: "Real-time dashboards for comprehensive yield statistics"
    },
    {
      icon: Globe,
      title: "Blockchain Integration",
      description: "Secure contracts for labor agreements and transactions"
    }
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
            FarmEase is a comprehensive agricultural platform that leverages technology to empower and connect 
            farmers, laborers, employees, and administrators in one unified digital ecosystem.
          </p>
          <div className="bg-green-100 border-l-4 border-green-600 p-6 max-w-3xl mx-auto rounded-r-lg">
            <p className="text-lg font-medium text-green-800 italic">
              &quot;From soil to sale, FarmEase brings clarity, connectivity, and convenience to agriculture.&quot;
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
                  To create a centralized, multilingual platform that addresses key agricultural challenges through 
                  real-time digital tools, enhanced transparency, and operational efficiency for all stakeholders 
                  in the agricultural ecosystem.
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
                  To transform agriculture into a connected, efficient, and technology-driven industry where every 
                  stakeholder has access to the tools, data, and connections they need to thrive in modern farming.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Challenges We Address</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              FarmEase tackles the core problems facing modern agriculture
            </p>
          </div>

          <div className="space-y-8">
            {challenges.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-red-600 mb-3">❌ Problem</h3>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for Every Stakeholder</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              FarmEase serves four distinct user roles with specialized features
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
                  <div className="grid grid-cols-2 gap-2">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that drive our mission to transform agriculture
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

      {/* Future Roadmap */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Future Roadmap</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Exciting features and enhancements coming to FarmEase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {futureFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center border-2 border-dashed border-green-300 bg-green-50">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-green-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-green-700">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-xl text-green-100">Comprehensive features for modern agriculture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4</div>
              <div className="text-green-100">User Role Types</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">Real-Time</div>
              <div className="text-green-100">Market Data</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">Geo-Based</div>
              <div className="text-green-100">Services</div>
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