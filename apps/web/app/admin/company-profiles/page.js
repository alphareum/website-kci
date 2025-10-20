'use client';

import { useId, useMemo, useState } from 'react';
import useSWR from 'swr';
import { MediaLibraryPicker } from '../../../components/admin/MediaLibraryPicker';
import { ImageUploadField } from '../../../components/admin/ImageUploadField';
import { apiGet, apiPost, apiDelete } from '../../../lib/api';

function createEmptyCompanyProfile() {
  return {
    slug: '',
    name: '',
    logo_url: '',
    description: '',
    website_url: '',
    email: '',
    phone: '',
    address: '',
    social_media: {
      instagram: '',
      linkedin: '',
      facebook: '',
      twitter: '',
    },
    services: [],
    founded_year: '',
    category: '',
  };
}

export default function CompanyProfilesPage() {
  const { data, error, isLoading, mutate } = useSWR('/company-profiles', () =>
    apiGet('/company-profiles')
  );
  const profiles = useMemo(() => data?.companyProfiles ?? [], [data]);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyCompanyProfile());
  const [editingId, setEditingId] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newService, setNewService] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const logoLabelId = useId();
  const logoHelpId = `${logoLabelId}-help`;

  function openCreate() {
    setDraft(createEmptyCompanyProfile());
    setEditingId(null);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(profile) {
    setDraft({
      ...profile,
      logo_url: profile.logo_url ?? '',
      website_url: profile.website_url ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      address: profile.address ?? '',
      social_media: profile.social_media ?? {
        instagram: '',
        linkedin: '',
        facebook: '',
        twitter: '',
      },
      services: profile.services ?? [],
      founded_year: profile.founded_year ?? '',
      category: profile.category ?? '',
    });
    setEditingId(profile.id);
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

  function updateSocialMedia(platform, value) {
    setDraft((prev) => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value,
      },
    }));
  }

  function handleMediaSelect(item) {
    if (!item) {
      return;
    }
    updateField('logo_url', item.asset_url || '');
    setPickerOpen(false);
  }

  // Service handlers
  function addService() {
    const trimmed = newService.trim();
    if (!trimmed) return;
    setDraft((prev) => ({
      ...prev,
      services: [...prev.services, trimmed],
    }));
    setNewService('');
  }

  function removeService(index) {
    setDraft((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = {
      id: editingId ?? undefined,
      slug: draft.slug,
      name: draft.name,
      logo_url: draft.logo_url || null,
      description: draft.description,
      website_url: draft.website_url || undefined,
      email: draft.email || undefined,
      phone: draft.phone || undefined,
      address: draft.address || undefined,
      social_media: draft.social_media,
      services: draft.services,
      founded_year: draft.founded_year || undefined,
      category: draft.category || undefined,
    };

    try {
      await apiPost('/admin/company-profiles', payload);
      await mutate();
      closeModal();
    } catch (error) {
      console.error('Save error:', error);
      setFormError(error.message || 'Failed to save company profile');
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this company profile?')) {
      return;
    }

    setDeletingId(id);
    try {
      await apiDelete(`/admin/company-profiles/${id}`);
      await mutate();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message || 'Failed to delete company profile');
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="admin-container">
        <h1 className="admin-title">Company Profiles</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <h1 className="admin-title">Company Profiles</h1>
        <p style={{ color: 'red' }}>Error: {error.message || 'Failed to load'}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Company Profiles</h1>
        <button type="button" className="button" onClick={openCreate}>
          New Company Profile
        </button>
      </div>

      {/* Profiles List */}
      {profiles.length === 0 ? (
        <p className="empty-state">No company profiles yet. Create one to get started.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Founded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td>
                  {profile.logo_url && (
                    <img
                      src={profile.logo_url}
                      alt={profile.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                        marginRight: '8px',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                    />
                  )}
                  {profile.name}
                </td>
                <td>
                  <code>{profile.slug}</code>
                </td>
                <td>{profile.category || '-'}</td>
                <td>{profile.founded_year || '-'}</td>
                <td>
                  <div className="button-group">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => openEdit(profile)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button danger"
                      onClick={() => handleDelete(profile.id)}
                      disabled={deletingId === profile.id}
                    >
                      {deletingId === profile.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Company Profile' : 'New Company Profile'}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {formError && <div className="error-message">{formError}</div>}

              {/* Basic Information Section */}
              <div className="section">
                <h3>Basic Information</h3>

                <div className="form-field">
                  <label htmlFor="name">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={draft.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="slug">
                    Slug <span className="required">*</span>
                  </label>
                  <input
                    id="slug"
                    type="text"
                    value={draft.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="company-name"
                    required
                  />
                  <small>Used in URL: /partner/{draft.slug || 'company-name'}</small>
                </div>

                <div className="form-field">
                  <label htmlFor={logoLabelId}>Logo</label>
                  <ImageUploadField
                    value={draft.logo_url}
                    onChange={(url) => updateField('logo_url', url)}
                    labelId={logoLabelId}
                    helpId={logoHelpId}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => setPickerOpen(true)}
                    >
                      Choose from media library
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    type="text"
                    value={draft.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    placeholder="e.g., Technology, Finance, Retail"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="founded_year">Founded Year</label>
                  <input
                    id="founded_year"
                    type="text"
                    value={draft.founded_year}
                    onChange={(e) => updateField('founded_year', e.target.value)}
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>

              {/* About Section */}
              <div className="section">
                <h3>About</h3>

                <div className="form-field">
                  <label htmlFor="description">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={draft.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Services Offered</label>
                  {draft.services.length > 0 && (
                    <ul className="tag-list">
                      {draft.services.map((service, index) => (
                        <li key={index} className="tag">
                          {service}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => removeService(index)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="input-group">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Add a service"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addService();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="button secondary"
                      onClick={addService}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="section">
                <h3>Contact Information</h3>

                <div className="form-field">
                  <label htmlFor="website_url">Website URL</label>
                  <input
                    id="website_url"
                    type="url"
                    value={draft.website_url}
                    onChange={(e) => updateField('website_url', e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+62..."
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    value={draft.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    rows={2}
                    placeholder="Company address"
                  />
                </div>
              </div>

              {/* Social Media Section */}
              <div className="section">
                <h3>Social Media</h3>

                <div className="form-field">
                  <label htmlFor="instagram">Instagram</label>
                  <input
                    id="instagram"
                    type="url"
                    value={draft.social_media.instagram}
                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                    placeholder="https://instagram.com/company"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    id="linkedin"
                    type="url"
                    value={draft.social_media.linkedin}
                    onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="facebook">Facebook</label>
                  <input
                    id="facebook"
                    type="url"
                    value={draft.social_media.facebook}
                    onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                    placeholder="https://facebook.com/company"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="twitter">Twitter</label>
                  <input
                    id="twitter"
                    type="url"
                    value={draft.social_media.twitter}
                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                    placeholder="https://twitter.com/company"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="button" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {pickerOpen && (
        <MediaLibraryPicker
          onSelect={handleMediaSelect}
          onClose={() => setPickerOpen(false)}
          type="partner"
        />
      )}
    </div>
  );
}
