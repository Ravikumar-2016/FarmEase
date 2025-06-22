"use client"

import * as React from "react"

export type ToastMessage = {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info" | "destructive"
}

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
  icon?: React.ReactNode
  showProgress?: boolean
}

type ToastActionElement = React.ReactElement

type ToasterToast = ToastProps & {
  id: string
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 3000

type ToasterToastType = ToasterToast

const ACTION_TYPES = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | {
      type: typeof ACTION_TYPES.ADD_TOAST
      toast: ToasterToastType
    }
  | {
      type: typeof ACTION_TYPES.UPDATE_TOAST
      toast: Partial<ToasterToastType>
    }
  | {
      type: typeof ACTION_TYPES.DISMISS_TOAST
      toastId?: ToasterToastType["id"]
    }
  | {
      type: typeof ACTION_TYPES.REMOVE_TOAST
      toastId?: ToasterToastType["id"]
    }

interface State {
  toasts: ToasterToastType[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ACTION_TYPES.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case ACTION_TYPES.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case ACTION_TYPES.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case ACTION_TYPES.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToastType, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToastType) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_TOAST,
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId: id })

  dispatch({
    type: ACTION_TYPES.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  const showToast = React.useCallback((message: string, type: ToastMessage["type"] = "info", duration = 3000) => {
    const toastId = genId()
    const toastMessage: ToastMessage = {
      id: toastId,
      message,
      type,
    }

    // Add to our simple toast state
    setState((prev) => ({
      toasts: [toastMessage, ...prev.toasts.slice(0, TOAST_LIMIT - 1)],
    }))

    // Auto-remove after duration
    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== toastId),
      }))
    }, duration)

    return toastId
  }, [])

  const removeToast = React.useCallback((toastId: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== toastId),
    }))
  }, [])

  const success = React.useCallback(
    (message: string, duration?: number) => showToast(message, "success", duration),
    [showToast],
  )
  const error = React.useCallback(
    (message: string, duration?: number) => showToast(message, "error", duration),
    [showToast],
  )
  const info = React.useCallback(
    (message: string, duration?: number) => showToast(message, "info", duration),
    [showToast],
  )
  const warning = React.useCallback(
    (message: string, duration?: number) => showToast(message, "warning", duration),
    [showToast],
  )

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId }),
    success,
    error,
    info,
    warning,
    showToast,
    removeToast,
  }
}

export { useToast, toast }
