import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });

    return NextResponse.json({ message: "✅ MongoDB ping successful" });
  } catch (error) {
    // TypeScript-safe error handling
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("❌ MongoDB ping failed:", err);

    return NextResponse.json(
      { message: "MongoDB ping failed", error: err.message },
      { status: 500 }
    );
  }
}
