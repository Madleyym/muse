"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer"; // ✅ ADDED
import Link from "next/link";
import { useState } from "react";

type FilterType = "all" | "mission" | "values" | "story" | "tech";

export default function AboutPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const sections = [
    {
      id: "mission",
      category: "mission",
      badge: "Mission",
      title: "Bridging Social & Onchain",
      description:
        "Muse transforms the ephemeral nature of social media into permanent, meaningful digital art. We believe every vibe, every mood, every moment deserves to be celebrated and remembered onchain.",
      gradient: "from-purple-400 via-pink-400 to-blue-400",
      icon: (
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      stats: [
        { label: "Total Mints", value: "1,589+" },
        { label: "Active Users", value: "735+" },
      ],
    },
    {
      id: "values",
      category: "values",
      badge: "Values",
      title: "Community First, Always",
      description:
        "We listen to our community and build features they want. Accessibility, transparency, and long-term thinking guide every decision we make for Farcaster users on Base.",
      gradient: "from-blue-400 via-purple-400 to-pink-400",
      icon: (
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      stats: [
        { label: "Community Size", value: "1,200+" },
        { label: "Feedback Received", value: "450+" },
      ],
    },
    {
      id: "story",
      category: "story",
      badge: "Story",
      title: "How Muse Was Born",
      description:
        "We noticed social media moments are fleeting. What if every like, every cast could become art? We built Muse on Base with Farcaster Frames to make it happen. Free to mint, forever yours.",
      gradient: "from-pink-400 via-purple-400 to-blue-400",
      icon: (
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      stats: [
        { label: "Launched", value: "Q2 2025" },
        { label: "Network", value: "Base" },
      ],
    },
    {
      id: "tech",
      category: "tech",
      badge: "Technology",
      title: "Built With Modern Stack",
      description:
        "Base Network for fast transactions, Farcaster Frames for seamless social integration, and generative art algorithms that transform your data into beautiful visual expressions.",
      gradient: "from-purple-400 via-blue-400 to-pink-400",
      icon: (
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
      stats: [
        { label: "Gas Fees", value: "<$0.01" },
        { label: "Mint Speed", value: "~3s" },
      ],
    },
  ];

  const filteredSections =
    filter === "all"
      ? sections
      : sections.filter((section) => section.category === filter);

  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto px-4 xl:px-0">
          <div className="text-center">
            <div className="inline-flex items-center gradient-bg text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg mb-4">
              About Muse
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4 leading-tight">
              Building a Social Art Experiment
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Where every interaction becomes collectible. Transforming
              ephemeral social moments into permanent, meaningful digital art on
              Base blockchain.
            </p>

            {/* Live Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md">
                <div className="text-xl sm:text-2xl font-bold gradient-text">
                  1,589
                </div>
                <div className="text-xs text-slate-500">Total Mints</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md">
                <div className="text-xl sm:text-2xl font-bold gradient-text">
                  735
                </div>
                <div className="text-xs text-slate-500">Active Users</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md">
                <div className="text-xl sm:text-2xl font-bold gradient-text">
                  Q2 2025
                </div>
                <div className="text-xs text-slate-500">Launched</div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {/* Mobile: Only All */}
              <button
                onClick={() => setFilter("all")}
                className="md:hidden px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-900 text-white shadow-lg"
              >
                All Stories
              </button>

              {/* Desktop: All Filters */}
              <div className="hidden md:flex flex-wrap justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                    filter === "all"
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow"
                  }`}
                >
                  All Stories
                </button>
                <button
                  onClick={() => setFilter("mission")}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                    filter === "mission"
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-purple-50 shadow"
                  }`}
                >
                  Mission
                </button>
                <button
                  onClick={() => setFilter("values")}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                    filter === "values"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-blue-50 shadow"
                  }`}
                >
                  Values
                </button>
                <button
                  onClick={() => setFilter("story")}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                    filter === "story"
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-pink-50 shadow"
                  }`}
                >
                  Story
                </button>
                <button
                  onClick={() => setFilter("tech")}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                    filter === "tech"
                      ? "bg-indigo-500 text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-indigo-50 shadow"
                  }`}
                >
                  Technology
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredSections.map((section) => (
              <article
                key={section.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-purple-100/50"
              >
                {/* Visual Header */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${section.gradient} flex items-center justify-center`}
                >
                  <div className="absolute inset-0 bg-black/5"></div>
                  {section.icon}

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {section.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {section.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {section.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                    {section.stats.map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-lg font-bold gradient-text">
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Why Muse Card */}
          <div className="mt-12 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200 rounded-2xl p-6 sm:p-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-2">
                Why Muse Matters
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Social Identity Meets Blockchain
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Social identity is fragmented across platforms. Muse creates a
                unified, on-chain representation of your digital
                personality—owned by YOU, not corporations. With Base's low fees
                and Farcaster's growing community, now is the perfect time to
                build the future of social art.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold gradient-text mb-1">
                    100%
                  </div>
                  <div className="text-xs text-slate-600">
                    On-Chain Ownership
                  </div>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold gradient-text mb-1">
                    FREE
                  </div>
                  <div className="text-xs text-slate-600">To Start Minting</div>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold gradient-text mb-1">
                    Forever
                  </div>
                  <div className="text-xs text-slate-600">Yours to Keep</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Join the Movement
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Be part of the future where social interactions become timeless art
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#pricing"
              scroll={true}
              className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(255,255,255,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] bg-white text-purple-600 hover:bg-purple-50 px-4 py-2.5 rounded-[0.625rem] flex"
            >
              Start Minting FREE
            </Link>
            <Link
              href="/gallery"
              className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(255,255,255,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-white/30 bg-purple-500/30 text-white hover:bg-purple-400/40 px-4 py-2.5 rounded-[0.625rem] flex"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ FOOTER ADDED */}
      <Footer />
    </main>
  );
}
