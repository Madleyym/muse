import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
          Ready to Mint Your Mood?
        </h2>
        <p className="text-xl text-purple-100 mb-8">
          Join hundreds of Farcaster users turning their vibes into collectible
          art
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="#pricing"
            className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(255,255,255,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] bg-white text-purple-600 hover:bg-purple-50 disabled:bg-slate-50/30 disabled:text-slate-900/20 px-4 py-2.5 rounded-[0.625rem] flex"
          >
            Get Started Free
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
  );
}
