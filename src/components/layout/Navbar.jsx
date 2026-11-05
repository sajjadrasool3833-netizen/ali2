import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">AH</div>
          <div>
            <span className="navbar-name">Ali Hamza</span>
            <span className="navbar-tagline">Digital Hub</span>
          </div>
        </Link>
        <div className="navbar-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/order" className="btn btn-gold btn-sm">Order Now</Link>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>
      {menuOpen && (
        <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, background: 'rgba(10,17,40,0.98)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} style={{ padding: '10px 16px', color: 'var(--gray-100)' }}>{l.label}</Link>
          ))}
          <Link to="/order" className="btn btn-gold btn-sm">Order Now</Link>
        </div>
      )}
    </nav>
  );
}