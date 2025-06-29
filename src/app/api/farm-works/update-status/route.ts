import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("FarmEase");
    const today = new Date().toISOString().split('T')[0];
    
    const result = await db.collection("farmWorks").updateMany(
      {
        status: "active",
        workDate: { $lt: today }
      },
      {
        $set: { status: "completed" }
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("Error updating work statuses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update work statuses" },
      { status: 500 }
    );
  }
}