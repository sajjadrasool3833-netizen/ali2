import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle.jsx';

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-blob-1"></div>
        <div className="hero-blob-2"></div>
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              PREMIUM DIGITAL AGENCY
            </div>
            <h1>
              Elevate Your Brand with <span className="gradient-gold">World-Class</span> Digital Services
            </h1>
            <p>
              From social media marketing to website development, we craft digital experiences that convert. Serving ambitious brands across Pakistan and beyond.
            </p>
            <div className="hero-actions">
              <Link to="/order" className="btn btn-gold btn-lg">
                Start Your Project <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link to="/portfolio" className="btn btn-outline btn-lg">
                View Portfolio
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">250+</div>
                <div className="hero-stat-label">Projects</div>
              </div>
              <div className="hero-divider"></div>
              <div>
                <div className="hero-stat-value">120+</div>
                <div className="hero-stat-label">Clients</div>
              </div>
              <div className="hero-divider"></div>
              <div>
                <div className="hero-stat-value">4.9★</div>
                <div className="hero-stat-label">Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
              alt="Digital Agency Team"
            />
            <div className="hero-visual-grid">
              <div className="hero-visual-card">
                <i className="fa-solid fa-chart-line"></i>
                <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Marketing ROI</div>
                <div style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 700 }}>+340%</div>
              </div>
              <div className="hero-visual-card">
                <i className="fa-solid fa-rocket"></i>
                <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>Delivery Time</div>
                <div style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 700 }}>7 Days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section">
        <div className="container">
          <SectionTitle
            label="What We Offer"
            title={
              <>
                Premium <span className="gradient-gold">Services</span> Tailored for You
              </>
            }
          />
          <div className="grid-services">
            {[
              {
                icon: 'fa-brands fa-facebook-f',
                title: 'Social Media Marketing',
                desc: 'Facebook, Instagram, TikTok & YouTube ads that convert.',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop&q=80',
              },
              {
                icon: 'fa-solid fa-pen-nib',
                title: 'Graphic Design',
                desc: 'Logos, branding, video editing & premium content creation.',
                image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&auto=format&fit=crop&q=80',
              },
              {
                icon: 'fa-solid fa-code',
                title: 'Web Development',
                desc: 'WordPress, Shopify & custom e-commerce websites.',
                image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&auto=format&fit=crop&q=80',
              },
              {
                icon: 'fa-solid fa-robot',
                title: 'AI & Digital Services',
                desc: 'AI tools, Daraz management, business consulting & more.',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80',
              },
            ].map((s, i) => (
              <div key={i} className="card card-hover">
                <div className="service-icon">
                  <i className={s.icon}></i>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>
                  {s.title}
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '14px', marginBottom: '16px' }}>{s.desc}</p>
                <Link to="/services" style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: 600 }}>
                  Learn More <i className="fa-solid fa-arrow-right" style={{ fontSize: '12px' }}></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section section-alt">
        <div className="container">
          <SectionTitle
            label="Why Choose Us"
            title={
              <>
                The <span className="gradient-gold">Advantage</span> You Deserve
              </>
            }
          />
          <div className="grid-why">
            {[
              { icon: 'fa-solid fa-award', title: 'Premium Quality', desc: 'International-standard deliverables every time.' },
              { icon: 'fa-solid fa-bolt', title: 'Fast Turnaround', desc: 'Projects delivered on-time, every time.' },
              { icon: 'fa-solid fa-headset', title: '24/7 Support', desc: 'Direct WhatsApp access to your account manager.' },
              { icon: 'fa-solid fa-shield-halved', title: 'Secure Payments', desc: 'Trusted transactions with money-back guarantee.' },
              { icon: 'fa-solid fa-chart-line', title: 'Proven Results', desc: 'Data-driven strategies that deliver measurable ROI.' },
              { icon: 'fa-solid fa-globe', title: 'Global Reach', desc: 'Trusted by clients across Pakistan, UAE, UK & USA.' },
            ].map((w, i) => (
              <div key={i} className="card card-hover" style={{ textAlign: 'center' }}>
                <i
                  className={w.icon}
                  style={{ color: 'var(--gold)', fontSize: '36px', marginBottom: '16px', display: 'block' }}
                ></i>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>{w.title}</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '14px' }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="section">
        <div className="container">
          <SectionTitle
            label="How We Work"
            title={
              <>
                Our Simple <span className="gradient-gold">Process</span>
              </>
            }
          />
          <div className="grid-services">
            {[
              { step: '01', title: 'Consultation', desc: 'We discuss your goals, vision, and requirements.' },
              { step: '02', title: 'Strategy', desc: 'We craft a tailored plan to achieve your objectives.' },
              { step: '03', title: 'Execution', desc: 'Our expert team brings the plan to life with precision.' },
              { step: '04', title: 'Delivery', desc: 'We deliver on-time and support you post-launch.' },
            ].map((p, i) => (
              <div key={i} className="card card-hover" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '48px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    marginBottom: '12px',
                  }}
                >
                  {p.step}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>{p.title}</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '14px' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-wrap">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                marginBottom: '16px',
              }}
            >
              Ready to <span className="gradient-gold">Transform</span> Your Brand?
            </h2>
            <p style={{ color: 'var(--gray-400)', maxWidth: '600px', margin: '0 auto' }}>
              Book a free consultation today and discover how we can help grow your business.
            </p>
            <div className="cta-actions">
              <Link to="/order" className="btn btn-gold btn-lg">
                Order Now
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}