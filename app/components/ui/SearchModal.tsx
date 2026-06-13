'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { searchVentures, searchEvents, searchTasks, type SearchResult } from '@/lib/search';
import { colors, spacing, radius, typography, transitions } from '@/styles/tokens';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVenture?: (ventureId: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectVenture }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ventures, events, tasks, selectedVentureId } = useStore();

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const ventureResults = searchVentures(ventures, query);
    const eventResults = searchEvents(events, query);
    const taskResults = searchTasks(tasks, query);

    const combined = [...ventureResults, ...eventResults, ...taskResults].slice(0, 12);
    setResults(combined);
    setSelectedIndex(0);
  }, [query, ventures, events, tasks]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === 'venture') {
      onSelectVenture?.(result.id);
      useStore.setState({ selectedVentureId: result.id });
    }
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: colors.background.base,
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.default}`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          animation: `slideDown 200ms ${transitions.default}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ padding: spacing.lg, borderBottom: `1px solid ${colors.border.subtle}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Search size={16} strokeWidth={1.5} style={{ color: colors.text.tertiary }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search ventures, events, tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: colors.text.primary,
                fontSize: typography.size.sm,
                fontFamily: typography.family.base,
                outline: 'none',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.text.tertiary,
                  cursor: 'pointer',
                  padding: spacing.xs,
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {results.length === 0 && query ? (
            <div
              style={{
                padding: spacing.lg,
                textAlign: 'center',
                color: colors.text.tertiary,
                fontSize: typography.size.xs,
              }}
            >
              No results for "{query}"
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: spacing.lg, color: colors.text.tertiary, fontSize: typography.size.xs }}>
              Type to search
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelectResult(result)}
                style={{
                  width: '100%',
                  padding: `${spacing.md}px ${spacing.lg}px`,
                  borderBottom: `1px solid ${colors.border.subtle}`,
                  background: index === selectedIndex ? colors.background.surface : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: `background ${transitions.default}`,
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ color: colors.text.primary, fontSize: typography.size.sm, fontWeight: 500 }}>
                  {result.title}
                </div>
                {result.subtext && (
                  <div style={{ color: colors.text.tertiary, fontSize: typography.size.xs, marginTop: 4 }}>
                    {result.subtext}
                  </div>
                )}
                <div
                  style={{
                    marginTop: spacing.xs,
                    display: 'flex',
                    gap: spacing.xs,
                    fontSize: 10,
                    color: colors.text.disabled,
                  }}
                >
                  <span
                    style={{
                      background: colors.border.default,
                      padding: '2px 6px',
                      borderRadius: radius.sm,
                      textTransform: 'capitalize',
                    }}
                  >
                    {result.type}
                  </span>
                  {result.matchedFields.map((field) => (
                    <span key={field} style={{ color: colors.text.tertiary }}>
                      • {field}
                    </span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: spacing.sm,
            borderTop: `1px solid ${colors.border.subtle}`,
            background: colors.background.surface,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: typography.size.xs,
            color: colors.text.tertiary,
          }}
        >
          <span>
            {results.length > 0 && `${selectedIndex + 1} of ${results.length}`}
          </span>
          <span>
            ↓ ↑ to navigate • Enter to select • Esc to close
          </span>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
