import { NextResponse } from "next/server";
import { verifyFID, getFarcasterActivity } from "@/lib/farcaster";
import { nftMoods } from "@/data/nftMoods";

// ✅ Cache untuk menghindari rate limit
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  console.log("[API Verify] 📨 Request for FID:", fid);

  if (!fid) {
    console.error("[API Verify] ❌ Missing FID");
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  // ✅ Check cache first
  const cacheKey = `fid-${fid}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("[API Verify] ✅ Returning cached data for FID:", fid);
    return NextResponse.json(cached.data);
  }

  try {
    console.log("[API Verify] 🔍 Fetching user data...");
    const user = await verifyFID(Number(fid));

    if (!user) {
      throw new Error("User not found");
    }

    console.log("[API Verify] ✅ User found:", user.username);

    console.log("[API Verify] 📊 Fetching activity...");
    const activity = await getFarcasterActivity(Number(fid));

    if (!activity) {
      console.warn("[API Verify] ⚠️ No activity data, using defaults");

      const defaultActivity = {
        totalCasts: 10,
        totalLikes: 50,
        totalReplies: 20,
        engagementScore: 150,
        suggestedMood: "Creative Mind",
        suggestedMoodId: "creative-mind",
      };

      const responseData = {
        success: true,
        user,
        activity: defaultActivity,
      };

      // ✅ Cache it
      cache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now(),
      });

      return NextResponse.json(responseData);
    }

    // ✅ VALIDATE MOOD EXISTS IN nftMoods
    const validMood = nftMoods.find((m) => m.id === activity.suggestedMoodId);

    if (!validMood) {
      console.warn("[API Verify] ⚠️ Invalid moodId:", activity.suggestedMoodId);
      console.warn(
        "[API Verify] Available moods:",
        nftMoods.map((m) => m.id)
      );

      // ✅ Use fallback
      activity.suggestedMood = "Creative Mind";
      activity.suggestedMoodId = "creative-mind";
    }

    console.log("[API Verify] ✅ Activity found:", activity.suggestedMood);

    const responseData = {
      success: true,
      user,
      activity,
    };

    // ✅ Store in cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    });

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("[API Verify] ❌ Error:", error?.message);

    // ✅ RETURN ERROR, JANGAN FALLBACK OTOMATIS
    // Ini biar frontend bisa handle sendiri
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch user data",
      },
      { status: 500 }
    );
  }
}
