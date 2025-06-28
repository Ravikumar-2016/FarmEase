"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import {
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Loader2,
  Handshake,
  Building,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle,
  // Shield,
  // Info,
} from "lucide-react"

interface Partner {
  _id: string
  username: string
  fullName: string
  email: string
  mobile: string
  organizationName?: string
  type?: string
  contactPerson?: string
  areaOfCollaboration?: string
  termsSummary?: string
  userType: "partner"
  status?: "active" | "inactive" | "pending"
  area?: string
  state?: string
  zipcode?: string
  emailVerified?: boolean
  createdAt: string
  updatedAt?: string
}

export default function ManagePartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [currentUser, setCurrentUser] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    type: "",
    contactPerson: "",
    areaOfCollaboration: "",
    termsSummary: "",
    area: "",
    state: "",
    zipcode: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<{ id: string; name: string } | null>(null)

  // Success/error message state
  const [successMessage, setSuccessMessage] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  })

  // Show success/error message
  const showMessage = (message: string, type: "success" | "error" = "success") => {
    setSuccessMessage({ show: true, message, type })
    setTimeout(() => {
      setSuccessMessage({ show: false, message: "", type: "success" })
    }, 4000)
  }

  // Get current user from localStorage
  useEffect(() => {
    const username = localStorage.getItem("username")
    if (username) {
      setCurrentUser(username)
    }
  }, [])

  // Filter partners to exclude current user
  useEffect(() => {
    if (currentUser && partners.length > 0) {
      const filtered = partners.filter((partner) => partner.username !== currentUser)
      setFilteredPartners(filtered)
    } else {
      setFilteredPartners(partners)
    }
  }, [partners, currentUser])

  // Fetch partners
  const fetchPartners = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/partners")
      const data = await response.json()

      if (response.ok && data.success) {
        setPartners(data.partners)
      } else {
        showMessage("Failed to fetch partners", "error")
      }
    } catch (error) {
      console.error("Error fetching partners:", error)
      showMessage("Error fetching partners", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile is required"
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits"
    }

    if (!editingId && !formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (formData.zipcode && !/^\d{6}$/.test(formData.zipcode)) {
      newErrors.zipcode = "Zipcode must be 6 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setErrors({}) // clear previous errors

    try {
      const url = "/api/partners"
      const method = editingId ? "PUT" : "POST"

      const body = {
        ...formData,
        ...(editingId ? { partnerId: editingId } : {}),
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      // Handle validation errors for username/email already exists
      if (!response.ok || !data.success) {
        if (data?.error?.toLowerCase().includes("username already exists")) {
          setErrors((prev) => ({ ...prev, username: "Username already exists" }))
          return
        }
        if (data?.error?.toLowerCase().includes("email already exists")) {
          setErrors((prev) => ({ ...prev, email: "Email already exists" }))
          return
        }
        if (data?.error?.toLowerCase().includes("password must be at least")) {
          setErrors((prev) => ({ ...prev, password: data.error }))
          return
        }
        if (data?.error?.toLowerCase().includes("passwords do not match")) {
          setErrors((prev) => ({ ...prev, confirmPassword: data.error }))
          return
        }
        // All other errors as toast
        showMessage(data.error || "Failed to save partner", "error")
        return
      }

      // Reset form and refresh data
      setFormData({
        username: "",
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        organizationName: "",
        type: "",
        contactPerson: "",
        areaOfCollaboration: "",
        termsSummary: "",
        area: "",
        state: "",
        zipcode: "",
      })
      setEditingId(null)
      setErrors({})

      // Show success message
      showMessage(editingId ? "Partner updated successfully!" : "Partner added successfully!")

      // Refresh partner list
      await fetchPartners()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to save partner", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit partner
  const handleEdit = (partner: Partner) => {
    setFormData({
      username: partner.username,
      fullName: partner.fullName,
      email: partner.email,
      mobile: partner.mobile,
      password: "",
      confirmPassword: "",
      organizationName: partner.organizationName || "",
      type: partner.type || "",
      contactPerson: partner.contactPerson || "",
      areaOfCollaboration: partner.areaOfCollaboration || "",
      termsSummary: partner.termsSummary || "",
      area: partner.area || "",
      state: partner.state || "",
      zipcode: partner.zipcode || "",
    })
    setEditingId(partner._id)
    setErrors({})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({
      username: "",
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      type: "",
      contactPerson: "",
      areaOfCollaboration: "",
      termsSummary: "",
      area: "",
      state: "",
      zipcode: "",
    })
    setErrors({})
  }

  // Delete partner
  const handleDelete = (id: string, name: string) => {
    setPartnerToDelete({ id, name })
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!partnerToDelete) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/partners?partnerId=${partnerToDelete.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        showMessage(data.error || "Failed to delete partner", "error")
        return
      }

      // Show success message
      showMessage("Partner deleted successfully!")

      // Refresh partner list
      await fetchPartners()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to delete partner", "error")
    } finally {
      setIsSubmitting(false)
      setDeleteModalOpen(false)
      setPartnerToDelete(null)
    }
  }

  // Status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>

    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
      case "inactive":
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Inactive</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">{status}</Badge>
    }
  }

  // Type badge
  const getTypeBadge = (type?: string) => {
    if (!type) return null
    const colors: Record<string, string> = {
      ngo: "bg-emerald-100 text-emerald-800 border-emerald-200",
      logistics: "bg-blue-100 text-blue-800 border-blue-200",
      technology: "bg-purple-100 text-purple-800 border-purple-200",
      financial: "bg-amber-100 text-amber-800 border-amber-200",
      government: "bg-red-100 text-red-800 border-red-200",
      research: "bg-indigo-100 text-indigo-800 border-indigo-200",
    }
    return (
      <Badge className={`${colors[type.toLowerCase()] || "bg-slate-100 text-slate-800 border-slate-200"} border`}>
        {type}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Success/Error Message */}
        {successMessage.show && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
              successMessage.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {successMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{successMessage.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Partner Management</h1>
          <p className="text-lg text-slate-600">Manage FarmEase platform partners and collaborations</p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Add/Edit Partner Form */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plus className="h-6 w-6" />
                </div>
                {editingId ? "Edit Partner" : "Add New Partner"}
              </CardTitle>
              <CardDescription className="text-purple-100 text-base">
                {editingId ? "Update partner information" : "Add a new partner to the platform"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                      Username *
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                      className={`h-12 mt-2 border-2 transition-all ${
                        errors.username
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.username && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.username}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className={`h-12 mt-2 border-2 transition-all ${
                        errors.fullName
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.fullName && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.fullName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className={`h-12 mt-2 border-2 transition-all ${
                        errors.email
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="mobile" className="text-sm font-semibold text-slate-700">
                      Mobile Number *
                    </Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit mobile number"
                      className={`h-12 mt-2 border-2 transition-all ${
                        errors.mobile
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.mobile && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.mobile}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="organizationName" className="text-sm font-semibold text-slate-700">
                      Organization Name
                    </Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="Enter organization name"
                      className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson" className="text-sm font-semibold text-slate-700">
                      Contact Person
                    </Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Enter contact person name"
                      className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                {!editingId && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password (min 6 characters)"
                        className={`h-12 mt-2 border-2 transition-all ${
                          errors.password
                            ? "border-red-300 focus:border-red-500"
                            : "border-slate-200 focus:border-purple-500"
                        }`}
                      />
                      {errors.password && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className={`h-12 mt-2 border-2 transition-all ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500"
                            : "border-slate-200 focus:border-purple-500"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {editingId && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                        New Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Leave blank to keep current"
                        className={`h-12 mt-2 border-2 transition-all ${
                          errors.password
                            ? "border-red-300 focus:border-red-500"
                            : "border-slate-200 focus:border-purple-500"
                        }`}
                      />
                      {errors.password && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className={`h-12 mt-2 border-2 transition-all ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500"
                            : "border-slate-200 focus:border-purple-500"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="type" className="text-sm font-semibold text-slate-700">
                      Partner Type
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 bg-white transition-all">
                        <SelectValue placeholder="Select partner type" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white border border-slate-200 shadow-lg z-[100]">
                        <SelectItem value="ngo" className="py-3 px-4 hover:bg-emerald-50 cursor-pointer">
                          🌱 NGO
                        </SelectItem>
                        <SelectItem value="logistics" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                          🚚 Logistics
                        </SelectItem>
                        <SelectItem value="technology" className="py-3 px-4 hover:bg-purple-50 cursor-pointer">
                          💻 Technology
                        </SelectItem>
                        <SelectItem value="financial" className="py-3 px-4 hover:bg-amber-50 cursor-pointer">
                          💰 Financial
                        </SelectItem>
                        <SelectItem value="government" className="py-3 px-4 hover:bg-red-50 cursor-pointer">
                          🏛️ Government
                        </SelectItem>
                        <SelectItem value="research" className="py-3 px-4 hover:bg-indigo-50 cursor-pointer">
                          🔬 Research
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="areaOfCollaboration" className="text-sm font-semibold text-slate-700">
                      Area of Collaboration
                    </Label>
                    <Input
                      id="areaOfCollaboration"
                      name="areaOfCollaboration"
                      value={formData.areaOfCollaboration}
                      onChange={handleInputChange}
                      placeholder="Enter collaboration area"
                      className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="area" className="text-sm font-semibold text-slate-700">
                      Area
                    </Label>
                    <Input
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="Enter area"
                      className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-semibold text-slate-700">
                      State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipcode" className="text-sm font-semibold text-slate-700">
                      Zipcode
                    </Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit zipcode"
                      className={`h-12 mt-2 border-2 transition-all ${
                        errors.zipcode
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.zipcode && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.zipcode}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="termsSummary" className="text-sm font-semibold text-slate-700">
                    Terms Summary
                  </Label>
                  <Textarea
                    id="termsSummary"
                    name="termsSummary"
                    value={formData.termsSummary}
                    onChange={handleInputChange}
                    placeholder="Enter partnership terms summary"
                    className="mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    rows={4}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        {editingId ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        {editingId ? <Edit className="mr-3 h-5 w-5" /> : <Plus className="mr-3 h-5 w-5" />}
                        {editingId ? "Update Partner" : "Add Partner"}
                      </>
                    )}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-14 px-8 border-2 border-slate-300 hover:border-slate-400 font-semibold transition-all bg-transparent"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Partners List */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Handshake className="h-6 w-6" />
                </div>
                Other Partners ({filteredPartners.length})
              </CardTitle>
              <CardDescription className="text-orange-100 text-base">
                Manage existing partners
                 {/* (excluding yourself) */}
              </CardDescription>
              {/* {currentUser && partners.length > filteredPartners.length && (
                <div className="flex items-center gap-2 mt-2 p-3 bg-blue-500/20 rounded-lg border border-blue-300">
                  <Info className="h-4 w-4 text-blue-200" />
                  <span className="text-sm text-blue-100">
                    Your account (@{currentUser}) is hidden from this list for security reasons
                  </span>
                </div>
              )} */}
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[700px]">
                <div className="space-y-0">
                  {loading ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : filteredPartners.length === 0 ? (
                    <div className="text-center py-16">
                      <Handshake className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium text-lg">No other partners found</p>
                      <p className="text-sm text-slate-400 mt-2">
                        {partners.length > 0
                          ? "All partners are currently filtered out"
                          : "Add your first partner to get started"}
                      </p>
                    </div>
                  ) : (
                    filteredPartners.map((partner, index) => (
                      <div
                        key={partner._id}
                        className={`p-6 border-b ${index % 2 === 0 ? "bg-slate-50" : "bg-white"} hover:bg-orange-50 transition-colors`}
                      >
                        <div className="flex items-start justify-between flex-wrap">
                          {/* LEFT BLOCK */}
                          <div className="flex-1 min-w-[250px]">
                            <div className="flex items-center flex-wrap gap-2 mb-3">
                              <h4 className="font-semibold text-lg text-slate-900">{partner.fullName}</h4>
                              {getStatusBadge(partner.status)}
                              {partner.type && getTypeBadge(partner.type)}
                              {partner.emailVerified && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Verified</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-3 text-sm text-slate-700 mb-3 w-full">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                                <span className="break-words">{partner.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>{partner.mobile}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-600 shrink-0" />
                                <span>@{partner.username}</span>
                              </div>
                              {partner.organizationName && (
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-orange-600 shrink-0" />
                                  <span>{partner.organizationName}</span>
                                </div>
                              )}
                              {partner.area && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-red-600 shrink-0" />
                                  <span>
                                    {partner.area}, {partner.state}
                                  </span>
                                </div>
                              )}
                              {partner.areaOfCollaboration && (
                                <div className="flex items-center gap-2">
                                  <Handshake className="h-4 w-4 text-indigo-600 shrink-0" />
                                  <span>{partner.areaOfCollaboration}</span>
                                </div>
                              )}
                            </div>

                            {partner.termsSummary && (
                              <div className="text-sm text-slate-700 mt-3">
                                <span className="font-medium">Terms:</span>
                                <p className="mt-1 whitespace-pre-wrap leading-relaxed">{partner.termsSummary}</p>
                              </div>
                            )}
                          </div>

                          {/* ACTIONS */}
                          <div className="flex items-center gap-2 ml-4 mt-2 md:mt-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(partner)}
                              className="h-10 w-10 p-0 hover:bg-blue-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(partner._id, partner.fullName)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Mobile Form */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingId ? "Edit Partner" : "Add New Partner"}
              </CardTitle>
              <CardDescription className="text-purple-100 text-sm">
                {editingId ? "Update partner information" : "Add a new partner to the platform"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <Label htmlFor="mobile-username" className="text-sm font-semibold text-slate-700">
                    Username *
                  </Label>
                  <Input
                    id="mobile-username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className={`h-12 mt-2 border-2 transition-all ${
                      errors.username
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.username && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <Label htmlFor="mobile-fullName" className="text-sm font-semibold text-slate-700">
                    Full Name *
                  </Label>
                  <Input
                    id="mobile-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={`h-12 mt-2 border-2 transition-all ${
                      errors.fullName
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.fullName && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="mobile-email" className="text-sm font-semibold text-slate-700">
                    Email *
                  </Label>
                  <Input
                    id="mobile-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`h-12 mt-2 border-2 transition-all ${
                      errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <Label htmlFor="mobile-mobile" className="text-sm font-semibold text-slate-700">
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobile-mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    className={`h-12 mt-2 border-2 transition-all ${
                      errors.mobile ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.mobile && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.mobile}
                    </div>
                  )}
                </div>

                {/* Password (only required for new partners) */}
                {!editingId && (
                  <>
                    <div>
                      <Label htmlFor="mobile-password" className="text-sm font-semibold text-slate-700">
                        Password *
                      </Label>
                      <Input
                        id="mobile-password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password (min 6 characters)"
                        className={`h-12 mt-2 border-2 transition-all ${
                          errors.password
                            ? "border-red-300 focus:border-red-500"
                            : "border-slate-200 focus:border-purple-500"
                        }`}
                      />
                      {errors.password && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="mobile-confirmPassword" className="text-sm font-semibold text-slate-700">
                        Confirm Password *
                      </Label>
                      <Input
                        id="mobile-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className={`h-12 mt-2 border-2 transition-all ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500"
                            : "border-slate-200 focus:border-purple-500"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Optional fields for both add and edit */}
                <div>
                  <Label htmlFor="mobile-organizationName" className="text-sm font-semibold text-slate-700">
                    Organization Name
                  </Label>
                  <Input
                    id="mobile-organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder="Enter organization name"
                    className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile-contactPerson" className="text-sm font-semibold text-slate-700">
                    Contact Person
                  </Label>
                  <Input
                    id="mobile-contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Enter contact person name"
                    className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile-type" className="text-sm font-semibold text-slate-700">
                    Partner Type
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 bg-white transition-all">
                      <SelectValue placeholder="Select partner type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-slate-200 shadow-lg z-[100]">
                      <SelectItem value="ngo" className="py-3 px-4 hover:bg-emerald-50 cursor-pointer">
                        🌱 NGO
                      </SelectItem>
                      <SelectItem value="logistics" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                        🚚 Logistics
                      </SelectItem>
                      <SelectItem value="technology" className="py-3 px-4 hover:bg-purple-50 cursor-pointer">
                        💻 Technology
                      </SelectItem>
                      <SelectItem value="financial" className="py-3 px-4 hover:bg-amber-50 cursor-pointer">
                        💰 Financial
                      </SelectItem>
                      <SelectItem value="government" className="py-3 px-4 hover:bg-red-50 cursor-pointer">
                        🏛️ Government
                      </SelectItem>
                      <SelectItem value="research" className="py-3 px-4 hover:bg-indigo-50 cursor-pointer">
                        🔬 Research
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mobile-areaOfCollaboration" className="text-sm font-semibold text-slate-700">
                    Area of Collaboration
                  </Label>
                  <Input
                    id="mobile-areaOfCollaboration"
                    name="areaOfCollaboration"
                    value={formData.areaOfCollaboration}
                    onChange={handleInputChange}
                    placeholder="Enter collaboration area"
                    className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                  />
                </div>

                {/* Address Fields */}
                <div>
                  <Label htmlFor="mobile-area" className="text-sm font-semibold text-slate-700">
                    Area
                  </Label>
                  <Input
                    id="mobile-area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter area"
                    className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobile-state" className="text-sm font-semibold text-slate-700">
                      State
                    </Label>
                    <Input
                      id="mobile-state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      className="h-12 mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile-zipcode" className="text-sm font-semibold text-slate-700">
                      Zipcode
                    </Label>
                    <Input
                      id="mobile-zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit zipcode"
                      className={`h-12 mt-2 border-2 transition-all ${
                        errors.zipcode
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-200 focus:border-purple-500"
                      }`}
                    />
                    {errors.zipcode && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.zipcode}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="mobile-termsSummary" className="text-sm font-semibold text-slate-700">
                    Terms Summary
                  </Label>
                  <Textarea
                    id="mobile-termsSummary"
                    name="termsSummary"
                    value={formData.termsSummary}
                    onChange={handleInputChange}
                    placeholder="Enter partnership terms summary"
                    className="mt-2 border-2 border-slate-200 focus:border-purple-500 transition-all"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingId ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {editingId ? "Update Partner" : "Add Partner"}
                      </>
                    )}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-6 border-2 bg-transparent"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Mobile Partners List */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Handshake className="h-5 w-5" />
                Other Partners ({filteredPartners.length})
              </CardTitle>
              <CardDescription className="text-orange-100 text-sm">
                Tap to edit partners
                 {/* (excluding yourself) */}
              </CardDescription>
              {/* {currentUser && partners.length > filteredPartners.length && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-blue-500/20 rounded-lg border border-blue-300">
                  <Shield className="h-4 w-4 text-blue-200" />
                  <span className="text-xs text-blue-100">Your account is hidden for security</span>
                </div>
              )} */}
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : filteredPartners.length === 0 ? (
                  <div className="text-center py-12">
                    <Handshake className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-500 font-medium">No other partners found</p>
                    <p className="text-sm text-slate-400 mt-2">
                      {partners.length > 0
                        ? "All partners are currently filtered out"
                        : "Add your first partner to get started"}
                    </p>
                  </div>
                ) : (
                  filteredPartners.map((partner) => (
                    <div key={partner._id} className="p-4 border-2 border-slate-200 rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-base text-slate-900">{partner.fullName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(partner.status)}
                            {partner.type && getTypeBadge(partner.type)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          {partner.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          {partner.mobile}
                        </div>
                        {partner.organizationName && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-purple-600" />
                            {partner.organizationName}
                          </div>
                        )}
                        {partner.areaOfCollaboration && (
                          <div className="flex items-center gap-2">
                            <Handshake className="h-4 w-4 text-indigo-600" />
                            {partner.areaOfCollaboration}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(partner)}
                          className="flex-1 h-10 border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 px-4 border-2 border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                          onClick={() => handleDelete(partner._id, partner.fullName)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Modal for Delete */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          title="Delete Partner"
          description={
            partnerToDelete
              ? `Are you sure you want to delete partner "${partnerToDelete.name}"? This action cannot be undone.`
              : ""
          }
          onConfirm={confirmDelete}
          onClose={() => setDeleteModalOpen(false)}
          confirmText={isSubmitting ? "Deleting..." : "Delete"}
        />
      </div>
    </div>
  )
}
