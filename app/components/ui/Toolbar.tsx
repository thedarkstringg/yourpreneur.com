'use client';

import { useState } from 'react';
import { Plus, Maximize2, Grid, List, BookOpen, ClipboardList, FlipVertical, Edit3, NotepadText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { colors, spacing, radius, layout, transitions } from '@/styles/tokens';

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
            background: `${colors.background.base}/97`,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.md,
            padding: `${spacing.xs}px ${spacing.md}px`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            pointerEvents: 'none',
            zIndex: 1000,
            fontSize: 12,
          }}
        >
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13,
            color: colors.text.secondary,
          }}>
            {hoveredTool?.tooltip}
          </span>
          <div
            style={{
              background: colors.background.surface,
              border: `1px solid ${colors.border.default}`,
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 9,
              color: colors.text.tertiary,
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
            gap: spacing.xs,
            padding: `${spacing.xs}px ${spacing.sm}px`,
            borderRadius: '999px',
            border: `1px solid ${colors.border.subtle}`,
            background: `${colors.background.base}`,
            color: colors.text.tertiary,
            fontSize: 9,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(18px)',
          }}
        >
          Canvas tools
          <span style={{ color: colors.text.disabled }}>hover for keys</span>
        </div>
        <div
          style={{
            background: `${colors.background.base}`,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            padding: 4,
            display: 'grid',
            gridTemplateColumns: 'repeat(12, auto)',
            gap: spacing.xs,
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
                    width: 1,
                    height: 28,
                    background: colors.border.subtle,
                    margin: `0 ${spacing.xs}px`,
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
                  width: 40,
                  height: 40,
                  borderRadius: radius.md,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  background: activeButton === tool.id ? colors.background.elevated : 'transparent',
                  border: activeButton === tool.id ? `1px solid ${colors.border.default}` : '1px solid transparent',
                  cursor: 'pointer',
                  transition: `background ${transitions.default}, border-color ${transitions.default}`,
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseOver={(e) => {
                  if (activeButton !== tool.id) {
                    (e.currentTarget as HTMLElement).style.background = colors.background.surface;
                    (e.currentTarget as HTMLElement).style.borderColor = colors.border.subtle;
                  }
                }}
                onMouseOut={(e) => {
                  if (activeButton !== tool.id) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  style={{
                    color: activeButton === tool.id ? colors.text.primary : colors.text.secondary,
                    transition: `color ${transitions.default}`,
                  }}
                />
                <span
                  style={{
                    fontSize: 7,
                    color: activeButton === tool.id ? colors.text.secondary : colors.text.disabled,
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif",
                    transition: `color ${transitions.default}`,
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

