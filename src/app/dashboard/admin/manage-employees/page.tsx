"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import {
  UserPlus,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Loader2,
  Users,
  MapPin,
  Building,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface Employee {
  _id: string
  username: string
  fullName: string
  email: string
  mobile: string
  designation?: string
  userRole?: string
  salary?: number
  department?: string
  userType: "employee"
  status?: "active" | "inactive"
  dateOfJoining?: string
  area?: string
  state?: string
  zipcode?: string
  emailVerified?: boolean
  createdAt: string
  updatedAt?: string
}

export default function ManageEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
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
    designation: "",
    userRole: "employee",
    salary: "",
    department: "",
    dateOfJoining: "",
    area: "",
    state: "",
    zipcode: "",
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<{id: string, name: string} | null>(null)

  // Success/error message state
  const [successMessage, setSuccessMessage] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error"
  })

  // Show success/error message
  const showMessage = (message: string, type: "success" | "error" = "success") => {
    setSuccessMessage({ show: true, message, type })
    setTimeout(() => {
      setSuccessMessage({ show: false, message: "", type: "success" })
    }, 4000)
  }

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/employees")
      const data = await response.json()
      
      if (response.ok && data.success) {
        setEmployees(data.employees)
      } else {
        // Only show toast for fetch errors, since no field error possible here
        showMessage("Failed to fetch employees", "error")
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      showMessage("Error fetching employees", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const url = "/api/employees"
      const method = editingId ? "PUT" : "POST"

      const body = {
        ...formData,
        ...(editingId ? { employeeId: editingId } : {})
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
        // Check for duplicate username/email error
        if (data?.error?.toLowerCase().includes("username already exists")) {
          setErrors(prev => ({ ...prev, username: "Username already exists" }))
          return
        }
        if (data?.error?.toLowerCase().includes("email already exists")) {
          setErrors(prev => ({ ...prev, email: "Email already exists" }))
          return
        }
        // Handle other field validation errors from backend (optional)
        if (data?.error?.toLowerCase().includes("password must be at least")) {
          setErrors(prev => ({ ...prev, password: data.error }))
          return
        }
        if (data?.error?.toLowerCase().includes("passwords do not match")) {
          setErrors(prev => ({ ...prev, confirmPassword: data.error }))
          return
        }
        // Fallback: show toast for other errors
        showMessage(data.error || "Failed to save employee", "error")
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
        designation: "",
        userRole: "employee",
        salary: "",
        department: "",
        dateOfJoining: "",
        area: "",
        state: "",
        zipcode: "",
      })
      setEditingId(null)
      setErrors({})

      // Show success message
      showMessage(editingId ? "Employee updated successfully!" : "Employee added successfully!")

      // Refresh employee list
      await fetchEmployees()
      
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to save employee", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit employee
  const handleEdit = (employee: Employee) => {
    setFormData({
      username: employee.username,
      fullName: employee.fullName,
      email: employee.email,
      mobile: employee.mobile,
      password: "",
      confirmPassword: "",
      designation: employee.designation || "",
      userRole: employee.userRole || "employee",
      salary: employee.salary?.toString() || "",
      department: employee.department || "",
      dateOfJoining: employee.dateOfJoining || "",
      area: employee.area || "",
      state: employee.state || "",
      zipcode: employee.zipcode || "",
    })
    setEditingId(employee._id)
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
      designation: "",
      userRole: "employee",
      salary: "",
      department: "",
      dateOfJoining: "",
      area: "",
      state: "",
      zipcode: "",
    })
    setErrors({})
  }

  // Delete employee
  const handleDelete = (id: string, name: string) => {
    setEmployeeToDelete({ id, name })
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!employeeToDelete) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/employees?employeeId=${employeeToDelete.id}`, {
        method: "DELETE",
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        showMessage(data.error || "Failed to delete employee", "error")
        return
      }
      
      // Show success message
      showMessage("Employee deleted successfully!")
      
      // Refresh employee list
      await fetchEmployees()
      
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to delete employee", "error")
    } finally {
      setIsSubmitting(false)
      setDeleteModalOpen(false)
      setEmployeeToDelete(null)
    }
  }

  // Status badge
  const getStatusBadge = (status?: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
    )
  }

  // Department badge
  const getDepartmentBadge = (department?: string) => {
    if (!department) return null
    const colors: Record<string, string> = {
      operations: "bg-blue-100 text-blue-800 border-blue-200",
      support: "bg-green-100 text-green-800 border-green-200",
      development: "bg-purple-100 text-purple-800 border-purple-200",
      marketing: "bg-orange-100 text-orange-800 border-orange-200",
      hr: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return (
      <Badge className={`${colors[department.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"} border`}>
        {department}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Message */}
      {successMessage.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            successMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
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

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Add/Edit Employee Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              {editingId ? "Edit Employee" : "Add New Employee"}
            </CardTitle>
            <CardDescription className="text-blue-100 text-base">
              {editingId ? "Update employee information" : "Add a new employee to the platform"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
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
                        : "border-gray-200 focus:border-blue-500"
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
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
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
                        : "border-gray-200 focus:border-blue-500"
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
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
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
                      errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
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
                  <Label htmlFor="mobile" className="text-sm font-semibold text-gray-700">
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
                        : "border-gray-200 focus:border-blue-500"
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
                  <Label htmlFor="designation" className="text-sm font-semibold text-gray-700">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Enter designation"
                    className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <Label htmlFor="salary" className="text-sm font-semibold text-gray-700">
                    Salary
                  </Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary amount"
                    className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {!editingId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
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
                          : "border-gray-200 focus:border-blue-500"
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
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
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
                          : "border-gray-200 focus:border-blue-500"
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
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
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
                          : "border-gray-200 focus:border-blue-500"
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
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
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
                          : "border-gray-200 focus:border-blue-500"
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
                  <Label htmlFor="userRole" className="text-sm font-semibold text-gray-700">
                    User Role
                  </Label>
                  <Select
                    value={formData.userRole}
                    onValueChange={(value) => handleSelectChange("userRole", value)}
                  >
                    <SelectTrigger className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 bg-white transition-all">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                      <SelectItem value="employee" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                        👨‍💼 Employee
                      </SelectItem>
                      <SelectItem value="manager" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                        👔 Manager
                      </SelectItem>
                      <SelectItem value="supervisor" className="py-3 px-4 hover:bg-purple-50 cursor-pointer">
                        👨‍💻 Supervisor
                      </SelectItem>
                      <SelectItem value="support" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
                        🎧 Support
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department" className="text-sm font-semibold text-gray-700">
                    Department
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 bg-white transition-all">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                      <SelectItem value="operations" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                        ⚙️ Operations
                      </SelectItem>
                      <SelectItem value="support" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                        🎧 Support
                      </SelectItem>
                      <SelectItem value="development" className="py-3 px-4 hover:bg-purple-50 cursor-pointer">
                        💻 Development
                      </SelectItem>
                      <SelectItem value="marketing" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
                        📢 Marketing
                      </SelectItem>
                      <SelectItem value="hr" className="py-3 px-4 hover:bg-pink-50 cursor-pointer">
                        👥 Human Resources
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="area" className="text-sm font-semibold text-gray-700">
                    Area
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter area"
                    className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <Label htmlFor="zipcode" className="text-sm font-semibold text-gray-700">
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
                        : "border-gray-200 focus:border-blue-500"
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
                <Label htmlFor="dateOfJoining" className="text-sm font-semibold text-gray-700">
                  Date of Joining
                </Label>
                <Input
                  id="dateOfJoining"
                  name="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                  className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      {editingId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {editingId ? <Edit className="mr-3 h-5 w-5" /> : <UserPlus className="mr-3 h-5 w-5" />}
                      {editingId ? "Update Employee" : "Add Employee"}
                    </>
                  )}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 px-8 border-2 border-gray-300 hover:border-gray-400 font-semibold transition-all bg-transparent"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Employees List */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              All Employees ({employees.length})
            </CardTitle>
            <CardDescription className="text-green-100 text-base">Manage existing employees</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[700px]">
              <div className="space-y-0">
                {loading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">No employees yet</p>
                    <p className="text-sm text-gray-400 mt-2">Add your first employee to get started</p>
                  </div>
                ) : (
                  employees.map((employee, index) => (
                    <div
                      key={employee._id}
                      className={`p-6 border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-semibold text-lg text-gray-900">{employee.fullName}</h4>
                            {getStatusBadge(employee.status)}
                            {employee.department && getDepartmentBadge(employee.department)}
                            {employee.emailVerified && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-3 text-sm text-gray-700 mb-3 w-full">
  <div className="flex items-center gap-2">
    <Mail className="h-4 w-4 text-blue-600 shrink-0" />
    <span className="break-words">{employee.email}</span>
  </div>
  <div className="flex items-center gap-2">
    <Phone className="h-4 w-4 text-green-600 shrink-0" />
    <span>{employee.mobile}</span>
  </div>
  <div className="flex items-center gap-2">
    <Users className="h-4 w-4 text-purple-600 shrink-0" />
    <span>@{employee.username}</span>
  </div>
  {employee.designation && (
    <div className="flex items-center gap-2">
      <Building className="h-4 w-4 text-orange-600 shrink-0" />
      <span>{employee.designation}</span>
    </div>
  )}
  {employee.area && (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-red-600 shrink-0" />
      <span>{employee.area}, {employee.state}</span>
    </div>
  )}
  {employee.salary && (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-indigo-600 shrink-0" />
      <span>₹{employee.salary.toLocaleString()}</span>
    </div>
  )}
</div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(employee)}
                            className="h-10 w-10 p-0 hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(employee._id, employee.fullName)}
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
  {/* Mobile Form - Show at top when editing or adding */}
  {(editingId || !editingId) && (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          {editingId ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          {editingId ? "Edit Employee" : "Add New Employee"}
        </CardTitle>
        <CardDescription className="text-blue-100 text-sm">
          {editingId ? "Update employee information" : "Add a new employee to the platform"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <Label htmlFor="mobile-username" className="text-sm font-semibold text-gray-700">
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
                  : "border-gray-200 focus:border-blue-500"
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
            <Label htmlFor="mobile-fullName" className="text-sm font-semibold text-gray-700">
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
                  : "border-gray-200 focus:border-blue-500"
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
            <Label htmlFor="mobile-email" className="text-sm font-semibold text-gray-700">
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
                errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
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
            <Label htmlFor="mobile-mobile" className="text-sm font-semibold text-gray-700">
              Mobile Number *
            </Label>
            <Input
              id="mobile-mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter 10-digit mobile number"
              className={`h-12 mt-2 border-2 transition-all ${
                errors.mobile
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.mobile && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.mobile}
              </div>
            )}
          </div>

          {/* Password (only required for new employees) */}
          {!editingId && (
            <>
              <div>
                <Label htmlFor="mobile-password" className="text-sm font-semibold text-gray-700">
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
                      : "border-gray-200 focus:border-blue-500"
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
                <Label htmlFor="mobile-confirmPassword" className="text-sm font-semibold text-gray-700">
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
                      : "border-gray-200 focus:border-blue-500"
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
            <Label htmlFor="mobile-designation" className="text-sm font-semibold text-gray-700">
              Designation
            </Label>
            <Input
              id="mobile-designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="Enter designation"
              className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <Label htmlFor="mobile-salary" className="text-sm font-semibold text-gray-700">
              Salary
            </Label>
            <Input
              id="mobile-salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Enter salary amount"
              className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <Label htmlFor="mobile-userRole" className="text-sm font-semibold text-gray-700">
              User Role
            </Label>
            <Select
              value={formData.userRole}
              onValueChange={(value) => handleSelectChange("userRole", value)}
            >
              <SelectTrigger className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 bg-white transition-all">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                <SelectItem value="employee" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                  👨‍💼 Employee
                </SelectItem>
                <SelectItem value="manager" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                  👔 Manager
                </SelectItem>
                <SelectItem value="supervisor" className="py-3 px-4 hover:bg-purple-50 cursor-pointer">
                  👨‍💻 Supervisor
                </SelectItem>
                <SelectItem value="support" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
                  🎧 Support
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mobile-department" className="text-sm font-semibold text-gray-700">
              Department
            </Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleSelectChange("department", value)}
            >
              <SelectTrigger className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 bg-white transition-all">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                <SelectItem value="operations" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                  ⚙️ Operations
                </SelectItem>
                <SelectItem value="support" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                  🎧 Support
                </SelectItem>
                <SelectItem value="development" className="py-3 px-4 hover:bg-purple-50 cursor-pointer">
                  💻 Development
                </SelectItem>
                <SelectItem value="marketing" className="py-3 px-4 hover:bg-orange-50 cursor-pointer">
                  📢 Marketing
                </SelectItem>
                <SelectItem value="hr" className="py-3 px-4 hover:bg-pink-50 cursor-pointer">
                  👥 Human Resources
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address Fields */}
          <div>
            <Label htmlFor="mobile-area" className="text-sm font-semibold text-gray-700">
              Area
            </Label>
            <Input
              id="mobile-area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Enter area"
              className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mobile-state" className="text-sm font-semibold text-gray-700">
                State
              </Label>
              <Input
                id="mobile-state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="mobile-zipcode" className="text-sm font-semibold text-gray-700">
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
                    : "border-gray-200 focus:border-blue-500"
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
            <Label htmlFor="mobile-dateOfJoining" className="text-sm font-semibold text-gray-700">
              Date of Joining
            </Label>
            <Input
              id="mobile-dateOfJoining"
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining}
              onChange={handleInputChange}
              className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingId ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {editingId ? <Edit className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {editingId ? "Update Employee" : "Add Employee"}
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
  )}

  {/* Mobile Employees List */}
  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Users className="h-5 w-5" />
        All Employees ({employees.length})
      </CardTitle>
      <CardDescription className="text-green-100 text-sm">Tap to edit employees</CardDescription>
    </CardHeader>
    <CardContent className="p-4">
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">No employees yet</p>
            <p className="text-sm text-gray-400 mt-2">Add your first employee to get started</p>
          </div>
        ) : (
          employees.map((employee) => (
            <div key={employee._id} className="p-4 border-2 border-gray-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-base text-gray-900">{employee.fullName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(employee.status)}
                    {employee.department && getDepartmentBadge(employee.department)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  {employee.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  {employee.mobile}
                </div>
                {employee.designation && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-orange-600" />
                    {employee.designation}
                  </div>
                )}
                {employee.salary && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    ₹{employee.salary.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(employee)}
                  className="flex-1 h-10 border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 px-4 border-2 border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                  onClick={() => handleDelete(employee._id, employee.fullName)}
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
        title="Delete Employee"
        description={
          employeeToDelete
            ? `Are you sure you want to delete employee "${employeeToDelete.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
        confirmText={isSubmitting ? "Deleting..." : "Delete"}
      />
    </div>
  )
}