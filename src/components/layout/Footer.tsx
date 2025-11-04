import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-t border-purple-100/50">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col gap-y-12">
        <div className="grid gap-y-6 sm:grid-cols-2 sm:gap-x-8 md:px-4 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-0 lg:px-8">
          {/* Logo & Tagline */}
          <figure>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/assets/Logo/Muse.png"
                  alt="Muse Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                  quality={100}
                />
              </div>
              <span className="font-bold text-xl gradient-text">Muse</span>
            </div>
            <p className="text-sm mt-4 text-neutral-500 leading-relaxed">
              Mint your mood. Collect the vibe. Transform social moments into
              timeless art on Base.
            </p>
          </figure>

          {/* Product */}
          <div className="flex flex-col items-start gap-y-4">
            <div className="text-sm font-bold text-neutral-700">Product</div>
            <div className="flex flex-col items-start gap-y-1.5">
              <Link
                className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="/#how-it-works"
              >
                How it Works
              </Link>
              <Link
                className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="/gallery"
              >
                Gallery
              </Link>
              <Link
                className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="/roadmap"
              >
                Roadmap
              </Link>
              {/* <Link
                className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="/#pricing"
              >
                Pricing
              </Link> */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Link
                  className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                  href="/#pricing"
                >
                  Free Mint
                </Link>
                <div className="items-center justify-center rounded-full text-xs font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] inline-flex bg-green-500 text-white px-2 py-0.5">
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* Community */}
          <div className="flex flex-col items-start gap-y-4">
            <div className="text-sm font-bold text-neutral-700">Community</div>
            <div className="flex flex-col items-start gap-y-1.5">
              <a
                className="flex items-center gap-x-2 whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition group"
                href="https://warpcast.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100 transition">
                  <Image
                    src="/assets/images/layout/farcaster.png"
                    alt="Farcaster"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                Farcaster
                <svg
                  className="h-3 text-neutral-400 group-hover:text-purple-600 transition"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {/* <a
                className="flex items-center gap-x-1.5 whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
                <svg
                  className="h-3 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a> */}
              {/* <a
                className="flex items-center gap-x-1.5 whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
                <svg
                  className="h-3 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a> */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="whitespace-nowrap text-sm font-medium text-neutral-500">
                  Rewards
                </span>
                <div className="items-center justify-center rounded-full text-xs font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] inline-flex bg-slate-300 text-slate-700 px-2 py-0.5">
                  Soon
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-start gap-y-4">
            <div className="text-sm font-bold text-neutral-700">Resources</div>
            <div className="flex flex-col items-start gap-y-1.5">
              <Link
                className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="/about"
              >
                About
              </Link>
              {/* <a
                className="flex items-center gap-x-1.5 whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://docs.base.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
                <svg
                  className="h-3 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a> */}
              {/* <a
                className="flex items-center gap-x-1.5 whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Base Network
                <svg
                  className="h-3 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a> */}
              {/* <a
                className="flex items-center gap-x-1.5 whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://basescan.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Smart Contract
                <svg
                  className="h-3 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a> */}
            </div>
          </div>
        </div>

        <div className="border-b border-b-purple-100"></div>

        {/* Bottom Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 md:px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">
              © <time>2025</time> Muse. Built on Base.
            </span>
          </div>

          {/* Social Icons & Logos */}
          <div className="flex items-center gap-4">
            {/* Farcaster */}
            <a
              href="https://warpcast.com"
              title="Farcaster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 transition"
            >
              <div className="relative w-5 h-5">
                <Image
                  src="/assets/images/layout/farcaster.png"
                  alt="Farcaster"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            </a>

            {/* Twitter */}
            {/* <a
              href="https://twitter.com"
              title="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 transition"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a> */}

            {/* Discord */}
            {/* <a
              href="https://discord.com"
              title="Discord"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 transition"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a> */}

            {/* Divider */}
            <div className="h-5 w-px bg-purple-200"></div>

            {/* Muse Logo */}
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src="/assets/Logo/Muse.png"
                alt="Muse"
                fill
                sizes="24px"
                className="object-contain"
                quality={100}
              />
            </div>

            {/* Base Logo */}
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src="/assets/images/layout/eth-base.png"
                alt="Base Network"
                fill
                sizes="24px"
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
