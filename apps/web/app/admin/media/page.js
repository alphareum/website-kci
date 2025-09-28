'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import MetadataEditor from '../../../components/MetadataEditor';
import { apiGet, apiPost } from '../../../lib/api';

const MEDIA_TYPES = [
  { type: 'gallery', label: 'Gallery' },
  { type: 'testimonial', label: 'Testimonials' },
  { type: 'partner', label: 'Partners' },
];

function createEmptyMedia(activeType) {
  return {
    id: null,
    type: activeType,
    title: '',
    description: '',
    asset_url: '',
    metadata: {},
  };
}

export default function MediaPage() {
  const [activeType, setActiveType] = useState(MEDIA_TYPES[0].type);
  const key = `/media/${activeType}`;
  const { data, error, isLoading, mutate } = useSWR(key, () => apiGet(key));
  const items = useMemo(() => data?.items ?? [], [data]);

  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyMedia(activeType));
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function changeType(type) {
    setActiveType(type);
    setShowModal(false);
    setDraft(createEmptyMedia(type));
    setFormError('');
  }

  function openCreate() {
    setDraft(createEmptyMedia(activeType));
    setFormError('');
    setShowModal(true);
  }

  function openEdit(item) {
    setDraft({
      id: item.id,
      type: item.type,
      title: item.title ?? '',
      description: item.description ?? '',
      asset_url: item.asset_url ?? '',
      metadata: item.metadata ?? {},
    });
    setFormError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSaving(false);
    setFormError('');
  }

  function updateField(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = {
      id: draft.id ?? undefined,
      type: draft.type,
      title: draft.title || null,
      description: draft.description || null,
      asset_url: draft.asset_url,
      metadata: Object.keys(draft.metadata || {}).length ? draft.metadata : null,
    };

    try {
      await apiPost('/media', payload);
      await mutate();
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to save media item');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Media Library</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Upload links for gallery images, testimonials, and partner logos.
          </p>
        </div>
        <button className="button" onClick={openCreate}>
          New asset
        </button>
      </header>

      <div className="tabs" role="tablist">
        {MEDIA_TYPES.map((item) => (
          <button
            key={item.type}
            type="button"
            role="tab"
            aria-selected={activeType === item.type}
            className={`tab ${activeType === item.type ? 'active' : ''}`}
            onClick={() => changeType(item.type)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading media…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">No media yet. Add your first item.</div>
      ) : (
        <div className="list">
          {items.map((item) => (
            <div key={item.id} className="card">
              <div className="stack">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>{item.title || 'Untitled'}</h2>
                    <p style={{ margin: '0.25rem 0', color: '#555' }}>{item.description || '—'}</p>
                    <a href={item.asset_url} target="_blank" rel="noreferrer">
                      {item.asset_url}
                    </a>
                  </div>
                  <button className="button secondary" onClick={() => openEdit(item)}>
                    Edit
                  </button>
                </div>
                {item.metadata ? (
                  <div style={{ fontSize: '0.85rem', color: '#555' }}>
                    <strong>Metadata:</strong>{' '}
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <span key={key} style={{ marginRight: '0.75rem' }}>
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <header className="stack" style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{draft.id ? 'Edit asset' : 'Add asset'}</h2>
              <p style={{ margin: 0, color: '#555' }}>
                Provide the public URL for the media and optional metadata (alt text, credits, etc.).
              </p>
            </header>
            {formError ? <div className="alert">{formError}</div> : null}
            <form className="stack" onSubmit={handleSubmit}>
              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="media-title">Title</label>
                  <input
                    id="media-title"
                    type="text"
                    value={draft.title}
                    onChange={(event) => updateField('title', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="media-type">Type</label>
                  <select
                    id="media-type"
                    value={draft.type}
                    onChange={(event) => updateField('type', event.target.value)}
                  >
                    {MEDIA_TYPES.map((option) => (
                      <option key={option.type} value={option.type}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="media-description">Description</label>
                <textarea
                  id="media-description"
                  rows={2}
                  value={draft.description}
                  onChange={(event) => updateField('description', event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="media-url">Asset URL</label>
                <input
                  id="media-url"
                  type="url"
                  required
                  value={draft.asset_url}
                  onChange={(event) => updateField('asset_url', event.target.value)}
                />
              </div>

              <MetadataEditor value={draft.metadata} onChange={(metadata) => updateField('metadata', metadata)} />

              <div className="actions">
                <button type="button" className="button secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={saving}>
                  {saving ? 'Saving…' : 'Save asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
