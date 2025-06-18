"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sprout, ArrowRight } from "lucide-react"



export default function FarmerDashboard() {
  const router = useRouter()

 

  return (
    <div className="min-h-screen bg-gray-50">
     

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* Main Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Crop Services */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sprout className="h-6 w-6 text-green-600" />
                  Crop Services
                  <Badge variant="secondary">AI Powered</Badge>
                </CardTitle>
                <CardDescription>
                  Get AI-powered crop recommendations, fertilizer suggestions, and manage your crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Services:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Crop Recommendation System</li>
                      <li>• Fertilizer Recommendation</li>
                      <li>• My Crops Management</li>
                      <li>• Soil Analysis Integration</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full group-hover:bg-green-600 transition-colors"
                    onClick={() => router.push("/crop-services")}
                  >
                    Access Crop Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
