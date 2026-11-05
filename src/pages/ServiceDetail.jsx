import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/ui/Loader.jsx';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/services/${slug}`).then(({ data }) => setService(data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!service) return <div style={{ padding: '140px 24px', textAlign: 'center' }}>Service not found. <Link to="/services" style={{ color: 'var(--gold)' }}>Back</Link></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">{service.category}</span>
          <h1 className="section-title">{service.title}</h1>
          <p className="section-subtitle">{service.shortDescription}</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card" style={{ padding: '40px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '16px' }}>About This Service</h2>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '16px' }}>{service.description}</p>
            <div style={{ color: 'var(--gold)', fontSize: '24px', fontWeight: 700 }}>Starting from PKR {service.priceFrom?.toLocaleString()}</div>
          </div>
          {service.features?.length > 0 && (
            <div className="card" style={{ padding: '40px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '16px' }}>What's Included</h2>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {service.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--gray-400)' }}>
                    <i className="fa-solid fa-check" style={{ color: 'var(--gold)' }}></i>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/order" className="btn btn-gold btn-lg">Order This Service <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>
    </div>
  );
}