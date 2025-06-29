"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function TermsBanner() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleProceed = () => {
    localStorage.setItem("termsAgreed", "true")
    router.push("/home")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 text-gray-800 px-6 py-10 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 md:p-10 border border-green-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-2">Welcome to FarmEase</h1>
          <p className="text-center text-sky-700 text-lg">
            Before continuing, please read and agree to the following terms to ensure the best experience.
          </p>
        </div>

        <div className="space-y-4 text-sm md:text-base text-gray-700">
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 text-amber-600 mr-3 mt-0.5">🤝</span>
              <span>
                You acknowledge that FarmEase is in active development. Your participation and feedback help us improve and serve the agricultural community better.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 text-amber-600 mr-3 mt-0.5">📝</span>
              <span>
                Please provide accurate information during signup. Our features — like weather, labor posts, and crop suggestions — rely on your region and location data.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 text-amber-600 mr-3 mt-0.5">⚠️</span>
              <span>
                Crop and fertilizer recommendations are based on publicly available data and are advisory only. Always consult local agricultural officers if in doubt.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 text-amber-600 mr-3 mt-0.5">🔄</span>
              <span>
                Some features use free third-party APIs that may slow down after inactivity. If a service doesn&apos;t respond, please wait a few seconds and try again.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 text-amber-600 mr-3 mt-0.5">📩</span>
              <span>
                For feedback or issues, email us at{" "}
                <a
                  href="mailto:farmeaseinfo@gmail.com"
                  className="text-green-700 underline font-medium hover:text-amber-600 transition-colors"
                >
                  farmeaseinfo@gmail.com
                </a>
                . You can include screenshots, error messages, or details of the page you&apos;re on.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 text-amber-600 mr-3 mt-0.5">🌐</span>
              <span>
                For the best user experience, use a desktop device or enable desktop view in your mobile browser.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex items-start mt-6 space-x-3 bg-green-50/60 p-4 rounded-lg border border-green-100">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-5 w-5 mt-0.5 text-green-700 border-gray-300 rounded focus:ring-green-600 focus:ring-offset-green-50"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I have read and agree to the terms and conditions outlined above.
          </label>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleProceed}
            disabled={!agreed}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              agreed
                ? "bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Proceed to FarmEase
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          This notice will not appear again unless you clear your browser data or use a different device/browser.
        </p>
      </div>
    </main>
  )
}
