"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sprout, Beaker, Database, Loader2 } from "lucide-react"
import CropRecommendation from "@/app/crop-services/crop-recommendations"
import FertilizerRecommendation from "@/app/crop-services/fertilizer-recommendations"
import MyCrops from "@/app/crop-services/my-crops"

interface User {
  userType: string
  username: string
}

export default function CropServicesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || userType !== "farmer") {
      router.push("/login")
      return
    }

    setUser({ userType, username: username || "" })
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-gray-600 text-sm">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-3 sm:py-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/farmer")}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <h1 className="text-lg font-bold text-gray-900">Crop Services</h1>
              </div>
            </div>
            <div className="w-16">
              {" "}
              {/* Spacer for balance */}
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-2 py-1">
                {user.username}
              </Badge>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/farmer")}
                className="mr-4 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center">
                <Sprout className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Crop Services</h1>
                  <p className="text-sm text-gray-500">AI-powered farming solutions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Welcome, {user.username}
              </Badge>
            </div>
          </div>

          {/* Mobile Subtitle */}
          <div className="lg:hidden pb-3 text-center">
            <p className="text-xs text-gray-500">AI-powered farming solutions</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-3 sm:py-6 px-3 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6">
          <Tabs defaultValue="crop-recommendation" className="w-full">
            {/* Mobile-Optimized Tabs */}
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border rounded-lg h-auto p-1">
              <TabsTrigger
                value="crop-recommendation"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                <Sprout className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  <span className="block sm:inline">Crop</span>
                  <span className="block sm:inline sm:ml-1">Recommendation</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="fertilizer-recommendation"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <Beaker className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  <span className="block sm:inline">Fertilizer</span>
                  <span className="block sm:inline sm:ml-1">Recommendation</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="my-crops"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <Database className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  <span className="block sm:inline">My</span>
                  <span className="block sm:inline sm:ml-1">Crops</span>
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="crop-recommendation" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    AI-Powered Crop Recommendation
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Get personalized crop recommendations based on your soil conditions, climate, and nutrient levels
                  </CardDescription>
                </CardHeader>
              </Card>
              <CropRecommendation />
            </TabsContent>

            <TabsContent value="fertilizer-recommendation" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Beaker className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    Smart Fertilizer Recommendation
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Optimize your crop yield with AI-recommended fertilizers tailored to your specific conditions
                  </CardDescription>
                </CardHeader>
              </Card>
              <FertilizerRecommendation />
            </TabsContent>

            <TabsContent value="my-crops" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Database className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    My Crops Collection
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Manage and track all your saved crop recommendations and farming data
                  </CardDescription>
                </CardHeader>
              </Card>
              <MyCrops />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
