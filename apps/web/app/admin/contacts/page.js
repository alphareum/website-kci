'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { MediaLibraryPicker } from '../../../components/admin/MediaLibraryPicker';
import { apiDelete, apiGet, apiPost } from '../../../lib/api';

function createEmptyContact() {
  return {
    id: null,
    name: '',
    role: '',
    phone: '',
    whatsapp_url: '',
    photo_url: '',
  };
}

export default function ContactsPage() {
  const { data, error, isLoading, mutate } = useSWR('/contacts', () => apiGet('/contacts'));
  const contacts = useMemo(() => data?.contacts ?? [], [data]);

  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyContact());
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  function openCreate() {
    setDraft(createEmptyContact());
    setFormError('');
    setShowModal(true);
  }

  function openEdit(contact) {
    setDraft({
      id: contact.id,
      name: contact.name ?? '',
      role: contact.role ?? '',
      phone: contact.phone ?? '',
      whatsapp_url: contact.whatsapp_url ?? '',
      photo_url: contact.photo_url ?? '',
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
      name: draft.name.trim(),
      role: draft.role.trim() ? draft.role.trim() : null,
      phone: draft.phone.trim() ? draft.phone.trim() : null,
      whatsapp_url: draft.whatsapp_url.trim() ? draft.whatsapp_url.trim() : null,
      photo_url: draft.photo_url.trim() ? draft.photo_url.trim() : null,
    };

    try {
      await apiPost('/contacts', payload);
      await mutate();
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contact) {
    if (!window.confirm(`Delete contact "${contact.name}"?`)) {
      return;
    }
    try {
      await apiDelete(`/contacts/${contact.id}`);
      await mutate();
    } catch (err) {
      alert(err.message || 'Failed to delete contact');
    }
  }

  function openMediaPicker() {
    setPickerOpen(true);
  }

  function closeMediaPicker() {
    setPickerOpen(false);
  }

  function handleMediaSelect(item) {
    updateField('photo_url', item.asset_url || '');
    closeMediaPicker();
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Contacts</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Manage the contact cards displayed on the public site. Add WhatsApp links and phone numbers for quick access.
          </p>
        </div>
        <button className="button" onClick={openCreate}>
          New contact
        </button>
      </header>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <div className="empty-state">No contacts yet. Add your first team member.</div>
      ) : (
        <div className="stack">
          {contacts.map((contact) => (
            <div key={contact.id} className="card">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    color: '#555',
                  }}
                >
                  {contact.photo_url ? (
                    <img
                      src={contact.photo_url}
                      alt={contact.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span>No photo</span>
                  )}
                </div>
                <div className="stack" style={{ gap: '0.35rem' }}>
                  <div>
                    <strong>{contact.name}</strong>
                    {contact.role ? <span style={{ display: 'block', color: '#555' }}>{contact.role}</span> : null}
                  </div>
                  {contact.phone ? (
                    <span style={{ color: '#555' }}>
                      Phone: <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a>
                    </span>
                  ) : null}
                  {contact.whatsapp_url ? (
                    <a href={contact.whatsapp_url} target="_blank" rel="noreferrer" style={{ color: '#1f6feb' }}>
                      WhatsApp link
                    </a>
                  ) : null}
                </div>
                <div className="stack" style={{ gap: '0.5rem' }}>
                  <button className="button secondary" onClick={() => openEdit(contact)}>
                    Edit
                  </button>
                  <button className="button" onClick={() => handleDelete(contact)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <header className="stack" style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{draft.id ? 'Edit contact' : 'Add contact'}</h2>
              <p style={{ margin: 0, color: '#555' }}>
                Provide the contact details that should appear on the website. All fields except name are optional.
              </p>
            </header>
            {formError ? <div className="alert">{formError}</div> : null}
            <form className="stack" onSubmit={handleSubmit}>
              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={draft.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-role">Role / Title</label>
                  <input
                    id="contact-role"
                    type="text"
                    value={draft.role}
                    onChange={(event) => updateField('role', event.target.value)}
                    placeholder="e.g. Founder"
                  />
                </div>
              </div>

              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="contact-phone">Phone number</label>
                  <input
                    id="contact-phone"
                    type="text"
                    value={draft.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    placeholder="e.g. +62 812-1234-5678"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-whatsapp">WhatsApp link</label>
                  <input
                    id="contact-whatsapp"
                    type="url"
                    value={draft.whatsapp_url}
                    onChange={(event) => updateField('whatsapp_url', event.target.value)}
                    placeholder="https://wa.me/..."
                  />
                </div>
              </div>

              <div className="stack">
                <div className="input-group">
                  <label htmlFor="contact-photo">Photo URL</label>
                  <input
                    id="contact-photo"
                    type="url"
                    value={draft.photo_url}
                    onChange={(event) => updateField('photo_url', event.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div>
                  <button type="button" className="button secondary" onClick={openMediaPicker}>
                    Choose from media library
                  </button>
                </div>
                {draft.photo_url ? (
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <img
                      src={draft.photo_url}
                      alt={draft.name || 'Selected avatar'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : null}
              </div>

              <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="button secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={saving}>
                  {saving ? 'Saving…' : 'Save contact'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}

      <MediaLibraryPicker open={pickerOpen} onClose={closeMediaPicker} onSelect={handleMediaSelect} />
    </section>
  );
}
