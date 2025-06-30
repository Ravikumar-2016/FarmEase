import { Loader2, Shield } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-0 p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl opacity-20 animate-pulse"></div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-emerald-500" />
                Loading Verification
              </h3>
              <p className="text-slate-600 text-lg">Preparing your email verification...</p>
              <div className="flex items-center justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
