export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 lg:py-32 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            About Muse
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're building a social art experiment where every interaction
            becomes a collectible memory
          </p>
        </div>

        {/* Mission */}
        <div className="mb-20 lg:mb-24">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">
            Our Mission
          </h3>
          <div className="max-w-4xl mx-auto space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            <p>
              Muse transforms the ephemeral nature of social media into
              permanent, meaningful digital art. We believe every vibe, every
              mood, every moment deserves to be celebrated and remembered.
            </p>
            <p>
              Built on Base and integrated with Farcaster, we're making NFTs
              accessible, fun, and truly social. No complicated wallets, no
              confusing processes - just pure creative expression.
            </p>
            <p>
              Our goal is to bridge the gap between social interaction and
              digital ownership, creating a new paradigm where community
              engagement becomes collectible art.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20 lg:mb-24">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100/50 hover:bg-white/80 hover:shadow-lg transition-all">
            <div className="text-4xl mb-4">🎨</div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">
              Creative Expression
            </h4>
            <p className="text-slate-600 text-sm sm:text-base">
              Turn your daily vibes into unique generative art
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100/50 hover:bg-white/80 hover:shadow-lg transition-all">
            <div className="text-4xl mb-4">🌐</div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">
              Onchain Forever
            </h4>
            <p className="text-slate-600 text-sm sm:text-base">
              Your moments preserved on Base blockchain
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100/50 hover:bg-white/80 hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
            <div className="text-4xl mb-4">🤝</div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">
              Community First
            </h4>
            <p className="text-slate-600 text-sm sm:text-base">
              Built for and with the Farcaster community
            </p>
          </div>
        </div>

        {/* How It Started */}
        <div className="mb-20 lg:mb-24">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-10 text-center">
            How It Started
          </h3>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-purple-200">
              <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                The Problem
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We noticed that social media moments are fleeting. Your best
                posts, your mood of the day, your creative energy - all lost in
                endless scrolls. Meanwhile, NFTs felt disconnected from real
                social interaction.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-purple-300">
              <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                The Insight
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                What if every like, every cast, every interaction could become
                art? What if your daily mood could be immortalized onchain?
                That's when Muse was born.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-purple-400">
              <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                The Solution
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We built Muse on Base, integrated it seamlessly with Farcaster
                Frames, and created an algorithm that transforms your social
                vibe into unique generative art. Free to mint, easy to share,
                forever yours.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20 lg:mb-24">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-10 text-center">
            Built With Modern Tech
          </h3>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100/50">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-bold text-slate-800 mb-2">Base Network</h4>
              <p className="text-sm text-slate-600">
                Built on Coinbase's L2 for fast, cheap, and secure transactions
              </p>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100/50">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-slate-800 mb-2">
                Farcaster Frames
              </h4>
              <p className="text-sm text-slate-600">
                Seamless social integration for minting directly from your feed
              </p>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100/50">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-bold text-slate-800 mb-2">Generative Art</h4>
              <p className="text-sm text-slate-600">
                Unique algorithms that turn data into beautiful visual
                expressions
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-10 text-center">
            Our Values
          </h3>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100/50">
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                Accessibility First
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Everyone should be able to create and collect art. That's why we
                offer free minting and make the process as simple as liking a
                post.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100/50">
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                Community Driven
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We listen to our community and build features they want. Muse
                grows with the needs of Farcaster users.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100/50">
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                Transparency Always
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                All our smart contracts are verified. All our algorithms are
                documented. No hidden surprises, just honest building.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100/50">
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                Long-term Thinking
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We're not chasing hype. We're building sustainable
                infrastructure for social art that will last for years to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
