/** @type {import('next').NextConfig} */
const nextConfig = {
  // Memory optimization
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };

    config.externals.push("pino-pretty", "lokijs", "encoding");

    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@coinbase/wallet-sdk": false,
      };
      config.optimization.minimize = false;
    }

    return config;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "https", hostname: "*.neynar.com" },
      { protocol: "https", hostname: "wrpcd.net" },
      { protocol: "https", hostname: "gateway.pinata.cloud" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "i.seadn.io" },
      { protocol: "https", hostname: "openseauserdata.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "muse.write3.fun" },
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    unoptimized: true,
  },

  // 🔥 HEADERS untuk .well-known (BUKAN REDIRECT!)
  async headers() {
    return [
      {
        source: "/.well-known/farcaster.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600", // Cache 1 hour
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },

  transpilePackages: ["@rainbow-me/rainbowkit"],
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  },
};

module.exports = nextConfig;
