import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const timestamp = new Date().toISOString();
  const userAgent = request.headers.get("user-agent") || "Unknown";

  console.log(`📡 [${timestamp}] /api/ping-db called`);
  console.log(`🧭 User-Agent: ${userAgent}`);

  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });

    console.log("✅ MongoDB ping successful");

    return NextResponse.json({ message: "✅ MongoDB ping successful" });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("❌ MongoDB ping failed:", err);

    return NextResponse.json(
      { message: "MongoDB ping failed", error: err.message },
      { status: 500 }
    );
  }
}
