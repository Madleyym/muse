import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Mood configuration mapping
const moodConfig: Record<
  string,
  {
    name: string;
    gradient: string;
    image: string;
  }
> = {
  "chaos-energy": {
    name: "Chaos Energy",
    gradient: "linear-gradient(135deg, #FF0066 0%, #CC00FF 50%, #6600CC 100%)",
    image: "/assets/images/Pro/chaos-energy.png",
  },
  "chaostic-expression": {
    name: "Chaostic Expression",
    gradient: "linear-gradient(135deg, #FF1493 0%, #FF0099 50%, #DD00DD 100%)",
    image: "/assets/images/Pro/chaostic-expression.png",
  },
  "creative-mind": {
    name: "Creative Mind",
    gradient: "linear-gradient(135deg, #FF0000 0%, #FFFF00 50%, #0000FF 100%)",
    image: "/assets/images/Pro/creative-mind.png",
  },
  "fire-starter": {
    name: "Fire Starter",
    gradient: "linear-gradient(135deg, #FFFF00 0%, #FF6600 50%, #FF0000 100%)",
    image: "/assets/images/Pro/fire-starter.png",
  },
  "green-peace": {
    name: "Green Peace",
    gradient: "linear-gradient(135deg, #AAFF00 0%, #00DD00 50%, #006600 100%)",
    image: "/assets/images/Pro/green-peace.png",
  },
  "moon-mission": {
    name: "Moon Mission",
    gradient: "linear-gradient(135deg, #00FFFF 0%, #0088FF 50%, #000088 100%)",
    image: "/assets/images/Pro/moon-mission.png",
  },
  "morning-mom": {
    name: "Morning Mom",
    gradient: "linear-gradient(135deg, #FFDD00 0%, #FF6600 50%, #FF1493 100%)",
    image: "/assets/images/Pro/morning-mom.png",
  },
  mysterious: {
    name: "Mysterious",
    gradient: "linear-gradient(135deg, #EEEEFF 0%, #9966FF 50%, #00FFFF 100%)",
    image: "/assets/images/Pro/mysterious.png",
  },
  "ocean-lady": {
    name: "Ocean Lady",
    gradient: "linear-gradient(135deg, #00FFFF 0%, #0088CC 50%, #001155 100%)",
    image: "/assets/images/Pro/ocean-lady.png",
  },
  "pink-to-rose": {
    name: "Pink to Rose",
    gradient: "linear-gradient(135deg, #FFB6C1 0%, #FF1493 50%, #880055 100%)",
    image: "/assets/images/Pro/pink-to-rose.png",
  },
  "relaxed-mode": {
    name: "Relaxed Mode",
    gradient: "linear-gradient(135deg, #99DDFF 0%, #AA88FF 50%, #DD99FF 100%)",
    image: "/assets/images/Pro/relaxed-mode.png",
  },
  "art-free": {
    name: "Art Free",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)",
    image: "/assets/images/Free/art-free.png",
  },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const moodId = searchParams.get("mood") || "fire-starter";
    const username = searchParams.get("username") || "Anon";
    const tx = searchParams.get("tx") || "";

    const mood = moodConfig[moodId] || moodConfig["fire-starter"];

    // Fetch the character image as base64
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://muse.write3.fun";
    const imageUrl = `${baseUrl}${mood.image}`;

    let imageData = "";
    try {
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageData = `data:image/png;base64,${buffer.toString("base64")}`;
    } catch (error) {
      console.error("Error fetching image:", error);
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "linear-gradient(135deg, #FFB6D9 0%, #D5AAFF 50%, #A8DAFF 100%)",
            padding: "60px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Left Side - Character */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "420px",
                height: "420px",
                background: "rgba(255, 255, 255, 0.25)",
                borderRadius: "32px",
                border: "6px solid rgba(255, 255, 255, 0.4)",
                padding: "24px",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {imageData && (
                <img
                  src={imageData}
                  alt={mood.name}
                  width="370"
                  height="370"
                  style={{
                    objectFit: "contain",
                    filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3))",
                  }}
                />
              )}
            </div>

            {/* Mood Badge */}
            <div
              style={{
                display: "flex",
                marginTop: "24px",
                background: mood.gradient,
                padding: "16px 32px",
                borderRadius: "16px",
                border: "4px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                {mood.name}
              </span>
            </div>
          </div>

          {/* Right Side - Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "600px",
              paddingLeft: "60px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                background: "rgba(255, 255, 255, 0.95)",
                padding: "14px 28px",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                https://muse.write3.fun/
              </span>
              <span style={{ fontSize: "28px", marginLeft: "12px" }}>🎨</span>
            </div>

            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                margin: "0",
                marginBottom: "16px",
                color: "#1a1a1a",
                lineHeight: "1.1",
                textShadow: "0 2px 4px rgba(255, 255, 255, 0.5)",
              }}
            >
              Muse - Mint Your Mood
            </h1>

            <p
              style={{
                fontSize: "32px",
                margin: "0",
                marginBottom: "12px",
                color: "#333",
                fontWeight: "400",
              }}
            >
              Transform your Farcaster activity into unique mood NFTs
            </p>

            <p
              style={{
                fontSize: "28px",
                margin: "0",
                marginBottom: "32px",
                color: "#666",
                fontWeight: "500",
              }}
            >
              {username} minted {mood.name} ⚡
            </p>

            <div
              style={{
                display: "flex",
                background: "linear-gradient(135deg, #FF1F8F 0%, #FF006E 100%)",
                color: "white",
                fontSize: "36px",
                fontWeight: "bold",
                padding: "24px 48px",
                borderRadius: "20px",
                boxShadow: "0 10px 25px rgba(255, 31, 143, 0.4)",
              }}
            >
              Mint Now - Free! 🔥
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
