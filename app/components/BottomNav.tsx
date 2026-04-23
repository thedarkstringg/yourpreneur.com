import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-t border-white/10 flex justify-around items-center h-16">
      <Link
        href="/chronicle"
        className="text-white border-b border-white pb-1 font-['Space_Grotesk'] tracking-tight uppercase text-sm flex flex-col items-center"
      >
        <span className="material-symbols-outlined text-sm mb-1">timeline</span>
        Chronicle
      </Link>
      <Link
        href="/patterns"
        className="text-white/40 hover:text-white/80 transition-colors font-['Space_Grotesk'] tracking-tight uppercase text-sm flex flex-col items-center hover:bg-white/5 transition-all duration-300 p-2 rounded"
      >
        <span className="material-symbols-outlined text-sm mb-1">query_stats</span>
        Patterns
      </Link>
      <Link
        href="/ventures"
        className="text-white/40 hover:text-white/80 transition-colors font-['Space_Grotesk'] tracking-tight uppercase text-sm flex flex-col items-center hover:bg-white/5 transition-all duration-300 p-2 rounded"
      >
        <span className="material-symbols-outlined text-sm mb-1">business_center</span>
        Ventures
      </Link>
    </div>
  );
}
