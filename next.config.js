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
      // IPFS Gateways
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
      // OpenSea
      {
        protocol: "https",
        hostname: "i.seadn.io",
      },
      {
        protocol: "https",
        hostname: "openseauserdata.com",
      },
      // Others
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "muse.write3.fun",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    unoptimized: true,
  },

  // 🔥 NEW: Mini App redirect
  async redirects() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination: "/api/farcaster/manifest",
        permanent: false,
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
