"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="hidden lg:flex flex-col py-8 px-6 gap-8 fixed h-screen left-0 w-64 border-r border-white/10 bg-black z-40">
      <div className="flex items-center gap-4 mb-8">
        <img
          alt="Founder Profile"
          className="w-12 h-12 rounded-full border border-white/10 object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoki6hoE-h5fEY8J1a7wpCLFfhHGgLp5nva39q35ePTxDPAlsdVxeL8rEpi_IPxQAsibn96zT1Wg-tJjDo-6rcKwVv3hDFqzdTErKglGoBOyobg4vvZOvJly2OFAV8o2yXxt5PyEgm-33-r4Uye7JhYGFTbbVRYvi8rboIpC7kSn8zAi8XMiEWAhK6QVVtJ70IvDuEfrYxGgs1kKLDGaHCxJxeMrzkclJWBs7zP6jOabX-_mbsru0XMsKVmtrOYyTYlNIVWz2ehA8"
        />
        <div>
          <div className="font-['Space_Grotesk'] font-bold text-white tracking-widest text-sm">
            Institutional Legacy
          </div>
          <div className="text-white/40 font-mono text-xs">Vol. 01</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <Link
          href="/chronicle"
          className={`flex items-center gap-4 px-4 py-3 font-['Space_Grotesk'] font-medium text-xs tracking-widest uppercase hover:bg-white/5 transition-all duration-200 rounded ${
            isActive("/chronicle")
              ? "bg-white/10 text-white border-l-2 border-white"
              : "text-white/30 hover:text-white/60"
          }`}
        >
          <span className="material-symbols-outlined">timeline</span>
          Chronicle
        </Link>
        <Link
          href="/patterns"
          className={`flex items-center gap-4 px-4 py-3 font-['Space_Grotesk'] font-medium text-xs tracking-widest uppercase hover:bg-white/5 transition-all duration-200 rounded ${
            isActive("/patterns")
              ? "bg-white/10 text-white border-l-2 border-white"
              : "text-white/30 hover:text-white/60"
          }`}
        >
          <span className="material-symbols-outlined text-sm">query_stats</span>
          Patterns
        </Link>
        <Link
          href="/ventures"
          className={`flex items-center gap-4 px-4 py-3 font-['Space_Grotesk'] font-medium text-xs tracking-widest uppercase hover:bg-white/5 transition-all duration-200 rounded ${
            isActive("/ventures")
              ? "bg-white/10 text-white border-l-2 border-white"
              : "text-white/30 hover:text-white/60"
          }`}
        >
          <span className="material-symbols-outlined text-sm">business_center</span>
          Ventures
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-4 px-4 py-3 font-['Space_Grotesk'] font-medium text-xs tracking-widest uppercase hover:bg-white/5 transition-all duration-200 rounded mt-auto ${
            isActive("/settings")
              ? "bg-white/10 text-white border-l-2 border-white"
              : "text-white/30 hover:text-white/60"
          }`}
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          Settings
        </Link>
      </div>

      <Link
        href="/entries/new"
        className="w-full py-3 bg-primary text-on-primary font-label-caps text-xs rounded hover:bg-white/90 transition-colors mt-8 uppercase tracking-widest text-center block"
      >
        New Entry
      </Link>
    </nav>
  );
}
