import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.jsx';
import api from '../../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Auto login after register
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data));
      success('Account created! Welcome!');
      navigate('/admin');
    } catch (err) {
      error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.12), transparent 60%)'
    }}>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '48px', maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="navbar-logo" style={{ margin: '0 auto 16px', width: '56px', height: '56px', fontSize: '24px' }}>AH</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>Create Account</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '14px', marginTop: '8px' }}>Ali Hamza Digital Hub — Admin</p>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Ali Hamza"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Min 6 characters"
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="form-input"
            placeholder="Re-enter password"
            required
          />
        </div>

        <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--gray-400)' }}>
          Already have an account?{' '}
          <Link to="/admin/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}