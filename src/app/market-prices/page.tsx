"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Filter,
  Package,
  Building2,
  Loader2,
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

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedCommodity && selectedCommodity !== "all") params.append("commodity", selectedCommodity)
      if (selectedState && selectedState !== "all") params.append("state", selectedState)
      if (selectedMarket && selectedMarket !== "all") params.append("market", selectedMarket)
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
      style: "currency",
      currency: "INR",
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
  const filteredPrices = prices.filter(price => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      price.commodity.toLowerCase().includes(search) ||
      price.market.toLowerCase().includes(search) ||
      price.state.toLowerCase().includes(search)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Market Prices</h1>
                  <p className="text-xs text-gray-500">Mandi rates across India</p>
                </div>
              </div>
            </div>

            {/* Source Badge */}
            <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Official Govt Data
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Last Updated Info */}
        {lastSync && (
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {formatDate(lastSync)}</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {getTimeSince(lastSync)}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPrices}
              disabled={loading}
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        )}

        {/* Filters Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-amber-600" />
              Filter Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Commodity Filter */}
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger>
                  <Package className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="All Commodities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Commodities</SelectItem>
                  {filters.commodities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* State Filter */}
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {filters.states.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Market Filter */}
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="All Markets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Markets</SelectItem>
                  {filters.markets.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(selectedCommodity || selectedState || selectedMarket || searchTerm) && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCommodity && selectedCommodity !== "all" && (
                  <Badge variant="secondary">{selectedCommodity}</Badge>
                )}
                {selectedState && selectedState !== "all" && (
                  <Badge variant="secondary">{selectedState}</Badge>
                )}
                {selectedMarket && selectedMarket !== "all" && (
                  <Badge variant="secondary">{selectedMarket}</Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary">Search: {searchTerm}</Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-amber-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading market prices...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert className="bg-amber-50 border-amber-200 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* No Data State */}
        {!loading && !error && filteredPrices.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Price Data Available</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Market prices are being updated. Please check back in a few hours.
              </p>
              <Button onClick={fetchPrices} className="bg-amber-600 hover:bg-amber-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Prices Grid */}
        {!loading && filteredPrices.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredPrices.length} of {pagination.total} prices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrices.map((price) => (
                <Card key={price._id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Commodity Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{price.commodity}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{price.market}, {price.state}</span>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                        {getTimeSince(price.lastUpdated)}
                      </Badge>
                    </div>

                    {/* Price Info */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-3">
                      <div className="text-center mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Modal Price</p>
                        <p className="text-2xl font-bold text-amber-700">
                          {formatPrice(price.modalPrice)}
                          <span className="text-sm font-normal text-gray-500">/quintal</span>
                        </p>
                      </div>
                      
                      <div className="flex justify-between text-sm border-t border-amber-200 pt-2 mt-2">
                        <div className="text-center">
                          <TrendingDown className="h-3 w-3 text-green-600 inline mr-1" />
                          <span className="text-gray-600">Min: </span>
                          <span className="font-semibold text-green-700">{formatPrice(price.minPrice)}</span>
                        </div>
                        <div className="text-center">
                          <TrendingUp className="h-3 w-3 text-red-600 inline mr-1" />
                          <span className="text-gray-600">Max: </span>
                          <span className="font-semibold text-red-700">{formatPrice(price.maxPrice)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Source Badge */}
                    <div className="flex items-center justify-center">
                      <Badge variant="outline" className="text-xs text-gray-500">
                        <ShieldCheck className="h-3 w-3 mr-1 text-green-600" />
                        Source: agmarknet.gov.in
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <Alert className="mt-8 bg-blue-50 border-blue-200">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            <strong>Note:</strong> Prices shown are indicative and sourced from official government data (agmarknet.gov.in). 
            Actual prices may vary. Data is updated every 12 hours.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  )
}
