import { Loader2, Shield } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-emerald-600" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600 absolute -bottom-1 -right-1" />
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-medium">Loading Pesticide AI</p>
          <p className="text-gray-500 text-sm">Preparing disease detection...</p>
        </div>
      </div>
    </div>
  )
}
