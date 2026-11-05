import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/ui/Loader.jsx';

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portfolio').then(({ data }) => setItems(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">Our Work</span>
          <h1 className="section-title">Recent <span className="gradient-gold">Projects</span></h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '64px 0' }}>No portfolio items yet.</div>
          ) : (
            <div className="grid-portfolio">
              {items.map((item) => (
                <div key={item._id} className="card card-hover portfolio-card">
                  <img src={item.image} alt={item.title} className="portfolio-img" />
                  <div className="portfolio-body">
                    <div className="portfolio-category">{item.category}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>{item.title}</h3>
                    <p style={{ color: 'var(--gray-400)', fontSize: '14px' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}