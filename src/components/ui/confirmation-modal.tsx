"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Ban, Trash2, Loader2 } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  type?: "delete" | "cancel" | "withdraw" | "default"
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = "default",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Trash2 className="h-6 w-6 text-red-600" />
      case "cancel":
        return <Ban className="h-6 w-6 text-orange-600" />
      case "withdraw":
        return <Ban className="h-6 w-6 text-orange-600" />
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case "delete":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      case "cancel":
        return "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
      case "withdraw":
        return "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-sm leading-relaxed">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto text-white font-medium ${getButtonColor()}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
