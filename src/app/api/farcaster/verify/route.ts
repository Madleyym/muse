import { NextResponse } from "next/server";
import { verifyFID, getFarcasterActivity } from "@/lib/farcaster";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  console.log("[API /farcaster/verify] Request for FID:", fid);

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    // ✅ Add timeout untuk Neynar API
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API timeout")), 8000)
    );

    const verifyPromise = (async () => {
      // Verify FID exists
      const user = await verifyFID(Number(fid));

      if (!user) {
        throw new Error("User not found");
      }

      // Get activity data
      const activity = await getFarcasterActivity(Number(fid));

      return { user, activity };
    })();

    const { user, activity } = (await Promise.race([
      verifyPromise,
      timeoutPromise,
    ])) as any;

    console.log("[API /farcaster/verify] Success:", {
      fid: user.fid,
      mood: activity?.suggestedMood,
    });

    return NextResponse.json({
      success: true,
      user,
      activity,
    });
  } catch (error: any) {
    console.error("[API /farcaster/verify] Error:", error?.message);

    // ✅ Return partial data instead of error
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
