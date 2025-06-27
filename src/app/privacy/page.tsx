import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Users, Mail, Phone, MapPin, Calendar, Bot } from "lucide-react"

export default function PrivacyPage() {
  const dataTypes = [
    {
      icon: Users,
      title: "Account Information",
      description:
        "Full name, email, password (encrypted), mobile number, and user role (farmer/laborer/employee/admin)",
    },
    {
      icon: MapPin,
      title: "Location & Regional Data",
      description:
        "Address, area/locality, state, zip code for geo-based services, weather forecasting, and regional market data",
    },
    {
      icon: Database,
      title: "Agricultural Data",
      description:
        "Crop information, fertilizer preferences, work history, job applications, and agricultural activities",
    },
    {
      icon: Bot,
      title: "AI & Usage Data",
      description: "Platform interactions, AI recommendation usage, weather queries, and system performance data",
    },
  ]

  const dataUsage = [
    "Provide AI-powered crop and fertilizer recommendations based on environmental conditions",
    "Deliver accurate weather forecasting with automatic location detection",
    "Connect farmers with laborers through AgroBridge platform and job matching",
    "Send real-time notifications about work opportunities, weather alerts, and platform updates",
    "Provide regional market price data and agricultural insights",
    "Improve AI algorithms and platform functionality through usage analytics",
    "Ensure platform security and prevent unauthorized access",
    "Comply with legal requirements and resolve user disputes",
  ]

  const userRights = [
    {
      title: "Access Your Data",
      description: "Request a complete copy of all personal and agricultural data we have stored",
    },
    {
      title: "Update Information",
      description: "Modify your profile, location, and agricultural preferences through account settings",
    },
    {
      title: "Delete Account",
      description: "Request permanent deletion of your account and all associated agricultural data",
    },
    {
      title: "Data Portability",
      description: "Export your crop data, work history, and platform interactions in standard formats",
    },
    {
      title: "Withdraw Consent",
      description: "Opt-out of AI recommendations, weather notifications, or other non-essential services",
    },
  ]

  const dataResponsibility = [
    "Provide accurate personal information including full name, email, and mobile number",
    "Ensure correct regional information (area, state, zip code) for location-based services",
    "Keep contact details updated for effective communication and service delivery",
    "Provide truthful agricultural information for accurate AI recommendations",
    "Report any changes in location or farming activities that may affect service quality",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your privacy is fundamental to FarmEase. This policy explains how we collect, use, and protect your personal
            and agricultural data in our AI-powered agricultural platform.
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
                <CardTitle className="text-2xl">Our Commitment to Agricultural Data Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  FarmEase is committed to protecting the privacy and security of our users&apos; personal and
                  agricultural information. As a comprehensive platform serving farmers, laborers, employees, and
                  administrators, we understand the critical importance of maintaining trust and transparency in
                  agricultural data handling.
                </p>
                <p>
                  This Privacy Policy applies to all users of the FarmEase platform and describes our practices
                  regarding the collection, use, storage, and sharing of your personal information, agricultural data,
                  and AI-generated insights.
                </p>
                <p>
                  We recognize that agricultural data is sensitive and valuable, and we are committed to using it
                  responsibly to improve farming outcomes while protecting your privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-xl text-gray-600">
                We collect information to provide AI-powered agricultural services and platform functionality
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dataTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl">{type.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">{type.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-xl text-gray-600">
                Your data powers our AI recommendations and enables comprehensive agricultural services
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {dataUsage.map((usage, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{usage}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Data Responsibility */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Data Responsibility</h2>
              <p className="text-xl text-gray-600">
                Accurate information ensures reliable service delivery and optimal AI recommendations
              </p>
            </div>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Database className="mr-3 h-6 w-6 text-orange-600" />
                  User Information Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 mb-4">
                  During signup, job applications, or partnership requests, users must provide accurate personal and
                  regional information. The correctness of this information is your responsibility as it directly
                  affects service quality and delivery.
                </p>
                <div className="space-y-3">
                  {dataResponsibility.map((responsibility, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{responsibility}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <p className="text-orange-800 font-medium">
                    Important: Incorrect details may affect access to certain features, reduce AI recommendation
                    accuracy, or result in incomplete service delivery.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Security & Protection</h2>
              <p className="text-xl text-gray-600">
                We implement robust security measures to protect your agricultural and personal data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                    <Lock className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Encryption</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    All agricultural data and personal information is encrypted using industry-standard protocols
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Secure Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Data is stored in secure, monitored databases with regular backups and strict access controls
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Strict access controls ensure only authorized personnel can access your information
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
              <p className="text-xl text-gray-600">
                You have complete control over your agricultural and personal data
              </p>
            </div>

            <div className="space-y-6">
              {userRights.map((right, index) => (
                <Card key={index} className="border-l-4 border-l-green-600">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                        <p className="text-gray-600">{right.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Sharing & Third Parties</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">We DO NOT sell your agricultural data</h3>
                    <p className="text-gray-600">
                      FarmEase does not sell, rent, or trade your personal information or agricultural data to third
                      parties for marketing or commercial purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Limited Data Sharing</h3>
                    <p className="text-gray-600 mb-3">
                      We may share your information only in these specific circumstances:
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>With your explicit consent for specific agricultural services</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Government agricultural data integration (agmarket.gov.in) for market prices</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>To comply with legal obligations or court orders</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>With trusted AI service providers under strict confidentiality agreements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Questions About Privacy?</h2>
            <p className="text-xl text-green-100 mb-8">Contact us for any privacy-related questions or data requests</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <Mail className="h-8 w-8 mx-auto mb-2 text-green-100" />
                  <CardTitle>Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100">privacy@farmease.com</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <Phone className="h-8 w-8 mx-auto mb-2 text-green-100" />
                  <CardTitle>Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100">+91 93920 00041</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-100" />
                  <CardTitle>Policy Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100">We&apos;ll notify you of any changes</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-lg">
              <p className="text-green-100">
                <strong>Policy Updates:</strong> We may update this Privacy Policy periodically to reflect new features
                or legal requirements. Users will be notified of significant changes via email or platform
                notifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
