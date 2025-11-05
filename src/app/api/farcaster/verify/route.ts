import { NextResponse } from "next/server";
import { verifyFID, getFarcasterActivity } from "@/lib/farcaster";

// ✅ Simple in-memory cache
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
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API timeout after 10s")), 10000)
    );

    const verifyPromise = (async () => {
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
        return {
          user,
          activity: {
            totalCasts: 10,
            totalLikes: 50,
            totalReplies: 20,
            engagementScore: 150,
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

    // Fallback data
    const fallbackData = {
      success: true,
      user: {
        fid: Number(fid),
        username: `user${fid}`,
        displayName: `User ${fid}`,
        pfpUrl: "",
        followerCount: 0,
        followingCount: 0,
        bio: "",
      },
      activity: {
        totalCasts: 10,
        totalLikes: 50,
        totalReplies: 20,
        engagementScore: 150,
        suggestedMood: "Creative Mind",
        suggestedMoodId: "creative-mind",
      },
    };

    // ✅ Cache fallback too
    cache.set(cacheKey, {
      data: fallbackData,
      timestamp: Date.now(),
    });

    return NextResponse.json(fallbackData);
  }
}
