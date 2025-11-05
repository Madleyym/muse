"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { useFarcaster } from "@/contexts/FarcasterContext";

export default function MiniAppHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { farcasterData, hasFID } = useFarcaster();
  const [pfpError, setPfpError] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const handlePfpError = () => {
    console.error("Failed to load profile picture:", farcasterData?.pfpUrl);
    setPfpError(true);
  };

  return (
    <>
      <header className="py-3 pb-0 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className="bg-white/90 backdrop-blur-md flex items-center justify-between gap-x-4 rounded-2xl py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0px_rgba(139,92,246,0.2)] border border-purple-100/50 lg:rounded-[1.375rem]">
            <Link
              href="/miniapp"
              title="Home"
              className="flex items-center gap-2"
              prefetch={true}
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/assets/Logo/Muse.png"
                  alt="Muse Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
              <span className="font-bold text-xl gradient-text">Muse</span>
            </Link>

            <div className="flex-1"></div>

            <div className="flex items-center gap-x-3">
              {isConnected && farcasterData ? (
                <>
                  <div
                    className="hidden md:flex items-center gap-2 px-3 py-2 border border-purple-200 bg-white hover:bg-purple-50 rounded-[0.625rem] transition cursor-pointer"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-purple-300 flex-shrink-0 bg-purple-100">
                      {!pfpError && farcasterData.pfpUrl ? (
                        <Image
                          src={farcasterData.pfpUrl}
                          alt={farcasterData.displayName}
                          fill
                          sizes="24px"
                          className="object-cover"
                          quality={100}
                          onError={handlePfpError}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                          {farcasterData.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 truncate max-w-[100px]">
                      {farcasterData.displayName}
                    </span>
                    <svg
                      className="w-4 h-4 text-neutral-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-purple-300 hover:border-purple-500 transition flex-shrink-0 bg-purple-100"
                  >
                    {!pfpError && farcasterData.pfpUrl ? (
                      <Image
                        src={farcasterData.pfpUrl}
                        alt={farcasterData.displayName}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        quality={100}
                        onError={handlePfpError}
                        unoptimized
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {farcasterData.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-200 animate-pulse flex-shrink-0"></div>
              )}

              <button
                type="button"
                aria-label="Open menu"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg
                  className="h-6 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white z-50 shadow-2xl overflow-y-auto">
            <div className="gradient-bg p-6 pb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/assets/Logo/Muse.png"
                      alt="Muse"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold text-xl text-white">Muse</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-bold">
                    MINI
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
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

              {isConnected && farcasterData ? (
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0 bg-white/10">
                      {!pfpError && farcasterData.pfpUrl ? (
                        <Image
                          src={farcasterData.pfpUrl}
                          alt={farcasterData.displayName}
                          fill
                          className="object-cover"
                          quality={100}
                          onError={handlePfpError}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                          {farcasterData.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-base truncate">
                        {farcasterData.displayName}
                      </div>
                      <div className="text-xs text-white/80 truncate">
                        @{farcasterData.username}
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        FID: {farcasterData.fid}
                      </div>

                      {farcasterData.mood && (
                        <div className="text-xs text-white font-semibold mt-2 bg-white/20 rounded px-2 py-0.5 inline-block">
                          🎭 {farcasterData.mood}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/20 rounded-xl p-4 text-white text-sm">
                  Connecting...
                </div>
              )}
            </div>

            <div className="px-4 py-4">
              <div className="space-y-3">
                <Link
                  href="#pricing"
                  scroll={true}
                  className="block w-full text-center px-4 py-3.5 text-sm font-bold gradient-bg text-white hover:opacity-90 rounded-xl transition shadow-lg"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {hasFID ? "🎨 Mint Now - FREE" : "⚙️ Setup FID - FREE"}
                </Link>

                {address && (
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-neutral-600 mb-1">
                      Connected Wallet
                    </p>
                    <p className="text-sm font-semibold text-purple-600 font-mono">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    disconnect();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 text-sm font-semibold border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  🔌 Disconnect Wallet
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-xs text-neutral-500">Minted on</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-purple-600">
                      Base Network
                    </span>
                    <div className="relative w-3.5 h-3.5 flex-shrink-0">
                      <Image
                        src="/assets/images/layout/eth-base.png"
                        alt="Base"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
