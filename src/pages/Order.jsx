import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext.jsx';

export default function Order() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ customerName: '', whatsapp: '', email: '', service: '', projectDetails: '', budget: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => { api.get('/services').then(({ data }) => setServices(data)).catch(() => {}); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', form);
      setSuccess(data.order);
      toastSuccess('Order placed successfully!');
      setForm({ customerName: '', whatsapp: '', email: '', service: '', projectDetails: '', budget: '' });
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">Order Now</span>
          <h1 className="section-title">Start Your <span className="gradient-gold">Project</span> Today</h1>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          {success ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '16px' }}>Order Placed!</h2>
              <p style={{ color: 'var(--gray-400)', marginBottom: '16px' }}>Your order number is:</p>
              <p style={{ color: 'var(--gold)', fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>{success.orderNumber}</p>
              <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>We'll contact you on WhatsApp within 24 hours.</p>
              <button className="btn btn-gold" onClick={() => setSuccess(null)}>Place Another Order</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{ padding: '40px' }}>
              <div className="form-group">
                <label className="form-label">Full Name <span>*</span></label>
                <input type="text" name="customerName" value={form.customerName} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number <span>*</span></label>
                <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="form-input" required placeholder="+92 300 1234567" />
              </div>
              <div className="form-group">
                <label className="form-label">Email <span>*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Service Required <span>*</span></label>
                <select name="service" value={form.service} onChange={handleChange} className="form-select" required>
                  <option value="">Select a service</option>
                  {services.map((s) => (<option key={s._id} value={s.title}>{s.title}</option>))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Budget <span>*</span></label>
                <select name="budget" value={form.budget} onChange={handleChange} className="form-select" required>
                  <option value="">Select budget range</option>
                  <option value="Under PKR 15,000">Under PKR 15,000</option>
                  <option value="PKR 15,000 - 35,000">PKR 15,000 - 35,000</option>
                  <option value="PKR 35,000 - 75,000">PKR 35,000 - 75,000</option>
                  <option value="PKR 75,000+">PKR 75,000+</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Project Details <span>*</span></label>
                <textarea name="projectDetails" value={form.projectDetails} onChange={handleChange} className="form-textarea" required rows="5" />
              </div>
              <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}