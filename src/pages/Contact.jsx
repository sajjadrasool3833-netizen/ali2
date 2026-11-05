import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">Contact Us</span>
          <h1 className="section-title">Let's <span className="gradient-gold">Talk</span></h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div>
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '16px' }}>
                  <i className="fa-brands fa-whatsapp" style={{ color: 'var(--gold)', marginRight: '12px' }}></i>WhatsApp
                </h3>
                <p style={{ color: 'var(--gray-400)' }}>+92 300 1234567</p>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm" style={{ marginTop: '16px' }}>Chat Now</a>
              </div>
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '16px' }}>
                  <i className="fa-solid fa-envelope" style={{ color: 'var(--gold)', marginRight: '12px' }}></i>Email
                </h3>
                <p style={{ color: 'var(--gray-400)' }}>info@alihamzadigital.com</p>
              </div>
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '16px' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--gold)', marginRight: '12px' }}></i>Location
                </h3>
                <p style={{ color: 'var(--gray-400)' }}>Lahore, Pakistan</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
              <div className="form-group">
                <label className="form-label">Name <span>*</span></label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email <span>*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject <span>*</span></label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Message <span>*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} className="form-textarea" required rows="5" />
              </div>
              <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}