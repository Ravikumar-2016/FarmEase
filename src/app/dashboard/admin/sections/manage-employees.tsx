"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Edit, Trash2, Calendar, Phone, Mail, Loader2, Users } from "lucide-react"

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
  lastLogin?: string
}

interface ManageEmployeesProps {
  employees: Employee[]
  onRefresh: () => void
  onShowDeleteConfirmation: (type: string, id: string, name: string) => void
  submitting: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function ManageEmployees({
  employees,
  onRefresh,
  onShowDeleteConfirmation,
  submitting,
  onSuccess,
  onError,
}: ManageEmployeesProps) {
  const [employeeForm, setEmployeeForm] = useState({
    username: "",
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    designation: "",
    userRole: "",
    salary: "",
    department: "",
    dateOfJoining: "",
    area: "",
    state: "",
    zipcode: "",
  })
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!employeeForm.username.trim()) {
      onError("Username is required")
      setIsSubmitting(false)
      return
    }

    // Password validation for new employees
    if (!editingEmployee) {
      if (!employeeForm.password) {
        onError("Password is required")
        setIsSubmitting(false)
        return
      }
      if (employeeForm.password.length < 6) {
        onError("Password must be at least 6 characters")
        setIsSubmitting(false)
        return
      }
      if (employeeForm.password !== employeeForm.confirmPassword) {
        onError("Passwords do not match")
        setIsSubmitting(false)
        return
      }
    }

    try {
      const method = editingEmployee ? "PUT" : "POST"
      const body = editingEmployee 
        ? { ...employeeForm, employeeId: editingEmployee }
        : employeeForm

      const response = await fetch("/api/employees", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok && data.success !== false) {
        onSuccess(editingEmployee ? "Employee updated successfully!" : "Employee added successfully!")
        setEmployeeForm({
          username: "",
          fullName: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          designation: "",
          userRole: "",
          salary: "",
          department: "",
          dateOfJoining: "",
          area: "",
          state: "",
          zipcode: "",
        })
        setEditingEmployee(null)
        onRefresh()
      } else {
        onError(data.error || "Failed to save employee")
      }
    } catch (error) {
      console.error("Error saving employee:", error)
      onError("Failed to save employee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmployeeEdit = (employee: Employee) => {
    setEmployeeForm({
      username: employee.username || "",
      fullName: employee.fullName || "",
      email: employee.email || "",
      mobile: employee.mobile || "",
      password: "",
      confirmPassword: "",
      designation: employee.designation || "",
      userRole: employee.userRole || "",
      salary: employee.salary?.toString() || "",
      department: employee.department || "",
      dateOfJoining: employee.dateOfJoining || "",
      area: employee.area || "",
      state: employee.state || "",
      zipcode: employee.zipcode || "",
    })
    setEditingEmployee(employee._id)
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>
    return status === "active" ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add/Edit Employee Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {editingEmployee ? "Edit Employee" : "Add New Employee"}
          </CardTitle>
          <CardDescription>
            {editingEmployee ? "Update employee information" : "Add a new employee to the platform"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmployeeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={employeeForm.username}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={employeeForm.mobile}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={employeeForm.designation}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                  placeholder="Enter designation"
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={employeeForm.salary}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                  placeholder="Enter salary amount"
                />
              </div>
            </div>

            {!editingEmployee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={employeeForm.confirmPassword}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            )}

            {editingEmployee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={employeeForm.confirmPassword}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userRole">User Role</Label>
                <Select
                  value={employeeForm.userRole}
                  onValueChange={(value) => setEmployeeForm({ ...employeeForm, userRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={employeeForm.department}
                  onValueChange={(value) => setEmployeeForm({ ...employeeForm, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={employeeForm.area}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, area: e.target.value })}
                  placeholder="Enter area"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={employeeForm.state}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="zipcode">Zipcode</Label>
                <Input
                  id="zipcode"
                  value={employeeForm.zipcode}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, zipcode: e.target.value })}
                  placeholder="Enter zipcode"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input
                  id="dateOfJoining"
                  type="date"
                  value={employeeForm.dateOfJoining}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, dateOfJoining: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting || submitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingEmployee ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {editingEmployee ? <Edit className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {editingEmployee ? "Update" : "Add"} Employee
                  </>
                )}
              </Button>
              {editingEmployee && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingEmployee(null)
                    setEmployeeForm({
                      username: "",
                      fullName: "",
                      email: "",
                      mobile: "",
                      password: "",
                      confirmPassword: "",
                      designation: "",
                      userRole: "",
                      salary: "",
                      department: "",
                      dateOfJoining: "",
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

      {/* Employees List */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees ({employees.length})</CardTitle>
          <CardDescription>Manage existing employees</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {employees.map((employee) => (
                <div key={employee._id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{employee.fullName}</h4>
                        {getStatusBadge(employee.status)}
                        {employee.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {employee.mobile}
                        </div>
                        <div>Username: {employee.username}</div>
                        {employee.designation && <div>Role: {employee.designation}</div>}
                        {employee.department && <div>Dept: {employee.department}</div>}
                        {employee.area && (
                          <div>
                            Area: {employee.area}, {employee.state}
                          </div>
                        )}
                        {employee.salary && <div>Salary: ₹{employee.salary.toLocaleString()}</div>}
                        {employee.dateOfJoining && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined: {new Date(employee.dateOfJoining).toLocaleDateString()}
                          </div>
                        )}
                        {employee.lastLogin && (
                          <div className="text-xs text-gray-500">
                            Last login: {new Date(employee.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="ghost" onClick={() => handleEmployeeEdit(employee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onShowDeleteConfirmation("employee", employee._id, employee.fullName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {employees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No employees yet</p>
                  <p className="text-sm text-gray-400">Add your first employee to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}