import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

const jobApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  designation: z.string().optional(),
  jobType: z.enum(["employee", "manager", "supervisor", "support"]),
  department: z.enum(["human_resources", "support", "development", "marketing", "operations"]),
  area: z.string().min(1, "Area is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  resumeLink: z.string().url("Invalid URL").optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  appliedAt: z.date().default(() => new Date()),
});

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("FarmEase");
    
    const body = await request.json();
    const validation = jobApplicationSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const result = await db.collection("jobApplications").insertOne(validation.data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Application submitted successfully", 
        applicationId: result.insertedId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("FarmEase");
    
    const applications = await db.collection("jobApplications")
      .find({ status: "pending" })
      .sort({ appliedAt: -1 })
      .toArray();
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}