import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'Ali Hamza',
  tags: '',
  published: false,
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/blogs/admin/all');
      setBlogs(data);
    } catch (err) {
      error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Open create modal
  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      slug: blog.slug || '',
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      author: blog.author || 'Ali Hamza',
      tags: (blog.tags || []).join(', '),
      published: blog.published || false,
    });
    setShowModal(true);
  };

  // Auto-generate slug from title
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

  // Submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload);
        success('Blog updated successfully!');
      } else {
        await api.post('/blogs', payload);
        success('Blog created successfully!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      success('Blog deleted');
      fetchBlogs();
    } catch (err) {
      error('Failed to delete blog');
    }
  };

  // Toggle publish
  const handleTogglePublish = async (blog) => {
    try {
      await api.put(`/blogs/${blog._id}`, { ...blog, published: !blog.published });
      success(blog.published ? 'Blog unpublished' : 'Blog published!');
      fetchBlogs();
    } catch (err) {
      error('Failed to update status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <h1>Blog Management</h1>
        <button className="btn btn-gold" onClick={handleCreate}>
          <i className="fa-solid fa-plus"></i> New Blog Post
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-file-alt" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Total Posts</div>
          <div className="value">{blogs.length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-check-circle" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Published</div>
          <div className="value">{blogs.filter((b) => b.published).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-pen" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Drafts</div>
          <div className="value">{blogs.filter((b) => !b.published).length}</div>
        </div>
      </div>

      {/* Blogs Table */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <i className="fa-solid fa-blog" style={{ fontSize: '48px', color: 'var(--gray-600)', marginBottom: '16px' }}></i>
          <p style={{ color: 'var(--gray-400)', marginBottom: '16px' }}>No blog posts yet.</p>
          <button className="btn btn-gold" onClick={handleCreate}>Create First Blog Post</button>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(212,175,55,0.08)', textAlign: 'left' }}>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cover</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Title</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Author</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</th>
                <th style={{ padding: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ) : (
                      <div style={{ width: '64px', height: '48px', background: 'rgba(212,175,55,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-image" style={{ color: 'var(--gray-600)' }}></i>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{blog.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{blog.excerpt?.slice(0, 60)}...</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--gray-400)', fontSize: '14px' }}>{blog.author}</td>
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: blog.published ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        color: blog.published ? 'var(--success)' : '#f59e0b',
                      }}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--gray-400)', fontSize: '14px' }}>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        className="btn btn-sm"
                        style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', padding: '6px 10px' }}
                        title={blog.published ? 'Unpublish' : 'Publish'}
                      >
                        <i className={`fa-solid ${blog.published ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="btn btn-sm"
                        style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '6px 10px' }}
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="btn btn-sm"
                        style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '6px 10px' }}
                        title="Delete"
                      >
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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
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
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
                {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ fontSize: '24px', color: 'var(--gray-400)' }}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Title <span>*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleTitleChange}
                  className="form-input"
                  required
                  placeholder="How to Grow Your Business in 2025"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="form-input"
                  placeholder="how-to-grow-your-business"
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Cover Image URL</label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt="Preview"
                    style={{ marginTop: '8px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="form-input"
                  placeholder="marketing, business, tips"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Excerpt <span>*</span></label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="form-textarea"
                  rows="2"
                  required
                  placeholder="Short summary of the blog post..."
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Content <span>*</span></label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="form-textarea"
                  rows="10"
                  required
                  placeholder="Write your blog content here..."
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--gold)' }}
                  />
                  <span>Publish immediately (unchecked = save as draft)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}