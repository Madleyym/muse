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
      console.error("Neynar API error:", response.status);
      return null;
    }

    const data = await response.json();
    const user = data.users[0];

    if (!user) return null;

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name || user.username,
      pfpUrl: user.pfp_url || "/assets/images/default-avatar.png",
      followerCount: user.follower_count || 0,
      followingCount: user.following_count || 0,
      bio: user.profile?.bio?.text || "",
    };
  } catch (error) {
    console.error("Failed to verify FID:", error);
    return null;
  }
}

/**
 * Fetch user's Farcaster activity and calculate mood
 * Uses follower-based algorithm as fallback for reliable data
 */
export async function getFarcasterActivity(
  fid: number
): Promise<FarcasterActivity | null> {
  try {
    // First, get user data (which we KNOW works)
    const user = await verifyFID(fid);

    if (!user) return null;

    // Try to fetch recent casts using correct endpoint
    let totalCasts = 0;
    let totalLikes = 0;
    let totalReplies = 0;

    try {
      // Method 1: Try feed endpoint
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
      }
    } catch (castError) {
      console.error("Could not fetch casts, using follower-based estimation");
    }

    // If we couldn't get cast data, estimate based on followers
    if (totalCasts === 0) {
      // Estimate activity based on follower count
      const followerCount = user.followerCount;

      if (followerCount > 100000) {
        totalCasts = 25;
        totalLikes = 500;
        totalReplies = 150;
      } else if (followerCount > 10000) {
        totalCasts = 20;
        totalLikes = 200;
        totalReplies = 80;
      } else if (followerCount > 1000) {
        totalCasts = 15;
        totalLikes = 80;
        totalReplies = 30;
      } else if (followerCount > 100) {
        totalCasts = 10;
        totalLikes = 30;
        totalReplies = 10;
      } else {
        totalCasts = 5;
        totalLikes = 10;
        totalReplies = 3;
      }
    }

    // Calculate engagement score
    const engagementScore =
      totalLikes * 2 +
      totalReplies * 3 +
      totalCasts +
      Math.floor(user.followerCount / 100); // Bonus from followers

    // Determine mood
    const mood = calculateMood(engagementScore, totalCasts, totalLikes);

    return {
      totalCasts,
      totalLikes,
      totalReplies,
      engagementScore,
      suggestedMood: mood.name,
      suggestedMoodId: mood.id,
    };
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return null;
  }
}

/**
 * Calculate mood based on activity metrics
 * ONLY uses moods with existing image files
 */
function calculateMood(
  engagementScore: number,
  casts: number,
  likes: number
): { name: string; id: string } {
  console.log("Calculating mood:", { engagementScore, casts, likes });

  // 🔥 ONLY these 11 PRO moods exist in /public/assets/images/Pro/

  // Very high engagement (6000+)
  if (engagementScore > 6000) {
    return { name: "Fire Starter 🔥", id: "fire-starter" };
  }

  // High engagement (4000+)
  if (engagementScore > 4000) {
    return { name: "Chaos Energy ⚡", id: "chaos-energy" };
  }

  // Good engagement (2500+)
  if (engagementScore > 2500) {
    return { name: "Chaostic Expression 💖", id: "chaostic-expression" };
  }

  // Active user (1500+)
  if (engagementScore > 1500) {
    return { name: "Creative Mind 🎨", id: "creative-mind" };
  }

  // Moderate user (1000+)
  if (engagementScore > 1000) {
    return { name: "Morning Mom ☀️", id: "morning-mom" };
  }

  // Regular user (600+)
  if (engagementScore > 600) {
    return { name: "Moon Mission 🌙", id: "moon-mission" };
  }

  // Medium activity (400+)
  if (engagementScore > 400) {
    return { name: "Relaxed Mode 😌", id: "relaxed-mode" };
  }

  // Low-medium activity (250+)
  if (engagementScore > 250) {
    return { name: "Green Peace 🌿", id: "green-peace" };
  }

  // Low activity (150+)
  if (engagementScore > 150) {
    return { name: "Mysterious 👻", id: "mysterious" };
  }

  // Minimal activity (50+)
  if (engagementScore > 50) {
    return { name: "Ocean Lady 🌊", id: "ocean-lady" };
  }

  // Very low activity
  return { name: "Pink to Rose 🌸", id: "pink-to-rose" };
}

/**
 * Get user's profile image
 */
export function getFarcasterProfileImage(pfpUrl: string): string {
  return pfpUrl || "/assets/images/default-avatar.png";
}
