'use client';

export default function Toolbar({
  onModifyClick,
  onGenerateClick,
  onPreviewClick,
  onMoreClick,
  onHelpClick,
  isPreviewMode = false,
}: {
  onModifyClick?: () => void;
  onGenerateClick?: () => void;
  onPreviewClick?: () => void;
  onMoreClick?: () => void;
  onHelpClick?: () => void;
  isPreviewMode?: boolean;
}) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-0 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-900/80 backdrop-blur-sm">
        {/* Generate */}
        <div
          onClick={onGenerateClick}
          className="flex items-center gap-1 px-3 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors"
        >
          <span>✦</span>
          <span className="text-xs font-mono tracking-widest text-white/75 hover:text-white">
            GENERATE
          </span>
          <span className="text-xs">∨</span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10" />

        {/* Modify */}
        <div
          onClick={onModifyClick}
          className="flex items-center gap-1 px-3 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors"
        >
          <span>✎</span>
          <span className="text-xs font-mono tracking-widest text-white/75 hover:text-white">
            MODIFY
          </span>
          <span className="text-xs">∨</span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10" />

        {/* Preview */}
        <div
          onClick={onPreviewClick}
          className={`flex items-center gap-1 px-3 py-1.5 rounded cursor-pointer transition-colors ${
            isPreviewMode
              ? 'bg-white/10 text-white'
              : 'hover:bg-white/5 text-white/75'
          }`}
        >
          <span>◎</span>
          <span className="text-xs font-mono tracking-widest hover:text-white">
            PREVIEW
          </span>
          <span className="text-xs">∨</span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10" />

        {/* Help */}
        <div
          onClick={onHelpClick}
          className="flex items-center gap-1 px-3 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors"
        >
          <span className="text-xs">?</span>
          <span className="text-xs font-mono tracking-widest text-white/75 hover:text-white">
            HELP
          </span>
        </div>
      </div>
    </div>
  );
}
