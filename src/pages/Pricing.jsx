import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/ui/Loader.jsx';

export default function Pricing() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/packages').then(({ data }) => setPackages(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">Pricing</span>
          <h1 className="section-title">Simple, Transparent <span className="gradient-gold">Pricing</span></h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : packages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '64px 0' }}>No packages yet.</div>
          ) : (
            <div className="grid-pricing">
              {packages.map((pkg) => (
                <div key={pkg._id} className={`card card-hover pricing-card ${pkg.popular ? 'popular' : ''}`} style={{ position: 'relative' }}>
                  {pkg.popular && <div className="pricing-badge">MOST POPULAR</div>}
                  <div style={{ fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.2em', marginBottom: '8px' }}>{pkg.tier?.toUpperCase()}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '8px' }}>{pkg.name}</h3>
                  <div className="pricing-price"><small style={{ fontSize: '16px', color: 'var(--gray-400)' }}>PKR </small>{pkg.price?.toLocaleString()}</div>
                  <ul className="pricing-features" style={{ margin: '24px 0' }}>
                    {pkg.features?.map((f, i) => (
                      <li key={i}><i className="fa-solid fa-check"></i>{f}</li>
                    ))}
                  </ul>
                  <Link to="/order" className={`btn ${pkg.popular ? 'btn-gold' : 'btn-outline'}`} style={{ width: '100%' }}>Order Now</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}