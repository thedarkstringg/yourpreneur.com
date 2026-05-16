'use client';

import { useState } from 'react';
import { Plus, Maximize2, Grid, List, BookOpen, ClipboardList, FlipVertical, Edit3, NotepadText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ActionTool = {
      id: string;
      Icon: LucideIcon;
      label: string;
      tooltip: string;
      shortcut: string;
      onClick?: () => void;
      isSeparator?: false;
    };

type ToolbarTool =
  | ActionTool
  | {
      id: string;
      isSeparator: true;
    };

export default function Toolbar({
  onGenerateClick,
  onModifyClick,
  onPreviewClick,
  onAxisClick,
  onLogEventClick,
  onReviewClick,
  onListClick,
  onTaskCanvasClick,
  onFlipSelectedClick,
}: {
  onGenerateClick?: () => void;
  onModifyClick?: () => void;
  onPreviewClick?: () => void;
  onAxisClick?: () => void;
  onLogEventClick?: () => void;
  onReviewClick?: () => void;
  onListClick?: () => void;
  onTaskCanvasClick?: () => void;
  onFlipSelectedClick?: () => void;
}) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const tools: ToolbarTool[] = [
    // GROUP 1 - Canvas tools
    { id: 'new', Icon: Plus, label: 'NEW', tooltip: 'Create a venture node', shortcut: 'N', onClick: onGenerateClick },
    { id: 'focus', Icon: Maximize2, label: 'FOCUS', tooltip: 'Center the selected node', shortcut: 'F', onClick: onPreviewClick },
    { id: 'modify', Icon: Edit3, label: 'EDIT', tooltip: 'Modify the selected venture', shortcut: 'M', onClick: onModifyClick },
    { id: 'grid', Icon: Grid, label: 'AXIS', tooltip: 'Jump to the selected year axis', shortcut: 'G', onClick: onAxisClick },
    { id: 'flip', Icon: FlipVertical, label: 'FLIP', tooltip: 'Move selected node across the timeline', shortcut: 'V', onClick: onFlipSelectedClick },
    { id: 'sep1', isSeparator: true },
    // GROUP 2 - View tools
    { id: 'list', Icon: List, label: 'LIST', tooltip: 'Open the portfolio sidebar', shortcut: 'L', onClick: onListClick },
    { id: 'log', Icon: NotepadText, label: 'LOG', tooltip: 'Log an event for the selected venture', shortcut: 'E', onClick: onLogEventClick },
    { id: 'tasks', Icon: ClipboardList, label: 'TASKS', tooltip: 'Open selected venture task canvas', shortcut: 'T', onClick: onTaskCanvasClick },
    { id: 'review', Icon: BookOpen, label: 'REVIEW', tooltip: 'Open annual review report', shortcut: 'R', onClick: onReviewClick },
  ];

  const handleMouseEnter = (toolId: string, event: React.MouseEvent) => {
    if (tools.find((tool) => tool.id === toolId)?.isSeparator) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
    setHoveredButton(toolId);
  };

  const handleToolClick = (tool: ToolbarTool) => {
    if (tool.isSeparator) return;
    setActiveButton(tool.id);
    tool.onClick?.();
    setTimeout(() => setActiveButton(null), 150);
  };

  const hoveredTool = tools.find((tool): tool is ActionTool => tool.id === hoveredButton && !tool.isSeparator);

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
            {hoveredTool?.tooltip}
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {hoveredTool?.shortcut}
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
          animation: 'toolbarSlideUp 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 1400ms both',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '62px',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(6,6,6,0.72)',
            color: 'rgba(255,255,255,0.42)',
            fontSize: '9px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(18px)',
          }}
        >
          Canvas tools
          <span style={{ color: 'rgba(255,255,255,0.22)' }}>hover for keys</span>
        </div>
        <div
          style={{
            background: 'rgba(7,7,7,0.94)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: '14px',
            padding: '4px',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, auto)',
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
                  fontFamily: "'Inter', sans-serif",
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
                    fontFamily: "'Inter', sans-serif",
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

    </>
  );
}

