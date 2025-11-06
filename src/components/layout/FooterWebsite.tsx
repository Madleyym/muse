"use client";

import Link from "next/link";
import Image from "next/image";

export default function FooterWebsite() {
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
                scroll={true}
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
              <div className="flex flex-wrap items-center gap-1.5">
                <Link
                  className="whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-purple-600 transition"
                  href="/#pricing"
                  scroll={true}
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
                href="https://farcaster.xyz/miniapps/5R8ES6mG26Bl/muse"
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
              {/* ✅ NEW: OpenSea Collection Link */}
              <a
                className="flex items-center gap-x-2 whitespace-nowrap text-sm font-medium text-neutral-500 hover:text-blue-600 transition group"
                href={`https://opensea.io/assets/base/${
                  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
                  "0x4A8F23ADdEA57Ba5f09e4345CE8D40883Cda0F61"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenSea Collection
                <svg
                  className="h-3 text-neutral-400 group-hover:text-blue-600 transition"
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
              href="https://farcaster.xyz/miniapps/5R8ES6mG26Bl/muse"
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
