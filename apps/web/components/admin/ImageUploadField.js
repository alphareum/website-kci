'use client';

import { useCallback, useRef, useState } from 'react';
import { apiUpload } from '../../lib/api';

export function ImageUploadField({
  value,
  onChange,
  uploadType = 'media',
  disabled = false,
  helperText = "We'll host this image and return a reusable link.",
  ariaLabelledBy,
  ariaDescribedBy,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleUpload = useCallback(
    async (file) => {
      if (!file || disabled || uploading) {
        return;
      }

      setUploading(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', uploadType);

        const response = await apiUpload('/media/upload', formData);
        onChange(response.url);
      } catch (err) {
        setError(err.message || 'Failed to upload image');
      } finally {
        setUploading(false);
        setIsDragging(false);
        resetInput();
      }
    },
    [disabled, onChange, resetInput, uploadType, uploading],
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled || uploading) {
        return;
      }
      setIsDragging(false);
      const file = event.dataTransfer?.files?.[0];
      if (file) {
        void handleUpload(file);
      }
    },
    [disabled, handleUpload, uploading],
  );

  const handleDragEnter = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled && !uploading) {
        setIsDragging(true);
      }
    },
    [disabled, uploading],
  );

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const openFilePicker = useCallback(() => {
    if (disabled || uploading) {
      return;
    }
    fileInputRef.current?.click();
  }, [disabled, uploading]);

  const handleFileInputChange = useCallback(
    (event) => {
      const [file] = event.target.files || [];
      if (file) {
        void handleUpload(file);
      }
    },
    [handleUpload],
  );

  return (
    <div className="stack" style={{ gap: '0.5rem' }}>
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={disabled || uploading}
        aria-busy={uploading}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        style={{
          border: '2px dashed',
          borderColor: isDragging ? '#1f6feb' : '#d0d7de',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          textAlign: 'center',
          background: isDragging ? '#f0f6ff' : '#f9fafb',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          outline: 'none',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          disabled={disabled || uploading}
        />
        <div className="stack" style={{ gap: '0.25rem', alignItems: 'center' }}>
          <strong>{uploading ? 'Uploading…' : 'Drag and drop or click to upload an image'}</strong>
          <span style={{ fontSize: '0.85rem', color: '#555' }}>{helperText}</span>
          {value ? (
            <span
              style={{
                fontSize: '0.85rem',
                color: '#1f6feb',
                wordBreak: 'break-word',
              }}
            >
              Current URL: {value}
            </span>
          ) : null}
        </div>
      </div>
      {error ? <div className="alert">{error}</div> : null}
    </div>
  );
}
