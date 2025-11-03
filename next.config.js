/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };

    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Fix for Coinbase Wallet SDK di SSR
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@coinbase/wallet-sdk": false,
      };
    }

    return config;
  },
  images: {
    remotePatterns: [
      // Farcaster CDNs
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "*.neynar.com",
      },
      {
        protocol: "https",
        hostname: "wrpcd.net",
      },
      // OpenSea (seadn.io causing error)
      {
        protocol: "https",
        hostname: "i.seadn.io",
      },
      {
        protocol: "https",
        hostname: "openseauserdata.com",
      },
      // Imgur (common for Farcaster)
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
      },
      // Twitter/X
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      // UI Avatars (fallback)
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      // Your own domain
      {
        protocol: "https",
        hostname: "muse.write3.fun",
      },
      // Legacy domains support
      {
        protocol: "https",
        hostname: "tailkits.com",
      },
      // Wildcard for any HTTPS image (most flexible)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // Skip optimization for external images
  },
  transpilePackages: ["@rainbow-me/rainbowkit"],
  reactStrictMode: true,
};

module.exports = nextConfig;
