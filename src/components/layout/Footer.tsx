"use client";

import Link from "next/link";
import Image from "next/image";
import { useFarcaster } from "@/contexts/FarcasterContext";

export default function Footer() {
  const { isMiniApp } = useFarcaster();

  // ✅ MINIAPP FOOTER - Fixed
  if (isMiniApp) {
    return (
      <footer className="py-8 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-t border-purple-100/50">
        <div className="max-w-md mx-auto px-4">
          {/* Logo & Tagline */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="relative w-6 h-6">
                <Image
                  src="/assets/Logo/Muse.png"
                  alt="Muse Logo"
                  fill
                  sizes="24px"
                  className="object-contain"
                  quality={100}
                />
              </div>
              <span className="font-bold text-base gradient-text">Muse</span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-relaxed">
              Mint your mood. Collect the vibe. Built on Base.
            </p>
          </div>

          {/* Quick Links - WITH PIPES */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <a
              href="https://muse.write3.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-neutral-500 hover:text-purple-600 transition"
            >
              Website
            </a>

            <span className="text-neutral-400">|</span>

            <a
              href="https://muse.write3.fun/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-neutral-500 hover:text-purple-600 transition"
            >
              Gallery
            </a>

            <span className="text-neutral-400">|</span>

            <a
              href="https://warpcast.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-neutral-500 hover:text-purple-600 transition"
            >
              Farcaster
            </a>
          </div>

          {/* Bottom - WITH FARCASTER ICON */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              {/* ✅ Farcaster Icon - SVG Fallback */}
              <a
                href="https://warpcast.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 transition"
                title="Farcaster"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 1000 1000"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" />
                  <path d="M128.889 253.333L157.778 351.111H182.222V844.444H128.889V253.333Z" />
                  <path d="M871.111 253.333L842.222 351.111H817.778V844.444H871.111V253.333Z" />
                </svg>
              </a>

              <div className="h-4 w-px bg-purple-200"></div>

              {/* Muse Logo */}
              <div className="relative w-5 h-5">
                <Image
                  src="/assets/Logo/Muse.png"
                  alt="Muse"
                  fill
                  sizes="20px"
                  className="object-contain"
                  quality={100}
                />
              </div>

              {/* Base Logo */}
              <div className="relative w-5 h-5">
                <Image
                  src="/assets/images/layout/eth-base.png"
                  alt="Base Network"
                  fill
                  sizes="20px"
                  className="object-contain"
                  quality={100}
                />
              </div>
            </div>

            <span className="text-[10px] font-medium text-neutral-500">
              © 2025 Muse. Built on Base.
            </span>
          </div>
        </div>
      </footer>
    );
  }

  // ✅ WEBSITE FOOTER - Full Version
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
