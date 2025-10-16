'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { MediaLibraryPicker } from '../../../components/admin/MediaLibraryPicker';
import { apiGet, apiPost } from '../../../lib/api';

function createEmptyMember() {
  return {
    name: '',
    role: '',
    photo: null,
  };
}

function createEmptyDivision() {
  return {
    id: `division-${Date.now()}`,
    name: '',
    coordinator: {
      name: '',
      instagram: '',
      photo: null,
    },
    members: [createEmptyMember()],
  };
}

export default function OrganizationPage() {
  const { data, error, isLoading, mutate } = useSWR('/organization', () => apiGet('/organization'));
  const organization = useMemo(() => data?.organization ?? null, [data]);

  const [draft, setDraft] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // { type: 'founder'|'cofounder'|'coordinator'|'member', divisionIndex?, memberIndex? }

  // Initialize draft when organization data loads
  useMemo(() => {
    if (organization && !draft) {
      setDraft(JSON.parse(JSON.stringify(organization))); // deep clone
    }
  }, [organization, draft]);

  function updateFounder(field, value) {
    setDraft((prev) => ({
      ...prev,
      founder: { ...prev.founder, [field]: value },
    }));
  }

  function updateCofounder(field, value) {
    setDraft((prev) => ({
      ...prev,
      cofounder: { ...prev.cofounder, [field]: value },
    }));
  }

  function updateDivision(divisionIndex, field, value) {
    setDraft((prev) => {
      const divisions = [...prev.divisions];
      divisions[divisionIndex] = { ...divisions[divisionIndex], [field]: value };
      return { ...prev, divisions };
    });
  }

  function updateCoordinator(divisionIndex, field, value) {
    setDraft((prev) => {
      const divisions = [...prev.divisions];
      divisions[divisionIndex] = {
        ...divisions[divisionIndex],
        coordinator: { ...divisions[divisionIndex].coordinator, [field]: value },
      };
      return { ...prev, divisions };
    });
  }

  function updateMember(divisionIndex, memberIndex, field, value) {
    setDraft((prev) => {
      const divisions = [...prev.divisions];
      const members = [...divisions[divisionIndex].members];
      members[memberIndex] = { ...members[memberIndex], [field]: value };
      divisions[divisionIndex] = { ...divisions[divisionIndex], members };
      return { ...prev, divisions };
    });
  }

  function addDivision() {
    setDraft((prev) => ({
      ...prev,
      divisions: [...prev.divisions, createEmptyDivision()],
    }));
  }

  function removeDivision(divisionIndex) {
    if (!window.confirm('Remove this division?')) return;
    setDraft((prev) => ({
      ...prev,
      divisions: prev.divisions.filter((_, i) => i !== divisionIndex),
    }));
  }

  function addMember(divisionIndex) {
    setDraft((prev) => {
      const divisions = [...prev.divisions];
      divisions[divisionIndex] = {
        ...divisions[divisionIndex],
        members: [...divisions[divisionIndex].members, createEmptyMember()],
      };
      return { ...prev, divisions };
    });
  }

  function removeMember(divisionIndex, memberIndex) {
    if (!window.confirm('Remove this member?')) return;
    setDraft((prev) => {
      const divisions = [...prev.divisions];
      divisions[divisionIndex] = {
        ...divisions[divisionIndex],
        members: divisions[divisionIndex].members.filter((_, i) => i !== memberIndex),
      };
      return { ...prev, divisions };
    });
  }

  function openMediaPicker(target) {
    setPickerTarget(target);
    setPickerOpen(true);
  }

  function closeMediaPicker() {
    setPickerOpen(false);
    setPickerTarget(null);
  }

  function handleMediaSelect(item) {
    if (!item || !pickerTarget) return;
    const photoUrl = item.asset_url || null;

    if (pickerTarget.type === 'founder') {
      updateFounder('photo', photoUrl);
    } else if (pickerTarget.type === 'cofounder') {
      updateCofounder('photo', photoUrl);
    } else if (pickerTarget.type === 'coordinator') {
      updateCoordinator(pickerTarget.divisionIndex, 'photo', photoUrl);
    } else if (pickerTarget.type === 'member') {
      updateMember(pickerTarget.divisionIndex, pickerTarget.memberIndex, 'photo', photoUrl);
    }

    closeMediaPicker();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      await apiPost('/organization', draft);
      await mutate();
      alert('Organization structure saved successfully!');
    } catch (err) {
      setFormError(err.message || 'Failed to save organization structure');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !draft) {
    return <p>Loading organization structure…</p>;
  }

  if (error) {
    return <div className="alert">{error.message}</div>;
  }

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Organization Structure</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Manage the organizational hierarchy displayed on the Tentang page. Edit leadership, divisions, and team members.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="stack">
        {formError && <div className="alert">{formError}</div>}

        {/* Leadership Section */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Leadership</h2>

          {/* Founder */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Founder</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="founder-name">Name *</label>
                <input
                  id="founder-name"
                  type="text"
                  value={draft.founder.name}
                  onChange={(e) => updateFounder('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="founder-role">Role *</label>
                <input
                  id="founder-role"
                  type="text"
                  value={draft.founder.role}
                  onChange={(e) => updateFounder('role', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="founder-instagram">Instagram Username</label>
                <input
                  id="founder-instagram"
                  type="text"
                  value={draft.founder.instagram || ''}
                  onChange={(e) => updateFounder('instagram', e.target.value)}
                  placeholder="founderkci"
                />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => openMediaPicker({ type: 'founder' })}
                >
                  {draft.founder.photo ? 'Change Photo' : 'Select Photo'}
                </button>
                {draft.founder.photo && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={draft.founder.photo} alt="Founder" style={{ maxWidth: '100px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Co-Founder */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Co-Founder</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="cofounder-name">Name *</label>
                <input
                  id="cofounder-name"
                  type="text"
                  value={draft.cofounder.name}
                  onChange={(e) => updateCofounder('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cofounder-role">Role *</label>
                <input
                  id="cofounder-role"
                  type="text"
                  value={draft.cofounder.role}
                  onChange={(e) => updateCofounder('role', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cofounder-instagram">Instagram Username</label>
                <input
                  id="cofounder-instagram"
                  type="text"
                  value={draft.cofounder.instagram || ''}
                  onChange={(e) => updateCofounder('instagram', e.target.value)}
                  placeholder="cofounderkci"
                />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => openMediaPicker({ type: 'cofounder' })}
                >
                  {draft.cofounder.photo ? 'Change Photo' : 'Select Photo'}
                </button>
                {draft.cofounder.photo && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={draft.cofounder.photo} alt="Co-Founder" style={{ maxWidth: '100px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divisions Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>Divisions</h2>
            <button type="button" className="button button-outline" onClick={addDivision}>
              Add Division
            </button>
          </div>

          <div className="stack">
            {draft.divisions.map((division, divIndex) => (
              <div key={division.id} className="card" style={{ background: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Division {divIndex + 1}</h3>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => removeDivision(divIndex)}
                    style={{ color: '#dc2626' }}
                  >
                    Remove
                  </button>
                </div>

                {/* Division Info */}
                <div className="form-group">
                  <label>Division Name *</label>
                  <input
                    type="text"
                    value={division.name}
                    onChange={(e) => updateDivision(divIndex, 'name', e.target.value)}
                    placeholder="e.g., Public Relations & Partnership Division"
                    required
                  />
                </div>

                {/* Coordinator */}
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                  <h4 style={{ marginTop: 0, fontSize: '1rem' }}>Coordinator</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={division.coordinator.name}
                        onChange={(e) => updateCoordinator(divIndex, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Instagram Username</label>
                      <input
                        type="text"
                        value={division.coordinator.instagram || ''}
                        onChange={(e) => updateCoordinator(divIndex, 'instagram', e.target.value)}
                        placeholder="koordinator.username"
                      />
                    </div>
                    <div className="form-group">
                      <label>Profile Photo</label>
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={() => openMediaPicker({ type: 'coordinator', divisionIndex: divIndex })}
                      >
                        {division.coordinator.photo ? 'Change Photo' : 'Select Photo'}
                      </button>
                      {division.coordinator.photo && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <img src={division.coordinator.photo} alt="Coordinator" style={{ maxWidth: '80px', borderRadius: '8px' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Members */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Members</h4>
                    <button
                      type="button"
                      className="button button-outline"
                      onClick={() => addMember(divIndex)}
                    >
                      Add Member
                    </button>
                  </div>

                  {division.members.map((member, memIndex) => (
                    <div key={memIndex} style={{ padding: '1rem', background: 'white', borderRadius: '8px', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Member {memIndex + 1}</span>
                        <button
                          type="button"
                          className="button button-outline"
                          onClick={() => removeMember(divIndex, memIndex)}
                          style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', color: '#dc2626' }}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateMember(divIndex, memIndex, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Role *</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => updateMember(divIndex, memIndex, 'role', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Profile Photo</label>
                          <button
                            type="button"
                            className="button button-outline"
                            onClick={() => openMediaPicker({ type: 'member', divisionIndex: divIndex, memberIndex: memIndex })}
                          >
                            {member.photo ? 'Change Photo' : 'Select Photo'}
                          </button>
                          {member.photo && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <img src={member.photo} alt="Member" style={{ maxWidth: '60px', borderRadius: '8px' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="button" disabled={saving}>
          {saving ? 'Saving…' : 'Save Organization Structure'}
        </button>
      </form>

      {/* Media Library Picker Modal */}
      {pickerOpen && (
        <MediaLibraryPicker onSelect={handleMediaSelect} onClose={closeMediaPicker} />
      )}
    </section>
  );
}
