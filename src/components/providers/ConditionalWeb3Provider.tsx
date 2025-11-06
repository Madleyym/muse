"use client";

import { usePathname } from "next/navigation";
import { Web3Provider } from "./Web3Provider";
import { ReactNode } from "react";

export default function ConditionalWeb3Provider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isMiniAppRoute = pathname?.startsWith("/miniapp");

  console.log("[ConditionalWeb3Provider]", {
    pathname,
    isMiniAppRoute,
    willWrapWithWeb3: !isMiniAppRoute,
  });

  if (isMiniAppRoute) {
    console.log(
      "[ConditionalWeb3Provider] ✅ Skipping Web3Provider for miniapp"
    );
    return <>{children}</>;
  }

  console.log("[ConditionalWeb3Provider] ✅ Using Web3Provider for website");
  return <Web3Provider>{children}</Web3Provider>;
}
