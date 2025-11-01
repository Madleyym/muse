export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Interact on Farcaster",
      description:
        "Like, cast, or reply on Farcaster. Your activity creates your unique mood signature.",
    },
    {
      number: 2,
      title: "Generate Your NFT",
      description:
        "Our algorithm analyzes your vibe and creates a unique generative art piece just for you.",
    },
    {
      number: 3,
      title: "Mint on Base",
      description:
        "Mint directly from Farcaster Frame. Free SD version or premium HD for 0.001 ETH.",
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
            Three simple steps to transform your Farcaster vibe into collectible
            art
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
