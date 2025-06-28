import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

interface EmployeeQuery {
  userType: string;
  status?: string;
  department?: string;
  userRole?: string;
}

interface EmployeeUpdateData {
  updatedAt: string;
  username?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  designation?: string;
  userRole?: string;
  salary?: number;
  department?: string;
  dateOfJoining?: string;
  area?: string;
  state?: string;
  zipcode?: string;
  status?: string;
  password?: string;
  [key: string]: string | number | undefined; // Added index signature
}

interface DuplicateQuery {
  _id: { $ne: ObjectId };
  username?: string;
  email?: string;
}

async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("FarmEase")
    return { db }
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// GET employees with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const department = searchParams.get("department")
    const userRole = searchParams.get("userRole")

    const { db } = await connectToDatabase()

    const query: EmployeeQuery = { userType: "employee" }

    if (status) query.status = status
    if (department) query.department = department
    if (userRole) query.userRole = userRole

    const employees = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    // Don't return password hashes to the client
    const sanitizedEmployees = employees.map(({ password: _password, ...rest }) => rest)

    return NextResponse.json({
      success: true,
      employees: sanitizedEmployees,
    })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employees",
        employees: [],
      },
      { status: 500 }
    )
  }
}

// POST new employee with password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const requiredFields = ["username", "fullName", "email", "mobile", "password", "confirmPassword"]
    
    // Validate required fields
    for (const field of requiredFields) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Password validation
    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Check for existing username or email
    const existingUser = await db.collection("users").findOne({
      $or: [
        { username: body.username.trim().toLowerCase() },
        { email: body.email.trim().toLowerCase() }
      ]
    })

    if (existingUser) {
      const field = existingUser.username === body.username.trim().toLowerCase() 
        ? "username" 
        : "email"
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt)

    const newEmployee = {
      username: body.username.trim().toLowerCase(),
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      mobile: body.mobile.trim(),
      password: hashedPassword,
      designation: body.designation?.trim() || "",
      userRole: body.userRole?.trim() || "employee",
      salary: body.salary ? Number(body.salary) : undefined,
      department: body.department?.trim() || "",
      userType: "employee",
      status: "active",
      dateOfJoining: body.dateOfJoining || new Date().toISOString().split("T")[0],
      area: body.area?.trim() || "",
      state: body.state?.trim() || "",
      zipcode: body.zipcode?.trim() || "",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("users").insertOne(newEmployee)

    if (!result.insertedId) {
      throw new Error("Failed to create employee")
    }

    const { password: _password, ...employeeWithoutPassword } = newEmployee

    return NextResponse.json({
      success: true,
      message: "Employee created successfully",
      employee: employeeWithoutPassword,
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create employee",
      },
      { status: 500 }
    )
  }
}

// PUT update employee
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.employeeId?.trim()) {
      return NextResponse.json(
        { success: false, error: "Employee ID is required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const employeeId = new ObjectId(body.employeeId.trim())

    // Check if employee exists
    const existingEmployee = await db.collection("users").findOne({
      _id: employeeId,
      userType: "employee",
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      )
    }

    const updateData: EmployeeUpdateData = {
      updatedAt: new Date().toISOString(),
    }

    // Update fields if provided
    const updatableFields = [
      "username", "fullName", "email", "mobile", "designation", 
      "userRole", "salary", "department", "dateOfJoining", 
      "area", "state", "zipcode", "status"
    ]

    for (const field of updatableFields) {
      if (body[field] !== undefined && body[field] !== null) {
        updateData[field] = typeof body[field] === "string" 
          ? body[field].trim() 
          : body[field]
      }
    }

    // Handle password update if provided
    if (body.password?.trim()) {
      if (body.password.length < 6) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 6 characters" },
          { status: 400 }
        )
      }

      if (body.password !== body.confirmPassword) {
        return NextResponse.json(
          { success: false, error: "Passwords do not match" },
          { status: 400 }
        )
      }

      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(body.password, salt)
    }

    // Check for duplicate username/email
    if (updateData.username || updateData.email) {
      const duplicateQuery: DuplicateQuery = { _id: { $ne: employeeId } }
      
      if (updateData.username) {
        duplicateQuery.username = updateData.username.toLowerCase()
      }
      if (updateData.email) {
        duplicateQuery.email = updateData.email.toLowerCase()
      }

      const duplicateUser = await db.collection("users").findOne(duplicateQuery)
      if (duplicateUser) {
        const field = duplicateUser.username === updateData.username?.toLowerCase()
          ? "username"
          : "email"
        return NextResponse.json(
          { success: false, error: `${field} already exists` },
          { status: 400 }
        )
      }
    }

    const result = await db.collection("users").updateOne(
      { _id: employeeId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Employee updated successfully",
    })
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update employee",
      },
      { status: 500 }
    )
  }
}

// DELETE employee
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    if (!employeeId?.trim()) {
      return NextResponse.json(
        { success: false, error: "Employee ID is required" },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(employeeId.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid employee ID format" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const objectId = new ObjectId(employeeId.trim())

    const result = await db.collection("users").deleteOne({
      _id: objectId,
      userType: "employee",
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete employee",
      },
      { status: 500 }
    )
  }
}