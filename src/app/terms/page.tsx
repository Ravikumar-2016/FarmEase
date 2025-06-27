import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Shield, AlertTriangle, FileText, Clock, Mail, Phone, Bot, Users } from "lucide-react"

export default function TermsPage() {
  const userTypes = [
    {
      icon: "👨‍🌾",
      title: "Farmers",
      responsibilities: [
        "Provide accurate crop and location information for AI recommendations",
        "Use AgroBridge labor management features responsibly",
        "Respect laborers' rights and honor agreed work terms",
        "Report issues through proper platform channels",
        "Maintain accurate regional data for weather and market services",
      ],
    },
    {
      icon: "🧑‍🏭",
      title: "Laborers",
      responsibilities: [
        "Maintain accurate profile, location, and availability information",
        "Honor work commitments and agreements made through AgroBridge",
        "Communicate professionally with farmers and employers",
        "Report workplace issues or disputes promptly",
        "Provide correct regional information for work matching",
      ],
    },
    {
      icon: "🧑‍💼",
      title: "Employees",
      responsibilities: [
        "Handle user queries and announcements professionally",
        "Maintain data accuracy and platform integrity",
        "Protect user privacy and confidential agricultural information",
        "Follow platform guidelines and escalation procedures",
        "Provide accurate information for AI system improvements",
      ],
    },
    {
      icon: "🛡️",
      title: "Administrators",
      responsibilities: [
        "Ensure platform security, performance, and data protection",
        "Manage user accounts and resolve complex disputes",
        "Oversee AI system performance and data accuracy",
        "Maintain system integrity and strategic platform development",
        "Protect agricultural data and user privacy",
      ],
    },
  ]

  const prohibitedActivities = [
    "Creating fake accounts or providing false agricultural or personal information",
    "Harassment, discrimination, or abusive behavior toward other platform users",
    "Posting inappropriate, offensive, or illegal content on the platform",
    "Attempting to hack, disrupt, or compromise platform security or AI systems",
    "Using the platform for non-agricultural or commercial spam purposes",
    "Sharing login credentials or allowing unauthorized access to accounts",
    "Violating intellectual property rights or applicable agricultural laws",
    "Manipulating weather data, market information, or AI recommendations",
    "Misusing AgroBridge for fraudulent work postings or applications",
    "Interfering with AI algorithms or attempting to manipulate recommendations",
  ]

  const platformRules = [
    {
      title: "Account Security & Data Accuracy",
      description:
        "Users must maintain secure accounts and provide accurate personal and regional information for optimal service delivery",
    },
    {
      title: "Agricultural Information Integrity",
      description:
        "All crop, location, and agricultural data must be truthful and current for accurate AI recommendations",
    },
    {
      title: "Professional Communication",
      description: "All interactions through AgroBridge and platform features must be respectful and appropriate",
    },
    {
      title: "Legal Compliance",
      description: "Users must comply with all applicable agricultural, labor, and data protection laws",
    },
  ]

  const aiDataUsage = [
    {
      title: "AI Recommendations",
      description:
        "Our AI systems use your agricultural and environmental data to provide crop and fertilizer suggestions. These are advisory only and should not replace professional agricultural consultation.",
    },
    {
      title: "Weather Integration",
      description:
        "Location data is used for automatic weather detection and forecasting. Users are responsible for verifying weather information for critical farming decisions.",
    },
    {
      title: "Market Data",
      description:
        "Market prices are sourced from government databases (agmarket.gov.in) and provided for informational purposes. We are not responsible for trading decisions based on this data.",
    },
    {
      title: "Labor Matching",
      description:
        "AgroBridge facilitates connections between farmers and laborers but does not guarantee work quality, safety, or payment. Users are responsible for their agreements.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Scale className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These terms govern your use of the FarmEase agricultural platform, including AI-powered recommendations,
            weather services, AgroBridge labor platform, and market data integration.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  Welcome to FarmEase, a comprehensive agricultural platform that leverages AI technology to provide
                  crop recommendations, weather forecasting, labor coordination, and market data integration. By
                  accessing or using our platform, you agree to be bound by these Terms of Service.
                </p>
                <p>
                  FarmEase serves farmers, laborers, employees, and administrators with specialized features including
                  AI-powered crop services, comprehensive weather forecasting, AgroBridge labor platform, and direct
                  integration with government market data sources.
                </p>
                <p>
                  If you do not agree with any part of these terms, including our data usage policies for AI
                  recommendations, you may not access or use the FarmEase platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">FarmEase Platform Services</h2>
              <p className="text-xl text-gray-600">Understanding our comprehensive agricultural ecosystem</p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <Bot className="mr-2 h-5 w-5 text-green-600" />
                      AI-Powered Agricultural Services
                    </h3>
                    <p className="text-gray-600">
                      FarmEase provides AI-generated crop and fertilizer recommendations based on environmental
                      conditions, comprehensive weather forecasting with automatic location detection, and intelligent
                      agricultural insights to improve farming outcomes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-600" />
                      AgroBridge Labor Platform
                    </h3>
                    <p className="text-gray-600">
                      Our labor coordination platform connects farmers with laborers through job postings, real-time
                      notifications, application tracking, and work history management to streamline agricultural
                      workforce coordination.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Core Platform Features</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>AI crop and fertilizer recommendations with My Crops tracking</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>24-hour and 5-day weather forecasting with detailed metrics</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Real-time notifications for work opportunities and platform updates</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Direct integration with government market data (agmarket.gov.in)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Responsibilities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">User Responsibilities by Role</h2>
              <p className="text-xl text-gray-600">
                Each user type has specific responsibilities within the FarmEase agricultural ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userTypes.map((userType, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{userType.icon}</div>
                      <CardTitle className="text-xl">{userType.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {userType.responsibilities.map((responsibility, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700 text-sm">{responsibility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Accuracy Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-orange-600" />
                  Data Accuracy & User Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Critical Information Requirements</h3>
                  <p>
                    During signup, job applications, or partnership requests, users must provide accurate personal and
                    regional information including full name, email, mobile number, and complete address details. The
                    correctness of this information is entirely the user&apos;s responsibility.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Impact</h3>
                  <p>
                    Accurate regional information (area, state, zip code) is essential for location-based services
                    including weather forecasting, AI recommendations, labor matching, and market data delivery.
                    Incorrect details may significantly affect service quality and feature accessibility.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-800 font-medium">
                    <strong>Important:</strong> Inaccurate information may result in incorrect AI recommendations,
                    failed weather forecasting, poor labor matching, or incomplete service delivery. Users are
                    responsible for updating their information when changes occur.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Rules */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Rules & Guidelines</h2>
              <p className="text-xl text-gray-600">
                Essential rules for maintaining a safe and productive agricultural community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platformRules.map((rule, index) => (
                <Card key={index} className="border-l-4 border-l-green-600">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{rule.title}</h3>
                    <p className="text-gray-600">{rule.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI & Data Usage */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Services & Data Usage</h2>
              <p className="text-xl text-gray-600">Understanding how our AI systems and data integration work</p>
            </div>

            <div className="space-y-6">
              {aiDataUsage.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-purple-600">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited Activities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
              <p className="text-xl text-gray-600">
                The following activities are strictly prohibited on the FarmEase platform
              </p>
            </div>

            <Card className="border-l-4 border-l-red-600">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {prohibitedActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 font-semibold text-xs">✕</span>
                      </div>
                      <p className="text-gray-700">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="mr-3 h-6 w-6 text-orange-600" />
                  Limitation of Liability & Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                  <p>
                    AI-generated crop and fertilizer recommendations are based on available environmental data and
                    should supplement, not replace, professional agricultural consultation. Users are responsible for
                    their farming decisions and outcomes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Weather & Market Data</h3>
                  <p>
                    Weather forecasts and market prices are provided for informational purposes. We are not responsible
                    for farming decisions, financial losses, or crop damage based on this information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AgroBridge Labor Platform</h3>
                  <p>
                    FarmEase facilitates connections between farmers and laborers but is not responsible for work
                    quality, safety, payment disputes, or agreements made between users.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Availability</h3>
                  <p>
                    While we strive for continuous availability, FarmEase is provided &quot;as is&quot; without
                    warranties. We do not guarantee uninterrupted service or error-free AI recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Clock className="mr-3 h-6 w-6 text-blue-600" />
                  Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <p>
                  FarmEase reserves the right to modify these Terms of Service to reflect new features, AI improvements,
                  or legal requirements. When we make changes:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Users will be notified via email, platform notifications, or announcements</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Updated terms will be posted with a new &quot;Last updated&quot; date</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Continued platform use constitutes acceptance of new terms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Users who disagree with changes may terminate their accounts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Questions About These Terms?</h2>
            <p className="text-xl text-green-100 mb-8">
              Contact us for any questions about these Terms of Service or platform usage
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <Mail className="h-8 w-8 mx-auto mb-2 text-green-100" />
                  <CardTitle>Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100">legal@farmease.com</p>
                  <p className="text-green-100 text-sm">For legal and terms-related inquiries</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <Phone className="h-8 w-8 mx-auto mb-2 text-green-100" />
                  <CardTitle>Phone Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100">+91 93920 00041</p>
                  <p className="text-green-100 text-sm">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-lg">
              <p className="text-green-100">
                By using FarmEase, you acknowledge that you have read, understood, and agree to be bound by these Terms
                of Service, including our AI data usage and agricultural service policies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
