import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  slug: '',
  title: '',
  category: '',
  shortDescription: '',
  description: '',
  features: '',
  benefits: '',
  icon: 'fa-solid fa-star',
  image: '',
  priceFrom: 0,
  featured: false,
  published: true,
};

const categories = ['Social Media', 'Design', 'Web', 'AI', 'Marketing', 'Other'];

const iconOptions = [
  { value: 'fa-solid fa-share-nodes', label: 'Share Nodes' },
  { value: 'fa-solid fa-pen-nib', label: 'Pen Nib' },
  { value: 'fa-solid fa-code', label: 'Code' },
  { value: 'fa-solid fa-robot', label: 'Robot' },
  { value: 'fa-solid fa-chart-line', label: 'Chart Line' },
  { value: 'fa-solid fa-bullhorn', label: 'Bullhorn' },
  { value: 'fa-solid fa-camera', label: 'Camera' },
  { value: 'fa-solid fa-video', label: 'Video' },
  { value: 'fa-solid fa-palette', label: 'Palette' },
  { value: 'fa-solid fa-mobile-screen', label: 'Mobile' },
  { value: 'fa-solid fa-star', label: 'Star' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { success, error } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/services/admin/all');
      setServices(data);
    } catch (err) {
      error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setForm({
      slug: service.slug || '',
      title: service.title || '',
      category: service.category || '',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      features: (service.features || []).join('\n'),
      benefits: (service.benefits || []).join('\n'),
      icon: service.icon || 'fa-solid fa-star',
      image: service.image || '',
      priceFrom: service.priceFrom || 0,
      featured: service.featured || false,
      published: service.published !== false,
    });
    setShowModal(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug:
        prev.slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      priceFrom: Number(form.priceFrom) || 0,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      benefits: form.benefits.split('\n').map((b) => b.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        success('Service updated successfully!');
      } else {
        await api.post('/services', payload);
        success('Service created successfully!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchServices();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service? This cannot be undone.')) return;
    try {
      await api.delete(`/services/${id}`);
      success('Service deleted');
      fetchServices();
    } catch (err) {
      error('Failed to delete service');
    }
  };

  const handleTogglePublish = async (service) => {
    try {
      await api.put(`/services/${service._id}`, { ...service, published: !service.published });
      success(service.published ? 'Service unpublished' : 'Service published!');
      fetchServices();
    } catch (err) {
      error('Failed to update status');
    }
  };

  const handleToggleFeatured = async (service) => {
    try {
      await api.put(`/services/${service._id}`, { ...service, featured: !service.featured });
      success(service.featured ? 'Removed from featured' : 'Marked as featured!');
      fetchServices();
    } catch (err) {
      error('Failed to update');
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <h1>Services Management</h1>
        <button className="btn btn-gold" onClick={handleCreate}>
          <i className="fa-solid fa-plus"></i> Add New Service
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-concierge-bell" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Total Services</div>
          <div className="value">{services.length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-check-circle" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Published</div>
          <div className="value">{services.filter((s) => s.published).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-star" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Featured</div>
          <div className="value">{services.filter((s) => s.featured).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-pen" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Drafts</div>
          <div className="value">{services.filter((s) => !s.published).length}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}></i>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '44px' }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '180px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div style={{ color: 'var(--gray-400)', fontSize: '14px' }}>
          Showing <strong style={{ color: 'var(--gold)' }}>{filteredServices.length}</strong> of {services.length}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
      ) : filteredServices.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <i className="fa-solid fa-concierge-bell" style={{ fontSize: '48px', color: 'var(--gray-600)', marginBottom: '16px' }}></i>
          <p style={{ color: 'var(--gray-400)', marginBottom: '16px' }}>
            {services.length === 0 ? 'No services yet.' : 'No services match your filters.'}
          </p>
          {services.length === 0 && (
            <button className="btn btn-gold" onClick={handleCreate}>Create First Service</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredServices.map((service) => (
            <div key={service._id} className="card" style={{ padding: '24px', position: 'relative' }}>
              {/* Badges */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                {service.featured && (
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: 'rgba(212,175,55,0.2)',
                      color: 'var(--gold)',
                    }}
                  >
                    ★ FEATURED
                  </span>
                )}
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: service.published ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: service.published ? 'var(--success)' : '#f59e0b',
                  }}
                >
                  {service.published ? 'LIVE' : 'DRAFT'}
                </span>
              </div>

              {/* Icon */}
              <div className="service-icon" style={{ marginBottom: '16px' }}>
                <i className={service.icon || 'fa-solid fa-star'}></i>
              </div>

              {/* Info */}
              <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
                {service.category}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>
                {service.title}
              </h3>
              <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5, minHeight: '40px' }}>
                {service.shortDescription}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--gray-400)', fontSize: '12px' }}>From</span>
                <span style={{ color: 'var(--gold)', fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  PKR {service.priceFrom?.toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  onClick={() => handleTogglePublish(service)}
                  className="btn btn-sm"
                  style={{ flex: 1, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '8px' }}
                  title={service.published ? 'Unpublish' : 'Publish'}
                >
                  <i className={`fa-solid ${service.published ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                <button
                  onClick={() => handleToggleFeatured(service)}
                  className="btn btn-sm"
                  style={{ flex: 1, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '8px' }}
                  title={service.featured ? 'Remove from featured' : 'Mark as featured'}
                >
                  <i className={`fa-${service.featured ? 'solid' : 'regular'} fa-star`}></i>
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="btn btn-sm"
                  style={{ flex: 1, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '8px' }}
                  title="Edit"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="card"
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '32px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
                  {editingId ? 'Edit Service' : 'Create New Service'}
                </h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginTop: '4px' }}>
                  {editingId ? 'Update service details below' : 'Fill in the details for your new service'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ fontSize: '24px', color: 'var(--gray-400)', padding: '8px' }}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Title */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Service Title <span>*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleTitleChange}
                  className="form-input"
                  required
                  placeholder="e.g. Social Media Marketing"
                />
              </div>

              {/* Slug */}
              <div className="form-group">
                <label className="form-label">Slug (URL) <span>*</span></label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="form-input"
                  required
                  placeholder="social-media-marketing"
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category <span>*</span></label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Icon Picker */}
              <div className="form-group">
                <label className="form-label">Icon</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="form-select"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--gray-400)', fontSize: '12px' }}>Preview:</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={form.icon} style={{ color: 'var(--gold)', fontSize: '18px' }}></i>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="form-label">Starting Price (PKR) <span>*</span></label>
                <input
                  type="number"
                  value={form.priceFrom}
                  onChange={(e) => setForm({ ...form, priceFrom: e.target.value })}
                  className="form-input"
                  required
                  min="0"
                  placeholder="15000"
                />
              </div>

              {/* Cover Image */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Cover Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ marginTop: '8px', width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              </div>

              {/* Short Description */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Short Description <span>*</span></label>
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="form-textarea"
                  rows="2"
                  required
                  placeholder="One-line summary shown on the services page"
                />
              </div>

              {/* Full Description */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Full Description <span>*</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="Detailed description for the service detail page"
                />
              </div>

              {/* Features */}
              <div className="form-group">
                <label className="form-label">Features (one per line)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  className="form-textarea"
                  rows="6"
                  placeholder="Facebook Ads Management&#10;Instagram Ads Management&#10;Page Management"
                />
              </div>

              {/* Benefits */}
              <div className="form-group">
                <label className="form-label">Benefits (one per line)</label>
                <textarea
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                  className="form-textarea"
                  rows="6"
                  placeholder="More leads&#10;Higher engagement&#10;ROI-driven campaigns"
                />
              </div>

              {/* Toggles */}
              <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }}
                  />
                  <span>Publish (visible on website)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }}
                  />
                  <span>Mark as Featured</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                  </>
                ) : editingId ? (
                  <>
                    <i className="fa-solid fa-save"></i> Update Service
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus"></i> Create Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}