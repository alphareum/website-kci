'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { MediaLibraryPicker } from '../../../components/admin/MediaLibraryPicker';
import { apiDelete, apiGet, apiPost } from '../../../lib/api';

function createEmptyPost() {
  return {
    title: '',
    slug: '',
    summary: '',
    body: '',
    cover_image_url: '',
    published_at: '',
    is_published: false,
  };
}

function toDateInputValue(isoString) {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value) {
  if (!value) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

export default function PostsAdminPage() {
  const key = '/posts?includeDrafts=1';
  const { data, error, isLoading, mutate } = useSWR(key, () => apiGet(key));
  const posts = useMemo(() => data?.posts ?? [], [data]);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyPost());
  const [editingId, setEditingId] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function openCreate() {
    setDraft(createEmptyPost());
    setEditingId(null);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(post) {
    setDraft({
      ...post,
      summary: post.summary ?? '',
      body: post.body ?? '',
      cover_image_url: post.cover_image_url ?? '',
      published_at: toDateInputValue(post.published_at),
    });
    setEditingId(post.id);
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

  function handleMediaSelect(item) {
    if (!item) {
      return;
    }
    updateField('cover_image_url', item.asset_url || '');
    setPickerOpen(false);
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
      body: draft.body,
      cover_image_url: draft.cover_image_url || null,
      is_published: draft.is_published,
      published_at: fromDateInputValue(draft.published_at),
    };

    try {
      await apiPost('/posts', payload);
      await mutate();
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(postRecord) {
    const nextPublished = !postRecord.is_published;
    const nextPublishedAt = nextPublished
      ? postRecord.published_at || new Date().toISOString()
      : postRecord.published_at || null;

    try {
      await apiPost('/posts', {
        id: postRecord.id,
        title: postRecord.title,
        slug: postRecord.slug,
        summary: postRecord.summary ?? null,
        body: postRecord.body,
        cover_image_url: postRecord.cover_image_url ?? null,
        is_published: nextPublished,
        published_at: nextPublishedAt,
      });
      await mutate();
    } catch (err) {
      alert(err.message || 'Failed to update publish status');
    }
  }

  async function deletePost(postRecord) {
    const confirmed = window.confirm(`Delete post "${postRecord.title}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }
    setDeletingId(postRecord.id);
    try {
      await apiDelete(`/posts/${postRecord.id}`);
      await mutate();
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Posts</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Create and manage blog entries. Publish posts to make them visible on the public blog.
          </p>
        </div>
        <button className="button" onClick={openCreate}>
          New post
        </button>
      </header>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading posts…</p>
      ) : posts.length === 0 ? (
        <div className="empty-state">No posts yet. Start by creating a new post.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Published on</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="stack">
                    <strong>{post.title}</strong>
                    <span style={{ color: '#666', fontSize: '0.875rem' }}>{post.slug}</span>
                  </div>
                </td>
                <td>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', { timeZone: 'Asia/Jakarta' })
                    : '—'}
                </td>
                <td>
                  <span
                    className="badge"
                    style={{
                      background: post.is_published ? '#dcfce7' : '#fee2e2',
                      color: post.is_published ? '#166534' : '#7f1d1d',
                    }}
                  >
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="button secondary" onClick={() => openEdit(post)}>
                      Edit
                    </button>
                    <button className="button" onClick={() => togglePublish(post)}>
                      {post.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => deletePost(post)}
                      disabled={deletingId === post.id}
                    >
                      {deletingId === post.id ? 'Deleting…' : 'Delete'}
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
          <div className="modal" style={{ maxWidth: '720px' }}>
            <header className="stack" style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{editingId ? 'Edit post' : 'Create post'}</h2>
              <p style={{ margin: 0, color: '#555' }}>
                Provide the post details below. The publish date helps order posts on the public blog.
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
                  rows={3}
                  value={draft.summary}
                  onChange={(event) => updateField('summary', event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="body">Body</label>
                <textarea
                  id="body"
                  rows={10}
                  required
                  value={draft.body}
                  onChange={(event) => updateField('body', event.target.value)}
                />
              </div>

              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="published_at">Publish date</label>
                  <input
                    id="published_at"
                    type="date"
                    value={draft.published_at}
                    onChange={(event) => updateField('published_at', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="cover_image">Cover image URL</label>
                  <div className="stack" style={{ gap: '0.5rem' }}>
                    <input
                      id="cover_image"
                      type="url"
                      value={draft.cover_image_url}
                      onChange={(event) => updateField('cover_image_url', event.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" className="button secondary" onClick={() => setPickerOpen(true)}>
                        Choose from media library
                      </button>
                      {draft.cover_image_url ? (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => updateField('cover_image_url', '')}
                        >
                          Remove image
                        </button>
                      ) : null}
                    </div>
                    {draft.cover_image_url ? (
                      <div
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          width: '100%',
                          maxWidth: '320px',
                        }}
                      >
                        <img
                          src={draft.cover_image_url}
                          alt="Selected cover"
                          style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                        />
                      </div>
                    ) : null}
                  </div>
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
                  {saving ? 'Saving…' : 'Save post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <MediaLibraryPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleMediaSelect} />
    </section>
  );
}
