export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description:
        "Connect your Web3 wallet to get started. We support MetaMask, Coinbase Wallet, and more via WalletConnect.",
    },
    {
      number: 2,
      title: "Enter Your Farcaster ID",
      description:
        "Our algorithm analyzes your Farcaster activity - likes, casts, and engagement - to determine your unique mood.",
    },
    {
      number: 3,
      title: "Mint Your Mood NFT",
      description:
        "Choose between free SD (512px) or premium HD (2048px) edition. Minted instantly on Base mainnet.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold gradient-text">
            How Muse Works
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Three simple steps to transform your Farcaster activity into a
            collectible mood NFT
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100/50 hover:bg-white/80 hover:shadow-lg hover:border-purple-200/70 transition-all duration-300"
            >
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                {step.title}
              </h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
