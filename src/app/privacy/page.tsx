import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Users, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function PrivacyPage() {
  const dataTypes = [
    {
      icon: Users,
      title: "Account Information",
      description: "Username, email, password (encrypted), account type (farmer/laborer/employee/admin)",
    },
    {
      icon: Phone,
      title: "Contact Details",
      description: "Mobile number, address, area/locality, state, zip code for geo-based services",
    },
    {
      icon: Database,
      title: "Agricultural Data",
      description: "Crop information, market preferences, labor history, work assignments",
    },
    {
      icon: MapPin,
      title: "Location Data",
      description: "Geographic location for matching farmers with nearby laborers and markets",
    },
  ]

  const dataUsage = [
    "Provide personalized agricultural recommendations and market data",
    "Connect farmers with nearby laborers and agricultural services",
    "Send notifications about job opportunities, market prices, and platform updates",
    "Improve platform functionality and user experience",
    "Ensure platform security and prevent fraudulent activities",
    "Comply with legal requirements and resolve disputes",
  ]

  const userRights = [
    {
      title: "Access Your Data",
      description: "Request a copy of all personal data we have about you",
    },
    {
      title: "Update Information",
      description: "Modify your profile information through account settings",
    },
    {
      title: "Delete Account",
      description: "Request permanent deletion of your account and associated data",
    },
    {
      title: "Data Portability",
      description: "Export your data in a commonly used format",
    },
    {
      title: "Withdraw Consent",
      description: "Opt-out of non-essential data processing activities",
    },
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
            Your privacy is important to us. This policy explains how FarmEase collects, uses, and protects your
            personal information in our agricultural platform.
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
                <CardTitle className="text-2xl">Our Commitment to Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  FarmEase is committed to protecting the privacy and security of our users&apos; personal information.
                  As an agricultural platform serving farmers, laborers, employees, and administrators, we understand
                  the importance of maintaining trust and transparency in how we handle your data.
                </p>
                <p>
                  This Privacy Policy applies to all users of the FarmEase platform and describes our practices
                  regarding the collection, use, storage, and sharing of your personal information.
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
                We collect information to provide better agricultural services and platform functionality
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
                Your data helps us provide personalized agricultural services and improve platform functionality
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

      {/* Data Security */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Security & Protection</h2>
              <p className="text-xl text-gray-600">
                We implement robust security measures to protect your personal information
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
                    All sensitive data is encrypted both in transit and at rest using industry-standard protocols
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
                    Data is stored in secure, monitored databases with regular backups and access controls
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
              <p className="text-xl text-gray-600">You have control over your personal information and how it&apos;s used</p>
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Sharing & Third Parties</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">We DO NOT sell your personal data</h3>
                    <p className="text-gray-600">
                      FarmEase does not sell, rent, or trade your personal information to third parties for marketing
                      purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Limited Sharing</h3>
                    <p className="text-gray-600 mb-3">
                      We may share your information only in these specific circumstances:
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>With your explicit consent for specific services</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>To comply with legal obligations or court orders</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          With trusted service providers who help operate our platform (under strict confidentiality
                          agreements)
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>In case of business merger or acquisition (users will be notified)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cookies & Tracking */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Cookies & Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <p>
                  FarmEase uses cookies and similar technologies to enhance your experience and improve our services:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Essential Cookies:</strong> Required for basic platform functionality and security
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Functional Cookies:</strong> Remember your preferences and settings
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform
                    </span>
                  </li>
                </ul>
                <p>
                  You can control cookie preferences through your browser settings, though disabling certain cookies may
                  affect platform functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Updates */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Questions About Privacy?</h2>
            <p className="text-xl text-green-100 mb-8">
              We&apos;re here to help you understand how we protect your information
            </p>

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
                <strong>Policy Updates:</strong> We may update this Privacy Policy periodically. Users will be notified
                of significant changes via email or platform notifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
