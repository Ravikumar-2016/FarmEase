import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const labourUsername = searchParams.get("labourUsername");

    if (!labourUsername) {
      return NextResponse.json({ error: "Missing labourUsername parameter" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("FarmEase");

    // Find works where this labour has applied
    const works = await db.collection("farmWorks")
      .find({
        "labourApplications.labourUsername": labourUsername
      })
      .toArray();

    return NextResponse.json({ works });
  } catch (error) {
    console.error("Error fetching applied works:", error);
    return NextResponse.json(
      { error: "Failed to fetch applied works" },
      { status: 500 }
    );
  }
}