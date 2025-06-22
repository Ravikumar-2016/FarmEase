"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sprout, ArrowRight, Sun, Users, TrendingUp, Bug, Shield } from "lucide-react"

export default function FarmerDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* First Row - Primary Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Crop Services */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-l-4 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sprout className="h-6 w-6 text-green-600" />
                  Crop Services
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    AI Powered
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Get AI-powered crop recommendations and management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Services:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Crop Recommendation System</li>
                      <li>• Fertilizer Calculator</li>
                      <li>• My Crops Management</li>
                      <li>• Soil Analysis Integration</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full group-hover:bg-green-600 transition-colors bg-green-500 hover:bg-green-600"
                    onClick={() => router.push("/crop-services")}
                  >
                    Access Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weather Services */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-l-4 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sun className="h-6 w-6 text-blue-600" />
                  Weather Forecast
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Live Data
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time weather updates and farming recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Features:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Hyperlocal Weather Alerts</li>
                      <li>• 7-Day Forecast</li>
                      <li>• Irrigation Recommendations</li>
                      <li>• Frost/Warning Alerts</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full group-hover:bg-blue-600 transition-colors bg-blue-500 hover:bg-blue-600"
                    onClick={() => router.push("/weather")}
                  >
                    View Forecast
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AgroBridge */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-l-4 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                  AgroBridge
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    New
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Connect with farm laborers and manage work requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Features:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Post Work Requests</li>
                      <li>• Laborer Management</li>
                      <li>• Payment Tracking</li>
                      <li>• Work History</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full group-hover:bg-purple-600 transition-colors bg-purple-500 hover:bg-purple-600"
                    onClick={() => router.push("/agrobridge")}
                  >
                    Manage Workers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Upcoming Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Market Prices */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-l-4 border-amber-500 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  Market Prices
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    Govt Data
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Access real-time mandi prices from official sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Coverage:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 1,000+ mandis nationwide</li>
                      <li>• 300+ commodities</li>
                      <li>• Historical trends</li>
                      <li>• Daily updates</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <div className="p-3 bg-white rounded-md border border-amber-200 text-center">
                      <p className="text-sm font-medium text-amber-600">
                       Official source: <span className="text-amber-600">agmarknet.gov.in</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pesticide Detection */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-l-4 border-indigo-500 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bug className="h-6 w-6 text-indigo-600" />
                  Pesticide Scan
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    Coming Soon
                  </Badge>
                </CardTitle>
                <CardDescription>
                  AI-powered pesticide residue detection from images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Image-based analysis</li>
                      <li>• Safety recommendations</li>
                      <li>• Organic alternatives</li>
                      <li>• Exportable reports</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <div className="p-3 bg-white rounded-md border border-indigo-200 text-center">
                      <p className="text-sm font-medium text-indigo-600">
                        We'll launch this feature soon
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crop Protection */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-l-4 border-teal-500 bg-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-6 w-6 text-teal-600" />
                  Crop Protection
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    Coming Soon
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Disease prediction and prevention system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Early disease detection</li>
                      <li>• Weather-based alerts</li>
                      <li>• Treatment plans</li>
                      <li>• Expert consultations</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <div className="p-3 bg-white rounded-md border border-teal-200 text-center">
                      <p className="text-sm font-medium text-teal-600">
                        This feature is in development
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}



