// src/components/suspense-wrapper.tsx
"use client"

import { ReactNode, Suspense } from "react"
import Loading from "./loading"

export default function SuspenseWrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}