'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface LogoUploadProps {
  onSave: (logoUrl: string) => void;
  onCancel: () => void;
  currentLogo?: string;
}

export default function LogoUploadPanel({ onSave, onCancel, currentLogo }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PNG, JPG, SVG, or WebP');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File must be smaller than 2MB');
      return;
    }

    setIsLoading(true);

    // Convert to base64
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
        {preview ? (
          <img
            src={preview}
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
      {!preview && (
        <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
          or
        </div>
      )}

      {/* Browse Button */}
      {!preview && (
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
            fontFamily: "'Space Grotesk', sans-serif",
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
      {preview && (
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
              fontFamily: "'Space Grotesk', sans-serif",
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
            onClick={() => {
              if (preview) {
                onSave(preview);
              }
            }}
            style={{
              flex: 1,
              padding: '6px',
              background: 'rgba(255,255,255,0.92)',
              border: 'none',
              borderRadius: '6px',
              color: '#080808',
              cursor: 'pointer',
              fontSize: '10px',
              fontFamily: "'Space Grotesk', sans-serif",
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
