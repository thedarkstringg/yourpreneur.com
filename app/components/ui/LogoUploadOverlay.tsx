'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { useToasts } from './Toast';

interface LogoUploadOverlayProps {
  ventureId?: string | null;
  onClose?: () => void;
}

export default function LogoUploadOverlay({ ventureId, onClose }: LogoUploadOverlayProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ventures, updateVenture } = useStore();
  const { addToast } = useToasts();

  const venture = ventures.find((v) => v.id === ventureId);

  if (!venture) return null;
  const previewSrc = preview ?? venture.logoUrl ?? null;

  const handleFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast('error', 'Please upload PNG, JPG, SVG, or WebP');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast('error', 'File must be smaller than 2MB');
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleSave = () => {
    if (preview && ventureId) {
      updateVenture(ventureId, { logoUrl: preview });
      addToast('success', 'Logo updated');
      onClose?.();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#0f0f0f',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '16px',
        width: '200px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
        zIndex: 600,
        animation: 'logoUploadOpen 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          width: '80px',
          height: '80px',
          border: '1px dashed rgba(255,255,255,0.15)',
          borderRadius: '8px',
          background: isDragOver ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          margin: '0 auto 12px',
          transition: 'all 150ms',
          flexDirection: 'column',
          gap: '4px',
        }}
        onClick={handleBrowse}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
          (e.currentTarget as HTMLElement).style.background = isDragOver ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)';
        }}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '6px',
            }}
          />
        ) : (
          <>
            <Upload size={20} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>Drop logo here</span>
          </>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Or Text */}
      {!previewSrc && (
        <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
          or
        </div>
      )}

      {/* Browse Button */}
      {!previewSrc && (
        <button
          onClick={handleBrowse}
          style={{
            width: '100%',
            padding: '6px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            fontSize: '10px',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 150ms',
            marginBottom: '12px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
          }}
        >
          Browse files
        </button>
      )}

      {/* Actions */}
      {previewSrc && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
          <button
            onClick={() => setPreview(null)}
            style={{
              flex: 1,
              padding: '6px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: '10px',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 150ms',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <X size={12} style={{ margin: '0 auto' }} />
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '6px',
              background: 'rgba(255,255,255,0.92)',
              border: 'none',
              borderRadius: '6px',
              color: '#080808',
              cursor: 'pointer',
              fontSize: '10px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              transition: 'opacity 150ms',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Check size={12} style={{ margin: '0 auto' }} />
          </button>
        </div>
      )}
    </div>
  );
}

