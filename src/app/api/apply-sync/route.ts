import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("FarmEase")

    // Fetch job applications
    const jobApplications = await db.collection("jobApplications").find({}).sort({ appliedAt: -1 }).toArray()

    // Fetch partnership requests
    const partnershipRequests = await db.collection("PartnershipsRequest").find({}).sort({ requestedAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      data: {
        jobApplications: jobApplications.map((app) => ({
          _id: app._id.toString(),
          fullName: app.fullName,
          email: app.email,
          mobile: app.mobileNumber,
          position: app.designation,
          jobType: app.jobType,
          department: app.department,
          location: `${app.area}, ${app.state}`,
          zipcode: app.zipcode,
          resumeLink: app.resumeLink,
          status: app.status,
          submittedAt: app.appliedAt,
        })),
        partnershipRequests: partnershipRequests.map((req) => ({
          _id: req._id.toString(),
          fullName: req.fullName,
          organizationName: req.organizationName,
          email: req.email,
          mobile: req.mobileNumber,
          type: req.partnershipType,
          contactPerson: req.contactPerson,
          location: `${req.area}, ${req.state}`,
          zipcode: req.zipcode,
          areaOfCollaboration: req.areaOfCollaboration,
          termsSummary: req.termsSummary,
          status: req.status,
          submittedAt: req.requestedAt,
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching apply-sync data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type") // 'job' or 'partnership'

    if (!id || !type) {
      return NextResponse.json({ success: false, error: "Missing id or type parameter" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("FarmEase")

    let result
    if (type === "job") {
      result = await db.collection("jobApplications").deleteOne({ _id: new ObjectId(id) })
    } else if (type === "partnership") {
      result = await db.collection("PartnershipsRequest").deleteOne({ _id: new ObjectId(id) })
    } else {
      return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 })
  }
}
