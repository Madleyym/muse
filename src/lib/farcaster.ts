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
    const response = await fetch(`${NEYNAR_BASE_URL}/user/bulk?fids=${fid}`, {
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY || "",
      },
    });

    if (!response.ok) {
      console.error("[Farcaster] Neynar API error:", response.status);
      return null;
    }

    const data = await response.json();
    const user = data.users[0];

    if (!user) return null;

    // Validate and clean PFP URL
    const validPfpUrl = validatePfpUrl(user.pfp_url);

    console.log("[Farcaster] PFP URL validation:", {
      original: user.pfp_url,
      validated: validPfpUrl,
      isValid: !!validPfpUrl,
      fid: user.fid,
      username: user.username,
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
  } catch (error) {
    console.error("[Farcaster] Failed to verify FID:", error);
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
    console.log("[Farcaster] Fetching activity for FID:", fid);

    // ✅ REMOVED: Don't call verifyFID again (already called in API route)
    // const user = await verifyFID(fid);

    let totalCasts = 0;
    let totalLikes = 0;
    let totalReplies = 0;
    let followerCount = 0; // Will estimate if casts fail

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

      // Use default values
      totalCasts = 10;
      totalLikes = 50;
      totalReplies = 20;
      followerCount = 20; // From your data

      console.log("[Farcaster] Using default values");
    }

    // Calculate engagement score
    const engagementScore =
      totalLikes * 2 +
      totalReplies * 3 +
      totalCasts +
      Math.floor(followerCount / 100);

    // Determine mood
    const mood = calculateMood(engagementScore, totalCasts, totalLikes);

    console.log("[Farcaster] ✅ Activity calculated:", {
      engagementScore,
      mood: mood.name,
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

    // Fallback
    return {
      totalCasts: 10,
      totalLikes: 50,
      totalReplies: 20,
      engagementScore: 150,
      suggestedMood: "Creative Mind",
      suggestedMoodId: "creative-mind",
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
  console.log("[Farcaster] Calculating mood:", {
    engagementScore,
    casts,
    likes,
  });

  if (engagementScore > 6000) {
    return { name: "Fire Starter", id: "fire-starter" };
  }

  if (engagementScore > 4000) {
    return { name: "Chaos Energy", id: "chaos-energy" };
  }

  if (engagementScore > 2500) {
    return { name: "Chaostic Expression", id: "chaostic-expression" };
  }

  if (engagementScore > 1500) {
    return { name: "Creative Mind", id: "creative-mind" };
  }

  if (engagementScore > 1000) {
    return { name: "Morning Mom", id: "morning-mom" };
  }

  if (engagementScore > 600) {
    return { name: "Moon Mission", id: "moon-mission" };
  }

  if (engagementScore > 400) {
    return { name: "Relaxed Mode", id: "relaxed-mode" };
  }

  if (engagementScore > 250) {
    return { name: "Green Peace", id: "green-peace" };
  }

  if (engagementScore > 150) {
    return { name: "Mysterious", id: "mysterious" };
  }

  if (engagementScore > 50) {
    return { name: "Ocean Lady", id: "ocean-lady" };
  }

  return { name: "Pink to Rose", id: "pink-to-rose" };
}

/**
 * Get user's profile image
 */
export function getFarcasterProfileImage(pfpUrl: string): string {
  return pfpUrl || "/assets/images/default-avatar.png";
}
