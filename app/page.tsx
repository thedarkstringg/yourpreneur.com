'use client';

import { useState, useCallback } from 'react';
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
import VentureList from './components/ui/VentureList';
import DataManager from './components/ui/DataManager';
import Statistics from './components/ui/Statistics';
import PatternsScreen from './components/ui/PatternsScreen';
import { useStore } from '@/lib/useStore';
import { useEventManagement } from '@/lib/useEventManagement';

export default function Home() {
  const [isModifyPanelOpen, setIsModifyPanelOpen] = useState(false);
  const [isNewVentureOpen, setIsNewVentureOpen] = useState(false);
  const [isEventLogOpen, setIsEventLogOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isPatternsOpen, setIsPatternsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2024);
  const [zoomLevel, setZoomLevel] = useState(100);

  const { selectedVentureId, ventures, addVenture } = useStore();
  const { addEvent } = useEventManagement();

  return (
    <>
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
        onFocus={() => {}}
        onList={() => setIsPortfolioOpen(true)}
        onInsights={() => setIsPatternsOpen(true)}
        onNavigatePrev={() => {}}
        onNavigateNext={() => {}}
      />

      <TopBar
        currentYear={currentYear}
        onYearChange={setCurrentYear}
        onNewVenture={() => setIsNewVentureOpen(true)}
        zoomLevel={zoomLevel}
      />

      <LeftPanel
        userName="Founder"
        ventures={ventures}
        selectedVentureId={selectedVentureId}
        onSelectVenture={(id) => useStore.setState({ selectedVentureId: id })}
      />

      <RightPanel ventures={ventures} />

      <PixiApp
        onNodeDoubleClick={(ventureId) => {
          useStore.setState({ selectedVentureId: ventureId });
          setIsModifyPanelOpen(true);
        }}
        onNewVenture={() => setIsNewVentureOpen(true)}
        onHelpToggle={() => setIsHelpOpen(!isHelpOpen)}
        onListToggle={() => setIsPortfolioOpen(!isPortfolioOpen)}
        onStatsToggle={() => setIsPatternsOpen(!isPatternsOpen)}
      />

      <Toolbar
        onGenerateClick={() => setIsNewVentureOpen(true)}
        onModifyClick={() => selectedVentureId && setIsModifyPanelOpen(true)}
        onPreviewClick={() => {}}
        onPatternsClick={() => setIsPatternsOpen(true)}
        onListClick={() => setIsPortfolioOpen(true)}
        onHelpClick={() => setIsHelpOpen(true)}
      />

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
            status: (venture.status as 'active' | 'pivot' | 'paused' | 'shutdown' | 'exited') || 'active',
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

      {isPatternsOpen && (
        <PatternsScreen onClose={() => setIsPatternsOpen(false)} />
      )}

      <KeyboardHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <VentureList
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        onSelectVenture={(id) => useStore.setState({ selectedVentureId: id })}
      />

      <DataManager isOpen={isDataManagerOpen} onClose={() => setIsDataManagerOpen(false)} />
    </>
  );
}
