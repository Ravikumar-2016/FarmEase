"use client"
import type { ToastMessage } from "@/app/hooks/use-toast"
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react"

interface ToastContainerProps {
  toasts: ToastMessage[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const getIcon = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
      case "destructive":
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
    }
  }

  const getToastStyles = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success":
        return "bg-white border-green-200 text-green-800 shadow-lg"
      case "destructive":
      case "error":
        return "bg-white border-red-200 text-red-800 shadow-lg"
      case "warning":
        return "bg-white border-yellow-200 text-yellow-800 shadow-lg"
      case "info":
      default:
        return "bg-white border-blue-200 text-blue-800 shadow-lg"
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[99999] space-y-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border-2 animate-in slide-in-from-right-full duration-300 pointer-events-auto min-w-[280px] ${getToastStyles(toast.type)}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed break-words">{toast.message}</p>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  )
}
