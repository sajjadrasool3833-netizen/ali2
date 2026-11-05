import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, services: 0, portfolio: 0, messages: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/orders').then(r => r.data.length).catch(() => 0),
      api.get('/services/admin/all').then(r => r.data.length).catch(() => 0),
      api.get('/portfolio/admin/all').then(r => r.data.length).catch(() => 0),
      api.get('/contact').then(r => r.data.length).catch(() => 0),
    ]).then(([orders, services, portfolio, messages]) => setStats({ orders, services, portfolio, messages }));
  }, []);

  return (
    <div>
      <div className="admin-header"><h1>Dashboard</h1></div>
      <div className="admin-stats">
        {[
          { label: 'Total Orders', value: stats.orders, icon: 'fa-shopping-cart' },
          { label: 'Services', value: stats.services, icon: 'fa-concierge-bell' },
          { label: 'Portfolio Items', value: stats.portfolio, icon: 'fa-images' },
          { label: 'Messages', value: stats.messages, icon: 'fa-envelope' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="label"><i className={`fa-solid ${s.icon}`} style={{ color: 'var(--gold)', marginRight: '8px' }}></i>{s.label}</div>
            <div className="value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '16px' }}>Welcome!</h2>
        <p style={{ color: 'var(--gray-400)' }}>Manage services, packages, orders, and content from the sidebar.</p>
      </div>
    </div>
  );
}