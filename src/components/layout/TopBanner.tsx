"use client";

import { useState } from "react";
import Image from "next/image";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="py-2 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 flex items-center justify-between gap-x-2">
        <div className="flex w-full grow items-center gap-x-2 justify-self-center md:justify-center">
          <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] inline-flex gradient-bg text-white px-2.5 py-0.5 gap-1.5">
            {/* 🎨 MUSE LOGO */}
            <div className="relative w-4 h-4 flex-shrink-0">
              <Image
                src="/assets/Logo/Muse.png"
                alt="Muse"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            LIVE ON
            {/* 🔵 BASE LOGO */}
            <div className="relative w-4 h-4 flex-shrink-0">
              <Image
                src="/assets/images/layout/eth-base.png"
                alt="Base"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-sm font-medium text-slate-700">
            Connect wallet & Enter FID to mint your mood NFT - FREE
          </div>
        </div>
        <button
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/60 backdrop-blur-sm p-1 transition hover:bg-white/80 border border-purple-200/50"
          type="button"
          aria-label="Close bar"
          onClick={() => setIsVisible(false)}
        >
          <svg
            className="h-4 text-slate-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
