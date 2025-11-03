import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { nftMoods } from "@/data/nftMoods";

const PINATA_JWT = process.env.PINATA_JWT!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fid, moodId, moodName, username, engagementScore, isHD, imageUrl } =
      body;

    console.log("📤 Upload request:", { fid, moodId, isHD, imageUrl });

    if (!fid || !moodId || !moodName || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const moodData = nftMoods.find((mood) => mood.id === moodId);
    if (!moodData) {
      return NextResponse.json({ error: "Mood not found" }, { status: 404 });
    }

    // Read static image
    let imageBuffer: Buffer;
    try {
      const imagePath = path.join(
        process.cwd(),
        "public",
        imageUrl.replace(/^\//, "")
      );

      console.log("📂 Reading file from:", imagePath);
      imageBuffer = await readFile(imagePath);
      console.log("✅ File read successfully:", imageBuffer.length, "bytes");
    } catch (error: any) {
      console.error("❌ File read error:", error);
      return NextResponse.json(
        { error: `Failed to read image file: ${error.message}` },
        { status: 500 }
      );
    }

    // Upload static image to IPFS
    console.log("📤 Uploading image to Pinata...");
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: "image/png" });
    formData.append("file", blob, `${moodId}-${fid}.png`);
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: `${moodId}-${fid}-${isHD ? "hd" : "sd"}.png`,
      })
    );

    const imageUploadResponse = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!imageUploadResponse.ok) {
      const errorText = await imageUploadResponse.text();
      console.error("❌ Pinata image upload error:", errorText);
      return NextResponse.json(
        { error: `Pinata error: ${errorText}` },
        { status: 500 }
      );
    }

    const imageData = await imageUploadResponse.json();
    const imageIPFS = `ipfs://${imageData.IpfsHash}`;
    console.log("✅ Image uploaded to IPFS:", imageIPFS);

    // Create metadata with gradient colors in attributes
    const metadata = {
      name: `${moodName} #${fid}`,
      description: `${
        moodData.description
      }\n\nMinted by @${username} with ${engagementScore.toLocaleString()} engagement score on Farcaster.\n\nThis mood features ${
        moodData.gradients.length
      } unique gradient color combinations that represent your social energy.`,
      image: imageIPFS,
      attributes: [
        { trait_type: "Mood", value: moodName },
        { trait_type: "Mood ID", value: moodId },
        {
          trait_type: "Category",
          value: moodData.category === "pro" ? "HD Premium" : "SD Free",
        },
        { trait_type: "Farcaster FID", value: fid },
        { trait_type: "Username", value: `@${username}` },
        { trait_type: "Engagement Score", value: engagementScore },
        { trait_type: "Edition", value: isHD ? "HD (2048px)" : "SD (512px)" },
        { trait_type: "Gradient Variations", value: moodData.gradients.length },
        // Add first gradient colors as traits
        { trait_type: "Primary Color", value: moodData.gradients[0].from },
        { trait_type: "Secondary Color", value: moodData.gradients[0].to },
        { trait_type: "Minted On", value: "Base" },
      ],
      external_url: `https://muse.write3.fun`,
      // Add gradient data for future use
      properties: {
        gradients: moodData.gradients,
      },
    };

    // Upload metadata to IPFS
    console.log("📤 Uploading metadata to Pinata...");
    const metadataUploadResponse = await fetch(
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
            name: `${moodId}-${fid}-metadata.json`,
          },
        }),
      }
    );

    if (!metadataUploadResponse.ok) {
      const errorText = await metadataUploadResponse.text();
      console.error("❌ Pinata metadata upload error:", errorText);
      return NextResponse.json(
        { error: `Pinata metadata error: ${errorText}` },
        { status: 500 }
      );
    }

    const metadataData = await metadataUploadResponse.json();
    const metadataURI = `ipfs://${metadataData.IpfsHash}`;
    console.log("✅ Metadata uploaded to IPFS:", metadataURI);

    return NextResponse.json({
      success: true,
      imageIPFS,
      metadataURI,
      metadata,
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
