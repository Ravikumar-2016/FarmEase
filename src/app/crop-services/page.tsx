"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastContainer } from "@/components/ui/toast-container"
import { ArrowLeft, Sprout, Beaker, Database, Loader2 } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import CropRecommendation from "@/app/crop-services/crop-recommendations"
import FertilizerRecommendation from "@/app/crop-services/fertilizer-recommendations"
import MyCrops from "@/app/crop-services/my-crops"

interface User {
  userType: string
  username: string
}

export default function CropServicesPage() {
  const router = useRouter()
  const { toasts, dismiss } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={dismiss} />

      {/* Page Header - Positioned below global header with proper z-index */}
      <div className="relative z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header - Compact Single Line Layout */}
          <div className="lg:hidden px-3 py-3">
            {/* Top Navigation Line */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-1 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors px-2 py-1 h-8"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="text-xs font-medium">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Sprout className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-center">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">Crop Services</h1>
                </div>
              </div>

              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full text-xs"
              >
                {user.username}
              </Badge>
            </div>

            {/* Subtitle */}
            <div className="text-center">
              <p className="text-xs text-gray-600">AI-powered farming solutions</p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block px-8 py-6">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Dashboard</span>
              </Button>

              {/* Center Title */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                    <Sprout className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Crop Services</h1>
                    <p className="text-gray-600">AI-powered farming solutions</p>
                  </div>
                </div>
              </div>

              {/* Welcome Badge */}
              <div className="flex flex-col items-end">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm"
                >
                  Welcome, {user.username}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-0 max-w-7xl mx-auto py-4 px-3 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Tabs defaultValue="crop-recommendation" className="w-full">
            {/* Mobile-Optimized Compact Tabs */}
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-md border border-gray-200 rounded-lg h-auto p-1 mb-4 lg:p-2 lg:mb-8 lg:rounded-xl lg:shadow-lg">
              <TabsTrigger
                value="crop-recommendation"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-green-50 lg:flex-row lg:gap-2 lg:py-3 lg:px-4 lg:text-sm lg:rounded-lg"
              >
                <Sprout className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-center leading-tight">
                  <span className="block lg:inline">Crop</span>
                  <span className="block lg:inline lg:ml-1">Recommendation</span>
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="fertilizer-recommendation"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-emerald-50 lg:flex-row lg:gap-2 lg:py-3 lg:px-4 lg:text-sm lg:rounded-lg"
              >
                <Beaker className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-center leading-tight">
                  <span className="block lg:inline">Fertilizer</span>
                  <span className="block lg:inline lg:ml-1">Recommendation</span>
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="my-crops"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-blue-50 lg:flex-row lg:gap-2 lg:py-3 lg:px-4 lg:text-sm lg:rounded-lg"
              >
                <Database className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-center leading-tight">
                  <span className="block lg:inline">My</span>
                  <span className="block lg:inline lg:ml-1">Crops</span>
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Tab Contents */}
            <TabsContent value="crop-recommendation" className="space-y-4 lg:space-y-6">
              <Card className="shadow-md border-0 bg-gradient-to-br from-white to-green-50 lg:shadow-lg">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg lg:gap-3 lg:text-xl">
                    <div className="p-1.5 bg-green-100 rounded-lg lg:p-2">
                      <Sprout className="h-4 w-4 text-green-600 lg:h-5 lg:w-5" />
                    </div>
                    <span className="text-base lg:text-xl">AI-Powered Crop Recommendation</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed lg:text-base">
                    Get personalized crop recommendations based on your soil conditions, climate, and nutrient levels
                    using advanced AI algorithms
                  </CardDescription>
                </CardHeader>
              </Card>
              <CropRecommendation />
            </TabsContent>

            <TabsContent value="fertilizer-recommendation" className="space-y-4 lg:space-y-6">
              <Card className="shadow-md border-0 bg-gradient-to-br from-white to-emerald-50 lg:shadow-lg">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg lg:gap-3 lg:text-xl">
                    <div className="p-1.5 bg-emerald-100 rounded-lg lg:p-2">
                      <Beaker className="h-4 w-4 text-emerald-600 lg:h-5 lg:w-5" />
                    </div>
                    <span className="text-base lg:text-xl">Smart Fertilizer Recommendation</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed lg:text-base">
                    Optimize your crop yield with AI-recommended fertilizers tailored to your specific soil and
                    environmental conditions
                  </CardDescription>
                </CardHeader>
              </Card>
              <FertilizerRecommendation />
            </TabsContent>

            <TabsContent value="my-crops" className="space-y-4 lg:space-y-6">
              <Card className="shadow-md border-0 bg-gradient-to-br from-white to-blue-50 lg:shadow-lg">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg lg:gap-3 lg:text-xl">
                    <div className="p-1.5 bg-blue-100 rounded-lg lg:p-2">
                      <Database className="h-4 w-4 text-blue-600 lg:h-5 lg:w-5" />
                    </div>
                    <span className="text-base lg:text-xl">My Crops Collection</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed lg:text-base">
                    Manage and track all your saved crop recommendations, farming data, and cultivation history in one
                    place
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
