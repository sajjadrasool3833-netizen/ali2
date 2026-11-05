import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/ui/Loader.jsx';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${slug}`).then(({ data }) => setPost(data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!post) return <div style={{ padding: '140px 24px', textAlign: 'center' }}>Post not found</div>;

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1 className="section-title">{post.title}</h1></div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </div>
      </section>
    </div>
  );
}