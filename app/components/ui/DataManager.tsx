'use client';

export default function DataManager({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleExport = () => {
    const state = localStorage.getItem('ventures-app-state');
    if (!state) {
      alert('No data to export');
      return;
    }

    const dataStr = state;
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ventures-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement | null)?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const data = JSON.parse(String(event.target?.result || ''));
          localStorage.setItem('ventures-app-state', JSON.stringify(data));
          alert('Data imported successfully! Please refresh the page.');
          window.location.reload();
        } catch {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure? This will delete all ventures and events. This cannot be undone.'
      )
    ) {
      localStorage.removeItem('ventures-app-state');
      alert('All data cleared. Please refresh the page.');
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-950 border border-white/10 rounded-lg shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Data Management</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-mono text-white/80">EXPORT DATA</h3>
            <p className="text-xs text-white/60 mb-3">
              Download your ventures and events as a JSON file for backup or sharing.
            </p>
            <button
              onClick={handleExport}
              className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm font-mono hover:bg-green-500/15 transition-colors"
            >
              ↓ EXPORT AS JSON
            </button>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <h3 className="text-sm font-mono text-white/80">IMPORT DATA</h3>
            <p className="text-xs text-white/60 mb-3">
              Load a previously exported JSON file. This will replace all current data.
            </p>
            <button
              onClick={handleImport}
              className="w-full px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-sm font-mono hover:bg-blue-500/15 transition-colors"
            >
              ↑ IMPORT FROM JSON
            </button>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <h3 className="text-sm font-mono text-white/80">DANGER ZONE</h3>
            <p className="text-xs text-white/60 mb-3">
              Permanently delete all ventures and events. This action cannot be undone.
            </p>
            <button
              onClick={handleClearData}
              className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm font-mono hover:bg-red-500/15 transition-colors"
            >
              ✕ CLEAR ALL DATA
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded p-4 mt-4">
            <p className="text-xs text-white/60">
              💾 <strong>Note:</strong> Your data is automatically saved to browser storage. Use
              export to create backups or transfer data between devices.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white text-sm font-mono hover:bg-white/15 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
