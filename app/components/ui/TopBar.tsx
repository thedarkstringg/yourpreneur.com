'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, User } from 'lucide-react';
import { useStore } from '@/lib/useStore';

export default function TopBar({
  onYearChange,
  onNewVenture,
  currentYear = 2024,
  zoomLevel = 100,
}: {
  onYearChange?: (year: number) => void;
  onNewVenture?: () => void;
  currentYear?: number;
  zoomLevel?: number;
}) {
  const years = [2022, 2023, 2024, 2025, 2026];
  const { onNavigateToYear } = useStore();

  const handleYearClick = (year: number) => {
    onYearChange?.(year);
    // Calculate year index (2022 is year 0)
    const yearIndex = year - 2022;
    onNavigateToYear?.(yearIndex);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '48px',
        background: 'rgba(10,8,8,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '20px',
        paddingRight: '20px',
        zIndex: 100,
        fontFamily: "'Space Grotesk', sans-serif",
        animation: 'slideDown 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: '#ffffff' }}>✦</span>
        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          PRENEURS
        </span>
        <div
          style={{
            width: '1px',
            height: '16px',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <span
          style={{
            fontSize: '9px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          CHRONICLE · {currentYear}
        </span>
      </div>

      {/* CENTER - Year Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 150ms',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>

        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            style={{
              background: 'none',
              border: 'none',
              color: year === currentYear ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'color 150ms',
              borderBottom: year === currentYear ? '1px solid rgba(255,255,255,0.9)' : 'none',
              paddingBottom: '2px',
            }}
            onMouseOver={(e) => {
              if (year !== currentYear) {
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (year !== currentYear) {
                e.currentTarget.style.color = 'rgba(255,255,255,0.25)';
              }
            }}
          >
            {year}
          </button>
        ))}

        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 150ms',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          style={{
            fontSize: '9px',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          {Math.round(zoomLevel)}%
        </span>
        <div
          style={{
            width: '1px',
            height: '16px',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <button
          onClick={onNewVenture}
          style={{
            padding: '6px 16px',
            borderRadius: '999px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '10px',
            color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 150ms',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          <Plus size={12} strokeWidth={1.5} />
          NEW VENTURE
        </button>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 'bold',
          }}
        >
          <User size={14} strokeWidth={1.5} />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-48px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
