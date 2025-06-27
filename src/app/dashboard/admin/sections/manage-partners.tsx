"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Phone, Mail, Loader2, Handshake } from "lucide-react"

interface Partner {
  _id: string
  username?: string
  fullName: string
  email: string
  mobile: string
  organizationName?: string
  type?: string
  contactPerson?: string
  areaOfCollaboration?: string
  termsSummary?: string
  userType: "admin"
  status?: "active" | "inactive" | "pending"
  area?: string
  state?: string
  zipcode?: string
  emailVerified?: boolean
  createdAt: string
  updatedAt?: string
  lastLogin?: string
}

interface ManagePartnersProps {
  partners: Partner[]
  onRefresh: () => void
  onShowDeleteConfirmation: (type: string, id: string, name: string) => void
  submitting: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function ManagePartners({
  partners,
  onRefresh,
  onShowDeleteConfirmation,
  submitting,
  onSuccess,
  onError,
}: ManagePartnersProps) {
  const [partnerForm, setPartnerForm] = useState({
    fullName: "",
    username: "",
    password: "",
    organizationName: "",
    type: "",
    contactPerson: "",
    email: "",
    mobile: "",
    areaOfCollaboration: "",
    termsSummary: "",
    area: "",
    state: "",
    zipcode: "",
  })
  const [editingPartner, setEditingPartner] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = editingPartner ? "PUT" : "POST"
      const body = editingPartner ? { ...partnerForm, partnerId: editingPartner } : partnerForm

      const response = await fetch("/api/partners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok && data.success !== false) {
        onSuccess(editingPartner ? "Partner updated successfully!" : "Partner added successfully!")
        setPartnerForm({
          fullName: "",
          username: "",
          password: "",
          organizationName: "",
          type: "",
          contactPerson: "",
          email: "",
          mobile: "",
          areaOfCollaboration: "",
          termsSummary: "",
          area: "",
          state: "",
          zipcode: "",
        })
        setEditingPartner(null)
        onRefresh()
      } else {
        onError(data.error || "Failed to save partner")
      }
    } catch (error) {
      console.error("Error saving partner:", error)
      onError("Failed to save partner. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePartnerEdit = (partner: Partner) => {
    setPartnerForm({
      fullName: partner.fullName || "",
      username: partner.username || "",
      password: "", // Don't pre-fill password for security
      organizationName: partner.organizationName || "",
      type: partner.type || "",
      contactPerson: partner.contactPerson || partner.fullName || "",
      email: partner.email || "",
      mobile: partner.mobile || "",
      areaOfCollaboration: partner.areaOfCollaboration || "",
      termsSummary: partner.termsSummary || "",
      area: partner.area || "",
      state: partner.state || "",
      zipcode: partner.zipcode || "",
    })
    setEditingPartner(partner._id)
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type?: string) => {
    if (!type) return null
    const colors: { [key: string]: string } = {
      ngo: "bg-green-100 text-green-800",
      logistics: "bg-blue-100 text-blue-800",
      technology: "bg-purple-100 text-purple-800",
      financial: "bg-yellow-100 text-yellow-800",
      government: "bg-red-100 text-red-800",
      research: "bg-indigo-100 text-indigo-800",
    }

    return <Badge className={colors[type.toLowerCase()] || "bg-gray-100 text-gray-800"}>{type}</Badge>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add/Edit Partner Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingPartner ? "Edit Partner" : "Add New Partner"}
          </CardTitle>
          <CardDescription>
            {editingPartner ? "Update partner information" : "Add a new partnership to the platform"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePartnerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={partnerForm.fullName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={partnerForm.organizationName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, organizationName: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={partnerForm.username}
                  onChange={(e) => setPartnerForm({ ...partnerForm, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">{editingPartner ? "New Password" : "Password *"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={partnerForm.password}
                  onChange={(e) => setPartnerForm({ ...partnerForm, password: e.target.value })}
                  placeholder={editingPartner ? "Leave blank to keep current" : "Enter password"}
                  required={!editingPartner}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={partnerForm.mobile}
                  onChange={(e) => setPartnerForm({ ...partnerForm, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Partnership Type</Label>
                <Select
                  value={partnerForm.type}
                  onValueChange={(value) => setPartnerForm({ ...partnerForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGO">NGO</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={partnerForm.contactPerson}
                  onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                  placeholder="Enter contact person name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={partnerForm.area}
                  onChange={(e) => setPartnerForm({ ...partnerForm, area: e.target.value })}
                  placeholder="Enter area"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={partnerForm.state}
                  onChange={(e) => setPartnerForm({ ...partnerForm, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="zipcode">Zipcode</Label>
                <Input
                  id="zipcode"
                  value={partnerForm.zipcode}
                  onChange={(e) => setPartnerForm({ ...partnerForm, zipcode: e.target.value })}
                  placeholder="Enter zipcode"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="areaOfCollaboration">Area of Collaboration</Label>
              <Input
                id="areaOfCollaboration"
                value={partnerForm.areaOfCollaboration}
                onChange={(e) => setPartnerForm({ ...partnerForm, areaOfCollaboration: e.target.value })}
                placeholder="e.g., Supply Chain, Technology"
              />
            </div>

            <div>
              <Label htmlFor="termsSummary">Terms Summary</Label>
              <Textarea
                id="termsSummary"
                value={partnerForm.termsSummary}
                onChange={(e) => setPartnerForm({ ...partnerForm, termsSummary: e.target.value })}
                placeholder="Brief summary of partnership terms and conditions"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting || submitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingPartner ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {editingPartner ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {editingPartner ? "Update" : "Add"} Partner
                  </>
                )}
              </Button>
              {editingPartner && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingPartner(null)
                    setPartnerForm({
                      fullName: "",
                      username: "",
                      password: "",
                      organizationName: "",
                      type: "",
                      contactPerson: "",
                      email: "",
                      mobile: "",
                      areaOfCollaboration: "",
                      termsSummary: "",
                      area: "",
                      state: "",
                      zipcode: "",
                    })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>All Partners ({partners.length})</CardTitle>
          <CardDescription>Manage existing partnerships</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {partners.map((partner) => (
                <div key={partner._id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{partner.organizationName || partner.fullName}</h4>
                        {getStatusBadge(partner.status)}
                        {partner.type && getTypeBadge(partner.type)}
                        {partner.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {partner.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {partner.mobile}
                        </div>
                        {partner.username && <div>Username: {partner.username}</div>}
                        {partner.contactPerson && partner.contactPerson !== partner.fullName && (
                          <div>Contact: {partner.contactPerson}</div>
                        )}
                        {partner.areaOfCollaboration && <div>Area: {partner.areaOfCollaboration}</div>}
                        {partner.area && (
                          <div>
                            Location: {partner.area}, {partner.state}
                          </div>
                        )}
                        {partner.lastLogin && (
                          <div className="text-xs text-gray-500">
                            Last login: {new Date(partner.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      {partner.termsSummary && (
                        <p className="text-sm text-gray-600 line-clamp-2">{partner.termsSummary}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="ghost" onClick={() => handlePartnerEdit(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onShowDeleteConfirmation("partner", partner._id, partner.organizationName || partner.fullName)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {partners.length === 0 && (
                <div className="text-center py-8">
                  <Handshake className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No partners yet</p>
                  <p className="text-sm text-gray-400">Add your first partner to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}