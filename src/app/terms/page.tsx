import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Shield, AlertTriangle, FileText, Clock, Mail, Phone } from "lucide-react"

export default function TermsPage() {
  const userTypes = [
    {
      icon: "👨‍🌾",
      title: "Farmers",
      responsibilities: [
        "Provide accurate crop and contact information",
        "Use labor management features responsibly",
        "Respect laborers' rights and agreed terms",
        "Report issues through proper channels",
      ],
    },
    {
      icon: "👷‍♂️",
      title: "Laborers",
      responsibilities: [
        "Maintain accurate profile and availability",
        "Honor work commitments and agreements",
        "Communicate professionally with farmers",
        "Report any workplace issues promptly",
      ],
    },
    {
      icon: "🧑‍💼",
      title: "Employees",
      responsibilities: [
        "Handle user queries professionally and promptly",
        "Maintain data accuracy and integrity",
        "Protect user privacy and confidential information",
        "Follow platform guidelines and procedures",
      ],
    },
    {
      icon: "🛠️",
      title: "Administrators",
      responsibilities: [
        "Ensure platform security and performance",
        "Manage user accounts and resolve disputes",
        "Maintain system integrity and data protection",
        "Oversee employee performance and platform operations",
      ],
    },
  ]

  const prohibitedActivities = [
    "Creating fake accounts or providing false information",
    "Harassment, discrimination, or abusive behavior toward other users",
    "Posting inappropriate, offensive, or illegal content",
    "Attempting to hack, disrupt, or compromise platform security",
    "Using the platform for non-agricultural or commercial spam purposes",
    "Sharing login credentials or allowing unauthorized access to accounts",
    "Violating intellectual property rights or applicable laws",
    "Manipulating market data or providing false agricultural information",
  ]

  const platformRules = [
    {
      title: "Account Security",
      description: "Users are responsible for maintaining the security of their accounts and passwords",
    },
    {
      title: "Accurate Information",
      description: "All information provided must be truthful, current, and complete",
    },
    {
      title: "Respectful Communication",
      description: "All interactions must be professional, respectful, and appropriate",
    },
    {
      title: "Compliance",
      description: "Users must comply with all applicable local, state, and national laws",
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
            These terms govern your use of the FarmEase agricultural platform. By using our services, you agree to
            comply with these terms and conditions.
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
                  Welcome to FarmEase, a comprehensive agricultural platform designed to connect and empower farmers,
                  laborers, employees, and administrators. By accessing or using our platform, you agree to be bound by
                  these Terms of Service.
                </p>
                <p>
                  FarmEase provides tools for crop management, market data access, labor coordination, and agricultural
                  support services. These terms apply to all users regardless of their role (farmer, laborer, employee,
                  or administrator).
                </p>
                <p>
                  If you do not agree with any part of these terms, you may not access or use the FarmEase platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Description */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About FarmEase Platform</h2>
              <p className="text-xl text-gray-600">Understanding our agricultural ecosystem and services</p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Purpose</h3>
                    <p className="text-gray-600">
                      FarmEase is designed to address key agricultural challenges including lack of timely crop advice,
                      inaccessible market data, unstructured labor availability, and poor coordination among
                      stakeholders.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Core Services</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Crop management and agricultural recommendations</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Real-time market price updates and trends</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Labor management and geo-based matching</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Issue reporting and support services</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-xl text-gray-600">
                Each user type has specific responsibilities within the FarmEase ecosystem
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

      {/* Platform Rules */}
      <section className="py-16 bg-gray-50">
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

      {/* Intellectual Property */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-blue-600" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Ownership</h3>
                  <p>
                    The FarmEase platform, including its design, functionality, content, and technology, is owned by
                    FarmEase and protected by intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Content</h3>
                  <p>
                    Users retain ownership of the content they create (crop data, profiles, messages). By using
                    FarmEase, you grant us a license to use this content to provide our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Agricultural Data</h3>
                  <p>
                    Market prices, crop recommendations, and agricultural advice are sourced from government and public
                    datasets. Users may not redistribute this data without proper attribution.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="py-16 bg-white">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Availability</h3>
                  <p>
                    While we strive for 24/7 availability, FarmEase is provided &quot;as is&quot; without warranties. We do not guarantee uninterrupted service or error-free operation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Agricultural Advice</h3>
                  <p>
                    Crop recommendations and agricultural advice are based on available data and should not replace
                    professional agricultural consultation. Users are responsible for their farming decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Data</h3>
                  <p>
                    Market prices are provided for informational purposes. We are not responsible for trading decisions
                    or financial losses based on this information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Interactions</h3>
                  <p>
                    FarmEase facilitates connections between users but is not responsible for disputes, agreements, or
                    transactions between farmers and laborers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Account Termination */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User-Initiated Termination</h3>
                  <p>
                    Users may terminate their accounts at any time through account settings or by contacting support.
                    Upon termination, access to platform features will be immediately revoked.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform-Initiated Termination</h3>
                  <p>
                    FarmEase reserves the right to suspend or terminate accounts that violate these terms, engage in
                    prohibited activities, or pose security risks to the platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Retention</h3>
                  <p>
                    Upon account termination, personal data will be deleted according to our Privacy Policy. Some
                    information may be retained for legal compliance or legitimate business purposes.
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
                <p>FarmEase reserves the right to modify these Terms of Service at any time. When we make changes:</p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Users will be notified via email or platform notifications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>The updated terms will be posted on this page with a new &quot;Last updated&quot; date</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Continued use of the platform constitutes acceptance of the new terms</span>
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
              Contact us if you have any questions about these Terms of Service
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
                of Service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
