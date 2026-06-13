'use client';

import { useEffect, useState } from 'react';
import PixiApp from './components/canvas/PixiApp';
import Toolbar from './components/ui/Toolbar';
import TopBar from './components/ui/TopBar';
import LeftPanel from './components/ui/LeftPanel';
import RightPanel from './components/ui/RightPanel';
import ToastContainer from './components/ui/Toast';
import KeyboardShortcuts from './components/ui/KeyboardShortcuts';
import NewVentureModal from './components/ui/NewVentureModal';
import EventLogPanel from './components/ui/EventLogPanel';
import ModifyPanel from './components/ui/ModifyPanel';
import KeyboardHelp from './components/ui/KeyboardHelp';
import DataManager from './components/ui/DataManager';
import PatternsScreen from './components/ui/PatternsScreen';
import TaskCanvas from './components/ui/TaskCanvas';
import { useStore } from '@/lib/useStore';
import { useEventManagement } from '@/lib/useEventManagement';
import { calculateLayout } from '@/lib/layoutAlgorithm';

export default function Home() {
  const [isModifyPanelOpen, setIsModifyPanelOpen] = useState(false);
  const [isNewVentureOpen, setIsNewVentureOpen] = useState(false);
  const [isEventLogOpen, setIsEventLogOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isTaskCanvasOpen, setIsTaskCanvasOpen] = useState(false);
  const [isTaskTopologyOpen, setIsTaskTopologyOpen] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [currentYear, setCurrentYear] = useState(2024);

  const { selectedVentureId, ventures, addVenture, updateVenture, zoomLevel, onNavigateToTarget } = useStore();
  const { addEvent } = useEventManagement();

  useEffect(() => {
    const openEventLog = (event: Event) => {
      const ventureId = (event as CustomEvent<{ ventureId?: string }>).detail?.ventureId;
      if (ventureId) useStore.setState({ selectedVentureId: ventureId });
      setIsEventLogOpen(true);
    };

    const closeExpandedNode = () => useStore.setState({ selectedVentureId: null });

    window.addEventListener('open-event-log', openEventLog as EventListener);
    window.addEventListener('venture-node-close', closeExpandedNode);
    return () => {
      window.removeEventListener('open-event-log', openEventLog as EventListener);
      window.removeEventListener('venture-node-close', closeExpandedNode);
    };
  }, []);

  const focusSelectedVenture = () => {
    if (!selectedVentureId) return;
    const layout = calculateLayout(ventures);
    const position = layout.positions.get(selectedVentureId);
    if (position) {
      onNavigateToTarget?.(position.x + 110, position.y + 60, 1);
    }
  };

  const flipSelectedVenture = () => {
    if (!selectedVentureId) return;
    const venture = ventures.find((item) => item.id === selectedVentureId);
    if (!venture) return;
    updateVenture(selectedVentureId, {
      timelineSide: venture.timelineSide === 'above' ? 'below' : 'above',
    });
  };

  const fitPortfolio = () => {
    const layout = calculateLayout(ventures);
    const positions = Array.from(layout.positions.values());
    if (positions.length === 0) return;
    const minX = Math.min(...positions.map((position) => position.x));
    const maxX = Math.max(...positions.map((position) => position.x + position.width));
    const minY = Math.min(...positions.map((position) => position.y));
    const maxY = Math.max(...positions.map((position) => position.y + position.height));
    onNavigateToTarget?.((minX + maxX) / 2, (minY + maxY) / 2, 0.82);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Vignette overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(5,3,3,0.75) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      <ToastContainer />

      <KeyboardShortcuts
        onNewVenture={() => setIsNewVentureOpen(true)}
        onLogEvent={() => setIsEventLogOpen(true)}
        onModify={() => selectedVentureId && setIsModifyPanelOpen(true)}
        onFocus={focusSelectedVenture}
        onList={() => setIsLeftPanelCollapsed(false)}
        onReview={() => setIsReviewOpen(true)}
        onHelp={() => setIsHelpOpen(true)}
        onTaskCanvas={() => setIsTaskCanvasOpen(true)}
        onFlipSelected={flipSelectedVenture}
        onNavigatePrev={() => {}}
        onNavigateNext={() => {}}
      />

      {/* Header - fixed at top */}
      <TopBar
        currentYear={currentYear}
        onYearChange={setCurrentYear}
        onNewVenture={() => setIsNewVentureOpen(true)}
        onTaskCanvas={() => setIsTaskCanvasOpen(true)}
        onHelpClick={() => setIsHelpOpen(true)}
        onFitClick={fitPortfolio}
        zoomLevel={zoomLevel * 100}
      />

      {/* Main content area - flexbox row */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', width: '100%' }}>
        {/* Left Panel - fixed width */}
        <LeftPanel
          userName="Founder"
          ventures={ventures}
          selectedVentureId={selectedVentureId}
          onSelectVenture={(id) => useStore.setState({ selectedVentureId: id })}
          collapsed={isLeftPanelCollapsed}
          onToggleCollapsed={() => setIsLeftPanelCollapsed((value) => !value)}
        />

        {/* Canvas - flex to fill remaining space */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <PixiApp
            onNodeDoubleClick={(ventureId) => {
              useStore.setState({ selectedVentureId: ventureId });
              setIsModifyPanelOpen(true);
            }}
            onNewVenture={() => setIsNewVentureOpen(true)}
            onHelpToggle={() => setIsHelpOpen(!isHelpOpen)}
            onListToggle={() => setIsLeftPanelCollapsed((value) => !value)}
            onStatsToggle={() => setIsReviewOpen(!isReviewOpen)}
            taskTopologyVentureId={isTaskTopologyOpen ? selectedVentureId : null}
          />
        </div>

        {/* Right Panel - fixed width */}
        <RightPanel
          ventures={ventures}
          collapsed={isRightPanelCollapsed}
          onToggleCollapsed={() => setIsRightPanelCollapsed((value) => !value)}
        />
      </div>

      {/* Toolbar - floating */}
      <Toolbar
        onGenerateClick={() => setIsNewVentureOpen(true)}
        onModifyClick={() => selectedVentureId && setIsModifyPanelOpen(true)}
        onPreviewClick={focusSelectedVenture}
        onAxisClick={() => {
          window.dispatchEvent(new CustomEvent('flash-year-watermark', { detail: { year: currentYear } }));
          useStore.getState().onNavigateToYear?.(currentYear);
        }}
        onLogEventClick={() => setIsEventLogOpen(true)}
        onReviewClick={() => setIsReviewOpen(true)}
        onListClick={() => setIsLeftPanelCollapsed(false)}
        onHelpClick={() => setIsHelpOpen(true)}
        onTaskCanvasClick={() => setIsTaskTopologyOpen((value) => !value)}
        onFlipSelectedClick={flipSelectedVenture}
      />

      {/* Modals and overlays */}

      {/* Modals and overlays */}
      <NewVentureModal
        isOpen={isNewVentureOpen}
        onClose={() => setIsNewVentureOpen(false)}
        onSave={(venture) => {
          addVenture({
            id: Math.random().toString(36).slice(2),
            name: venture.name,
            description: venture.description || '',
            industry: venture.industry || '',
            startedDate: venture.startDate,
            status: (venture.status as 'active' | 'stealth' | 'graveyard' | 'pivot' | 'paused' | 'shutdown' | 'exited' | 'archived' | 'acquired' | 'failed') || 'active',
            logoUrl: venture.logoUrl,
            burnRate: 0,
            runwayMonths: 0,
            collaborators: [],
            healthScore: 55,
            mrrTrend: [1, 2, 3, 4, 5, 6, 7],
            lastSyncedAt: new Date().toISOString(),
            source: 'manual',
          });
          setIsNewVentureOpen(false);
        }}
      />

      <EventLogPanel
        isOpen={isEventLogOpen}
        onClose={() => setIsEventLogOpen(false)}
        onSave={(event) => {
          if (event.ventureId) {
            addEvent(event.ventureId, {
              date: event.date,
              type: event.type,
              title: event.title,
              notes: event.notes,
              mood: event.mood,
              impact: event.impact,
              lessonLearned: event.lessonLearned,
              whatYouddoDifferently: event.whatYouddoDifferently,
              linkUrl: event.linkUrl,
            });
          }
          setIsEventLogOpen(false);
        }}
        ventures={ventures}
        selectedVentureId={selectedVentureId}
      />

      {isModifyPanelOpen && (
        <ModifyPanel
          ventureId={selectedVentureId}
          onClose={() => setIsModifyPanelOpen(false)}
        />
      )}

      {isReviewOpen && (
        <PatternsScreen onClose={() => setIsReviewOpen(false)} />
      )}

      <KeyboardHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <DataManager isOpen={isDataManagerOpen} onClose={() => setIsDataManagerOpen(false)} />
      <TaskCanvas isOpen={isTaskCanvasOpen} onClose={() => setIsTaskCanvasOpen(false)} ventureId={selectedVentureId} />
    </div>
  );
}
