import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  name: '',
  tier: 'Basic',
  price: 0,
  features: '',
  popular: false,
  published: true,
};

const tiers = ['Basic', 'Standard', 'Premium', 'Custom'];

const tierColors = {
  Basic: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  Standard: { bg: 'rgba(16,185,129,0.15)', color: 'var(--success)' },
  Premium: { bg: 'rgba(212,175,55,0.2)', color: 'var(--gold)' },
  Custom: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
};

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const { success, error } = useToast();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/packages/admin/all');
      setPackages(data);
    } catch (err) {
      error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setForm({
      name: pkg.name || '',
      tier: pkg.tier || 'Basic',
      price: pkg.price || 0,
      features: (pkg.features || []).join('\n'),
      popular: pkg.popular || false,
      published: pkg.published !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/packages/${editingId}`, payload);
        success('Package updated successfully!');
      } else {
        await api.post('/packages', payload);
        success('Package created successfully!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchPackages();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      success('Package deleted');
      fetchPackages();
    } catch (err) {
      error('Failed to delete package');
    }
  };

  const handleDuplicate = async (pkg) => {
    try {
      const payload = {
        name: `${pkg.name} (Copy)`,
        tier: pkg.tier,
        price: pkg.price,
        features: pkg.features,
        popular: false,
        published: false,
      };
      await api.post('/packages', payload);
      success('Package duplicated as draft!');
      fetchPackages();
    } catch (err) {
      error('Failed to duplicate');
    }
  };

  const handleTogglePublish = async (pkg) => {
    try {
      await api.put(`/packages/${pkg._id}`, { ...pkg, published: !pkg.published });
      success(pkg.published ? 'Package unpublished' : 'Package published!');
      fetchPackages();
    } catch (err) {
      error('Failed to update');
    }
  };

  const handleTogglePopular = async (pkg) => {
    try {
      // Only one package can be popular - unmark others
      if (!pkg.popular) {
        const popularPkgs = packages.filter((p) => p.popular && p._id !== pkg._id);
        for (const p of popularPkgs) {
          await api.put(`/packages/${p._id}`, { ...p, popular: false });
        }
      }
      await api.put(`/packages/${pkg._id}`, { ...pkg, popular: !pkg.popular });
      success(pkg.popular ? 'Removed popular flag' : 'Marked as most popular!');
      fetchPackages();
    } catch (err) {
      error('Failed to update');
    }
  };

  const filteredPackages = packages.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || p.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <h1>Packages Management</h1>
        <button className="btn btn-gold" onClick={handleCreate}>
          <i className="fa-solid fa-plus"></i> Add New Package
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-box" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Total Packages</div>
          <div className="value">{packages.length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-check-circle" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Published</div>
          <div className="value">{packages.filter((p) => p.published).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-star" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Popular</div>
          <div className="value">{packages.filter((p) => p.popular).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-dollar-sign" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Avg Price</div>
          <div className="value">
            PKR {packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + (p.price || 0), 0) / packages.length).toLocaleString() : 0}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}></i>
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '44px' }}
          />
        </div>
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="all">All Tiers</option>
          {tiers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div style={{ color: 'var(--gray-400)', fontSize: '14px' }}>
          <strong style={{ color: 'var(--gold)' }}>{filteredPackages.length}</strong> of {packages.length}
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
      ) : filteredPackages.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <i className="fa-solid fa-box" style={{ fontSize: '48px', color: 'var(--gray-600)', marginBottom: '16px' }}></i>
          <p style={{ color: 'var(--gray-400)', marginBottom: '16px' }}>
            {packages.length === 0 ? 'No packages yet.' : 'No packages match your filters.'}
          </p>
          {packages.length === 0 && (
            <button className="btn btn-gold" onClick={handleCreate}>Create First Package</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredPackages.map((pkg) => {
            const tierColor = tierColors[pkg.tier] || tierColors.Basic;
            return (
              <div
                key={pkg._id}
                className="card"
                style={{
                  padding: '28px',
                  position: 'relative',
                  borderColor: pkg.popular ? 'var(--gold)' : undefined,
                  boxShadow: pkg.popular ? 'var(--shadow-gold-lg)' : undefined,
                  opacity: pkg.published ? 1 : 0.6,
                }}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--gold)',
                      color: 'var(--navy)',
                      padding: '4px 14px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                    }}
                  >
                    ★ MOST POPULAR
                  </div>
                )}

                {/* Status badges */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: pkg.published ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                      color: pkg.published ? 'var(--success)' : '#f59e0b',
                    }}
                  >
                    {pkg.published ? 'LIVE' : 'DRAFT'}
                  </span>
                </div>

                {/* Tier */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: tierColor.bg,
                    color: tierColor.color,
                    marginBottom: '12px',
                  }}
                >
                  {pkg.tier}
                </div>

                {/* Name */}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '12px' }}>
                  {pkg.name}
                </h3>

                {/* Price */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ color: 'var(--gray-400)', fontSize: '13px' }}>PKR</span>
                    <span style={{ color: 'var(--gold)', fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                      {pkg.price?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '20px', minHeight: '120px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Features ({pkg.features?.length || 0})
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(pkg.features || []).slice(0, 4).map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--gray-400)' }}>
                        <i className="fa-solid fa-check" style={{ color: 'var(--gold)', fontSize: '11px' }}></i>
                        {f}
                      </li>
                    ))}
                    {pkg.features?.length > 4 && (
                      <li style={{ fontSize: '12px', color: 'var(--gray-600)', fontStyle: 'italic' }}>
                        +{pkg.features.length - 4} more...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => handleTogglePublish(pkg)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '8px' }}
                    title={pkg.published ? 'Unpublish' : 'Publish'}
                  >
                    <i className={`fa-solid ${pkg.published ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <button
                    onClick={() => handleTogglePopular(pkg)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '8px' }}
                    title={pkg.popular ? 'Remove popular' : 'Mark as popular'}
                  >
                    <i className={`fa-${pkg.popular ? 'solid' : 'regular'} fa-star`}></i>
                  </button>
                  <button
                    onClick={() => handleDuplicate(pkg)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', padding: '8px' }}
                    title="Duplicate"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '8px' }}
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '8px' }}
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
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
              maxWidth: '720px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '32px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
                  {editingId ? 'Edit Package' : 'Create New Package'}
                </h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginTop: '4px' }}>
                  {editingId ? 'Update pricing package details' : 'Create a new pricing tier'}
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
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Package Name <span>*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  required
                  placeholder="e.g. Growth Plan"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tier <span>*</span></label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="form-select"
                  required
                >
                  {tiers.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price (PKR) <span>*</span></label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="form-input"
                  required
                  min="0"
                  placeholder="35000"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Features (one per line) <span>*</span></label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  className="form-textarea"
                  rows="6"
                  required
                  placeholder="3 Platforms&#10;12 Posts/month&#10;Priority Support&#10;3 Revisions&#10;Monthly Report"
                />
                <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '6px' }}>
                  <i className="fa-solid fa-info-circle"></i> Each new line becomes a feature bullet
                </p>
              </div>

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
                    checked={form.popular}
                    onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }}
                  />
                  <span>Mark as "Most Popular"</span>
                </label>
              </div>

              {form.popular && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '13px',
                    color: 'var(--gold)',
                  }}
                >
                  <i className="fa-solid fa-info-circle"></i> Only one package can be "Most Popular". Marking this will unmark others.
                </div>
              )}
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
                  <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                ) : editingId ? (
                  <><i className="fa-solid fa-save"></i> Update Package</>
                ) : (
                  <><i className="fa-solid fa-plus"></i> Create Package</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}