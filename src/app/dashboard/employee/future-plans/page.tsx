"use client"

import React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Lightbulb,
  ArrowLeft,
  Bot,
  Smartphone,
  Globe,
  DollarSign,
  Camera,
  Wrench,
  BarChart3,
  Shield,
  MessageSquare,
  Users,
  Zap,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react"

export default function FuturePlansPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("ai")

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "employee") {
      router.push("/login")
      return
    }
  }, [router])

  const aiFeatures = [
    {
      icon: BarChart3,
      title: "Market Analytics AI",
      description: "Predictive market analysis and price forecasting using machine learning",
      timeline: "Q3 2024",
      priority: "Medium",
      status: "Planning",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Crop Protection AI",
      description: "Intelligent pest and disease prevention with automated monitoring systems",
      timeline: "Q4 2024",
      priority: "Medium",
      status: "Research",
      color: "from-orange-500 to-orange-600",
    },
  ]

  const platformFeatures = [
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Native Android and iOS apps with offline capabilities and real-time sync",
      timeline: "Q2 2024",
      priority: "High",
      status: "Development",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Platform available in Hindi, Telugu, Tamil, Bengali, and other regional languages",
      timeline: "Q3 2024",
      priority: "High",
      status: "Planning",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: TrendingUp,
      title: "Real-time Market Integration",
      description: "Live market price updates and trend analysis from multiple government sources",
      timeline: "Q1 2024",
      priority: "Medium",
      status: "Integration",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Enhanced platform speed, reliability, and user experience improvements",
      timeline: "Ongoing",
      priority: "High",
      status: "Active",
      color: "from-red-500 to-red-600",
    },
  ]

  const serviceFeatures = [
    {
      icon: Wrench,
      title: "Equipment Rental Marketplace",
      description: "Comprehensive platform for agricultural machinery and equipment rental services",
      timeline: "Q2 2024",
      priority: "Medium",
      status: "Design Phase",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: DollarSign,
      title: "Financial Services Integration",
      description: "Crop loans, insurance, and financial planning tools integrated with banks",
      timeline: "Q4 2024",
      priority: "High",
      status: "Partnership",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Shield,
      title: "Crop Insurance Platform",
      description: "Comprehensive crop protection and insurance management system",
      timeline: "Q3 2024",
      priority: "Medium",
      status: "Research",
      color: "from-violet-500 to-violet-600",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description: "Detailed insights and analytics for farmers, laborers, and administrators",
      timeline: "Q2 2024",
      priority: "Medium",
      status: "Development",
      color: "from-pink-500 to-pink-600",
    },
  ]

  const communityFeatures = [
    {
      icon: MessageSquare,
      title: "Farmer Community Forums",
      description: "Interactive discussion platforms for knowledge sharing and peer support",
      timeline: "Q2 2024",
      priority: "Medium",
      status: "Design",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Expert Consultation Network",
      description: "Direct access to agricultural experts, consultants, and extension officers",
      timeline: "Q3 2024",
      priority: "High",
      status: "Partnership",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Target,
      title: "Training & Certification Programs",
      description: "Online courses and certification programs for modern farming techniques",
      timeline: "Q4 2024",
      priority: "Medium",
      status: "Content Creation",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Lightbulb,
      title: "Innovation Hub",
      description: "Platform for showcasing agricultural innovations and startup collaborations",
      timeline: "Q1 2025",
      priority: "Low",
      status: "Concept",
      color: "from-orange-500 to-orange-600",
    },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-100 text-red-800 border-red-300">High Priority</Badge>
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium Priority</Badge>
      case "Low":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Low Priority</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      "In Development": "bg-blue-100 text-blue-800 border-blue-300",
      "Testing Phase": "bg-purple-100 text-purple-800 border-purple-300",
      Planning: "bg-gray-100 text-gray-800 border-gray-300",
      Research: "bg-orange-100 text-orange-800 border-orange-300",
      Development: "bg-indigo-100 text-indigo-800 border-indigo-300",
      Integration: "bg-teal-100 text-teal-800 border-teal-300",
      Active: "bg-green-100 text-green-800 border-green-300",
      "Design Phase": "bg-pink-100 text-pink-800 border-pink-300",
      Partnership: "bg-cyan-100 text-cyan-800 border-cyan-300",
      Design: "bg-violet-100 text-violet-800 border-violet-300",
      "Content Creation": "bg-amber-100 text-amber-800 border-amber-300",
      Concept: "bg-red-100 text-red-800 border-red-300",
    }
    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300"}>{status}</Badge>
  }
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  timeline: string;
  priority: string;
  status: string;
  color: string;
}

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const IconComponent = feature.icon;
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}
          >
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col gap-2">
            {getPriorityBadge(feature.priority)}
            {getStatusBadge(feature.status)}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{feature.timeline}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

  const tabOptions = [
    { value: "ai", label: "AI & Technology", icon: Bot, color: "blue" },
    { value: "platform", label: "Platform Updates", icon: Smartphone, color: "green" },
    { value: "services", label: "New Services", icon: Wrench, color: "purple" },
    { value: "community", label: "Community", icon: Users, color: "orange" },
  ]

  const getCurrentFeatures = () => {
    switch (activeTab) {
      case "ai":
        return aiFeatures
      case "platform":
        return platformFeatures
      case "services":
        return serviceFeatures
      case "community":
        return communityFeatures
      default:
        return aiFeatures
    }
  }

  const getCurrentTitle = () => {
    switch (activeTab) {
      case "ai":
        return "AI & Technology Innovations"
      case "platform":
        return "Platform Enhancements"
      case "services":
        return "Agricultural Services Expansion"
      case "community":
        return "Community & Knowledge Sharing"
      default:
        return "AI & Technology Innovations"
    }
  }

  const getCurrentDescription = () => {
    switch (activeTab) {
      case "ai":
        return "Advanced artificial intelligence and technology features to revolutionize agriculture"
      case "platform":
        return "Core platform improvements and new user experience features"
      case "services":
        return "New services and integrations to support the complete agricultural ecosystem"
      case "community":
        return "Building a strong agricultural community with knowledge sharing and collaboration tools"
      default:
        return "Advanced artificial intelligence and technology features to revolutionize agriculture"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - Desktop */}
      <div className="hidden md:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/employee")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Future Plans & Roadmap</h1>
                <p className="text-gray-600">Strategic development plans and upcoming innovations</p>
              </div>
            </div>
            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Header - Mobile */}
      <div className="md:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/employee")}
              className="flex items-center space-x-1 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>

            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Future Plans</h1>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center mt-2">
            Development roadmap & innovations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{aiFeatures.length}</div>
              <div className="text-blue-100">AI Features</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{platformFeatures.length}</div>
              <div className="text-green-100">Platform Updates</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{serviceFeatures.length}</div>
              <div className="text-purple-100">New Services</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{communityFeatures.length}</div>
              <div className="text-orange-100">Community Features</div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-lg p-1 gap-1">
              {tabOptions.map((tab) => {
                const IconComponent = tab.icon;
                const activeColorClass = {
                  'blue': 'data-[state=active]:bg-blue-500 data-[state=active]:text-white',
                  'green': 'data-[state=active]:bg-green-500 data-[state=active]:text-white',
                  'purple': 'data-[state=active]:bg-purple-500 data-[state=active]:text-white',
                  'orange': 'data-[state=active]:bg-orange-500 data-[state=active]:text-white',
                }[tab.color] || 'data-[state=active]:bg-blue-500 data-[state=active]:text-white';

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`flex items-center justify-center gap-2 p-3 rounded-md transition-colors ${activeColorClass}`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {React.createElement(tabOptions.find((tab) => tab.value === activeTab)?.icon || Bot, {
                      className: "h-5 w-5",
                    })}
                    {getCurrentTitle()}
                  </CardTitle>
                  <CardDescription>{getCurrentDescription()}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getCurrentFeatures().map((feature, index) => (
                      <FeatureCard key={index} feature={feature} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile Select Dropdown */}
        <div className="md:hidden space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
              <CardTitle className="text-lg">Select Category</CardTitle>
              <div className="space-y-3">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                    {tabOptions.map((tab) => {
                      const IconComponent = tab.icon
                      return (
                        <SelectItem
                          key={tab.value}
                          value={tab.value}
                          className="py-3 px-4 hover:bg-blue-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {tab.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                {React.createElement(tabOptions.find((tab) => tab.value === activeTab)?.icon || Bot, {
                  className: "h-5 w-5",
                })}
                {getCurrentTitle()}
              </CardTitle>
              <CardDescription className="text-sm">{getCurrentDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4">
                {getCurrentFeatures().map((feature, index) => (
                  <FeatureCard key={index} feature={feature}/>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Vision */}
        <Card className="shadow-lg border-0 mt-8">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5" />
              Strategic Vision 2024-2025
            </CardTitle>
            <CardDescription>Our long-term vision for transforming agriculture through technology</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600">Q1-Q2 2024: Foundation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Mobile app development and testing</li>
                  <li>• Real-time market integration</li>
                  <li>• Enhanced AI crop recommendations</li>
                  <li>• Community forums launch</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-600">Q3-Q4 2024: Expansion</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multilingual platform support</li>
                  <li>• Equipment rental marketplace</li>
                  <li>• Advanced market analytics</li>
                  <li>• Expert consultation network</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-600">2025: Innovation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Financial services integration</li>
                  <li>• Training & certification programs</li>
                  <li>• Innovation hub platform</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}