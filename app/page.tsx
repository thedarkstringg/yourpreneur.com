'use client';

import { useState } from 'react';
import PixiApp from './components/canvas/PixiApp';
import Toolbar from './components/ui/Toolbar';
import ModifyPanel from './components/ui/ModifyPanel';
import NewVentureDialog from './components/ui/NewVentureDialog';
import KeyboardHelp from './components/ui/KeyboardHelp';
import VentureList from './components/ui/VentureList';
import DataManager from './components/ui/DataManager';
import Statistics from './components/ui/Statistics';
import { useStore } from '@/lib/useStore';

export default function Home() {
  const [isModifyPanelOpen, setIsModifyPanelOpen] = useState(false);
  const [isNewVentureOpen, setIsNewVentureOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { selectedVentureId } = useStore();

  // Open modify panel when M is pressed or Modify button clicked
  const handleOpenModifyPanel = (ventureId: string) => {
    useStore.setState({ selectedVentureId: ventureId });
    setIsModifyPanelOpen(true);
  };

  // Handle new venture (open dialog)
  const handleNewVenture = () => {
    setIsNewVentureOpen(true);
  };

  // Handle preview mode toggle
  const handlePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Handle venture selection from list
  const handleSelectVenture = (id: string) => {
    useStore.setState({ selectedVentureId: id });
  };

  return (
    <>
      <PixiApp
        onNodeDoubleClick={handleOpenModifyPanel}
        onNewVenture={handleNewVenture}
        onPreviewMode={handlePreviewMode}
        onHelpToggle={() => setIsHelpOpen(!isHelpOpen)}
        onListToggle={() => setIsListOpen(!isListOpen)}
        onStatsToggle={() => setIsStatsOpen(!isStatsOpen)}
      />
      <Toolbar
        onModifyClick={() => selectedVentureId && setIsModifyPanelOpen(true)}
        onGenerateClick={handleNewVenture}
        onPreviewClick={handlePreviewMode}
        onHelpClick={() => setIsHelpOpen(!isHelpOpen)}
        onListClick={() => setIsListOpen(!isListOpen)}
        onSettingsClick={() => setIsDataManagerOpen(!isDataManagerOpen)}
        isPreviewMode={isPreviewMode}
      />
      {!isPreviewMode && (
        <>
          <ModifyPanel
            ventureId={selectedVentureId}
            onClose={() => setIsModifyPanelOpen(false)}
          />
          <NewVentureDialog
            isOpen={isNewVentureOpen}
            onClose={() => setIsNewVentureOpen(false)}
          />
        </>
      )}
      <KeyboardHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <VentureList
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        onSelectVenture={handleSelectVenture}
      />
      <DataManager isOpen={isDataManagerOpen} onClose={() => setIsDataManagerOpen(false)} />
      <Statistics isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
    </>
  );
}
