// src/lib/pinata.ts

const PINATA_JWT = process.env.PINATA_JWT!;
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

/**
 * Upload NFT metadata to IPFS via Pinata
 */
export async function uploadMetadataToIPFS(
  metadata: NFTMetadata
): Promise<string> {
  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `${metadata.name}-metadata.json`,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status}`);
    }

    const data = await response.json();
    const ipfsHash = data.IpfsHash;

    // Return full IPFS URL
    return `${PINATA_GATEWAY}${ipfsHash}`;
  } catch (error) {
    console.error("Failed to upload to IPFS:", error);
    throw error;
  }
}

/**
 * Upload image to IPFS via Pinata
 */
export async function uploadImageToIPFS(
  imageUrl: string,
  fileName: string
): Promise<string> {
  try {
    // Fetch image as blob
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    // Create FormData
    const formData = new FormData();
    formData.append("file", imageBlob, fileName);
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: fileName,
      })
    );

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status}`);
    }

    const data = await response.json();
    const ipfsHash = data.IpfsHash;

    return `${PINATA_GATEWAY}${ipfsHash}`;
  } catch (error) {
    console.error("Failed to upload image to IPFS:", error);
    throw error;
  }
}

/**
 * Generate complete NFT metadata
 */
export function generateNFTMetadata(params: {
  fid: number;
  moodId: string;
  moodName: string;
  username: string;
  engagementScore: number;
  isHD: boolean;
  imageIPFS: string;
}): NFTMetadata {
  return {
    name: `${params.moodName} #${params.fid}`,
    description: `A unique mood NFT representing @${params.username}'s Farcaster vibe. Generated from on-chain activity with an engagement score of ${params.engagementScore}.`,
    image: params.imageIPFS,
    attributes: [
      {
        trait_type: "Mood",
        value: params.moodName,
      },
      {
        trait_type: "Mood ID",
        value: params.moodId,
      },
      {
        trait_type: "Farcaster FID",
        value: params.fid,
      },
      {
        trait_type: "Username",
        value: `@${params.username}`,
      },
      {
        trait_type: "Engagement Score",
        value: params.engagementScore,
      },
      {
        trait_type: "Edition",
        value: params.isHD ? "HD (2048px)" : "SD (512px)",
      },
      {
        trait_type: "Minted On",
        value: "Base",
      },
    ],
    external_url: `https://warpcast.com/${params.username}`,
  };
}
