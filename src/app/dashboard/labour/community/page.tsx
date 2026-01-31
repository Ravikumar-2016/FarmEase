"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/app/hooks/use-toast"
import {
  ArrowLeft,
  Sprout,
  Bug,
  Cloud,
  Users,
  TrendingUp,
  MessageCircle,
  Clock,
  Plus,
  Search,
  ShieldCheck,
  Award,
  Star,
  Sparkles,
  Send,
  ThumbsUp,
  Bookmark,
  ChevronRight,
  Flame,
  Zap,
  HelpCircle,
  Lightbulb,
  Heart,
  Loader2,
  X,
} from "lucide-react"

// Discussion categories with enhanced data
const CATEGORIES = [
  {
    id: "crop-problems",
    title: "Crop Problems",
    subtitle: "& Solutions",
    description: "Get help with crop issues, diseases, and growth problems",
    icon: Sprout,
    gradient: "from-emerald-500 to-green-600",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    count: 156,
    activeUsers: 23,
  },
  {
    id: "pest-disease",
    title: "Pest & Disease",
    subtitle: "Identification",
    description: "Identify pests and get treatment recommendations",
    icon: Bug,
    gradient: "from-rose-500 to-red-600",
    lightBg: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    count: 98,
    activeUsers: 15,
  },
  {
    id: "weather-tips",
    title: "Weather Tips",
    subtitle: "& Alerts",
    description: "Share weather insights and seasonal farming advice",
    icon: Cloud,
    gradient: "from-sky-500 to-blue-600",
    lightBg: "bg-sky-50",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
    count: 124,
    activeUsers: 31,
  },
  {
    id: "local-practices",
    title: "Local Practices",
    subtitle: "& Traditions",
    description: "Share regional farming techniques and knowledge",
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    count: 87,
    activeUsers: 12,
  },
  {
    id: "market-prices",
    title: "Market Prices",
    subtitle: "& Trends",
    description: "Discuss market rates, trends, and selling strategies",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    count: 203,
    activeUsers: 45,
  },
]

// Enhanced sample discussions
const SAMPLE_DISCUSSIONS = [
  {
    id: 1,
    title: "Best fertilizer for paddy during monsoon season?",
    excerpt: "I'm growing paddy in Karnataka and need advice on which fertilizer works best during heavy rains...",
    author: "Ramesh Kumar",
    authorAvatar: "RK",
    badge: "Verified Farmer",
    badgeIcon: ShieldCheck,
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    time: "2 hours ago",
    replies: 12,
    views: 156,
    likes: 24,
    category: "crop-problems",
    categoryLabel: "Crop Problems",
    categoryColor: "bg-emerald-100 text-emerald-700",
    isHot: true,
    isPinned: false,
  },
  {
    id: 2,
    title: "How to identify early blight in tomatoes? Need urgent help!",
    excerpt: "My tomato leaves are showing brown spots with rings. Is this early blight? What should I do immediately...",
    author: "Lakshmi Devi",
    authorAvatar: "LD",
    badge: "Experienced Worker",
    badgeIcon: Award,
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    time: "5 hours ago",
    replies: 8,
    views: 89,
    likes: 15,
    category: "pest-disease",
    categoryLabel: "Pest & Disease",
    categoryColor: "bg-rose-100 text-rose-700",
    isHot: false,
    isPinned: true,
  },
  {
    id: 3,
    title: "Rain alert for South India - Prepare your fields now!",
    excerpt: "Heavy rainfall expected in Karnataka, Tamil Nadu, and AP for the next 5 days. Here's how to prepare...",
    author: "Weather Watch",
    authorAvatar: "WW",
    badge: "Agri Expert",
    badgeIcon: Star,
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    time: "1 day ago",
    replies: 45,
    views: 523,
    likes: 89,
    category: "weather-tips",
    categoryLabel: "Weather Tips",
    categoryColor: "bg-sky-100 text-sky-700",
    isHot: true,
    isPinned: true,
  },
  {
    id: 4,
    title: "Traditional pest control methods that actually work",
    excerpt: "I've been using neem oil and garlic spray for 10 years. Let me share my experience with organic methods...",
    author: "Suresh Babu",
    authorAvatar: "SB",
    badge: "Verified Farmer",
    badgeIcon: ShieldCheck,
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    time: "1 day ago",
    replies: 34,
    views: 312,
    likes: 67,
    category: "local-practices",
    categoryLabel: "Local Practices",
    categoryColor: "bg-violet-100 text-violet-700",
    isHot: false,
    isPinned: false,
  },
  {
    id: 5,
    title: "Current onion prices across major mandis - January 2025",
    excerpt: "Compiled prices from Lasalgaon, Nashik, Bangalore, and Kurnool. Prices are expected to rise next week...",
    author: "Market Analyst",
    authorAvatar: "MA",
    badge: "Agri Expert",
    badgeIcon: Star,
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    time: "3 hours ago",
    replies: 67,
    views: 891,
    likes: 123,
    category: "market-prices",
    categoryLabel: "Market Prices",
    categoryColor: "bg-amber-100 text-amber-700",
    isHot: true,
    isPinned: false,
  },
  {
    id: 6,
    title: "Drip irrigation setup for small farms - Complete guide",
    excerpt: "Step-by-step guide to set up drip irrigation in less than ₹5000. Includes materials list and tips...",
    author: "Anand Patil",
    authorAvatar: "AP",
    badge: "Experienced Worker",
    badgeIcon: Award,
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    time: "2 days ago",
    replies: 56,
    views: 678,
    likes: 145,
    category: "crop-problems",
    categoryLabel: "Crop Problems",
    categoryColor: "bg-emerald-100 text-emerald-700",
    isHot: false,
    isPinned: false,
  },
]

// Trending topics
const TRENDING_TOPICS = [
  { tag: "Paddy", count: 234, trend: "up" },
  { tag: "Tomato", count: 189, trend: "up" },
  { tag: "Fertilizer", count: 156, trend: "stable" },
  { tag: "RainAlert", count: 145, trend: "up" },
  { tag: "MarketRates", count: 134, trend: "down" },
  { tag: "OrganicFarming", count: 123, trend: "up" },
  { tag: "WaterSaving", count: 98, trend: "stable" },
  { tag: "SoilHealth", count: 87, trend: "up" },
]

// Top contributors
const TOP_CONTRIBUTORS = [
  { name: "Ramesh K.", posts: 45, badge: "Verified Farmer", avatar: "RK" },
  { name: "Lakshmi D.", posts: 38, badge: "Expert", avatar: "LD" },
  { name: "Suresh B.", posts: 32, badge: "Verified Farmer", avatar: "SB" },
]

export default function CommunityPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAskModalOpen, setIsAskModalOpen] = useState(false)
  const [questionTitle, setQuestionTitle] = useState("")
  const [questionDescription, setQuestionDescription] = useState("")
  const [questionCategory, setQuestionCategory] = useState("")
  const [activeTab, setActiveTab] = useState<"latest" | "popular" | "unanswered">("latest")
  const [submitting, setSubmitting] = useState(false)
  const [successNotification, setSuccessNotification] = useState(false)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "labour") {
      router.push("/login")
      return
    }
  }, [router])

  const filteredDiscussions = SAMPLE_DISCUSSIONS.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || d.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (activeTab === "popular") return b.likes - a.likes
    if (activeTab === "unanswered") return a.replies - b.replies
    return 0
  })

  const handleAskQuestion = () => {
    if (!questionTitle.trim() || !questionCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and select a category.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setIsAskModalOpen(false)
      setQuestionTitle("")
      setQuestionDescription("")
      setQuestionCategory("")
      
      // Show success notification
      setSuccessNotification(true)
      
      // Auto-hide after 5 seconds
      setTimeout(() => setSuccessNotification(false), 5000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/labour")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">FarmEase Community</h1>
                  <p className="text-xs text-gray-500">Connect • Learn • Grow Together</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0 px-3 py-1 shadow-md">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </Badge>
              
              <Button 
                onClick={() => setIsAskModalOpen(true)}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Custom Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsAskModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Ask the Community</h2>
                    <p className="text-teal-100 text-sm">Get answers from experienced farmers</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAskModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Question Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Question Title <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Best time to plant wheat in Punjab?"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1.5">Be specific and clear for better responses</p>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    Details <span className="text-gray-400 font-normal">(Optional)</span>
                  </span>
                </label>
                <textarea
                  placeholder="Add more context - your location, crop type, current conditions, what you've already tried..."
                  value={questionDescription}
                  onChange={(e) => setQuestionDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-gray-900 resize-none"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-emerald-500" />
                    Category <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon
                    const isSelected = questionCategory === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setQuestionCategory(cat.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          isSelected 
                            ? `${cat.borderColor} ${cat.lightBg}` 
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 bg-gradient-to-br ${cat.gradient} rounded-lg shadow-sm`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isSelected ? cat.textColor : "text-gray-900"}`}>
                            {cat.title} {cat.subtitle}
                          </p>
                        </div>
                        {isSelected && (
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tip Banner */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-100">
                <p className="text-sm text-teal-800 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-teal-600" />
                  <span><strong>Tip:</strong> Questions with clear titles and details get 3x more responses!</span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAskQuestion}
                disabled={!questionTitle.trim() || !questionCategory || submitting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-xl font-medium hover:from-teal-700 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Post Question
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-gray-900">Question Posted! 🎉</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your question is now visible to the community. You&apos;ll be notified when someone replies.
                </p>
              </div>
              <button
                onClick={() => setSuccessNotification(false)}
                className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-[shrink_5s_linear_forwards]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 p-8 mb-8 shadow-xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome to the Community! 👋</h2>
                <p className="text-teal-100 text-lg max-w-xl">
                  Join thousands of farmers sharing knowledge, solving problems, and growing together.
                </p>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-medium text-white">
                          {["RK", "LD", "SB", "AP"][i-1]}
                        </div>
                      ))}
                    </div>
                    <span className="text-teal-100 text-sm">+2.5k members online</span>
                  </div>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="w-full md:w-96">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search discussions, topics, experts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 bg-white/95 backdrop-blur border-0 shadow-lg text-gray-900 placeholder:text-gray-500 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Discussions", value: "668", icon: MessageCircle, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Active Members", value: "2,547", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Questions Answered", value: "94%", icon: ThumbsUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Expert Contributors", value: "126", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 ${stat.bg} rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Browse by Category</h3>
                {selectedCategory && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="text-teal-600">
                    Clear filter
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {CATEGORIES.map((category) => {
                  const IconComponent = category.icon
                  const isSelected = selectedCategory === category.id
                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                        isSelected 
                          ? `${category.borderColor} ${category.lightBg} shadow-md` 
                          : "border-transparent hover:border-gray-200"
                      }`}
                      onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">{category.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{category.count} posts</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Discussion Tabs & List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  {[
                    { id: "latest", label: "Latest", icon: Clock },
                    { id: "popular", label: "Popular", icon: Flame },
                    { id: "unanswered", label: "Unanswered", icon: HelpCircle },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">{filteredDiscussions.length} discussions</span>
              </div>

              {/* Discussions */}
              <div className="space-y-4">
                {filteredDiscussions.map((discussion) => {
                  const BadgeIcon = discussion.badgeIcon
                  return (
                    <Card 
                      key={discussion.id} 
                      className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Left Stats Panel */}
                          <div className="hidden sm:flex flex-col items-center justify-center w-24 py-6 bg-gray-50 border-r border-gray-100">
                            <div className="text-center mb-3">
                              <p className="text-xl font-bold text-gray-900">{discussion.replies}</p>
                              <p className="text-xs text-gray-500">replies</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-600">{discussion.views}</p>
                              <p className="text-xs text-gray-500">views</p>
                            </div>
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 p-5">
                            {/* Badges Row */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {discussion.isPinned && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                  <Bookmark className="h-3 w-3 mr-1" />
                                  Pinned
                                </Badge>
                              )}
                              {discussion.isHot && (
                                <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                              <Badge className={`${discussion.categoryColor} text-xs`}>
                                {discussion.categoryLabel}
                              </Badge>
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                              {discussion.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{discussion.excerpt}</p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                                  {discussion.authorAvatar}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 text-sm">{discussion.author}</span>
                                    <Badge className={`${discussion.badgeColor} text-xs py-0`}>
                                      <BadgeIcon className="h-3 w-3 mr-1" />
                                      {discussion.badge}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-gray-500">{discussion.time}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-gray-500">
                                <div className="flex items-center gap-1 text-sm">
                                  <Heart className="h-4 w-4" />
                                  <span>{discussion.likes}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 group-hover:text-teal-600 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {filteredDiscussions.length === 0 && (
                  <Card className="border-0 shadow-md">
                    <CardContent className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                      <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Trending Topics
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {TRENDING_TOPICS.slice(0, 6).map((topic, i) => (
                    <button
                      key={topic.tag}
                      onClick={() => setSearchTerm(topic.tag)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">#{i + 1}</span>
                        <span className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                          #{topic.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{topic.count}</span>
                        {topic.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Contributors
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {TOP_CONTRIBUTORS.map((user, i) => (
                    <div key={user.name} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                          {user.avatar}
                        </div>
                        {i === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                            <span className="text-xs">👑</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.posts} helpful posts</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{user.badge}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guidelines Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-teal-50 to-emerald-50">
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  Community Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500">✓</span>
                    Be respectful and helpful
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500">✓</span>
                    Share accurate information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500">✓</span>
                    Use clear, specific titles
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500">✓</span>
                    Search before posting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-2 border-dashed border-teal-300 bg-teal-50/50">
              <CardContent className="p-5 text-center">
                <Sparkles className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Have a Question?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get answers from our community of experienced farmers
                </p>
                <Button 
                  onClick={() => setIsAskModalOpen(true)}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                >
                  Ask Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
