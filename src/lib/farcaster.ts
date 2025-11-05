const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
const NEYNAR_BASE_URL = "https://api.neynar.com/v2/farcaster";

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  followerCount: number;
  followingCount: number;
  bio?: string;
}

export interface FarcasterActivity {
  totalCasts: number;
  totalLikes: number;
  totalReplies: number;
  engagementScore: number;
  suggestedMood: string;
  suggestedMoodId: string;
}

/**
 * Validate and clean PFP URL
 */
export function validatePfpUrl(pfpUrl: string | undefined | null): string {
  if (!pfpUrl) return "";

  const cleaned = pfpUrl.trim();

  // Check if valid URL
  try {
    const url = new URL(cleaned);

    // Only allow https
    if (url.protocol !== "https:") {
      console.warn("[Farcaster] Non-HTTPS PFP URL:", cleaned);
      return "";
    }

    return cleaned;
  } catch {
    console.warn("[Farcaster] Invalid PFP URL:", cleaned);
    return "";
  }
}

/**
 * Verify if FID exists and fetch user data
 */
export async function verifyFID(fid: number): Promise<FarcasterUser | null> {
  try {
    console.log("[Farcaster] 🔍 Verifying FID:", fid);

    const response = await fetch(`${NEYNAR_BASE_URL}/user/bulk?fids=${fid}`, {
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY || "",
      },
    });

    if (!response.ok) {
      console.error("[Farcaster] ❌ Neynar API error:", response.status);
      return null;
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user) {
      console.error("[Farcaster] ❌ User not found for FID:", fid);
      return null;
    }

    // Validate and clean PFP URL
    const validPfpUrl = validatePfpUrl(user.pfp_url);

    console.log("[Farcaster] ✅ User verified:", {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: validPfpUrl ? "Valid" : "Invalid",
      followerCount: user.follower_count || 0,
    });

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name || user.username,
      pfpUrl: validPfpUrl || "",
      followerCount: user.follower_count || 0,
      followingCount: user.following_count || 0,
      bio: user.profile?.bio?.text || "",
    };
  } catch (error: any) {
    console.error("[Farcaster] ❌ Failed to verify FID:", error?.message);
    return null;
  }
}

/**
 * Fetch user's Farcaster activity and calculate mood
 */
export async function getFarcasterActivity(
  fid: number
): Promise<FarcasterActivity | null> {
  try {
    console.log("[Farcaster] 📊 Fetching activity for FID:", fid);

    let totalCasts = 0;
    let totalLikes = 0;
    let totalReplies = 0;
    let followerCount = 0;

    // ✅ Fetch user data untuk dapat followerCount
    try {
      const userResponse = await fetch(
        `${NEYNAR_BASE_URL}/user/bulk?fids=${fid}`,
        {
          headers: {
            accept: "application/json",
            api_key: NEYNAR_API_KEY || "",
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const user = userData.users?.[0];
        if (user) {
          followerCount = user.follower_count || 0;
          console.log("[Farcaster] 👥 Follower count:", followerCount);
        }
      }
    } catch (err) {
      console.warn("[Farcaster] ⚠️ Could not fetch follower count");
    }

    // ✅ Fetch casts
    try {
      const feedResponse = await fetch(
        `${NEYNAR_BASE_URL}/feed?feed_type=filter&filter_type=fids&fid=${fid}&with_recasts=false&limit=25`,
        {
          headers: {
            accept: "application/json",
            api_key: NEYNAR_API_KEY || "",
          },
        }
      );

      if (feedResponse.ok) {
        const feedData = await feedResponse.json();
        const casts = feedData.casts || [];

        totalCasts = casts.length;
        totalLikes = casts.reduce(
          (sum: number, cast: any) => sum + (cast.reactions?.likes_count || 0),
          0
        );
        totalReplies = casts.reduce(
          (sum: number, cast: any) => sum + (cast.replies?.count || 0),
          0
        );

        console.log("[Farcaster] ✅ Activity from casts:", {
          totalCasts,
          totalLikes,
          totalReplies,
        });
      } else {
        throw new Error("Feed fetch failed");
      }
    } catch (castError: any) {
      console.error("[Farcaster] ⚠️ Could not fetch casts:", castError.message);

      // ✅ Use estimated values based on follower count
      if (followerCount > 0) {
        totalCasts = Math.max(10, Math.floor(followerCount / 10));
        totalLikes = Math.max(50, Math.floor(followerCount * 2));
        totalReplies = Math.max(20, Math.floor(followerCount / 5));
      } else {
        // Default fallback
        totalCasts = 10;
        totalLikes = 50;
        totalReplies = 20;
      }

      console.log("[Farcaster] 📊 Using estimated values:", {
        totalCasts,
        totalLikes,
        totalReplies,
      });
    }

    // ✅ Calculate engagement score
    const engagementScore =
      totalLikes * 2 + // Likes worth 2 points
      totalReplies * 3 + // Replies worth 3 points
      totalCasts * 1 + // Casts worth 1 point
      Math.floor(followerCount / 10); // Followers contribute too

    console.log("[Farcaster] 📈 Engagement score:", engagementScore);

    // ✅ Determine mood
    const mood = calculateMood(engagementScore, totalCasts, totalLikes);

    console.log("[Farcaster] ✅ Mood determined:", {
      moodName: mood.name,
      moodId: mood.id,
      engagementScore,
    });

    return {
      totalCasts,
      totalLikes,
      totalReplies,
      engagementScore,
      suggestedMood: mood.name,
      suggestedMoodId: mood.id,
    };
  } catch (error: any) {
    console.error("[Farcaster] ❌ Failed to fetch activity:", error.message);

    // ✅ Return fallback with proper mood
    return {
      totalCasts: 10,
      totalLikes: 50,
      totalReplies: 20,
      engagementScore: 150,
      suggestedMood: "Mysterious",
      suggestedMoodId: "mysterious",
    };
  }
}

/**
 * Calculate mood based on activity metrics
 */
function calculateMood(
  engagementScore: number,
  casts: number,
  likes: number
): { name: string; id: string } {
  console.log("[Farcaster] 🎯 Calculating mood from score:", engagementScore);

  // ✅ TIER 1: Super Active (6000+)
  if (engagementScore > 6000) {
    return { name: "Fire Starter", id: "fire-starter" };
  }

  // ✅ TIER 2: Very Active (4000-6000)
  if (engagementScore > 4000) {
    return { name: "Chaos Energy", id: "chaos-energy" };
  }

  // ✅ TIER 3: Highly Active (2500-4000)
  if (engagementScore > 2500) {
    return { name: "Chaostic Expression", id: "chaostic-expression" };
  }

  // ✅ TIER 4: Active (1500-2500)
  if (engagementScore > 1500) {
    return { name: "Creative Mind", id: "creative-mind" };
  }

  // ✅ TIER 5: Moderately Active (1000-1500)
  if (engagementScore > 1000) {
    return { name: "Morning Mom", id: "morning-mom" };
  }

  // ✅ TIER 6: Regular (600-1000)
  if (engagementScore > 600) {
    return { name: "Moon Mission", id: "moon-mission" };
  }

  // ✅ TIER 7: Casual (400-600)
  if (engagementScore > 400) {
    return { name: "Relaxed Mode", id: "relaxed-mode" };
  }

  // ✅ TIER 8: Light Activity (250-400)
  if (engagementScore > 250) {
    return { name: "Green Peace", id: "green-peace" };
  }

  // ✅ TIER 9: Low Activity (150-250)
  if (engagementScore > 150) {
    return { name: "Mysterious", id: "mysterious" };
  }

  // ✅ TIER 10: Very Low (50-150)
  if (engagementScore > 50) {
    return { name: "Ocean Lady", id: "ocean-lady" };
  }

  // ✅ TIER 11: Minimal (<50)
  return { name: "Pink to Rose", id: "pink-to-rose" };
}

/**
 * Get user's profile image
 */
export function getFarcasterProfileImage(pfpUrl: string): string {
  return pfpUrl || "/assets/images/default-avatar.png";
}
