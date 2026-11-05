import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/ui/Loader.jsx';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs').then(({ data }) => setPosts(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">Blog</span>
          <h1 className="section-title">Our <span className="gradient-gold">Insights</span></h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : posts.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '64px 0' }}>No blog posts yet.</div>
          ) : (
            <div className="grid-portfolio">
              {posts.map((p) => (
                <Link key={p._id} to={`/blog/${p.slug}`} className="card card-hover">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '12px' }}>{p.title}</h3>
                  <p style={{ color: 'var(--gray-400)', fontSize: '14px' }}>{p.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}