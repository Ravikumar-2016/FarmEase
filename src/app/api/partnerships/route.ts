import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

const partnershipSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  organizationName: z.string().min(1, "Organization name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  partnershipType: z.enum(["ngo", "logistics", "technology", "financial", "government", "research", "other"]),
  contactPerson: z.string().min(1, "Contact person is required"),
  area: z.string().min(1, "Area is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  areaOfCollaboration: z.string().min(1, "Area of collaboration is required"),
  termsSummary: z.string().min(1, "Terms summary is required"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  requestedAt: z.date().default(() => new Date()),
});

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("FarmEase");
    
    const body = await request.json();
    const validation = partnershipSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const result = await db.collection("PartnershipsRequest").insertOne(validation.data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Partnership request submitted successfully", 
        requestId: result.insertedId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Partnership request error:", error);
    return NextResponse.json(
      { error: "Failed to submit partnership request. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("FarmEase");
    
    const requests = await db.collection("PartnershipsRequest")
      .find({ status: "pending" })
      .sort({ requestedAt: -1 })
      .toArray();
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching partnership requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch partnership requests" },
      { status: 500 }
    );
  }
}