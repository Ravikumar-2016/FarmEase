import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FarmEase | Empowering Agriculture Connections",
  description:
    "FarmEase connects farmers, laborers, and agricultural professionals. Signup with email OTP, manage users securely, and grow your network easily.",
  metadataBase: new URL("https://farm-ease-seven.vercel.app"),
  openGraph: {
    title: "FarmEase | Empowering Agriculture Connections",
    description:
      "Connect farmers, workers, and agriculture experts on FarmEase. Signup securely, verify via email OTP, and grow your field network effortlessly.",
    url: "https://farm-ease-seven.vercel.app",
    siteName: "FarmEase",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FarmEase - Agriculture Network Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmEase | Empowering Agriculture Connections",
    description:
      "Platform for farmers, laborers, and agricultural professionals to connect and grow.",
    images: ["/og-image.png"],
  },
  themeColor: "#3b8d32",
  authors: [{ name: "FarmEase Team" }],
  keywords: [
    "FarmEase",
    "farming jobs",
    "agriculture hiring",
    "farm labor connect",
    "OTP signup",
    "MongoDB",
    "MERN",
    "Next.js",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
