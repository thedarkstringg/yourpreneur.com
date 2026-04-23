export default function TopNav() {
  return (
    <nav className="md:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="font-['Space_Grotesk'] text-xl font-bold tracking-tighter text-white">
        LEGACY_VAULT
      </div>
      <div className="flex gap-4">
        <button className="text-white/40 hover:text-white/80 transition-colors">
          <span className="material-symbols-outlined">history_edu</span>
        </button>
        <button className="text-white/40 hover:text-white/80 transition-colors">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </nav>
  );
}
