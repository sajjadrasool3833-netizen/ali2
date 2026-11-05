import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  clientName: '',
  clientTitle: '',
  company: '',
  avatar: '',
  rating: 5,
  content: '',
  approved: false,
};

const avatarColors = ['#d4af37', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b'];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const { success, error } = useToast();

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/testimonials/admin/all');
      setTestimonials(data);
    } catch (err) {
      error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      clientName: t.clientName || '',
      clientTitle: t.clientTitle || '',
      company: t.company || '',
      avatar: t.avatar || '',
      rating: t.rating || 5,
      content: t.content || '',
      approved: t.approved || false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, form);
        success('Testimonial updated!');
      } else {
        await api.post('/testimonials', form);
        success('Testimonial created!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial? This cannot be undone.')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      success('Testimonial deleted');
      fetchTestimonials();
    } catch (err) {
      error('Failed to delete');
    }
  };

  const handleToggleApprove = async (t) => {
    try {
      await api.put(`/testimonials/${t._id}`, { ...t, approved: !t.approved });
      success(t.approved ? 'Unapproved' : 'Approved & published!');
      fetchTestimonials();
    } catch (err) {
      error('Failed to update');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            style={{
              background: 'none',
              border: 'none',
              padding: interactive ? '4px' : 0,
              cursor: interactive ? 'pointer' : 'default',
              fontSize: interactive ? '24px' : '16px',
              color: star <= rating ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'approved' && t.approved) ||
      (filterStatus === 'pending' && !t.approved);
    const matchesRating = filterRating === 'all' || t.rating === Number(filterRating);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <h1>Testimonials Management</h1>
        <button className="btn btn-gold" onClick={handleCreate}>
          <i className="fa-solid fa-plus"></i> Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-quote-left" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Total Reviews</div>
          <div className="value">{testimonials.length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-check-circle" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Approved</div>
          <div className="value">{testimonials.filter((t) => t.approved).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-clock" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Pending</div>
          <div className="value">{testimonials.filter((t) => !t.approved).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-star" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Avg Rating</div>
          <div className="value">{avgRating} ★</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}></i>
          <input
            type="text"
            placeholder="Search by name, company, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '44px' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
          ))}
        </select>
        <div style={{ color: 'var(--gray-400)', fontSize: '14px' }}>
          <strong style={{ color: 'var(--gold)' }}>{filteredTestimonials.length}</strong> of {testimonials.length}
        </div>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <i className="fa-solid fa-quote-left" style={{ fontSize: '48px', color: 'var(--gray-600)', marginBottom: '16px' }}></i>
          <p style={{ color: 'var(--gray-400)', marginBottom: '16px' }}>
            {testimonials.length === 0 ? 'No testimonials yet.' : 'No testimonials match your filters.'}
          </p>
          {testimonials.length === 0 && (
            <button className="btn btn-gold" onClick={handleCreate}>Add First Testimonial</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredTestimonials.map((t) => (
            <div
              key={t._id}
              className="card"
              style={{
                padding: '28px',
                position: 'relative',
                opacity: t.approved ? 1 : 0.7,
                borderColor: t.approved ? 'rgba(212,175,55,0.3)' : 'rgba(245,158,11,0.3)',
              }}
            >
              {/* Status badge */}
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: t.approved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: t.approved ? 'var(--success)' : '#f59e0b',
                  }}
                >
                  {t.approved ? '✓ APPROVED' : '⏳ PENDING'}
                </span>
              </div>

              {/* Quote icon */}
              <i className="fa-solid fa-quote-left" style={{ color: 'rgba(212,175,55,0.3)', fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>

              {/* Stars */}
              <div style={{ marginBottom: '16px' }}>
                {renderStars(t.rating)}
              </div>

              {/* Content */}
              <p style={{ color: 'var(--gray-400)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic', minHeight: '80px' }}>
                "{t.content}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: getAvatarColor(t.clientName),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--navy)',
                    fontWeight: 700,
                    fontSize: '16px',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(t.clientName)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.clientName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                    {t.clientTitle}
                    {t.clientTitle && t.company && ' • '}
                    {t.company}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  onClick={() => handleToggleApprove(t)}
                  className="btn btn-sm"
                  style={{ flex: 1, background: t.approved ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)', color: t.approved ? '#f59e0b' : 'var(--success)', padding: '8px' }}
                  title={t.approved ? 'Unapprove' : 'Approve'}
                >
                  <i className={`fa-solid ${t.approved ? 'fa-times' : 'fa-check'}`}></i>
                </button>
                <button
                  onClick={() => handleEdit(t)}
                  className="btn btn-sm"
                  style={{ flex: 1, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '8px' }}
                  title="Edit"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="btn btn-sm"
                  style={{ flex: 1, background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '8px' }}
                  title="Delete"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
          onClick={() => setShowModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="card"
            style={{ maxWidth: '720px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
                  {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginTop: '4px' }}>
                  Client reviews that build trust
                </p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={{ fontSize: '24px', color: 'var(--gray-400)', padding: '8px' }}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Client Name <span>*</span></label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className="form-input"
                  required
                  placeholder="e.g. Ahmed Khan"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Title</label>
                <input
                  type="text"
                  value={form.clientTitle}
                  onChange={(e) => setForm({ ...form, clientTitle: e.target.value })}
                  className="form-input"
                  placeholder="e.g. CEO, Founder"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="form-input"
                  placeholder="e.g. TechCorp"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Rating <span>*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {renderStars(form.rating, true, (r) => setForm({ ...form, rating: r }))}
                  <span style={{ color: 'var(--gold)', fontWeight: 700, marginLeft: '8px' }}>{form.rating}.0</span>
                  <span style={{ color: 'var(--gray-400)', fontSize: '12px' }}>/ 5 stars</span>
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Avatar URL (optional)</label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg (leave empty for initials)"
                />
                <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '6px' }}>
                  <i className="fa-solid fa-info-circle"></i> If empty, initials will be shown with a colored background
                </p>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Testimonial Content <span>*</span></label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="form-textarea"
                  rows="5"
                  required
                  placeholder="What did the client say about your work? Include specific results if possible..."
                />
                <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '6px' }}>
                  {form.content.length} characters
                </p>
              </div>

              {/* Preview */}
              {form.clientName && form.content && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Live Preview</label>
                  <div className="card" style={{ padding: '20px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ marginBottom: '8px' }}>{renderStars(form.rating)}</div>
                    <p style={{ color: 'var(--gray-400)', fontSize: '14px', fontStyle: 'italic', marginBottom: '12px' }}>
                      "{form.content}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: getAvatarColor(form.clientName),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--navy)',
                          fontWeight: 700,
                          fontSize: '14px',
                        }}
                      >
                        {getInitials(form.clientName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{form.clientName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
                          {form.clientTitle}{form.clientTitle && form.company && ' • '}{form.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.approved}
                    onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }}
                  />
                  <span>Approve (visible on website)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</> : editingId ? <><i className="fa-solid fa-save"></i> Update</> : <><i className="fa-solid fa-plus"></i> Create</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}