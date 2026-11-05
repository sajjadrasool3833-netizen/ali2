import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: 'fa-chart-pie', end: true },
    { to: '/admin/orders', label: 'Orders', icon: 'fa-shopping-cart' },
    { to: '/admin/services', label: 'Services', icon: 'fa-concierge-bell' },
    { to: '/admin/packages', label: 'Packages', icon: 'fa-box' },
    { to: '/admin/portfolio', label: 'Portfolio', icon: 'fa-images' },
    { to: '/admin/testimonials', label: 'Testimonials', icon: 'fa-quote-left' },
    { to: '/admin/blogs', label: 'Blog', icon: 'fa-blog' },
    { to: '/admin/messages', label: 'Messages', icon: 'fa-envelope' },
    { to: '/admin/settings', label: 'Settings', icon: 'fa-cog' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="navbar-logo" style={{ width: '40px', height: '40px', fontSize: '18px' }}>AH</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}>Ali Hamza</div>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--gold)' }}>ADMIN PANEL</div>
        </div>
      </div>
      <nav className="admin-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <i className={`fa-solid ${l.icon}`}></i>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
        <div style={{ padding: '0 16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--gray-600)' }}>{user?.email}</div>
        </div>
        <button onClick={handleLogout} className="admin-nav-link" style={{ width: '100%', textAlign: 'left' }}>
          <i className="fa-solid fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
}