'use client';

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiGet } from '../../lib/api';

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

export function MediaLibraryPicker({ open, onClose, onSelect }) {
  const [activeType, setActiveType] = useState(MEDIA_TYPES[0]?.value ?? 'testimonial');

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
            Pick an image from the media library. You can manage assets from the Media section of the admin panel.
          </p>
        </header>

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

        <footer style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="button secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
