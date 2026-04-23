"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-t border-white/10 flex justify-around items-center h-16">
      <Link
        href="/chronicle"
        className={`font-['Space_Grotesk'] tracking-tight uppercase text-sm flex flex-col items-center py-2 px-4 rounded ${
          isActive("/chronicle")
            ? "text-white border-b border-white pb-1"
            : "text-white/40 hover:text-white/80 transition-colors"
        }`}
      >
        <span className="material-symbols-outlined text-sm mb-1">timeline</span>
        Chronicle
      </Link>
      <Link
        href="/patterns"
        className={`font-['Space_Grotesk'] tracking-tight uppercase text-sm flex flex-col items-center p-2 rounded ${
          isActive("/patterns")
            ? "text-white border-b border-white pb-1"
            : "text-white/40 hover:text-white/80 transition-colors hover:bg-white/5"
        }`}
      >
        <span className="material-symbols-outlined text-sm mb-1">query_stats</span>
        Patterns
      </Link>
      <Link
        href="/ventures"
        className={`font-['Space_Grotesk'] tracking-tight uppercase text-sm flex flex-col items-center p-2 rounded ${
          isActive("/ventures")
            ? "text-white border-b border-white pb-1"
            : "text-white/40 hover:text-white/80 transition-colors hover:bg-white/5"
        }`}
      >
        <span className="material-symbols-outlined text-sm mb-1">
          business_center
        </span>
        Ventures
      </Link>
    </div>
  );
}
