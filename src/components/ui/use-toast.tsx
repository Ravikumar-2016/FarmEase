export type ToastMessage = {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info" | "destructive"
}
