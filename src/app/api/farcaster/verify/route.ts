// src/app/api/farcaster/verify/route.ts
import { NextResponse } from "next/server";
import { verifyFID, getFarcasterActivity } from "@/lib/farcaster";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    // Verify FID exists
    const user = await verifyFID(Number(fid));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get activity data
    const activity = await getFarcasterActivity(Number(fid));

    return NextResponse.json({
      success: true,
      user,
      activity,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
