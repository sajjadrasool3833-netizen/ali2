import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="navbar-logo">AH</div>
            <div>
              <span className="navbar-name">Ali Hamza</span>
              <span className="navbar-tagline">Digital Hub</span>
            </div>
          </div>
          <p>Premium digital marketing & IT services. Serving ambitious brands worldwide.</p>
          <div className="footer-socials">
            <a href="#" className="social-icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="social-icon"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#" className="social-icon"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/refund">Refund Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4>Get In Touch</h4>
          <p><i className="fa-brands fa-whatsapp text-gold" style={{ marginRight: '8px' }}></i>+92 300 1234567</p>
          <p><i className="fa-solid fa-envelope text-gold" style={{ marginRight: '8px' }}></i>info@alihamzadigital.com</p>
          <p><i className="fa-solid fa-location-dot text-gold" style={{ marginRight: '8px' }}></i>Lahore, Pakistan</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 Ali Hamza Digital Hub. All rights reserved. | <Link to="/admin/login" style={{ color: 'var(--gray-600)' }}>Admin</Link>
      </div>
    </footer>
  );
}