import Header from "@/components/layout/Header";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <Header />

      <section className="pt-12 lg:pt-16 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] inline-flex gradient-bg text-white px-2.5 py-1">
              About Muse
            </div>
            <div className="mt-6 gradient-text text-center text-3xl font-semibold sm:mx-auto sm:w-2/3 md:w-1/2 lg:mt-9 lg:text-4xl lg:leading-tight xl:w-2/3">
              Building a Social Art Experiment Where Every Interaction Becomes
              Collectible
            </div>
            <p className="text-sm font-medium text-slate-600 leading-normal lg:leading-normal lg:text-base mt-4 text-center sm:mx-auto sm:w-2/3 md:w-1/2 xl:w-2/5">
              Transforming ephemeral social moments into permanent, meaningful
              digital art on Base blockchain
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-white gradient-bg"
              >
                All Stories
              </button>
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-neutral-700 bg-white"
              >
                Mission
              </button>
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-neutral-700 bg-white"
              >
                Values
              </button>
              <button
                type="button"
                className="py-1 px-2.5 text-sm flex items-center justify-center font-medium shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] rounded-full whitespace-nowrap text-neutral-700 bg-white"
              >
                Technology
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="mt-6 grid gap-y-3 sm:mx-auto sm:w-2/3 md:w-1/2 md:px-4 lg:mx-0 lg:mt-12 lg:w-full lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6 lg:px-8">
            {/* Mission Article */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
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
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Mission
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 hidden xl:block">
                  Mission
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Our Mission: Bridging Social & Onchain
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    Muse transforms the ephemeral nature of social media into
                    permanent, meaningful digital art. We believe every vibe,
                    every mood, every moment deserves to be celebrated and
                    remembered onchain.
                  </p>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Muse Team
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500"></time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Values Article */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center">
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
                  Values
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 hidden xl:block">
                  Values
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Community First, Always
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    We listen to our community and build features they want.
                    Accessibility, transparency, and long-term thinking guide
                    every decision we make for Farcaster users.
                  </p>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Muse Team
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        2025
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* How It Started Article */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
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
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Story
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 hidden xl:block">
                  Story
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    How Muse Was Born
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    We noticed social media moments are fleeting. What if every
                    like, every cast could become art? We built Muse on Base
                    with Farcaster Frames to make it happen. Free to mint,
                    forever yours.
                  </p>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Muse Team
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        2025
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Technology Article */}
            <article className="grid gap-x-6 gap-y-2 lg:gap-y-0 xl:grid-cols-[15.625rem_auto]">
              <figure className="relative w-full self-start rounded-2xl shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="h-40 w-full rounded-2xl lg:h-48 bg-gradient-to-br from-purple-400 via-blue-400 to-pink-400 flex items-center justify-center">
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
                </div>
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 absolute right-3 top-3 z-10 xl:hidden">
                  Tech
                </div>
              </figure>
              <div className="flex flex-col items-start p-4 xl:p-0">
                <div className="items-center justify-center rounded-full text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] bg-white text-neutral-700 px-2.5 py-1 hidden xl:block">
                  Tech
                </div>
                <div className="xl:mt-2.5">
                  <h3 className="font-bold text-neutral-700">
                    Built With Modern Stack
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    Base Network for fast transactions, Farcaster Frames for
                    seamless social integration, and generative art algorithms
                    that transform your data into beautiful visual expressions.
                  </p>
                </div>
                <div className="mt-2.5 flex grow items-end">
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="text-sm font-medium text-slate-600">
                      Muse Team
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="h-1 w-1 rounded-full bg-neutral-200"></span>
                      <time className="text-sm font-medium text-neutral-500">
                        2025
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
            Join the Movement
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Be part of the future where social interactions become timeless art
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#pricing"
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
    </main>
  );
}
