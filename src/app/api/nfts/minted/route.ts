import { NextResponse } from "next/server";
import { createPublicClient, http, fallback } from "viem";
import { base } from "viem/chains";
import { MUSE_NFT_CONTRACT } from "@/config/contracts";
import type { Abi } from "viem";

// Multiple RPC endpoints for reliability
const transports = fallback([
  http("https://mainnet.base.org"),
  http("https://base.llamarpc.com"),
  http("https://base-rpc.publicnode.com"),
]);

const client = createPublicClient({
  chain: base,
  transport: transports,
  batch: {
    multicall: true,
  },
});

// ✅ USE ENV VARIABLE (NOT hardcoded)
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;

// In-memory cache
let cachedNFTs: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 20000; // 20 seconds

function getDefaultAvatar(fid: number): string {
  const colors = [
    "FF6B6B",
    "4ECDC4",
    "45B7D1",
    "FFA07A",
    "98D8C8",
    "F7DC6F",
    "BB8FCE",
    "85C1E2",
    "F8B739",
    "52B788",
  ];
  const colorIndex = fid % colors.length;
  return `https://ui-avatars.com/api/?name=FID${fid}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`;
}

// Batch fetch PFPs for multiple FIDs at once
async function batchFetchPfps(fids: number[]): Promise<Map<number, string>> {
  const pfpMap = new Map<number, string>();

  if (fids.length === 0) return pfpMap;

  try {
    const fidsParam = fids.join(",");
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fidsParam}`,
      {
        headers: {
          accept: "application/json",
          api_key: NEYNAR_API_KEY,
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
      }
    );

    if (response.ok) {
      const data = await response.json();
      const users = data.users || [];

      users.forEach((user: any) => {
        if (user?.fid && user?.pfp_url) {
          pfpMap.set(user.fid, user.pfp_url);
        }
      });

      console.log(`✅ Fetched ${pfpMap.size}/${fids.length} PFPs from Neynar`);
    }
  } catch (error) {
    console.error("⚠️ Batch PFP fetch failed:", error);
  }

  // Fill missing PFPs with defaults
  fids.forEach((fid) => {
    if (!pfpMap.has(fid)) {
      pfpMap.set(fid, getDefaultAvatar(fid));
    }
  });

  return pfpMap;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    // Return cache if fresh
    const now = Date.now();
    if (
      !forceRefresh &&
      cachedNFTs.length > 0 &&
      now - lastFetchTime < CACHE_DURATION
    ) {
      console.log(`✅ Returning ${cachedNFTs.length} cached NFTs`);
      return NextResponse.json({
        success: true,
        totalMinted: cachedNFTs.length,
        nfts: cachedNFTs,
        cached: true,
        timestamp: new Date(lastFetchTime).toISOString(),
      });
    }

    console.log("🔄 Fetching fresh NFT data from contract...");

    // Step 1: Get total minted
    const totalMinted = await client.readContract({
      address: MUSE_NFT_CONTRACT.address as `0x${string}`,
      abi: MUSE_NFT_CONTRACT.abi as Abi,
      functionName: "totalMinted",
    });

    const total = Number(totalMinted);
    console.log(`📊 Total minted: ${total}`);

    if (total === 0) {
      return NextResponse.json({
        success: true,
        totalMinted: 0,
        nfts: [],
        cached: false,
      });
    }

    // Step 2: Batch fetch ALL metadata and owners using multicall
    console.log("📦 Batch fetching metadata and owners...");

    const metadataCalls = [];
    const ownerCalls = [];

    for (let i = 0; i < total; i++) {
      metadataCalls.push({
        address: MUSE_NFT_CONTRACT.address as `0x${string}`,
        abi: MUSE_NFT_CONTRACT.abi as Abi,
        functionName: "getMoodMetadata",
        args: [BigInt(i)],
      } as const);

      ownerCalls.push({
        address: MUSE_NFT_CONTRACT.address as `0x${string}`,
        abi: MUSE_NFT_CONTRACT.abi as Abi,
        functionName: "ownerOf",
        args: [BigInt(i)],
      } as const);
    }

    // Execute multicall (much faster than individual calls)
    const [metadataResults, ownerResults] = await Promise.all([
      client.multicall({ contracts: metadataCalls as any, allowFailure: true }),
      client.multicall({ contracts: ownerCalls as any, allowFailure: true }),
    ]);

    console.log(`✅ Fetched ${metadataResults.length} metadata records`);

    // Step 3: Process results
    const nftData: Array<{
      id: number;
      tokenId: number;
      moodId: string;
      moodName: string;
      fid: number;
      username: string;
      owner: string;
      isHD: boolean;
      mintedAt: string;
      pfpUrl?: string;
    }> = [];
    const fids: number[] = [];

    for (let i = 0; i < total; i++) {
      const metaResult = metadataResults[i];
      const ownerResult = ownerResults[i];

      if (metaResult.status === "success" && ownerResult.status === "success") {
        const meta = metaResult.result as any;
        const owner = ownerResult.result as string;

        const fid = Number(meta.fid);
        fids.push(fid);

        nftData.push({
          id: i,
          tokenId: i,
          moodId: String(meta.moodId),
          moodName: String(meta.moodName),
          fid: fid,
          username: String(meta.farcasterUsername),
          owner: owner,
          isHD: Boolean(meta.isHD),
          mintedAt: new Date(Number(meta.mintedAt) * 1000).toISOString(),
        });
      } else {
        console.warn(`⚠️ Failed to fetch NFT #${i}`);
      }
    }

    console.log(`✅ Processed ${nftData.length}/${total} NFTs`);

    // Step 4: Batch fetch profile pictures
    console.log(`🖼️ Batch fetching ${fids.length} profile pictures...`);
    const pfpMap = await batchFetchPfps(fids);

    // Step 5: Attach PFPs to NFT data
    nftData.forEach((nft) => {
      nft.pfpUrl = pfpMap.get(nft.fid) || getDefaultAvatar(nft.fid);
    });

    // Step 6: Sort by newest first
    const sortedNFTs = nftData.sort(
      (a, b) => new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime()
    );

    // Update cache
    cachedNFTs = sortedNFTs;
    lastFetchTime = now;

    console.log(`✅ Successfully fetched and cached ${sortedNFTs.length} NFTs`);

    return NextResponse.json({
      success: true,
      totalMinted: total,
      nfts: sortedNFTs,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Failed to fetch minted NFTs:", error);

    // Return stale cache on error
    if (cachedNFTs.length > 0) {
      console.log("⚠️ Returning stale cache due to error");
      return NextResponse.json({
        success: true,
        totalMinted: cachedNFTs.length,
        nfts: cachedNFTs,
        cached: true,
        stale: true,
        error: error.message,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        nfts: [],
      },
      { status: 500 }
    );
  }
}

// Enable caching at edge
export const runtime = "nodejs";
export const revalidate = 20; // Revalidate every 20 seconds
