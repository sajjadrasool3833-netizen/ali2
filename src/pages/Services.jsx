import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/ui/Loader.jsx';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(({ data }) => setServices(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">Our Services</span>
          <h1 className="section-title">Premium <span className="gradient-gold">Digital Services</span></h1>
          <p className="section-subtitle">Complete digital solutions designed to grow your business.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : services.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '64px 0' }}>No services yet. Run backend seed.</div>
          ) : (
            <div className="grid-services" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {services.map((s) => (
                <div key={s._id} className="card card-hover">
                  <div className="service-icon"><i className={s.icon || 'fa-solid fa-star'}></i></div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--gray-400)', fontSize: '14px', marginBottom: '16px' }}>{s.shortDescription}</p>
                  <Link to={`/services/${s.slug}`} className="btn btn-outline btn-sm">View Details <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}