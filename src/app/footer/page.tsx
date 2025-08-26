"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: "/features", label: "Features" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ]

  const socialLinks = [
    {
      href: "https://facebook.com",
      icon: Facebook,
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      href: "https://twitter.com",
      icon: Twitter,
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      href: "https://instagram.com",
      icon: Instagram,
      label: "Instagram",
      color: "hover:text-pink-600",
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity mb-4">
              <Image
                src="/FarmEaseLogo.png"
                alt="FarmEase Logo"
                width={48}
                height={48}
                className="rounded-full object-cover border border-green-600"
              />
              <div className="hidden sm:flex flex-col items-center leading-tight">
                <h1 className="text-[1.25rem] font-extrabold text-white tracking-wide">
                  FarmEase
                </h1>
                <p
                  className="text-[0.9rem] text-green-600 font-medium tracking-tight -mt-1"
                  style={{ fontFamily: "'Edu VIC WA NT Hand'" }}
                >
                  Smart Farming Platform
                </p>
              </div>
            </Link>

            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Revolutionizing agriculture through smart technology. FarmEase empowers farmers with data-driven insights,
              automated solutions, and sustainable farming practices for a better tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-400 flex-shrink-0" />
                <a
                  href="mailto:farmeaseinfo@gmail.com"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  farmeaseinfo@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
                <a href="tel:+919392000041" className="text-gray-300 hover:text-green-400 transition-colors">
                  +91 93xxxxxx41
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">
                  IIITDM Jabalpur, Madhya Pradesh, 482005
                </span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-800 rounded-full ${social.color} hover:bg-gray-700 transition-all duration-200 transform hover:scale-110`}
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-400 text-sm">© {currentYear} FarmEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
