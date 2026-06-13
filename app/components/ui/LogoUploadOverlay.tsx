'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { useToasts } from './Toast';
import { colors, spacing, radius, typography, transitions } from '@/styles/tokens';

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
        background: colors.background.surface,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.lg,
        padding: spacing.lg,
        width: '200px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
        zIndex: 600,
        animation: 'logoUploadOpen 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        fontFamily: typography.family.base,
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
          border: `1px dashed ${colors.border.default}`,
          borderRadius: radius.md,
          background: isDragOver ? colors.background.elevated : colors.background.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          margin: `0 auto ${spacing.md}px`,
          transition: `all ${transitions.fast}`,
          flexDirection: 'column',
          gap: spacing.xs,
        }}
        onClick={handleBrowse}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.border.strong;
          (e.currentTarget as HTMLElement).style.background = colors.background.elevated;
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.border.default;
          (e.currentTarget as HTMLElement).style.background = isDragOver ? colors.background.elevated : colors.background.surface;
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
              borderRadius: radius.sm,
            }}
          />
        ) : (
          <>
            <Upload size={20} strokeWidth={1.5} style={{ color: colors.text.secondary }} />
            <span style={{ fontSize: typography.size.xs, color: colors.text.tertiary }}>Drop logo here</span>
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
        <div style={{ textAlign: 'center', margin: `${spacing.sm}px 0`, fontSize: typography.size.xs, color: colors.text.disabled }}>
          or
        </div>
      )}

      {/* Browse Button */}
      {!previewSrc && (
        <button
          onClick={handleBrowse}
          style={{
            width: '100%',
            padding: spacing.xs,
            background: 'transparent',
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.sm,
            color: colors.text.secondary,
            cursor: 'pointer',
            fontSize: typography.size.xs,
            fontFamily: typography.family.base,
            transition: `all ${transitions.fast}`,
            marginBottom: spacing.md,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = colors.border.strong;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = colors.border.default;
            e.currentTarget.style.color = colors.text.secondary;
          }}
        >
          Browse files
        </button>
      )}

      {/* Actions */}
      {previewSrc && (
        <div style={{ display: 'flex', gap: spacing.xs - 2, marginTop: spacing.md }}>
          <button
            onClick={() => setPreview(null)}
            style={{
              flex: 1,
              padding: spacing.xs,
              background: 'transparent',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.sm,
              color: colors.text.secondary,
              cursor: 'pointer',
              fontSize: typography.size.xs,
              fontFamily: typography.family.base,
              transition: `all ${transitions.fast}`,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = colors.border.strong;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = colors.border.default;
            }}
          >
            <X size={12} style={{ margin: '0 auto' }} />
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: spacing.xs,
              background: colors.text.primary,
              border: 'none',
              borderRadius: radius.sm,
              color: colors.background.base,
              cursor: 'pointer',
              fontSize: typography.size.xs,
              fontFamily: typography.family.base,
              fontWeight: typography.weight.semibold,
              transition: `opacity ${transitions.fast}`,
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

