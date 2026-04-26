'use client';

import { useState } from 'react';
import { Plus, Maximize2, Grid, List, BarChart2, BookOpen, Sparkles } from 'lucide-react';

export default function Toolbar({
  onGenerateClick,
  onModifyClick,
  onPreviewClick,
  onListClick,
  onPatternsClick,
  onHelpClick,
}: {
  onGenerateClick?: () => void;
  onModifyClick?: () => void;
  onPreviewClick?: () => void;
  onListClick?: () => void;
  onPatternsClick?: () => void;
  onHelpClick?: () => void;
}) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const tools: any[] = [
    // GROUP 1 - Canvas tools
    { id: 'new', Icon: Plus, label: 'NEW', tooltip: 'New', shortcut: 'N', onClick: onGenerateClick },
    { id: 'focus', Icon: Maximize2, label: 'FOCUS', tooltip: 'Focus', shortcut: 'F', onClick: onPreviewClick },
    { id: 'grid', Icon: Grid, label: 'GRID', tooltip: 'Grid', shortcut: 'G', onClick: onPreviewClick },
    { id: 'sep1', isSeparator: true },
    // GROUP 2 - View tools
    { id: 'list', Icon: List, label: 'LIST', tooltip: 'List', shortcut: 'L', onClick: onListClick },
    { id: 'insights', Icon: BarChart2, label: 'INSIGHTS', tooltip: 'Insights', shortcut: 'I', onClick: onPatternsClick },
    { id: 'review', Icon: BookOpen, label: 'REVIEW', tooltip: 'Review', shortcut: 'R', onClick: onPreviewClick },
    { id: 'sep2', isSeparator: true },
    // GROUP 3 - AI tools
    { id: 'coach', Icon: Sparkles, label: 'COACH', tooltip: 'Coach', shortcut: 'C', onClick: onHelpClick },
  ];

  const handleMouseEnter = (toolId: string, event: React.MouseEvent) => {
    if ((tools.find(t => t.id === toolId) as any)?.isSeparator) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
    setHoveredButton(toolId);
  };

  const handleToolClick = (tool: any) => {
    if (tool.isSeparator) return;
    setActiveButton(tool.id);
    tool.onClick?.();
    setTimeout(() => setActiveButton(null), 150);
  };

  return (
    <>
      {hoveredButton && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPos.y - 60,
            left: tooltipPos.x,
            transform: 'translateX(-50%)',
            background: 'rgba(8,6,6,0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
            zIndex: 1000,
            fontSize: '12px',
          }}
        >
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            {tools.find(t => t.id === hoveredButton)?.tooltip}
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {tools.find(t => t.id === hoveredButton)?.shortcut}
          </div>
        </div>
      )}

      <div
        id="toolbar"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          animation: 'slideUp 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 1400ms both',
        }}
      >
        <div
          style={{
            background: 'rgba(12,9,9,0.96)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            padding: '4px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, auto)',
            gap: '2px',
            backdropFilter: 'blur(32px)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {tools.map((tool) => {
            if (tool.isSeparator) {
              return (
                <div
                  key={tool.id}
                  style={{
                    width: '1px',
                    height: '28px',
                    background: 'rgba(255,255,255,0.08)',
                    margin: '0 2px',
                  }}
                />
              );
            }

            const Icon = tool.Icon;

            return (
              <button
                key={tool.id}
                onMouseEnter={(e) => handleMouseEnter(tool.id, e)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleToolClick(tool)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  background: activeButton === tool.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: activeButton === tool.id ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 150ms ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseOver={(e) => {
                  if (activeButton !== tool.id) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeButton !== tool.id) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  style={{
                    color: activeButton === tool.id ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    transition: 'color 150ms ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '7px',
                    color: activeButton === tool.id ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'color 150ms ease',
                  }}
                >
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(60px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
