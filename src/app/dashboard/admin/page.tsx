"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { 
  Users, 
  Building, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Shield,
  CalendarDays,
  User,
  Activity,
  Briefcase,
  HelpCircle,
  PieChart
} from "lucide-react"

// Import section components
import Overview from "./overview/page"
import ApplySync from "./apply-sync/page"
import ManageEmployees from "./manage-employees/page"
import ManagePartners from "./manage-partners/page"
import Stats from "./quick-stats/page"
import TicketManagement from "./ticket-management/page"

interface DashboardStats {
  totalUsers: number
  farmers: number
  labourers: number
  employees: number
  activeUsers: number
  newUsersThisMonth: number
  totalQueries: number
  resolvedQueries: number
  totalTickets: number
  openTickets: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [currentUser, setCurrentUser] = useState("")
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    farmers: 0,
    labourers: 0,
    employees: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalQueries: 0,
    resolvedQueries: 0,
    totalTickets: 0,
    openTickets: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "admin") {
      router.push("/login")
      return
    }

    setCurrentUser(username)
    fetchDashboardStats()
  }, [router])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 1250,
        farmers: 850,
        labourers: 320,
        employees: 45,
        activeUsers: 980,
        newUsersThisMonth: 45,
        totalQueries: 28,
        resolvedQueries: 22,
        totalTickets: 15,
        openTickets: 3,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const today = format(new Date(), "EEEE, MMMM d, yyyy")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6 lg:py-8">
            {/* Left - Date Widget */}
            <div className="flex items-center space-x-3 bg-indigo-50 px-4 py-3 rounded-lg shadow-sm">
              <CalendarDays className="h-6 w-6 text-indigo-600" />
              <span className="text-base font-semibold text-indigo-800">{today}</span>
            </div>

            {/* Center - Dashboard Title */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">Manage your FarmEase platform efficiently</p>
            </div>

            {/* Right - User Info Widget */}
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
              <User className="h-5 w-5 text-gray-500" />
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome Back</p>
                <p className="font-bold text-gray-900">{currentUser}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Platform Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{currentUser}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-6 w-6 text-indigo-100" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.totalUsers}</div>
              <div className="text-indigo-100 text-sm lg:text-base">Total Users</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="flex justify-center mb-2">
                <Activity className="h-6 w-6 text-teal-100" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.activeUsers}</div>
              <div className="text-teal-100 text-sm lg:text-base">Active Users</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="flex justify-center mb-2">
                <HelpCircle className="h-6 w-6 text-rose-100" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.openTickets}</div>
              <div className="text-rose-100 text-sm lg:text-base">Open Tickets</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="flex justify-center mb-2">
                <Briefcase className="h-6 w-6 text-amber-100" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stats.newUsersThisMonth}</div>
              <div className="text-amber-100 text-sm lg:text-base">New This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Sections */}
        

        {/* Tabs Section */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto bg-gray-50 p-1 rounded-none">
                  <TabsTrigger 
                    value="overview" 
                    className="py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                  >
                    <PieChart className="h-5 w-5" />
                    <span className="text-xs font-medium">Overview</span>
                  </TabsTrigger>

                  <TabsTrigger 
                    value="stats" 
                    className="py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs font-medium">Stats</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="employees" 
                    className="py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-xs font-medium">Employees</span>
                  </TabsTrigger>

                  
                  
                  <TabsTrigger 
                    value="partners" 
                    className="py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                  >
                    <Building className="h-5 w-5" />
                    <span className="text-xs font-medium">Partners</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tickets" 
                    className="py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs font-medium">Tickets</span>
                  </TabsTrigger>


                  <TabsTrigger 
                    value="apply-sync" 
                    className="py-4 flex flex-col items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
                  >
                    <FileText className="h-5 w-5" />
                    <span className="text-xs font-medium">Applications</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="overview">
                  <Overview />
                </TabsContent>

                <TabsContent value="stats">
                  <Stats stats={stats} />
                </TabsContent>

                <TabsContent value="employees">
                  <ManageEmployees />
                </TabsContent>

                <TabsContent value="partners">
                  <ManagePartners />
                </TabsContent>

                <TabsContent value="tickets">
                  <TicketManagement
                    tickets={[]} // Replace with actual tickets data
                    employees={[]} // Replace with actual employees data
                    onRefresh={() => {}} // Replace with actual refresh handler
                    onShowDeleteConfirmation={() => {}} // Replace with actual handler
                    // Add other required props with appropriate values
                  />
                </TabsContent>

                   <TabsContent value="apply-sync">
                  <ApplySync />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}