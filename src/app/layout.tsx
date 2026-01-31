// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/next"
import { NetworkBanner } from "@/components/network-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FarmEase - Smart Farming Platform",
  description: "Revolutionizing agriculture through smart technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <NetworkBanner />
          <main className="flex-1 relative">
            {children}
            <Analytics />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}