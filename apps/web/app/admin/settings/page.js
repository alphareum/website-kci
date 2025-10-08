'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiGet, apiPost } from '../../../lib/api';

function createEmptySettings() {
  return {
    contact_email: '',
    contact_address: '',
    whatsapp_admin_label: '',
    whatsapp_admin_number: '',
    whatsapp_admin_link: '',
    whatsapp_founder_label: '',
    whatsapp_founder_number: '',
    whatsapp_founder_link: '',
    whatsapp_cofounder_label: '',
    whatsapp_cofounder_number: '',
    whatsapp_cofounder_link: '',
    social_facebook: '',
    social_instagram: '',
    social_tiktok: '',
    social_threads: '',
    social_youtube: '',
  };
}

export default function SettingsPage() {
  const { data, error, isLoading, mutate } = useSWR('/settings', () => apiGet('/settings'));
  const settings = useMemo(() => data?.settings ?? createEmptySettings(), [data]);

  const [draft, setDraft] = useState(() => settings);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Update draft when settings load
  useMemo(() => {
    if (settings) {
      setDraft(settings);
    }
  }, [settings]);

  function updateField(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = {
      contact_email: draft.contact_email?.trim() || null,
      contact_address: draft.contact_address?.trim() || null,
      whatsapp_admin_label: draft.whatsapp_admin_label?.trim() || null,
      whatsapp_admin_number: draft.whatsapp_admin_number?.trim() || null,
      whatsapp_admin_link: draft.whatsapp_admin_link?.trim() || null,
      whatsapp_founder_label: draft.whatsapp_founder_label?.trim() || null,
      whatsapp_founder_number: draft.whatsapp_founder_number?.trim() || null,
      whatsapp_founder_link: draft.whatsapp_founder_link?.trim() || null,
      whatsapp_cofounder_label: draft.whatsapp_cofounder_label?.trim() || null,
      whatsapp_cofounder_number: draft.whatsapp_cofounder_number?.trim() || null,
      whatsapp_cofounder_link: draft.whatsapp_cofounder_link?.trim() || null,
      social_facebook: draft.social_facebook?.trim() || null,
      social_instagram: draft.social_instagram?.trim() || null,
      social_tiktok: draft.social_tiktok?.trim() || null,
      social_threads: draft.social_threads?.trim() || null,
      social_youtube: draft.social_youtube?.trim() || null,
    };

    try {
      await apiPost('/settings', payload);
      await mutate();
      setFormError('');
      alert('Settings saved successfully!');
    } catch (err) {
      setFormError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Site Settings</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Manage contact information and social media links displayed on the website.
          </p>
        </div>
      </header>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading settings…</p>
      ) : (
        <div className="card">
          {formError ? <div className="alert">{formError}</div> : null}
          <form className="stack" onSubmit={handleSubmit} style={{ gap: '2rem' }}>
            {/* Contact Information Section */}
            <div className="stack">
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Contact Information</h2>
              <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
                This information appears in the "Informasi Kontak" section on the homepage.
              </p>

              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={draft.contact_email || ''}
                    onChange={(event) => updateField('contact_email', event.target.value)}
                    placeholder="info@kci-indonesia.org"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-address">Physical Address</label>
                  <input
                    id="contact-address"
                    type="text"
                    value={draft.contact_address || ''}
                    onChange={(event) => updateField('contact_address', event.target.value)}
                    placeholder="Jakarta, Indonesia"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Contacts Section */}
            <div className="stack">
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>WhatsApp Contacts</h2>
              <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
                Configure up to 3 WhatsApp contact cards. Leave fields empty to hide a contact.
              </p>

              {/* WhatsApp Admin */}
              <div className="stack" style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>WhatsApp Admin</h3>
                <div className="form-grid three-col">
                  <div className="input-group">
                    <label htmlFor="wa-admin-label">Label</label>
                    <input
                      id="wa-admin-label"
                      type="text"
                      value={draft.whatsapp_admin_label || ''}
                      onChange={(event) => updateField('whatsapp_admin_label', event.target.value)}
                      placeholder="WhatsApp Admin"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="wa-admin-number">Display Number</label>
                    <input
                      id="wa-admin-number"
                      type="text"
                      value={draft.whatsapp_admin_number || ''}
                      onChange={(event) => updateField('whatsapp_admin_number', event.target.value)}
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="wa-admin-link">WhatsApp Link</label>
                    <input
                      id="wa-admin-link"
                      type="url"
                      value={draft.whatsapp_admin_link || ''}
                      onChange={(event) => updateField('whatsapp_admin_link', event.target.value)}
                      placeholder="https://wa.me/628123456789"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Founder */}
              <div className="stack" style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>WhatsApp Founder</h3>
                <div className="form-grid three-col">
                  <div className="input-group">
                    <label htmlFor="wa-founder-label">Label</label>
                    <input
                      id="wa-founder-label"
                      type="text"
                      value={draft.whatsapp_founder_label || ''}
                      onChange={(event) => updateField('whatsapp_founder_label', event.target.value)}
                      placeholder="WhatsApp Founder"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="wa-founder-number">Display Number</label>
                    <input
                      id="wa-founder-number"
                      type="text"
                      value={draft.whatsapp_founder_number || ''}
                      onChange={(event) => updateField('whatsapp_founder_number', event.target.value)}
                      placeholder="+62 812-3456-7891"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="wa-founder-link">WhatsApp Link</label>
                    <input
                      id="wa-founder-link"
                      type="url"
                      value={draft.whatsapp_founder_link || ''}
                      onChange={(event) => updateField('whatsapp_founder_link', event.target.value)}
                      placeholder="https://wa.me/628123456791"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Co-Founder */}
              <div className="stack" style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>WhatsApp Co-Founder</h3>
                <div className="form-grid three-col">
                  <div className="input-group">
                    <label htmlFor="wa-cofounder-label">Label</label>
                    <input
                      id="wa-cofounder-label"
                      type="text"
                      value={draft.whatsapp_cofounder_label || ''}
                      onChange={(event) => updateField('whatsapp_cofounder_label', event.target.value)}
                      placeholder="WhatsApp Co-Founder"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="wa-cofounder-number">Display Number</label>
                    <input
                      id="wa-cofounder-number"
                      type="text"
                      value={draft.whatsapp_cofounder_number || ''}
                      onChange={(event) => updateField('whatsapp_cofounder_number', event.target.value)}
                      placeholder="+62 812-3456-7892"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="wa-cofounder-link">WhatsApp Link</label>
                    <input
                      id="wa-cofounder-link"
                      type="url"
                      value={draft.whatsapp_cofounder_link || ''}
                      onChange={(event) => updateField('whatsapp_cofounder_link', event.target.value)}
                      placeholder="https://wa.me/628123456792"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Social Media Links</h2>
              <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
                These links appear in the footer. Icons will only display for URLs that are provided.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', gridAutoRows: 'auto' }}>
                <div className="input-group">
                  <label htmlFor="social-facebook">Facebook URL</label>
                  <input
                    id="social-facebook"
                    type="url"
                    value={draft.social_facebook || ''}
                    onChange={(event) => updateField('social_facebook', event.target.value)}
                    placeholder="https://facebook.com/kciindonesia"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="social-instagram">Instagram URL</label>
                  <input
                    id="social-instagram"
                    type="url"
                    value={draft.social_instagram || ''}
                    onChange={(event) => updateField('social_instagram', event.target.value)}
                    placeholder="https://instagram.com/kciindonesia"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="social-tiktok">TikTok URL</label>
                  <input
                    id="social-tiktok"
                    type="url"
                    value={draft.social_tiktok || ''}
                    onChange={(event) => updateField('social_tiktok', event.target.value)}
                    placeholder="https://tiktok.com/@kciindonesia"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="social-threads">Threads URL</label>
                  <input
                    id="social-threads"
                    type="url"
                    value={draft.social_threads || ''}
                    onChange={(event) => updateField('social_threads', event.target.value)}
                    placeholder="https://threads.net/@kciindonesia"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="social-youtube">YouTube URL</label>
                  <input
                    id="social-youtube"
                    type="url"
                    value={draft.social_youtube || ''}
                    onChange={(event) => updateField('social_youtube', event.target.value)}
                    placeholder="https://youtube.com/@kciindonesia"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <button type="submit" className="button" disabled={saving}>
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
