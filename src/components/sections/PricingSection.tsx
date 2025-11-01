export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold gradient-text">
            Choose Your Mint
          </h2>
          <p className="mt-4 text-slate-600">
            Start free, upgrade when you love it
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Mint */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all">
            <div className="text-sm font-medium text-purple-600 mb-2">
              🟢 FREE MINT
            </div>
            <h3 className="text-2xl font-bold mb-2">SD Edition</h3>
            <div className="text-4xl font-bold gradient-text mb-4">FREE</div>
            <p className="text-slate-600 mb-6">
              Perfect for experimenting and sharing
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "512px resolution NFT",
                "Just like a Farcaster cast",
                "Minted on Base mainnet",
                "Shareable on socials",
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="block w-full text-center items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(139,92,246,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] gradient-bg text-white hover:opacity-90 px-4 py-2.5 rounded-[0.625rem]"
            >
              Claim Free NFT
            </a>
          </div>

          {/* Premium Mint */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-purple-500 hover:border-purple-600 hover:shadow-2xl transition-all relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              MOST POPULAR
            </div>
            <div className="text-sm font-medium text-purple-600 mb-2">
              🔵 HD PREMIUM
            </div>
            <h3 className="text-2xl font-bold mb-2">HD Edition</h3>
            <div className="text-4xl font-bold gradient-text mb-4">
              0.001 ETH
            </div>
            <p className="text-slate-600 mb-6">
              For collectors and true believers
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "2048px high resolution",
                "Optional animation",
                "Commercial rights included",
                "Support the creator",
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="block w-full text-center items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(139,92,246,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] gradient-bg text-white hover:opacity-90 px-4 py-2.5 rounded-[0.625rem]"
            >
              Mint HD NFT
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
