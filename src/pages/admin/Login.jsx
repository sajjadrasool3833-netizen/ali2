import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      error(err.response?.data?.message || 'Login failed');
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
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>Admin Login</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '14px', marginTop: '8px' }}>Ali Hamza Digital Hub</p>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--gray-400)' }}>
          Don't have an account?{' '}
          <Link to="/admin/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--gray-600)' }}>
          Demo: admin@alihamzadigital.com / admin123
        </p>
      </form>
    </div>
  );
}