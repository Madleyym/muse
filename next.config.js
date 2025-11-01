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
    domains: ["tailkits.com"],
  },
  transpilePackages: ["@rainbow-me/rainbowkit"],
  // Suppress hydration warnings
  reactStrictMode: true,
};

module.exports = nextConfig;
