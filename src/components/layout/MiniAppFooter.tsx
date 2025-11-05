import Link from "next/link";
import Image from "next/image";

export default function MiniAppFooter() {
  return (
    <footer className="py-12 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-t border-purple-100/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-y-6 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-7 h-7">
                <Image
                  src="/assets/Logo/Muse.png"
                  alt="Muse Logo"
                  fill
                  sizes="28px"
                  className="object-contain"
                  quality={100}
                />
              </div>
              <span className="font-bold text-lg gradient-text">Muse</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Mint your mood. Collect the vibe. Built on Base.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="text-xs font-bold text-neutral-700 mb-3">
              Product
            </div>
            <div className="flex flex-col gap-y-1.5">
              <a
                className="text-xs font-medium text-neutral-500 hover:text-purple-600 transition"
                href="#pricing"
              >
                Free Mint
              </a>
              <a
                className="text-xs font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://muse.write3.fun/gallery"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gallery
              </a>
            </div>
          </div>

          {/* Community */}
          <div>
            <div className="text-xs font-bold text-neutral-700 mb-3">
              Community
            </div>
            <div className="flex flex-col gap-y-1.5">
              <a
                className="flex items-center gap-x-1.5 text-xs font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://warpcast.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative w-3.5 h-3.5">
                  <Image
                    src="/assets/images/layout/farcaster.png"
                    alt="Farcaster"
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                </div>
                Farcaster
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="text-xs font-bold text-neutral-700 mb-3">
              Resources
            </div>
            <div className="flex flex-col gap-y-1.5">
              <a
                className="text-xs font-medium text-neutral-500 hover:text-purple-600 transition"
                href="https://muse.write3.fun/about"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </div>
          </div>
        </div>

        <div className="border-b border-purple-100 my-6"></div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-medium text-neutral-700">
            © 2025 Muse. Built on Base.
          </span>

          <div className="flex items-center gap-3">
            <a
              href="https://warpcast.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 transition"
            >
              <div className="relative w-4 h-4">
                <Image
                  src="/assets/images/layout/farcaster.png"
                  alt="Farcaster"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
            </a>

            <div className="h-4 w-px bg-purple-200"></div>

            <div className="relative w-5 h-5">
              <Image
                src="/assets/Logo/Muse.png"
                alt="Muse"
                fill
                sizes="20px"
                className="object-contain"
                quality={100}
              />
            </div>

            <div className="relative w-5 h-5">
              <Image
                src="/assets/images/layout/eth-base.png"
                alt="Base Network"
                fill
                sizes="20px"
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
