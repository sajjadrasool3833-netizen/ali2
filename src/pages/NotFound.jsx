import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '160px 24px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '120px', color: 'var(--gold)' }}>404</h1>
      <p style={{ color: 'var(--gray-400)', marginTop: '16px', marginBottom: '32px', fontSize: '18px' }}>Page not found</p>
      <Link to="/" className="btn btn-gold">Back to Home</Link>
    </div>
  );
}