'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiGet, apiPost } from '../../../lib/api';
import { fromJakartaInputValue, toJakartaInputValue } from '../../../lib/utils';

function createEmptyEvent() {
  return {
    title: '',
    slug: '',
    summary: '',
    description: '',
    location: '',
    starts_at: toJakartaInputValue(new Date().toISOString()),
    ends_at: '',
    hero_image_url: '',
    is_published: false,
  };
}

export default function EventsPage() {
  const { data, error, isLoading, mutate } = useSWR('/events', () => apiGet('/events'));
  const events = useMemo(() => data?.events ?? [], [data]);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyEvent());
  const [editingId, setEditingId] = useState(null);

  function openCreate() {
    setDraft(createEmptyEvent());
    setEditingId(null);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(event) {
    setDraft({
      ...event,
      summary: event.summary ?? '',
      description: event.description ?? '',
      location: event.location ?? '',
      hero_image_url: event.hero_image_url ?? '',
      starts_at: toJakartaInputValue(event.starts_at),
      ends_at: toJakartaInputValue(event.ends_at),
    });
    setEditingId(event.id);
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
      id: editingId ?? undefined,
      title: draft.title,
      slug: draft.slug,
      summary: draft.summary || null,
      description: draft.description || null,
      location: draft.location || null,
      hero_image_url: draft.hero_image_url || null,
      is_published: draft.is_published,
      starts_at: fromJakartaInputValue(draft.starts_at) ?? new Date().toISOString(),
      ends_at: draft.ends_at ? fromJakartaInputValue(draft.ends_at) : null,
    };

    try {
      await apiPost('/events', payload);
      await mutate();
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(eventRecord) {
    try {
      await apiPost('/events', {
        ...eventRecord,
        summary: eventRecord.summary ?? null,
        description: eventRecord.description ?? null,
        location: eventRecord.location ?? null,
        hero_image_url: eventRecord.hero_image_url ?? null,
        starts_at: eventRecord.starts_at,
        ends_at: eventRecord.ends_at,
        is_published: !eventRecord.is_published,
      });
      await mutate();
    } catch (err) {
      alert(err.message || 'Failed to update publish status');
    }
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Events</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Manage upcoming events. Toggle publish status to control visibility on the site.
          </p>
        </div>
        <button className="button" onClick={openCreate}>
          New event
        </button>
      </header>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading events…</p>
      ) : events.length === 0 ? (
        <div className="empty-state">No events yet. Create your first event.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Starts</th>
              <th>Ends</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((eventItem) => (
              <tr key={eventItem.id}>
                <td>
                  <div className="stack">
                    <strong>{eventItem.title}</strong>
                    <span style={{ color: '#666', fontSize: '0.875rem' }}>{eventItem.slug}</span>
                  </div>
                </td>
                <td>{new Date(eventItem.starts_at).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}</td>
                <td>
                  {eventItem.ends_at
                    ? new Date(eventItem.ends_at).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
                    : '—'}
                </td>
                <td>
                  <span className="badge" style={{ background: eventItem.is_published ? '#dcfce7' : '#fee2e2', color: eventItem.is_published ? '#166534' : '#7f1d1d' }}>
                    {eventItem.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="button secondary" onClick={() => openEdit(eventItem)}>
                      Edit
                    </button>
                    <button className="button" onClick={() => togglePublish(eventItem)}>
                      {eventItem.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <header className="stack" style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{editingId ? 'Edit event' : 'Create event'}</h2>
              <p style={{ margin: 0, color: '#555' }}>
                Fill in the event details. Times are saved in Jakarta time (UTC+7).
              </p>
            </header>
            {formError ? <div className="alert">{formError}</div> : null}
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={draft.title}
                    onChange={(event) => updateField('title', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="slug">Slug</label>
                  <input
                    id="slug"
                    type="text"
                    required
                    value={draft.slug}
                    onChange={(event) => updateField('slug', event.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="summary">Summary</label>
                <textarea
                  id="summary"
                  rows={2}
                  value={draft.summary}
                  onChange={(event) => updateField('summary', event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  value={draft.description}
                  onChange={(event) => updateField('description', event.target.value)}
                />
              </div>

              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={draft.location}
                    onChange={(event) => updateField('location', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="hero">Hero image URL</label>
                  <input
                    id="hero"
                    type="url"
                    value={draft.hero_image_url}
                    onChange={(event) => updateField('hero_image_url', event.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="starts_at">Starts at</label>
                  <input
                    id="starts_at"
                    type="datetime-local"
                    required
                    value={draft.starts_at}
                    onChange={(event) => updateField('starts_at', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="ends_at">Ends at</label>
                  <input
                    id="ends_at"
                    type="datetime-local"
                    value={draft.ends_at}
                    onChange={(event) => updateField('ends_at', event.target.value)}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={draft.is_published}
                  onChange={(event) => updateField('is_published', event.target.checked)}
                />
                <span>Published</span>
              </label>

              <div className="actions">
                <button type="button" className="button secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={saving}>
                  {saving ? 'Saving…' : 'Save event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
