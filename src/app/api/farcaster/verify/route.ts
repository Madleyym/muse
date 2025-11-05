import { NextResponse } from "next/server";
import { verifyFID, getFarcasterActivity } from "@/lib/farcaster";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  console.log("[API Verify] 📨 Request for FID:", fid);

  if (!fid) {
    console.error("[API Verify] ❌ Missing FID");
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    // Add timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API timeout after 8s")), 8000)
    );

    const verifyPromise = (async () => {
      console.log("[API Verify] 🔍 Fetching user data...");
      const user = await verifyFID(Number(fid));

      if (!user) {
        throw new Error("User not found in Neynar");
      }

      console.log("[API Verify] ✅ User found:", user.username);

      console.log("[API Verify] 📊 Fetching activity...");
      const activity = await getFarcasterActivity(Number(fid));

      if (!activity) {
        console.warn("[API Verify] ⚠️ No activity data, using defaults");
        // Return user with default activity
        return {
          user,
          activity: {
            totalCasts: 0,
            totalLikes: 0,
            totalReplies: 0,
            engagementScore: 100,
            suggestedMood: "Creative Mind",
            suggestedMoodId: "creative-mind",
          },
        };
      }

      console.log("[API Verify] ✅ Activity found:", activity.suggestedMood);

      return { user, activity };
    })();

    const { user, activity } = (await Promise.race([
      verifyPromise,
      timeoutPromise,
    ])) as any;

    console.log("[API Verify] ✅ Success:", {
      fid: user.fid,
      mood: activity.suggestedMood,
    });

    return NextResponse.json({
      success: true,
      user,
      activity,
    });
  } catch (error: any) {
    console.error("[API Verify] ❌ Error:", error?.message);

    return NextResponse.json(
      {
        error: error.message || "Failed to verify FID",
        success: false,
      },
      { status: 500 }
    );
  }
}
