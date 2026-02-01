"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomSelect } from "@/components/ui/custom-select"
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Package,
  Loader2,
  ChevronDown,
  ChevronUp,
  Info,
  X,
} from "lucide-react"

interface MarketPrice {
  _id: string
  commodity: string
  market: string
  state: string
  district: string | null
  minPrice: number
  maxPrice: number
  modalPrice: number
  date: string
  source: string
  lastUpdated: string
}

interface FiltersData {
  commodities: string[]
  states: string[]
  markets: string[]
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function MarketPricesPage() {
  const router = useRouter()
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [filters, setFilters] = useState<FiltersData>({ commodities: [], states: [], markets: [] })
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 50, totalPages: 1 })

  // Filter states
  const [selectedCommodity, setSelectedCommodity] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedMarket, setSelectedMarket] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedCommodity && selectedCommodity !== "all" && selectedCommodity !== "") params.append("commodity", selectedCommodity)
      if (selectedState && selectedState !== "all" && selectedState !== "") params.append("state", selectedState)
      if (selectedMarket && selectedMarket !== "all" && selectedMarket !== "") params.append("market", selectedMarket)
      params.append("page", pagination.page.toString())
      params.append("limit", "50")

      const response = await fetch(`/api/market/prices?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setPrices(data.data)
        setFilters(data.filters)
        setPagination(data.pagination)
        setLastSync(data.metadata.lastSync)
      } else {
        setError(data.error || "Failed to fetch prices")
        setPrices([])
      }
    } catch (err) {
      console.error("Error fetching prices:", err)
      setError("Unable to connect to server. Please try again.")
      setPrices([])
    } finally {
      setLoading(false)
    }
  }, [selectedCommodity, selectedState, selectedMarket, pagination.page])

  useEffect(() => {
    // Auth check
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (!userType || !username) {
      router.push("/login")
      return
    }

    fetchPrices()
  }, [router, fetchPrices])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeSince = (dateString: string) => {
    const now = new Date()
    const then = new Date(dateString)
    const diffHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const clearFilters = () => {
    setSelectedCommodity("")
    setSelectedState("")
    setSelectedMarket("")
    setSearchTerm("")
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Filter prices by search term (client-side for instant feedback)
  const filteredPrices = useMemo(() => {
    return prices.filter(price => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return (
        price.commodity.toLowerCase().includes(search) ||
        price.market.toLowerCase().includes(search) ||
        price.state.toLowerCase().includes(search)
      )
    })
  }, [prices, searchTerm])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (filteredPrices.length === 0) return null

    const sortedByPrice = [...filteredPrices].sort((a, b) => b.modalPrice - a.modalPrice)
    const topPriced = sortedByPrice.slice(0, 3)

    // Group by commodity and count
    const commodityCounts = filteredPrices.reduce((acc, price) => {
      acc[price.commodity] = (acc[price.commodity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostTraded = Object.entries(commodityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    // Unique states count
    const uniqueStates = new Set(filteredPrices.map(p => p.state)).size
    const uniqueMarkets = new Set(filteredPrices.map(p => p.market)).size

    return {
      topPriced,
      mostTraded,
      uniqueStates,
      uniqueMarkets,
      totalPrices: filteredPrices.length,
    }
  }, [filteredPrices])

  const hasActiveFilters = selectedCommodity || selectedState || selectedMarket || searchTerm
  const activeFilterCount = [selectedCommodity, selectedState, selectedMarket, searchTerm].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Official Govt Data</span>
            </Badge>
          </div>

          {/* Hero Content */}
          <div className="pb-8 pt-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Market Prices</h1>
                <p className="text-emerald-100 text-sm sm:text-base">Live Mandi rates from across India</p>
              </div>
            </div>

            {/* Last Updated Banner */}
            {lastSync && (
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-emerald-200" />
                  <span className="text-emerald-50">Last updated: {formatDate(lastSync)}</span>
                  <Badge className="bg-emerald-400/30 text-white border-0 text-xs ml-1">
                    {getTimeSince(lastSync)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchPrices}
                  disabled={loading}
                  className="text-white hover:bg-white/10 border border-white/20"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 mb-6 mt-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search commodities, markets, or states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-11 text-sm sm:text-base bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Row - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {/* Commodity Filter */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Commodity</label>
                <CustomSelect
                  options={[
                    { value: "all", label: "All Commodities" },
                    ...filters.commodities.map(c => ({ value: c, label: c }))
                  ]}
                  value={selectedCommodity || "all"}
                  onValueChange={(value) => setSelectedCommodity(value === "all" ? "" : value)}
                  placeholder="All Commodities"
                />
              </div>

              {/* State Filter */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">State</label>
                <CustomSelect
                  options={[
                    { value: "all", label: "All States" },
                    ...filters.states.map(s => ({ value: s, label: s }))
                  ]}
                  value={selectedState || "all"}
                  onValueChange={(value) => setSelectedState(value === "all" ? "" : value)}
                  placeholder="All States"
                />
              </div>

              {/* Market Filter */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Market</label>
                <CustomSelect
                  options={[
                    { value: "all", label: "All Markets" },
                    ...filters.markets.map(m => ({ value: m, label: m }))
                  ]}
                  value={selectedMarket || "all"}
                  onValueChange={(value) => setSelectedMarket(value === "all" ? "" : value)}
                  placeholder="All Markets"
                />
              </div>
            </div>

            {/* Active Filters Pills & View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-between">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedCommodity && selectedCommodity !== "all" && selectedCommodity !== "" && (
                    <Badge variant="secondary" className="gap-1 pr-1 text-xs py-1">
                      <span className="truncate">{selectedCommodity}</span>
                      <button onClick={() => setSelectedCommodity("")} className="ml-0.5 hover:text-red-600 transition-colors flex-shrink-0">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedState && selectedState !== "all" && selectedState !== "" && (
                    <Badge variant="secondary" className="gap-1 pr-1 text-xs py-1">
                      <span className="truncate">{selectedState}</span>
                      <button onClick={() => setSelectedState("")} className="ml-0.5 hover:text-red-600 transition-colors flex-shrink-0">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedMarket && selectedMarket !== "all" && selectedMarket !== "" && (
                    <Badge variant="secondary" className="gap-1 pr-1 text-xs py-1">
                      <span className="truncate">{selectedMarket}</span>
                      <button onClick={() => setSelectedMarket("")} className="ml-0.5 hover:text-red-600 transition-colors flex-shrink-0">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors whitespace-nowrap"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    viewMode === "cards" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    viewMode === "table" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        {!loading && summaryStats && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{summaryStats.totalPrices}</div>
              <div className="text-xs sm:text-sm text-gray-500">Total Prices</div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">{summaryStats.uniqueStates}</div>
              <div className="text-xs sm:text-sm text-gray-500">States</div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{summaryStats.uniqueMarkets}</div>
              <div className="text-xs sm:text-sm text-gray-500">Markets</div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-bold text-amber-600">{filters.commodities.length}</div>
              <div className="text-xs sm:text-sm text-gray-500">Commodities</div>
            </div>
          </div>
        )}

        {/* Top Priced & Most Traded Section */}
        {!loading && summaryStats && !hasActiveFilters && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Priced Commodities */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  Top Priced Today
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {summaryStats.topPriced.map((price, idx) => (
                  <div key={price._id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">{price.commodity}</div>
                        <div className="text-xs text-gray-500">{price.market}, {price.state}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-700">₹{formatPrice(price.modalPrice)}</div>
                      <div className="text-xs text-gray-400">/quintal</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Traded Commodities */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  Most Listed Commodities
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {summaryStats.mostTraded.map((item, idx) => (
                  <div key={item.name} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                      {item.count} markets
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 mt-4 font-medium">Loading market prices...</p>
              <p className="text-gray-400 text-sm mt-1">Fetching latest data from government sources</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 ml-2">
              {error}
              <Button
                variant="link"
                onClick={fetchPrices}
                className="text-red-700 underline ml-2 p-0 h-auto"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* No Data State */}
        {!loading && !error && filteredPrices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No prices found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search term to see more results."
                : "Market prices are being updated. Please check back later."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredPrices.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredPrices.length}</span> of{" "}
              <span className="font-semibold">{pagination.total}</span> prices
            </p>
          </div>
        )}

        {/* Prices Grid - Card View */}
        {!loading && filteredPrices.length > 0 && viewMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price) => (
              <Card key={price._id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                <CardContent className="p-0">
                  {/* Card Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{price.commodity}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{price.market}, {price.state}</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs flex-shrink-0 ml-2">
                        {getTimeSince(price.lastUpdated)}
                      </Badge>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="p-4">
                    {/* Modal Price - Main */}
                    <div className="text-center mb-4">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Modal Price
                      </div>
                      <div className="text-3xl font-bold text-emerald-600">
                        ₹{formatPrice(price.modalPrice)}
                        <span className="text-sm font-normal text-gray-400 ml-1">/quintal</span>
                      </div>
                    </div>

                    {/* Min/Max Range */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <TrendingDown className="h-3 w-3" />
                          Min
                        </div>
                        <div className="font-semibold text-gray-700">₹{formatPrice(price.minPrice)}</div>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                          <TrendingUp className="h-3 w-3" />
                          Max
                        </div>
                        <div className="font-semibold text-gray-700">₹{formatPrice(price.maxPrice)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Source Footer */}
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                      <ShieldCheck className="h-3 w-3 text-green-500" />
                      <span>Source: agmarknet.gov.in</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Prices Table View */}
        {!loading && filteredPrices.length > 0 && viewMode === "table" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Commodity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Market</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">State</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Min Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Modal Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Max Price</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPrices.map((price) => (
                    <tr key={price._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{price.commodity}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{price.market}</td>
                      <td className="py-3 px-4 text-gray-600">{price.state}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-green-600 font-medium">₹{formatPrice(price.minPrice)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-emerald-700 font-bold">₹{formatPrice(price.modalPrice)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-red-600 font-medium">₹{formatPrice(price.maxPrice)}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary" className="text-xs">
                          {getTimeSince(price.lastUpdated)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="gap-1"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === pageNum
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {pagination.totalPages > 5 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: pagination.totalPages }))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === pagination.totalPages
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              className="gap-1"
            >
              Next
            </Button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 sm:p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">About Market Prices</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                All prices are sourced from official government data (agmarknet.gov.in) and are updated automatically. 
                Prices shown are indicative modal prices per quintal. Actual prices at your local mandi may vary. 
                Data refreshes daily to ensure you have the latest market information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
