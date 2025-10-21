'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { apiGet, apiUpload } from '../../lib/api';

const MEDIA_TYPES = [
  { value: 'testimonial', label: 'Testimonials' },
  { value: 'partner', label: 'Partners' },
  { value: 'gallery', label: 'Gallery' },
];

function MediaList({ type, onSelect }) {
  const { data, error, isLoading } = useSWR(`/media/${type}`, () => apiGet(`/media/${type}`));
  const items = useMemo(() => data?.items ?? [], [data]);

  if (error) {
    return <div className="alert">{error.message}</div>;
  }

  if (isLoading) {
    return <p>Loading media…</p>;
  }

  if (items.length === 0) {
    return <div className="empty-state">No media in this group yet.</div>;
  }

  return (
    <div className="stack">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="card"
          style={{ textAlign: 'left', display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: '1rem', alignItems: 'center' }}
          onClick={() => onSelect(item)}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e5e7eb',
            }}
          >
            {item.asset_url ? (
              <img src={item.asset_url} alt={item.title || 'Media asset'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#555' }}>No preview</span>
            )}
          </div>
          <div className="stack" style={{ gap: '0.35rem' }}>
            <strong>{item.title || 'Untitled asset'}</strong>
            {item.description ? <span style={{ color: '#555' }}>{item.description}</span> : null}
            <span style={{ fontSize: '0.85rem', color: '#1f6feb', wordBreak: 'break-all' }}>{item.asset_url}</span>
          </div>
          <span className="badge" style={{ justifySelf: 'flex-start' }}>
            Select
          </span>
        </button>
      ))}
    </div>
  );
}

function UploadSection({ type, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback(
    async (file) => {
      if (!file || uploading) {
        return;
      }

      setUploading(true);
      setUploadError('');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await apiUpload('/media/upload', formData);

        // Automatically select the uploaded file
        onUploadComplete({
          asset_url: response.url,
          metadata: response.metadata || {},
        });
      } catch (err) {
        setUploadError(err.message || 'Failed to upload file');
      } finally {
        setUploading(false);
        setIsDragging(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [type, uploading, onUploadComplete]
  );

  const handleFileInputChange = useCallback(
    (event) => {
      const [file] = event.target.files || [];
      if (!file) {
        return;
      }
      if (uploading) {
        return;
      }
      handleFileUpload(file);
    },
    [handleFileUpload, uploading]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (uploading) {
        return;
      }
      const file = event.dataTransfer?.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload, uploading]
  );

  const handleDragEnter = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!uploading) {
        setIsDragging(true);
      }
    },
    [uploading]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const openFilePicker = useCallback(() => {
    if (uploading) {
      return;
    }
    fileInputRef.current?.click();
  }, [uploading]);

  return (
    <div className="stack" style={{ gap: '1rem' }}>
      {uploadError && <div className="alert">{uploadError}</div>}

      <div
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: isDragging ? '2px dashed #1f6feb' : '2px dashed #d1d5db',
          borderRadius: '0.75rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          background: isDragging ? '#f0f6ff' : '#fafafa',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={openFilePicker}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1f6feb' }}>
              Uploading...
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
              Please wait while your file is being uploaded
            </p>
          </div>
        ) : (
          <div>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
              {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MediaLibraryPicker({ open, onClose, onSelect }) {
  const [mode, setMode] = useState('browse'); // 'browse' or 'upload'
  const [activeType, setActiveType] = useState(MEDIA_TYPES[0]?.value ?? 'testimonial');

  const handleUploadComplete = useCallback(
    (uploadedFile) => {
      onSelect(uploadedFile);
    },
    [onSelect]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: '720px' }}>
        <header className="stack" style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Choose media</h2>
          <p style={{ margin: 0, color: '#555' }}>
            {mode === 'browse'
              ? 'Pick an image from the media library or upload a new one.'
              : 'Upload a new image to use as profile photo.'}
          </p>
        </header>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            className={`button ${mode === 'browse' ? '' : 'secondary'}`}
            onClick={() => setMode('browse')}
          >
            Browse Library
          </button>
          <button
            type="button"
            className={`button ${mode === 'upload' ? '' : 'secondary'}`}
            onClick={() => setMode('upload')}
          >
            Upload New
          </button>
        </div>

        {mode === 'browse' ? (
          <>
            <div className="tabs" role="tablist" style={{ marginBottom: '1rem' }}>
              {MEDIA_TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={activeType === item.value}
                  className={`tab ${activeType === item.value ? 'active' : ''}`}
                  onClick={() => setActiveType(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <MediaList type={activeType} onSelect={(item) => onSelect(item)} />
            </div>
          </>
        ) : (
          <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            <UploadSection type={activeType} onUploadComplete={handleUploadComplete} />
          </div>
        )}

        <footer style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="button secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
