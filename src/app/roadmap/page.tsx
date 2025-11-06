"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer"; // ✅ ADDED
import Link from "next/link";
import { useState } from "react";

type FilterType = "all" | "completed" | "current" | "upcoming";

interface Phase {
  id: string;
  status: "completed" | "current" | "upcoming";
  date: string;
  quarter: string;
  title: string;
  description: string;
}

export default function RoadmapPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const phases: Phase[] = [
    {
      id: "phase-1",
      status: "completed",
      date: "06.15.2025",
      quarter: "Q2 2025",
      title: "Foundation & Launch",
      description:
        "Successfully launched core platform with free minting, Base network integration, and Farcaster Frames support. Deployed basic mood generation engine and community gallery.",
    },
    {
      id: "phase-2",
      status: "completed",
      date: "09.20.2025",
      quarter: "Q3 2025",
      title: "Premium Features & Enhancement",
      description:
        "Rolled out HD premium minting with 2048px resolution, advanced sentiment analysis algorithms, profile customization, enhanced gallery filters, and social sharing tools.",
    },
    {
      id: "phase-3",
      status: "current",
      date: "11.03.2025",
      quarter: "Q4 2025",
      title: "Community & Marketplace",
      description:
        "Currently building secondary marketplace in beta, implementing creator royalties system, community voting on new moods, collection management tools, and leaderboards with rewards program.",
    },
    {
      id: "phase-4",
      status: "upcoming",
      date: "02.15.2026",
      quarter: "Q1 2026",
      title: "Advanced Integrations",
      description:
        "Planning AI-powered mood recommendations, cross-chain bridge to Ethereum, mobile app for iOS and Android, animated mood NFTs, and developer API access for third-party integrations.",
    },
    {
      id: "phase-5",
      status: "upcoming",
      date: "06.30.2026",
      quarter: "Q2-Q3 2026",
      title: "Scale & Partnerships",
      description:
        "Introducing brand collaboration program, DAO governance system for community decisions, virtual gallery events, educational content hub, and multi-language support for global expansion.",
    },
  ];

  const filteredPhases = phases.filter((phase) => {
    if (filter === "all") return true;
    return phase.status === filter;
  });

  const getStatusBadge = (status: Phase["status"]) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-500",
          text: "Completed",
        };
      case "current":
        return {
          bg: "bg-blue-500",
          text: "In Progress",
        };
      case "upcoming":
        return {
          bg: "bg-zinc-400",
          text: "Upcoming",
        };
    }
  };

  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto px-4 xl:px-0">
          <div className="max-w-xl mx-auto text-center lg:text-balance">
            <p className="text-xs relative font-semibold uppercase tracking-wide text-slate-500">
              Product Roadmap
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold tracking-tight text-slate-900">
              Product milestones & launches
            </h2>
            <p className="text-base mt-4 font-medium text-slate-500">
              Trace our journey from the inaugural release through every major
              feature update.
            </p>
          </div>

          {/* Filter Buttons - Mobile: Only "All Phases", Desktop: All Options */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8">
            {/* Mobile: Only All Phases */}
            <button
              onClick={() => setFilter("all")}
              className="md:hidden px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-900 text-white shadow-lg"
            >
              All Phases
            </button>

            {/* Desktop: All Filter Options */}
            <div className="hidden md:flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  filter === "all"
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-50 shadow"
                }`}
              >
                All Phases
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  filter === "completed"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-green-50 shadow"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("current")}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  filter === "current"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-blue-50 shadow"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  filter === "upcoming"
                    ? "bg-slate-500 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-50 shadow"
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Continuous Vertical Line */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2"></div>

            {/* Timeline Items */}
            <div className="space-y-8 relative">
              {filteredPhases.map((phase, index) => {
                const badge = getStatusBadge(phase.status);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={phase.id}
                    className={`relative flex items-start ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } flex-row`}
                  >
                    {/* Dot */}
                    <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 z-10">
                      <div
                        className={`w-3 h-3 rounded-full border-4 ${
                          phase.status === "completed"
                            ? "bg-green-500 border-green-200"
                            : phase.status === "current"
                            ? "bg-blue-500 border-blue-200 shadow-lg shadow-blue-500/50 animate-pulse"
                            : "bg-zinc-300 border-zinc-100"
                        }`}
                      ></div>
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 ml-12 md:ml-0 ${
                        isEven ? "md:pr-12" : "md:pl-12"
                      } ${isEven ? "md:text-right" : "md:text-left"}`}
                    >
                      <div
                        className={`inline-block w-full md:max-w-md ${
                          isEven ? "md:ml-auto" : "md:mr-auto"
                        }`}
                      >
                        <div className="bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 sm:p-6 shadow hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              <time dateTime={phase.date}>{phase.date}</time>
                            </p>
                            <span
                              className={`${badge.bg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}
                            >
                              {badge.text}
                            </span>
                          </div>

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-purple-600 mb-1">
                            {phase.quarter}
                          </p>

                          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 mb-2">
                            {phase.title}
                          </h3>

                          <p className="text-sm text-slate-600 leading-relaxed text-left">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Community Feedback Card */}
          <div className="mt-16 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-2">
              Community Driven
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 mb-3">
              Your Voice Shapes Our Future
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
              This roadmap evolves with community feedback. Have ideas, feature
              requests, or suggestions? Join our Farcaster channel to share your
              thoughts and help us build the future of social art.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://warpcast.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium shadow"
              >
                Join on Farcaster
              </a>
              <Link
                href="/#pricing"
                scroll={true}
                className="inline-flex items-center px-5 py-2.5 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
              >
                Start Minting
              </Link>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Last updated: November 6, 2025
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Be Part of the Journey
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start minting your moods today and watch Muse evolve with your
            community
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#pricing"
              scroll={true}
              className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(255,255,255,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] bg-white text-purple-600 hover:bg-purple-50 disabled:bg-slate-50/30 disabled:text-slate-900/20 px-4 py-2.5 rounded-[0.625rem] flex"
            >
              Start Minting FREE
            </Link>
            <Link
              href="/gallery"
              className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(255,255,255,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-white/30 bg-purple-500/30 text-white hover:bg-purple-400/40 disabled:bg-slate-900/30 disabled:text-slate-50/70 px-4 py-2.5 rounded-[0.625rem] flex"
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
