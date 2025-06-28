"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Handshake, Briefcase, ChevronDown, MapPin, Building2, Users } from "lucide-react"
import { z } from "zod"

const partnershipTypes = ["ngo", "logistics", "technology", "financial", "government", "research", "other"] as const

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  organizationName: z.string().min(1, "Organization name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  partnershipType: z.enum(partnershipTypes),
  contactPerson: z.string().min(1, "Contact person is required"),
  area: z.string().min(1, "Area is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  areaOfCollaboration: z.string().min(1, "Area of collaboration is required"),
  termsSummary: z.string().min(1, "Terms summary is required"),
})

export default function PartnershipsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    organizationName: "",
    email: "",
    mobileNumber: "",
    partnershipType: "technology" as const,
    contactPerson: "",
    area: "",
    state: "",
    zipcode: "",
    areaOfCollaboration: "",
    termsSummary: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const validatedData = formSchema.parse(formData)
      setErrors({})

      const response = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to submit partnership request")

      setSuccessMessage("Thanks for reaching out! We’ve received your partnership request and will be in touch shortly.")
      setFormData({
        fullName: "",
        organizationName: "",
        email: "",
        mobileNumber: "",
        partnershipType: "technology",
        contactPerson: "",
        area: "",
        state: "",
        zipcode: "",
        areaOfCollaboration: "",
        termsSummary: "",
      })
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.errors.forEach((error) => {
          if (error.path) newErrors[error.path[0]] = error.message
        })
        setErrors(newErrors)
      } else {
        setErrorMessage(
          "Submission Failed: " + (err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="sm:hidden flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>

            <div className="flex items-center space-x-2">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FarmEase</h1>
            </div>

            <Link href="/jobs" className="text-blue-600 hover:text-blue-800">
              <Briefcase className="h-6 w-6" />
            </Link>
          </div>

          <div className="hidden sm:flex items-center justify-between">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>

            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">FarmEase</h1>
                <p className="text-sm text-gray-600">Partnership Opportunities</p>
              </div>
            </div>

            <Link
              href="/jobs"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Briefcase className="h-5 w-5" />
              <span>Explore Careers</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Message Display */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{errorMessage}</div>
          )}

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Handshake className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Partnership Opportunities</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Collaborate with us to create sustainable agricultural solutions and drive innovation in farming
              technology
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
              <h2 className="text-2xl font-semibold text-white">Partnership Request Form</h2>
              <p className="text-green-100 mt-1">Tell us about your organization and collaboration interests</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.fullName
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.contactPerson
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="Enter contact person name"
                      />
                      {errors.contactPerson && <p className="mt-2 text-sm text-red-600">{errors.contactPerson}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.email
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="contact@example.com"
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.mobileNumber
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.mobileNumber && <p className="mt-2 text-sm text-red-600">{errors.mobileNumber}</p>}
                    </div>
                  </div>
                </div>

                {/* Organization Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="h-5 w-5 text-green-600 mr-2" />
                    Organization Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="organizationName"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.organizationName
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="Enter your organization name"
                      />
                      {errors.organizationName && (
                        <p className="mt-2 text-sm text-red-600">{errors.organizationName}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-700 mb-2">
                        Partnership Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="partnershipType"
                          name="partnershipType"
                          value={formData.partnershipType}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-green-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none bg-white transition-colors"
                        >
                          <option value="ngo">NGO</option>
                          <option value="logistics">Logistics</option>
                          <option value="technology">Technology</option>
                          <option value="financial">Financial</option>
                          <option value="government">Government</option>
                          <option value="research">Research</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                        Area <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.area
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="Enter your area"
                      />
                      {errors.area && <p className="mt-2 text-sm text-red-600">{errors.area}</p>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.state
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="Enter your state"
                      />
                      {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state}</p>}
                    </div>

                    <div>
                      <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
                        Zipcode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.zipcode
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        placeholder="12345"
                      />
                      {errors.zipcode && <p className="mt-2 text-sm text-red-600">{errors.zipcode}</p>}
                    </div>
                  </div>
                </div>

                {/* Collaboration Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Collaboration Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="areaOfCollaboration" className="block text-sm font-medium text-gray-700 mb-2">
                        Area of Collaboration <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="areaOfCollaboration"
                        name="areaOfCollaboration"
                        rows={4}
                        value={formData.areaOfCollaboration}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.areaOfCollaboration
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none`}
                        placeholder="Describe the specific areas where you'd like to collaborate with FarmEase..."
                      />
                      {errors.areaOfCollaboration && (
                        <p className="mt-2 text-sm text-red-600">{errors.areaOfCollaboration}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="termsSummary" className="block text-sm font-medium text-gray-700 mb-2">
                        Terms Summary <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="termsSummary"
                        name="termsSummary"
                        rows={4}
                        value={formData.termsSummary}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.termsSummary
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none`}
                        placeholder="Provide a summary of the proposed terms and conditions for the partnership..."
                      />
                      {errors.termsSummary && <p className="mt-2 text-sm text-red-600">{errors.termsSummary}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing Request...
                      </>
                    ) : (
                      <>
                        <Handshake className="mr-2 h-5 w-5" />
                        Submit Partnership Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
