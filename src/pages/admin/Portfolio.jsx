import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  title: '',
  category: '',
  description: '',
  image: '',
  projectUrl: '',
  mediaType: 'image',
  featured: false,
  published: true,
};

const categories = [
  'Web Development',
  'Social Media',
  'Graphic Design',
  'Video Editing',
  'Advertising',
  'Branding',
  'Other',
];

const categoryIcons = {
  'Web Development': 'fa-solid fa-code',
  'Social Media': 'fa-solid fa-share-nodes',
  'Graphic Design': 'fa-solid fa-pen-nib',
  'Video Editing': 'fa-solid fa-video',
  'Advertising': 'fa-solid fa-bullhorn',
  'Branding': 'fa-solid fa-crown',
  'Other': 'fa-solid fa-star',
};

const sampleImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
];

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { success, error } = useToast();

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/portfolio/admin/all');
      setItems(data);
    } catch (err) {
      error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      image: item.image || '',
      projectUrl: item.projectUrl || '',
      mediaType: item.mediaType || 'image',
      featured: item.featured || false,
      published: item.published !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/portfolio/${editingId}`, form);
        success('Portfolio item updated!');
      } else {
        await api.post('/portfolio', form);
        success('Portfolio item created!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchPortfolio();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item? This cannot be undone.')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      success('Portfolio item deleted');
      fetchPortfolio();
    } catch (err) {
      error('Failed to delete');
    }
  };

  const handleDuplicate = async (item) => {
    try {
      await api.post('/portfolio', {
        ...item,
        title: `${item.title} (Copy)`,
        featured: false,
        published: false,
        _id: undefined,
      });
      success('Portfolio item duplicated!');
      fetchPortfolio();
    } catch (err) {
      error('Failed to duplicate');
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      await api.put(`/portfolio/${item._id}`, { ...item, published: !item.published });
      success(item.published ? 'Unpublished' : 'Published!');
      fetchPortfolio();
    } catch (err) {
      error('Failed to update');
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      await api.put(`/portfolio/${item._id}`, { ...item, featured: !item.featured });
      success(item.featured ? 'Removed from featured' : 'Marked as featured!');
      fetchPortfolio();
    } catch (err) {
      error('Failed to update');
    }
  };

  const handleRandomImage = () => {
    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setForm({ ...form, image: randomImg });
  };

  const filteredItems = items.filter((i) => {
    const matchesSearch =
      i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || i.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && i.published) ||
      (filterStatus === 'draft' && !i.published) ||
      (filterStatus === 'featured' && i.featured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <h1>Portfolio Management</h1>
        <button className="btn btn-gold" onClick={handleCreate}>
          <i className="fa-solid fa-plus"></i> Add Portfolio Item
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-images" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Total Projects</div>
          <div className="value">{items.length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-check-circle" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Published</div>
          <div className="value">{items.filter((i) => i.published).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-star" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Featured</div>
          <div className="value">{items.filter((i) => i.featured).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-pen" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Drafts</div>
          <div className="value">{items.filter((i) => !i.published).length}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}></i>
          <input
            type="text"
            placeholder="Search by title or description..."
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
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '140px' }}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured</option>
        </select>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: viewMode === 'grid' ? 'var(--gold)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--navy)' : 'var(--gray-400)',
            }}
            title="Grid view"
          >
            <i className="fa-solid fa-th"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: viewMode === 'list' ? 'var(--gold)' : 'transparent',
              color: viewMode === 'list' ? 'var(--navy)' : 'var(--gray-400)',
            }}
            title="List view"
          >
            <i className="fa-solid fa-list"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <i className="fa-solid fa-images" style={{ fontSize: '48px', color: 'var(--gray-600)', marginBottom: '16px' }}></i>
          <p style={{ color: 'var(--gray-400)', marginBottom: '16px' }}>
            {items.length === 0 ? 'No portfolio items yet.' : 'No items match your filters.'}
          </p>
          {items.length === 0 && (
            <button className="btn btn-gold" onClick={handleCreate}>Add First Project</button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredItems.map((item) => (
            <div key={item._id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: item.published ? 1 : 0.6 }}>
              {/* Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/0a1128/d4af37?text=No+Image';
                  }}
                />
                {/* Badges */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: 'rgba(0,0,0,0.7)',
                      color: 'var(--gold)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <i className={`${categoryIcons[item.category] || 'fa-solid fa-star'}`} style={{ marginRight: '4px' }}></i>
                    {item.category}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                  {item.featured && (
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, background: 'var(--gold)', color: 'var(--navy)' }}>
                      ★ FEATURED
                    </span>
                  )}
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: item.published ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.9)',
                      color: 'white',
                    }}
                  >
                    {item.published ? 'LIVE' : 'DRAFT'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px', minHeight: '40px' }}>
                  {item.description?.slice(0, 100)}{item.description?.length > 100 ? '...' : ''}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '8px' }}
                    title={item.published ? 'Unpublish' : 'Publish'}
                  >
                    <i className={`fa-solid ${item.published ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '8px' }}
                    title="Toggle featured"
                  >
                    <i className={`fa-${item.featured ? 'solid' : 'regular'} fa-star`}></i>
                  </button>
                  <button
                    onClick={() => handleDuplicate(item)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', padding: '8px' }}
                    title="Duplicate"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '8px' }}
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-sm"
                    style={{ flex: 1, background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '8px' }}
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(212,175,55,0.08)', textAlign: 'left' }}>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase' }}>Preview</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', opacity: item.published ? 1 : 0.6 }}>
                  <td style={{ padding: '12px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{item.description?.slice(0, 60)}...</div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--gold)', fontSize: '13px' }}>
                    <i className={categoryIcons[item.category] || 'fa-solid fa-star'} style={{ marginRight: '6px' }}></i>
                    {item.category}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', background: item.published ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: item.published ? 'var(--success)' : '#f59e0b', width: 'fit-content' }}>
                        {item.published ? 'LIVE' : 'DRAFT'}
                      </span>
                      {item.featured && (
                        <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', background: 'rgba(212,175,55,0.2)', color: 'var(--gold)', width: 'fit-content' }}>
                          ★ FEATURED
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => handleEdit(item)} className="btn btn-sm" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '6px 10px' }}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => handleDuplicate(item)} className="btn btn-sm" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', padding: '6px 10px' }}>
                        <i className="fa-solid fa-copy"></i>
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '6px 10px' }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            style={{ maxWidth: '800px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
                  {editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                </h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginTop: '4px' }}>
                  Showcase your best work
                </p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={{ fontSize: '24px', color: 'var(--gray-400)', padding: '8px' }}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Project Title <span>*</span></label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" required placeholder="e.g. E-commerce Store Redesign" />
              </div>

              <div className="form-group">
                <label className="form-label">Category <span>*</span></label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-select" required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Media Type</label>
                <select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })} className="form-select">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Image URL <span>*</span></label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="form-input" required placeholder="https://images.unsplash.com/..." />
                  <button type="button" onClick={handleRandomImage} className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }} title="Random image">
                    <i className="fa-solid fa-shuffle"></i> Random
                  </button>
                </div>
                {form.image && (
                  <img src={form.image} alt="Preview" style={{ marginTop: '8px', width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
                )}
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Project URL (optional)</label>
                <input type="url" value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} className="form-input" placeholder="https://example.com/project" />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description <span>*</span></label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-textarea" rows="3" required placeholder="Describe the project, client, and results achieved..." />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }} />
                  <span>Publish (visible on website)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }} />
                  <span>Mark as Featured</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
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