'use client';

import { useId, useMemo, useState } from 'react';
import useSWR from 'swr';
import { MediaLibraryPicker } from '../../../components/admin/MediaLibraryPicker';
import { ImageUploadField } from '../../../components/admin/ImageUploadField';
import { apiGet, apiPost } from '../../../lib/api';

function createEmptyProfile() {
  return {
    slug: '',
    name: '',
    title: '',
    location: '',
    email: '',
    photo_url: '',
    bio: '',
    experience: [],
    education: [],
    achievements: [],
    skills: [],
  };
}

function createEmptyExperience() {
  return {
    period: '',
    title: '',
    organization: '',
    description: '',
  };
}

function createEmptyEducation() {
  return {
    period: '',
    degree: '',
    institution: '',
    description: '',
  };
}

function createEmptyAchievement() {
  return {
    title: '',
    description: '',
    year: '',
  };
}

export default function ProfilesPage() {
  const { data, error, isLoading, mutate } = useSWR('/profiles', () => apiGet('/profiles'));
  const profiles = useMemo(() => data?.profiles ?? [], [data]);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyProfile());
  const [editingId, setEditingId] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const photoLabelId = useId();
  const photoHelpId = `${photoLabelId}-help`;

  function openCreate() {
    setDraft(createEmptyProfile());
    setEditingId(null);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(profile) {
    setDraft({
      ...profile,
      photo_url: profile.photo_url ?? '',
      experience: profile.experience ?? [],
      education: profile.education ?? [],
      achievements: profile.achievements ?? [],
      skills: profile.skills ?? [],
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

  function handleMediaSelect(item) {
    if (!item) {
      return;
    }
    updateField('photo_url', item.asset_url || '');
    setPickerOpen(false);
  }

  // Experience handlers
  function addExperience() {
    setDraft((prev) => ({
      ...prev,
      experience: [...prev.experience, createEmptyExperience()],
    }));
  }

  function updateExperience(index, field, value) {
    setDraft((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  }

  function removeExperience(index) {
    setDraft((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }

  // Education handlers
  function addEducation() {
    setDraft((prev) => ({
      ...prev,
      education: [...prev.education, createEmptyEducation()],
    }));
  }

  function updateEducation(index, field, value) {
    setDraft((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  }

  function removeEducation(index) {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }

  // Achievement handlers
  function addAchievement() {
    setDraft((prev) => ({
      ...prev,
      achievements: [...prev.achievements, createEmptyAchievement()],
    }));
  }

  function updateAchievement(index, field, value) {
    setDraft((prev) => {
      const updated = [...prev.achievements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, achievements: updated };
    });
  }

  function removeAchievement(index) {
    setDraft((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  }

  // Skill handlers
  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    setDraft((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkill('');
  }

  function removeSkill(index) {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
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
      title: draft.title,
      location: draft.location,
      email: draft.email,
      photo_url: draft.photo_url || null,
      bio: draft.bio,
      experience: draft.experience,
      education: draft.education,
      achievements: draft.achievements,
      skills: draft.skills,
    };

    try {
      await apiPost('/admin/profiles', payload);
      await mutate();
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Profiles</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Manage team member profiles. These profiles are displayed on the organization page.
          </p>
        </div>
        <button className="button" onClick={openCreate}>
          New profile
        </button>
      </header>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading profiles…</p>
      ) : profiles.length === 0 ? (
        <div className="empty-state">No profiles yet. Create your first profile.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td>
                  <div className="stack">
                    <strong>{profile.name}</strong>
                    <span style={{ color: '#666', fontSize: '0.875rem' }}>{profile.email}</span>
                  </div>
                </td>
                <td>{profile.title}</td>
                <td>
                  <code style={{ fontSize: '0.875rem', color: '#666' }}>/portfolio/{profile.slug}</code>
                </td>
                <td>
                  <button className="button secondary" onClick={() => openEdit(profile)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: '900px' }}>
            <header className="stack" style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{editingId ? 'Edit profile' : 'Create profile'}</h2>
              <p style={{ margin: 0, color: '#555' }}>
                Fill in the profile details. All fields are required unless marked optional.
              </p>
            </header>
            {formError ? <div className="alert">{formError}</div> : null}
            <form className="form-grid" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={draft.name}
                    onChange={(event) => updateField('name', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="slug">Slug *</label>
                  <input
                    id="slug"
                    type="text"
                    required
                    placeholder="joshua"
                    value={draft.slug}
                    onChange={(event) => updateField('slug', event.target.value)}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#555' }}>
                    URL path: /portfolio/{draft.slug || '[slug]'}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="Founder, Komunitas Chinese Indonesia"
                  value={draft.title}
                  onChange={(event) => updateField('title', event.target.value)}
                />
              </div>

              <div className="form-grid two-col">
                <div className="input-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={draft.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    type="text"
                    required
                    placeholder="Yogyakarta, Indonesia"
                    value={draft.location}
                    onChange={(event) => updateField('location', event.target.value)}
                  />
                </div>
              </div>

              {/* Profile Photo */}
              <div className="input-group">
                <label id={photoLabelId} htmlFor="photo">
                  Profile photo
                </label>
                <ImageUploadField
                  value={draft.photo_url}
                  onChange={(url) => updateField('photo_url', url)}
                  uploadType="profiles"
                  ariaLabelledBy={photoLabelId}
                  ariaDescribedBy={photoHelpId}
                  disabled={saving}
                  helperText="Upload a profile photo."
                />
                <span id={photoHelpId} style={{ fontSize: '0.8rem', color: '#555' }}>
                  Or paste an external link, or choose from media library.
                </span>
                <div className="stack" style={{ gap: '0.5rem' }}>
                  <input
                    id="photo"
                    type="text"
                    placeholder="https://example.com/photo.jpg or /uploads/photo.jpg"
                    value={draft.photo_url}
                    onChange={(event) => updateField('photo_url', event.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="button secondary" onClick={() => setPickerOpen(true)}>
                      Choose from media library
                    </button>
                    {draft.photo_url ? (
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => updateField('photo_url', '')}
                      >
                        Remove photo
                      </button>
                    ) : null}
                  </div>
                  {draft.photo_url ? (
                    <div
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        width: '150px',
                        height: '150px',
                      }}
                    >
                      <img
                        src={draft.photo_url}
                        alt="Profile photo"
                        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Bio */}
              <div className="input-group">
                <label htmlFor="bio">Bio *</label>
                <textarea
                  id="bio"
                  rows={4}
                  required
                  placeholder="Brief biography or introduction..."
                  value={draft.bio}
                  onChange={(event) => updateField('bio', event.target.value)}
                />
              </div>

              {/* Experience Section */}
              <div className="input-group" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Experience</label>
                  <button type="button" className="button secondary" onClick={addExperience}>
                    + Add experience
                  </button>
                </div>
                {draft.experience.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: '#999', fontStyle: 'italic' }}>
                    No experience added yet. Click "Add experience" to get started.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {draft.experience.map((exp, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          background: '#f9fafb',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <strong style={{ fontSize: '0.9rem' }}>Experience #{index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            style={{
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.75rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="form-grid two-col">
                          <div className="input-group">
                            <label>Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="Founder"
                              value={exp.title}
                              onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label>Period *</label>
                            <input
                              type="text"
                              required
                              placeholder="2025 - Present"
                              value={exp.period}
                              onChange={(e) => updateExperience(index, 'period', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="input-group">
                          <label>Organization *</label>
                          <input
                            type="text"
                            required
                            placeholder="Komunitas Chinese Indonesia"
                            value={exp.organization}
                            onChange={(e) => updateExperience(index, 'organization', e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label>Description *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Brief description of role and responsibilities..."
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="input-group" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Education</label>
                  <button type="button" className="button secondary" onClick={addEducation}>
                    + Add education
                  </button>
                </div>
                {draft.education.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: '#999', fontStyle: 'italic' }}>
                    No education added yet. Click "Add education" to get started.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {draft.education.map((edu, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          background: '#f9fafb',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <strong style={{ fontSize: '0.9rem' }}>Education #{index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            style={{
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.75rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="form-grid two-col">
                          <div className="input-group">
                            <label>Degree *</label>
                            <input
                              type="text"
                              required
                              placeholder="Bachelor of Computer Science"
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label>Period *</label>
                            <input
                              type="text"
                              required
                              placeholder="2020 - 2024"
                              value={edu.period}
                              onChange={(e) => updateEducation(index, 'period', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="input-group">
                          <label>Institution *</label>
                          <input
                            type="text"
                            required
                            placeholder="Universitas Kristen Duta Wacana"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label>Description (optional)</label>
                          <textarea
                            rows={2}
                            placeholder="Additional details about studies or achievements..."
                            value={edu.description || ''}
                            onChange={(e) => updateEducation(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Achievements Section */}
              <div className="input-group" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Achievements</label>
                  <button type="button" className="button secondary" onClick={addAchievement}>
                    + Add achievement
                  </button>
                </div>
                {draft.achievements.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: '#999', fontStyle: 'italic' }}>
                    No achievements added yet. Click "Add achievement" to get started.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {draft.achievements.map((ach, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          background: '#f9fafb',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <strong style={{ fontSize: '0.9rem' }}>Achievement #{index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            style={{
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.75rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="form-grid two-col">
                          <div className="input-group">
                            <label>Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="Achievement Title"
                              value={ach.title}
                              onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label>Year *</label>
                            <input
                              type="text"
                              required
                              placeholder="2025"
                              value={ach.year}
                              onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="input-group">
                          <label>Description *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Brief description of the achievement..."
                            value={ach.description}
                            onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="input-group" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <label style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Skills</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Enter a skill (e.g., Leadership)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="button secondary" onClick={addSkill}>
                    Add
                  </button>
                </div>
                {draft.skills.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: '#999', fontStyle: 'italic' }}>
                    No skills added yet. Type a skill and click "Add".
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {draft.skills.map((skill, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          background: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#1e40af',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '1.2rem',
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="actions" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <button type="button" className="button secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={saving}>
                  {saving ? 'Saving…' : 'Save profile'}
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
