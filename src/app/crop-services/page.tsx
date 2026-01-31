"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sprout, Beaker, Database, Loader2, Sparkles, Brain, Leaf, ChevronRight } from "lucide-react"
import CropRecommendation from "@/app/crop-services/crop-recommendations"
import FertilizerRecommendation from "@/app/crop-services/fertilizer-recommendations"
import MyCrops from "@/app/crop-services/my-crops"

interface User {
  userType: string
  username: string
}

const tabConfig = [
  {
    id: "crop-recommendation",
    label: "Crop Advisory",
    shortLabel: "Crops",
    icon: Sprout,
    gradient: "from-emerald-500 to-green-600",
    bgGradient: "from-emerald-50 to-green-50",
    iconBg: "bg-emerald-500",
    description: "AI-powered crop recommendations based on soil and climate conditions",
  },
  {
    id: "fertilizer-recommendation",
    label: "Fertilizer Guide",
    shortLabel: "Fertilizer",
    icon: Beaker,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-500",
    description: "Smart fertilizer suggestions to optimize your crop yield",
  },
  {
    id: "my-crops",
    label: "My Crops",
    shortLabel: "My Crops",
    icon: Database,
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-500",
    description: "Track and manage all your saved crop recommendations",
  },
]

export default function CropServicesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("crop-recommendation")

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-gray-600">Loading Crop Services...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const currentTab = tabConfig.find(tab => tab.id === activeTab) || tabConfig[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="lg:hidden py-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/farmer")}
                className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Button>

              <Badge className="bg-emerald-100 text-emerald-700 font-medium">
                {user.username}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Crop Services</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI-powered farming solutions
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between py-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/farmer")}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Dashboard</span>
            </Button>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
                <Sprout className="h-7 w-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Smart Crop Services</h1>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Brain className="h-4 w-4" />
                  AI-powered recommendations for better yields
                </p>
              </div>
            </div>

            <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 font-semibold px-4 py-2">
              Welcome, {user.username}
            </Badge>
          </div>

          {/* Tab Navigation */}
          <div className="pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabConfig.map((tab) => {
                const isActive = activeTab === tab.id
                const IconComponent = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Tab Header Card */}
        <motion.div
          key={activeTab + "-header"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className={`border-0 shadow-lg bg-gradient-to-br ${currentTab.bgGradient} overflow-hidden`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${currentTab.iconBg} shadow-lg`}>
                  <currentTab.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{currentTab.label}</h2>
                  <p className="text-gray-600 text-sm">{currentTab.description}</p>
                </div>
                <Badge className="hidden sm:flex bg-white/60 text-gray-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "crop-recommendation" && <CropRecommendation />}
            {activeTab === "fertilizer-recommendation" && <FertilizerRecommendation />}
            {activeTab === "my-crops" && <MyCrops />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
