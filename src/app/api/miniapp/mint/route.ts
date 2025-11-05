import { NextRequest, NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { base } from "viem/chains";
import { MUSE_NFT_CONTRACT } from "@/config/contracts";

export async function POST(request: NextRequest) {
  try {
    const {
      fid,
      moodId,
      moodName,
      farcasterUsername,
      engagementScore,
      metadataURI,
      tier,
    } = await request.json();
    
    // Validate
    if (!fid || !moodId || !tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Setup wallet
    const PRIVATE_KEY = process.env.MUSE_MINTER_PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      );
    }

    const account = privateKeyToAccount(`0x${PRIVATE_KEY}` as `0x${string}`);

    const publicClient = createPublicClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC),
    });

    const walletClient = createWalletClient({
      chain: base,
      account,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC),
    });

    // Call contract
    let hash: string;

    if (tier === "free") {
      hash = await walletClient.writeContract({
        address: MUSE_NFT_CONTRACT.address,
        abi: MUSE_NFT_CONTRACT.abi,
        functionName: "mintFree",
        args: [
          BigInt(fid),
          moodId,
          moodName,
          farcasterUsername,
          BigInt(engagementScore),
          metadataURI,
        ],
      });
    } else if (tier === "hd") {
      hash = await walletClient.writeContract({
        address: MUSE_NFT_CONTRACT.address,
        abi: MUSE_NFT_CONTRACT.abi,
        functionName: "mintHD",
        args: [
          BigInt(fid),
          moodId,
          moodName,
          farcasterUsername,
          BigInt(engagementScore),
          metadataURI,
        ],
        value: parseEther("0.001"),
      });
    } else {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    console.log(`[Mint] ${tier.toUpperCase()} - FID: ${fid} - Hash: ${hash}`);

    return NextResponse.json({
      success: true,
      hash,
      fid,
      tier,
    });
  } catch (error: any) {
    console.error("[Mint API Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to mint" },
      { status: 500 }
    );
  }
}
