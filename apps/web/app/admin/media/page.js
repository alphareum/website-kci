'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import MetadataEditor from '../../../components/MetadataEditor';
import { apiDelete, apiGet, apiPost, apiUpload } from '../../../lib/api';

const MEDIA_TYPES = [
  { type: 'gallery', label: 'Gallery' },
  { type: 'testimonial', label: 'Testimonials' },
  { type: 'partner', label: 'Partners' },
];

function isValidAssetUrl(value) {
  if (!value) {
    return false;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return false;
  }

  if (trimmedValue.startsWith('/')) {
    return true;
  }

  try {
    const parsed = new URL(trimmedValue);
    return Boolean(parsed.protocol) && Boolean(parsed.hostname);
  } catch (error) {
    return false;
  }
}

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
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [deletingId, setDeletingId] = useState(null);

  function resetUploadState() {
    setUploading(false);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function changeType(type) {
    setActiveType(type);
    setShowModal(false);
    setDraft(createEmptyMedia(type));
    setFormError('');
    resetUploadState();
  }

  function openCreate() {
    setDraft(createEmptyMedia(activeType));
    setFormError('');
    setShowModal(true);
    resetUploadState();
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
    resetUploadState();
  }

  function closeModal() {
    setShowModal(false);
    setSaving(false);
    setFormError('');
    resetUploadState();
  }

  function updateField(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  const applyUploadResult = useCallback((url, metadata = {}) => {
    setDraft((previous) => {
      const nextMetadata = { ...(previous.metadata || {}) };
      nextMetadata.uploaded_file_url = url;

      if (metadata.originalName) {
        nextMetadata.original_filename = metadata.originalName;
      }
      if (metadata.mimeType) {
        nextMetadata.upload_mime_type = metadata.mimeType;
      }
      if (typeof metadata.size !== 'undefined') {
        nextMetadata.upload_file_size = String(metadata.size);
      }
      if (metadata.storage) {
        nextMetadata.upload_storage = metadata.storage;
      }
      if (metadata.storageKey) {
        nextMetadata.upload_storage_key = metadata.storageKey;
      }
      if (metadata.publicUrl) {
        nextMetadata.upload_public_url = metadata.publicUrl;
      }
      if (metadata.folder) {
        nextMetadata.upload_folder = metadata.folder;
      }

      return {
        ...previous,
        asset_url: url,
        metadata: nextMetadata,
      };
    });
  }, []);

  const handleFileUpload = useCallback(
    async (file) => {
      if (!file || uploading) {
        return;
      }

      setUploading(true);
      setFormError('');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', draft.type);

        const response = await apiUpload('/media/upload', formData);
        applyUploadResult(response.url, response.metadata || {});
        setFormError('');
      } catch (err) {
        setFormError(err.message || 'Failed to upload file');
      } finally {
        setUploading(false);
        setIsDragging(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [applyUploadResult, draft.type, uploading]
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

  async function handleSubmit(event) {
    event.preventDefault();
    if (uploading) {
      setFormError('Please wait for the upload to finish before saving.');
      return;
    }

    const trimmedAssetUrl = draft.asset_url?.trim() ?? '';
    if (!trimmedAssetUrl) {
      setFormError('Please provide an asset URL or upload a file before saving.');
      return;
    }

    if (!isValidAssetUrl(trimmedAssetUrl)) {
      setFormError('Please provide a valid URL or uploaded file path (starting with /).');
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      id: draft.id ?? undefined,
      type: draft.type,
      title: draft.title || null,
      description: draft.description || null,
      asset_url: trimmedAssetUrl,
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

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Remove "${item.title || item.asset_url}" from the media library? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    setDeletingId(item.id);
    try {
      await apiDelete(`/media/${item.id}`);
      await mutate();
    } catch (err) {
      alert(err.message || 'Failed to delete media item');
    } finally {
      setDeletingId(null);
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
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}
                >
                  <div className="stack" style={{ gap: '0.35rem' }}>
                    <h2 style={{ margin: 0 }}>{item.title || 'Untitled'}</h2>
                    <p style={{ margin: 0, color: '#555' }}>{item.description || '—'}</p>
                    <a href={item.asset_url} target="_blank" rel="noreferrer">
                      {item.asset_url}
                    </a>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="button secondary" onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
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
                <label>Upload asset</label>
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
                  style={{
                    border: '2px dashed',
                    borderColor: isDragging ? '#1f6feb' : '#d0d7de',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: isDragging ? '#f0f6ff' : '#f9fafb',
                    cursor: uploading ? 'progress' : 'pointer',
                    opacity: uploading ? 0.75 : 1,
                    transition: 'all 0.2s ease-in-out',
                    outline: 'none',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                  <div className="stack" style={{ gap: '0.35rem', alignItems: 'center' }}>
                    <strong>{uploading ? 'Uploading…' : 'Drag and drop or click to select a file'}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>
                      We'll host this asset and provide a reusable public link.
                    </span>
                    {draft.asset_url ? (
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: '#1f6feb',
                          wordBreak: 'break-word',
                        }}
                      >
                        Current URL: {draft.asset_url}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#555' }}>
                  Prefer an external resource? Paste its link below.
                </span>
              </div>

              <div className="input-group">
                <label htmlFor="media-url">Asset URL</label>
                <input
                  id="media-url"
                  type="text"
                  value={draft.asset_url}
                  onChange={(event) => updateField('asset_url', event.target.value)}
                />
              </div>

              <MetadataEditor value={draft.metadata} onChange={(metadata) => updateField('metadata', metadata)} />

              <div className="actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={closeModal}
                  disabled={saving || uploading}
                >
                  Cancel
                </button>
                <button type="submit" className="button" disabled={saving || uploading}>
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
