"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFarcaster } from "@/contexts/FarcasterContext";

export default function Header() {
 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMiniAppInfo, setShowMiniAppInfo] = useState(true);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { farcasterData, hasFID, isMiniApp } = useFarcaster();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("miniAppInfoDismissed");
      if (dismissed === "true") {
        setShowMiniAppInfo(false);
      }
    }
  }, []);

  const handleDismissMiniAppInfo = () => {
    setShowMiniAppInfo(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("miniAppInfoDismissed", "true");
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="py-3 pb-0">
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          {/* 🔥 FIX: Conditional grid layout based on isMiniApp */}
          <div
            className={`bg-white/90 backdrop-blur-md flex items-center justify-between gap-x-4 rounded-2xl py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0px_rgba(139,92,246,0.2)] border border-purple-100/50 lg:rounded-[1.375rem] ${
              !isMiniApp
                ? "lg:grid lg:grid-cols-[1fr_auto_1fr] lg:justify-stretch lg:gap-x-12"
                : "lg:flex lg:justify-between"
            }`}
          >
            <div className="flex items-center gap-x-10">
              <Link
                href={isMiniApp ? "/miniapp" : "/"}
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
              {!isMiniApp && (
                <span className="hidden h-4 w-[1px] bg-purple-200 lg:block"></span>
              )}
            </div>

            {/* Navigation - Only show when NOT Mini App */}
            {!isMiniApp && (
              <nav className="hidden lg:block">
                <ul className="flex items-center">
                  <li>
                    <Link
                      className="px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                      href="/#how-it-works"
                      prefetch={false}
                      scroll={true}
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                      href="/gallery"
                      prefetch={true}
                    >
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                      href="/roadmap"
                      prefetch={true}
                    >
                      Roadmap
                    </Link>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-1.5 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600 group"
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
                        className="h-4 text-neutral-500 group-hover:text-purple-600 transition"
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
                  </li>
                  <li>
                    <Link
                      className="px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                      href="/about"
                      prefetch={true}
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </nav>
            )}

            {/* Right section - 🔥 FIX: Remove justify-self-end when Mini App */}
            <div
              className={`flex items-center gap-x-10 ${
                !isMiniApp ? "lg:justify-self-end" : ""
              }`}
            >
              {!isMiniApp && (
                <span className="hidden h-4 w-[1px] bg-purple-200 lg:block"></span>
              )}
              <div className="flex items-center gap-x-3 lg:gap-x-2">
                <div className="hidden lg:flex items-center gap-2">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      mounted,
                    }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;
                      const { isMiniApp, isAutoConnecting } = useFarcaster();

                      // 🔥 DI FARCASTER: Hide connect button saat auto-connecting
                      if (isMiniApp && isAutoConnecting && !connected) {
                        return (
                          <div className="flex items-center gap-2 px-3 py-2 text-xs text-purple-600">
                            <div className="animate-spin">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                  opacity="0.25"
                                ></circle>
                                <path
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                            <span>Connecting...</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          {...(!ready && {
                            "aria-hidden": true,
                            style: {
                              opacity: 0,
                              pointerEvents: "none",
                              userSelect: "none",
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <button
                                  onClick={openConnectModal}
                                  type="button"
                                  className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(139,92,246,0.25)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-purple-200 bg-white text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-[0.625rem] flex"
                                >
                                  Connect Wallet
                                </button>
                              );
                            }

                            if (chain.unsupported) {
                              return (
                                <button
                                  onClick={openChainModal}
                                  type="button"
                                  className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-[0.625rem] flex"
                                >
                                  Wrong network
                                </button>
                              );
                            }

                            return (
                              <div className="flex items-center gap-2">
                                <Link
                                  href={isMiniApp ? "#pricing" : "/#pricing"}
                                  scroll={true}
                                  className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] gradient-bg text-white hover:opacity-90 px-3 py-2 rounded-[0.625rem] flex"
                                >
                                  {hasFID ? "Mint Now" : "Setup FID"}
                                  <span className="ml-1 text-purple-200">
                                    {" "}
                                    - FREE
                                  </span>
                                </Link>

                                <button
                                  onClick={openAccountModal}
                                  type="button"
                                  className="flex items-center gap-2 px-3 py-2 border border-purple-200 bg-white hover:bg-purple-50 rounded-[0.625rem] transition"
                                >
                                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-purple-300">
                                    <Image
                                      src={
                                        farcasterData?.pfpUrl ||
                                        "/assets/images/layout/connected.png"
                                      }
                                      alt="Profile"
                                      fill
                                      sizes="24px"
                                      className="object-cover"
                                      quality={100}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-neutral-700">
                                    {farcasterData?.displayName ||
                                      account.displayName}
                                  </span>
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>

                <button
                  type="button"
                  aria-label="Open menu"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
            <div className="gradient-bg p-6 pb-8">
              <div className="flex items-center justify-between mb-4">
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
                  {isMiniApp && (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-bold">
                      MINI
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
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

              {isMiniApp && showMiniAppInfo && (
                <div className="mb-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 animate-fade-in">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">✨</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-bold text-xs">
                          Mini App Mode
                        </span>
                        <button
                          onClick={handleDismissMiniAppInfo}
                          className="text-white/70 hover:text-white p-0.5 transition"
                          aria-label="Dismiss"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-white/80 text-[10px] leading-relaxed mb-2">
                        You're viewing the mobile-optimized version. Want the
                        full experience?
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://muse.write3.fun/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-white text-purple-700 font-semibold text-xs rounded-lg hover:bg-white/90 transition-all active:scale-95 shadow-lg"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span>Open Full Site</span>
                  </a>
                </div>
              )}

              {isConnected && (
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0">
                      <Image
                        src={
                          farcasterData?.pfpUrl ||
                          "/assets/images/layout/connected.png"
                        }
                        alt="Profile"
                        fill
                        className="object-cover"
                        quality={100}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-base truncate">
                        {farcasterData?.displayName || "Connected"}
                      </div>
                      <div className="text-xs text-white/80 truncate">
                        {farcasterData
                          ? `@${farcasterData.username}`
                          : address
                          ? `${address.slice(0, 6)}...${address.slice(-4)}`
                          : ""}
                      </div>
                      {farcasterData && (
                        <div className="text-xs text-white font-semibold mt-1 bg-white/20 rounded px-2 py-0.5 inline-block">
                          {farcasterData.mood}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Content */}
            <div className="px-4 py-4">
              {/* Navigation - Hidden in Mini App */}
              {!isMiniApp && (
                <nav className="mb-4">
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/#how-it-works"
                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-700 hover:bg-purple-50 rounded-xl transition group"
                        onClick={() => setIsMobileMenuOpen(false)}
                        prefetch={false}
                        scroll={true}
                      >
                        <span>How It Works</span>
                        <svg
                          className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/gallery"
                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-700 hover:bg-purple-50 rounded-xl transition group"
                        onClick={() => setIsMobileMenuOpen(false)}
                        prefetch={true}
                      >
                        <span>Gallery</span>
                        <svg
                          className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/roadmap"
                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-700 hover:bg-purple-50 rounded-xl transition group"
                        onClick={() => setIsMobileMenuOpen(false)}
                        prefetch={true}
                      >
                        <span>Roadmap</span>
                        <svg
                          className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="https://warpcast.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-700 hover:bg-purple-50 rounded-xl transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-5 h-5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition">
                            <Image
                              src="/assets/images/layout/farcaster.png"
                              alt="Farcaster"
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          </div>
                          <span>Farcaster</span>
                        </div>
                        <svg
                          className="w-4 h-4 text-neutral-400 group-hover:text-purple-600 transition"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-700 hover:bg-purple-50 rounded-xl transition group"
                        onClick={() => setIsMobileMenuOpen(false)}
                        prefetch={true}
                      >
                        <span>About</span>
                        <svg
                          className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </nav>
              )}

              {/* Action Buttons */}
              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) => {
                    const connected = mounted && account && chain;

                    if (!connected) {
                      return (
                        <button
                          onClick={() => {
                            openConnectModal();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-center px-4 py-3.5 text-sm font-bold gradient-bg text-white rounded-xl transition shadow-lg hover:opacity-90"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <>
                        <Link
                          href={isMiniApp ? "#pricing" : "/#pricing"}
                          scroll={true}
                          className="block w-full text-center px-4 py-3.5 text-sm font-bold gradient-bg text-white hover:opacity-90 rounded-xl transition shadow-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {hasFID ? "Mint Now - FREE" : "Setup FID - FREE"}
                        </Link>
                        <button
                          onClick={() => {
                            disconnect();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-center px-4 py-3 text-sm font-semibold border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          Disconnect Wallet
                        </button>
                      </>
                    );
                  }}
                </ConnectButton.Custom>
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
