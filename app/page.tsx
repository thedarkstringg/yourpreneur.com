'use client';

import { useState } from 'react';
import PixiApp from './components/canvas/PixiApp';
import Toolbar from './components/ui/Toolbar';
import ModifyPanel from './components/ui/ModifyPanel';
import NewVentureDialog from './components/ui/NewVentureDialog';
import KeyboardHelp from './components/ui/KeyboardHelp';
import { useStore } from '@/lib/useStore';

export default function Home() {
  const [isModifyPanelOpen, setIsModifyPanelOpen] = useState(false);
  const [isNewVentureOpen, setIsNewVentureOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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

  return (
    <>
      <PixiApp
        onNodeDoubleClick={handleOpenModifyPanel}
        onNewVenture={handleNewVenture}
        onPreviewMode={handlePreviewMode}
        onHelpToggle={() => setIsHelpOpen(!isHelpOpen)}
      />
      <Toolbar
        onModifyClick={() => selectedVentureId && setIsModifyPanelOpen(true)}
        onGenerateClick={handleNewVenture}
        onPreviewClick={handlePreviewMode}
        onHelpClick={() => setIsHelpOpen(!isHelpOpen)}
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
    </>
  );
}
