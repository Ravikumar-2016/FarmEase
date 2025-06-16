"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserLogo } from "@/components/logos/user-logo"
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react'


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ username: string; userType: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const username = localStorage.getItem("username")

    if (userType && username) {
      setIsLoggedIn(true)
      setUserInfo({ username, userType })
    } else {
      setIsLoggedIn(false)
      setUserInfo(null)
    }
  }, [pathname])

  const handleSignOut = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    setUserInfo(null)
    router.push("/")
  }

  const handleDashboardClick = () => {
    if (userInfo?.userType) {
      router.push(`/dashboard/${userInfo.userType.toLowerCase()}`)
    }
  }

  const navigationLinks = [
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-green-100/90 backdrop-blur supports-[backdrop-filter]:bg-green-100/90">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-2">
        <div className="flex h-15 items-center justify-between flex-wrap gap-y-4 md:flex-nowrap md:gap-0">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 text-decoration-none">
            <Image
              src="/FarmEaseLogo.png"
              alt="FarmEase Logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover border border-green-600"
              priority
            />
            <div className="hidden sm:flex flex-col items-center leading-tight">
              <h1 className="text-[1.25rem] font-extrabold text-gray-900 tracking-wide">
                FarmEase
              </h1>
              <p className="text-[0.9rem] text-green-600 font-medium tracking-tight -mt-1" style={{ fontFamily: "'Edu VIC WA NT Hand'" }}>
                Smart Farming Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation and Auth */}
          <div className="hidden md:flex items-center gap-6">
            {/* Show Navigation Links for both logged-in and non-logged-in users */}
            <nav className="flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Auth Buttons or User Profile */}
            {isLoggedIn && userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-green-50">
                    <UserLogo userName={userInfo.username} size="sm" />
                    <span className="font-medium text-gray-700">{userInfo.username}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-gray-900">{userInfo.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{userInfo.userType}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-sm">
            <div className="px-4 pt-3 pb-4 space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t pt-3 mt-3">
                {isLoggedIn && userInfo ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2">
                      <UserLogo userName={userInfo.username} size="sm" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{userInfo.username}</p>
                        <p className="text-xs text-gray-500 capitalize">{userInfo.userType}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-green-600 hover:bg-green-50"
                      onClick={() => {
                        handleDashboardClick()
                        setIsMenuOpen(false)
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:text-green-600 hover:bg-green-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="block">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:text-green-600 hover:bg-green-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
