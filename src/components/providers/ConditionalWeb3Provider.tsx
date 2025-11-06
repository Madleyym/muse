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

  // ✅ Check if current route is miniapp
  const isMiniAppRoute = pathname?.startsWith("/miniapp");

  console.log("[ConditionalWeb3Provider]", {
    pathname,
    isMiniAppRoute,
    willWrapWithWeb3: !isMiniAppRoute,
  });

  // ✅ If miniapp route: no Web3Provider
  if (isMiniAppRoute) {
    console.log(
      "[ConditionalWeb3Provider] ✅ Skipping Web3Provider for miniapp"
    );
    return <>{children}</>;
  }

  // ✅ If other routes: wrap with Web3Provider
  console.log("[ConditionalWeb3Provider] ✅ Using Web3Provider for website");
  return <Web3Provider>{children}</Web3Provider>;
}
