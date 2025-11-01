"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

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

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      <header className="py-3 pb-0">
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className="bg-white/90 backdrop-blur-md flex items-center justify-between gap-x-4 rounded-2xl py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0px_rgba(139,92,246,0.2)] border border-purple-100/50 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:justify-stretch lg:gap-x-12 lg:rounded-[1.375rem]">
            <div className="flex items-center gap-x-10">
              <Link href="/" title="Home" className="flex items-center gap-2">
                {/* 🔥 FIXED: HD Image Implementation */}
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
              <span className="hidden h-4 w-[1px] bg-purple-200 lg:block"></span>
            </div>

            <nav className="hidden lg:block">
              <ul className="flex items-center">
                <li>
                  <Link
                    className="px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                    href="/#how-it-works"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    className="px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                    href="/gallery"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    className="px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                    href="/roadmap"
                  >
                    Roadmap
                  </Link>
                </li>
                <li>
                  <a
                    className="flex items-center gap-x-1.5 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:text-purple-600"
                    href="https://warpcast.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Farcaster
                    <svg
                      className="h-4 text-neutral-500"
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
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-x-10 justify-self-end">
              <span className="hidden h-4 w-[1px] bg-purple-200 lg:block"></span>
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
                                <a
                                  href="/#pricing"
                                  className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] gradient-bg text-white hover:opacity-90 px-3 py-2 rounded-[0.625rem] flex"
                                >
                                  Mint Now
                                  <span className="ml-1 text-purple-200">
                                    {" "}
                                    - FREE
                                  </span>
                                </a>

                                <button
                                  onClick={openAccountModal}
                                  type="button"
                                  className="flex items-center gap-2 px-3 py-2 border border-purple-200 bg-white hover:bg-purple-50 rounded-[0.625rem] transition"
                                >
                                  {/* 🔥 FIXED: Profile Image HD */}
                                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-purple-300">
                                    <Image
                                      src="/assets/images/layout/connected.png"
                                      alt="Profile"
                                      fill
                                      sizes="24px"
                                      className="object-cover"
                                      quality={100}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-neutral-700">
                                    {account.displayName}
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
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-6 w-6 text-slate-600"
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

              {isConnected && address && (
                <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {/* 🔥 FIXED: Mobile Profile Image HD */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-300">
                      <Image
                        src="/assets/images/layout/connected.png"
                        alt="Profile"
                        fill
                        sizes="48px"
                        className="object-cover"
                        quality={100}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Connected
                      </div>
                      <div className="text-xs text-slate-600">
                        {shortenAddress(address)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <nav>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/#how-it-works"
                      className="block px-4 py-3 text-base font-medium text-neutral-700 hover:bg-slate-50 rounded-lg transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gallery"
                      className="block px-4 py-3 text-base font-medium text-neutral-700 hover:bg-slate-50 rounded-lg transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/roadmap"
                      className="block px-4 py-3 text-base font-medium text-neutral-700 hover:bg-slate-50 rounded-lg transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Roadmap
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://warpcast.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-700 hover:bg-slate-50 rounded-lg transition"
                    >
                      Farcaster
                      <svg
                        className="h-4 text-neutral-500"
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
                      href="/about"
                      className="block px-4 py-3 text-base font-medium text-neutral-700 hover:bg-slate-50 rounded-lg transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="border-t border-neutral-200 my-6"></div>

              <div className="space-y-3">
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
                          className="w-full text-center px-4 py-3 text-sm font-medium border-2 border-purple-200 bg-white text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <>
                        <a
                          href="/#pricing"
                          className="block w-full text-center px-4 py-3 text-sm font-medium gradient-bg text-white hover:opacity-90 rounded-lg transition"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Mint Now - FREE
                        </a>
                        <button
                          onClick={() => {
                            disconnect();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-center px-4 py-3 text-sm font-medium border border-neutral-200 bg-white text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          Disconnect
                        </button>
                      </>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
