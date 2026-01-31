"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Tractor,
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  Calendar,
  Clock,
  User,
  Loader2,
  Info,
  Lock,
  Sparkles,
  Wheat,
  Droplets,
  Cog,
  Zap,
} from "lucide-react"

// Static machine listings for MVP - no backend needed
const MACHINE_LISTINGS = [
  {
    id: "mach-001",
    name: "Mahindra 575 DI Tractor",
    type: "tractor",
    description: "45 HP tractor, well maintained, suitable for ploughing and transportation",
    hourlyRate: 400,
    dailyRate: 2500,
    providerName: "Ramesh Kumar",
    location: { district: "Karnal", state: "Haryana" },
    condition: "Excellent",
    available: true,
  },
  {
    id: "mach-002",
    name: "Kubota Harvester DC-70",
    type: "harvester",
    description: "Combine harvester for paddy and wheat, 70 HP engine",
    hourlyRate: 1200,
    dailyRate: 8000,
    providerName: "Singh Brothers Farm",
    location: { district: "Ludhiana", state: "Punjab" },
    condition: "Good",
    available: true,
  },
  {
    id: "mach-003",
    name: "Power Sprayer 20L",
    type: "sprayer",
    description: "Battery-operated knapsack sprayer for pesticide application",
    hourlyRate: 100,
    dailyRate: 500,
    providerName: "Kishan Agro Services",
    location: { district: "Nashik", state: "Maharashtra" },
    condition: "Good",
    available: true,
  },
  {
    id: "mach-004",
    name: "Rotavator 5ft",
    type: "rotavator",
    description: "Heavy duty rotavator for soil preparation, fits 35+ HP tractors",
    hourlyRate: 350,
    dailyRate: 2000,
    providerName: "Patel Farm Equipment",
    location: { district: "Ahmedabad", state: "Gujarat" },
    condition: "Excellent",
    available: true,
  },
  {
    id: "mach-005",
    name: "Multi-Crop Thresher",
    type: "thresher",
    description: "Suitable for wheat, paddy, maize - 5 quintal/hour capacity",
    hourlyRate: 500,
    dailyRate: 3000,
    providerName: "Sharma Agri Tools",
    location: { district: "Indore", state: "Madhya Pradesh" },
    condition: "Good",
    available: true,
  },
  {
    id: "mach-006",
    name: "John Deere 5310 Tractor",
    type: "tractor",
    description: "55 HP premium tractor with power steering, AC cabin available",
    hourlyRate: 600,
    dailyRate: 4000,
    providerName: "Modern Farm Solutions",
    location: { district: "Jaipur", state: "Rajasthan" },
    condition: "Excellent",
    available: false,
  },
  {
    id: "mach-007",
    name: "Seed Drill Machine",
    type: "seeder",
    description: "9 row seed drill for precise sowing, works with tractors 35+ HP",
    hourlyRate: 300,
    dailyRate: 1800,
    providerName: "Agri King Services",
    location: { district: "Hisar", state: "Haryana" },
    condition: "Good",
    available: true,
  },
  {
    id: "mach-008",
    name: "Cultivator 9 Tyne",
    type: "cultivator",
    description: "Spring loaded cultivator for field preparation",
    hourlyRate: 250,
    dailyRate: 1500,
    providerName: "Bharat Farmers Co-op",
    location: { district: "Guntur", state: "Andhra Pradesh" },
    condition: "Good",
    available: true,
  },
]

const MACHINE_TYPE_ICONS: Record<string, React.ReactNode> = {
  tractor: <Tractor className="h-6 w-6" />,
  harvester: <Wheat className="h-6 w-6" />,
  sprayer: <Droplets className="h-6 w-6" />,
  rotavator: <Cog className="h-6 w-6" />,
  thresher: <Zap className="h-6 w-6" />,
  seeder: <Sparkles className="h-6 w-6" />,
  cultivator: <Cog className="h-6 w-6" />,
}

interface RequestForm {
  date: string
  duration: string
  phone: string
  notes: string
}

export default function MachineryRentalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<typeof MACHINE_LISTINGS[0] | null>(null)
  const [requestForm, setRequestForm] = useState<RequestForm>({
    date: "",
    duration: "1",
    phone: "",
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [successNotification, setSuccessNotification] = useState<{
    show: boolean
    machineName: string
    providerName: string
  } | null>(null)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username || userType !== "farmer") {
      router.push("/login")
      return
    }

    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [router])

  const filteredMachines = MACHINE_LISTINGS.filter((machine) => {
    const matchesSearch =
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.providerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || machine.type === selectedType
    return matchesSearch && matchesType
  })

  const handleRequestSubmit = () => {
    if (!selectedMachine || !requestForm.date || !requestForm.phone) return

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const machineName = selectedMachine.name
      const providerName = selectedMachine.providerName
      
      setSubmitting(false)
      setShowRequestDialog(false)
      setRequestForm({ date: "", duration: "1", phone: "", notes: "" })
      
      // Show custom success notification
      setSuccessNotification({
        show: true,
        machineName,
        providerName,
      })
      
      // Auto-hide after 5 seconds
      setTimeout(() => setSuccessNotification(null), 5000)
    }, 1000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price)
  }

  const uniqueTypes = [...new Set(MACHINE_LISTINGS.map((m) => m.type))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading machinery listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/farmer")}
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Badge className="bg-amber-400/90 text-amber-900 border-0 px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Community Sharing (Beta)
            </Badge>
          </div>

          <div className="pb-8 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Tractor className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Machine Rental</h1>
                <p className="text-cyan-100 text-sm sm:text-base">
                  Rent farm equipment from local providers
                </p>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-start gap-3">
              <Info className="h-5 w-5 text-cyan-200 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-cyan-50">
                This is a community-driven service. Submit a request and our team will connect
                you with the provider. No online payments - pay directly to the provider.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search machines, locations, or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
                className={selectedType === "all" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
              >
                All
              </Button>
              {uniqueTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={`capitalize whitespace-nowrap ${
                    selectedType === type ? "bg-cyan-600 hover:bg-cyan-700" : ""
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Features Banner */}
        <div className="bg-gray-100 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border text-gray-400 text-sm cursor-not-allowed group relative">
            <Lock className="h-4 w-4" />
            <span>Live Availability</span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Coming soon in Phase 2
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border text-gray-400 text-sm cursor-not-allowed group relative">
            <Lock className="h-4 w-4" />
            <span>Online Booking</span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Coming soon in Phase 2
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border text-gray-400 text-sm cursor-not-allowed group relative">
            <Lock className="h-4 w-4" />
            <span>Online Payment</span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Coming soon in Phase 2
            </span>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredMachines.length}</span> machines
          </p>
        </div>

        {/* Machine Listings */}
        {filteredMachines.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="text-center py-12">
              <Tractor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No machines found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMachines.map((machine) => (
              <Card
                key={machine.id}
                className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
                  !machine.available ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-0">
                  {/* Card Header with Icon */}
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-100 rounded-xl text-cyan-700">
                          {MACHINE_TYPE_ICONS[machine.type] || <Tractor className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {machine.name}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">{machine.type}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          machine.available
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }
                      >
                        {machine.available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                  </div>

                  {/* Machine Details */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {machine.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{machine.providerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>
                          {machine.location.district}, {machine.location.state}
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <div className="flex items-center justify-center gap-1 text-green-700">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-xs">Per Hour</span>
                          </div>
                          <p className="font-bold text-green-800">
                            ₹{formatPrice(machine.hourlyRate)}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-green-200"></div>
                        <div className="text-center flex-1">
                          <div className="flex items-center justify-center gap-1 text-green-700">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-xs">Per Day</span>
                          </div>
                          <p className="font-bold text-green-800">
                            ₹{formatPrice(machine.dailyRate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300"
                      disabled={!machine.available}
                      onClick={() => {
                        setSelectedMachine(machine)
                        setShowRequestDialog(true)
                      }}
                    >
                      {machine.available ? "Request Machine" : "Currently Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            How it works
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                1
              </span>
              <span>Browse available machines and click &quot;Request Machine&quot;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                2
              </span>
              <span>Fill in your requirement details and submit the request</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                3
              </span>
              <span>Our team will connect you with the provider within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                4
              </span>
              <span>Discuss terms directly with the provider and pay them directly</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Custom Request Modal */}
      {showRequestDialog && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRequestDialog(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-500 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {MACHINE_TYPE_ICONS[selectedMachine.type] || <Tractor className="h-6 w-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Request Machine</h2>
                    <p className="text-cyan-100 text-sm">{selectedMachine.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRequestDialog(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Machine Info Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-semibold text-gray-900">{selectedMachine.providerName}</p>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="text-right">
                  <p className="text-sm text-gray-500">Daily Rate</p>
                  <p className="font-bold text-lg text-cyan-600">₹{formatPrice(selectedMachine.dailyRate)}</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Required Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={requestForm.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={requestForm.duration}
                      onChange={(e) => setRequestForm({ ...requestForm, duration: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={requestForm.phone}
                      onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    placeholder="Any specific requirements or questions..."
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-gray-900 resize-none"
                  />
                </div>
              </div>

              {/* Estimated Cost */}
              {requestForm.duration && parseInt(requestForm.duration) > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Total</p>
                      <p className="text-xs text-gray-500">{requestForm.duration} day(s) × ₹{formatPrice(selectedMachine.dailyRate)}</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{formatPrice(parseInt(requestForm.duration) * selectedMachine.dailyRate)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    💡 Pay directly to provider • No online payment required
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowRequestDialog(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSubmit}
                disabled={!requestForm.date || !requestForm.phone || submitting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Success Notification */}
      {successNotification?.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-w-sm">
            <div className="flex items-start gap-4">
              {/* Success Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-gray-900">Request Sent! 🎉</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your request for <span className="font-semibold text-cyan-600">{successNotification.machineName}</span> has been submitted.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>We&apos;ll connect you with <strong>{successNotification.providerName}</strong> within 24 hours</span>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setSuccessNotification(null)}
                className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-[shrink_5s_linear_forwards]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
