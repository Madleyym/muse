import Header from "@/components/layout/Header";
import Link from "next/link";

export default function RoadmapPage() {
  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <Header />

      <section className="pt-12 lg:pt-16 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] inline-flex gradient-bg text-white px-2.5 py-1">
              Product Roadmap
            </div>
            <div className="mt-6 gradient-text text-center text-3xl font-semibold sm:mx-auto sm:w-2/3 md:w-1/2 lg:mt-9 lg:text-4xl lg:leading-tight xl:w-2/3">
              Building the Future of Social Art on Base
            </div>
            <p className="text-sm font-medium text-slate-600 leading-normal lg:leading-normal lg:text-base mt-4 text-center sm:mx-auto sm:w-2/3 md:w-1/2 xl:w-2/5">
              Follow our journey as we transform social interactions into
              collectible art. Here's what we're building next.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-white gradient-bg"
              >
                All Phases
              </button>
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-neutral-700 bg-white"
              >
                Completed
              </button>
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-neutral-700 bg-white"
              >
                In Progress
              </button>
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-neutral-700 bg-white"
              >
                Upcoming
              </button>
            </div>
          </div>

          {/* Roadmap Grid */}
          <div className="mt-6 grid gap-y-3 sm:mx-auto sm:w-2/3 md:w-1/2 md:px-4 lg:mx-0 lg:mt-12 lg:w-full lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6 lg:px-8">
            {/* Phase 1 - Completed */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 flex items-center justify-center">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-green-500 text-white px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Completed
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-green-500 text-white px-2.5 py-1 hidden xl:block">
                  Completed
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Phase 1: Foundation & Launch
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0">
                        ✓
                      </span>
                      <span>Base network integration</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0">
                        ✓
                      </span>
                      <span>Farcaster Frames support</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0">
                        ✓
                      </span>
                      <span>Free SD minting</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0">
                        ✓
                      </span>
                      <span>Basic generative art engine</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0">
                        ✓
                      </span>
                      <span>Gallery page</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Q4 2024
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        Completed
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Phase 2 - In Progress */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center">
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
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-blue-500 text-white px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  In Progress
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-blue-500 text-white px-2.5 py-1 hidden xl:block">
                  In Progress
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Phase 2: Enhanced Features
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-blue-500 mr-2 flex-shrink-0">
                        →
                      </span>
                      <span>HD premium minting</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-blue-500 mr-2 flex-shrink-0">
                        →
                      </span>
                      <span>Advanced mood algorithms</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-blue-500 mr-2 flex-shrink-0">
                        →
                      </span>
                      <span>Profile customization</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-blue-500 mr-2 flex-shrink-0">
                        →
                      </span>
                      <span>Collection management</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-blue-500 mr-2 flex-shrink-0">
                        →
                      </span>
                      <span>Social sharing tools</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Q1 2025
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        70% Complete
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Phase 3 - Upcoming */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 flex items-center justify-center">
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
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Upcoming
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 hidden xl:block">
                  Upcoming
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Phase 3: Community & Marketplace
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Secondary marketplace</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Creator royalties</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Community voting</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Collaborative moods</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Leaderboards & rewards</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Q2 2025
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        Planned
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Phase 4 - Future */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex items-center justify-center">
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Future
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 hidden xl:block">
                  Future
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Phase 4: Advanced Integrations
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>AI-powered recommendations</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Cross-chain support</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>3D mood avatars</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>AR/VR experiences</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>API for developers</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Q3 2025
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        Research Phase
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Phase 5 - Vision */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-400 flex items-center justify-center">
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Vision
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 hidden xl:block">
                  Vision
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Phase 5: The Metaverse Era
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Virtual galleries</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Live mood events</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Brand partnerships</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>DAO governance</span>
                    </li>
                    <li className="text-sm font-medium text-neutral-500 flex items-start">
                      <span className="text-slate-400 mr-2 flex-shrink-0">
                        ○
                      </span>
                      <span>Global art festival</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      2026+
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        Long-term Vision
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Community Feedback */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 flex items-center justify-center">
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
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] gradient-bg text-white px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Feedback
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] gradient-bg text-white px-2.5 py-1 hidden xl:block">
                  Feedback
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Your Ideas Shape Our Future
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-500 leading-relaxed">
                    This roadmap evolves with community feedback. Have ideas?
                    Join our Farcaster channel or Discord to share your thoughts
                    and help us build the future of social art.
                  </p>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Always Listening
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        Ongoing
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>
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
              className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(255,255,255,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] bg-white text-purple-600 hover:bg-purple-50 px-4 py-2.5 rounded-[0.625rem] flex"
            >
              Start Minting FREE
            </Link>
            <Link
              href="/about"
              className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(255,255,255,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-white/30 bg-purple-500/30 text-white hover:bg-purple-400/40 px-4 py-2.5 rounded-[0.625rem] flex"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
