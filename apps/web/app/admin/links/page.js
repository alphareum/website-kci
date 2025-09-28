'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiDelete, apiGet, apiPost } from '../../../lib/api';
import { sortByOrder } from '../../../lib/utils';

const CATEGORIES = [
  { value: 'primary', label: 'Primary navigation' },
  { value: 'secondary', label: 'Secondary navigation' },
  { value: 'social', label: 'Social links' },
];

function createEmptyLink() {
  return {
    id: null,
    label: '',
    url: '',
    category: 'primary',
    order: 0,
    is_active: true,
  };
}

export default function LinksPage() {
  const { data, error, isLoading, mutate } = useSWR('/links', () => apiGet('/links'));
  const links = useMemo(() => data?.links ?? [], [data]);

  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyLink());
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  function openCreate() {
    setDraft(createEmptyLink());
    setFormError('');
    setShowModal(true);
  }

  function openEdit(link) {
    setDraft({ ...link });
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
      label: draft.label,
      url: draft.url,
      category: draft.category,
      order: Number(draft.order) || 0,
      is_active: Boolean(draft.is_active),
    };

    try {
      await apiPost('/links', payload);
      await mutate();
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to save link');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(link) {
    if (!window.confirm(`Delete link "${link.label}"?`)) {
      return;
    }
    try {
      await apiDelete(`/links/${link.id}`);
      await mutate();
    } catch (err) {
      alert(err.message || 'Failed to delete link');
    }
  }

  async function reorderLink(link, direction) {
    const categoryLinks = sortByOrder(links.filter((item) => item.category === link.category));
    const index = categoryLinks.findIndex((item) => item.id === link.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoryLinks.length) {
      return;
    }
    const swapped = [...categoryLinks];
    const [removed] = swapped.splice(index, 1);
    swapped.splice(targetIndex, 0, removed);

    setReordering(true);
    try {
      await Promise.all(
        swapped.map((item, position) =>
          apiPost('/links', {
            ...item,
            order: position,
          })
        )
      );
      await mutate();
    } catch (err) {
      alert(err.message || 'Failed to update order');
    } finally {
      setReordering(false);
    }
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Navigation & Links</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Organise menu items and social links. Use the arrow buttons to reorder items within their group.
          </p>
        </div>
        <button className="button" onClick={openCreate}>
          New link
        </button>
      </header>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading links…</p>
      ) : links.length === 0 ? (
        <div className="empty-state">No links yet. Add your first navigation item.</div>
      ) : (
        <div className="stack">
          {CATEGORIES.map((category) => {
            const items = sortByOrder(links.filter((link) => link.category === category.value));
            return (
              <div key={category.value} className="card">
                <header className="action-bar" style={{ marginBottom: '0.5rem' }}>
                  <h2 style={{ margin: 0 }}>{category.label}</h2>
                </header>
                {items.length === 0 ? (
                  <p style={{ margin: 0, color: '#666' }}>No links in this group.</p>
                ) : (
                  <div className="stack">
                    {items.map((link) => (
                      <div
                        key={link.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          gap: '1rem',
                          alignItems: 'center',
                          border: '1px solid #eee',
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1rem',
                          background: '#fff',
                        }}
                      >
                        <div className="stack">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong>{link.label}</strong>
                            <span className="badge" style={{ background: link.is_active ? '#dcfce7' : '#fee2e2', color: link.is_active ? '#166534' : '#7f1d1d' }}>
                              {link.is_active ? 'Active' : 'Hidden'}
                            </span>
                          </div>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            {link.url}
                          </a>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="button secondary"
                            onClick={() => reorderLink(link, 'up')}
                            disabled={reordering}
                          >
                            ↑
                          </button>
                          <button
                            className="button secondary"
                            onClick={() => reorderLink(link, 'down')}
                            disabled={reordering}
                          >
                            ↓
                          </button>
                          <button className="button secondary" onClick={() => openEdit(link)}>
                            Edit
                          </button>
                          <button className="button" onClick={() => handleDelete(link)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <header className="stack" style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{draft.id ? 'Edit link' : 'Add link'}</h2>
              <p style={{ margin: 0, color: '#555' }}>
                Choose the destination, placement, and visibility for this navigation item.
              </p>
            </header>
            {formError ? <div className="alert">{formError}</div> : null}
            <form className="stack" onSubmit={handleSubmit}>
              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="link-label">Label</label>
                  <input
                    id="link-label"
                    type="text"
                    required
                    value={draft.label}
                    onChange={(event) => updateField('label', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="link-url">URL</label>
                  <input
                    id="link-url"
                    type="url"
                    required
                    value={draft.url}
                    onChange={(event) => updateField('url', event.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="link-category">Category</label>
                  <select
                    id="link-category"
                    value={draft.category}
                    onChange={(event) => updateField('category', event.target.value)}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="link-order">Order</label>
                  <input
                    id="link-order"
                    type="number"
                    min="0"
                    value={draft.order}
                    onChange={(event) => updateField('order', Number(event.target.value))}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={draft.is_active}
                  onChange={(event) => updateField('is_active', event.target.checked)}
                />
                <span>Visible</span>
              </label>

              <div className="actions">
                <button type="button" className="button secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={saving}>
                  {saving ? 'Saving…' : 'Save link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
