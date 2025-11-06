"use client";

import Image from "next/image";

export default function FooterMiniApp() {
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

        {/* Quick Info - NO EXTERNAL LINKS */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[11px] font-medium text-neutral-500">
            Farcaster MiniApp
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-[11px] font-medium text-purple-600">
            Powered by Base
          </span>
        </div>

        {/* Bottom - WITH ICONS */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {/* Farcaster Icon - SVG */}
            <a
              href="https://farcaster.xyz/miniapps/5R8ES6mG26Bl/muse"
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
