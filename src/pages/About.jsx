import SectionTitle from '../components/ui/SectionTitle.jsx';

export default function About() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">About Us</span>
          <h1 className="section-title">Building Brands That <span className="gradient-gold">Dominate</span></h1>
          <p className="section-subtitle">Ali Hamza Digital Hub is a premium digital agency dedicated to helping ambitious brands achieve world-class results.</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card" style={{ padding: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>Our <span className="gradient-gold">Story</span></h2>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '16px' }}>Founded with a vision to bridge the gap between Pakistani businesses and world-class digital solutions, Ali Hamza Digital Hub has grown into a full-service digital agency trusted by over 120 clients worldwide.</p>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '16px' }}>We specialize in social media marketing, web development, graphic design, video editing, AI services, and complete business consulting.</p>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8 }}>Our mission is simple: <strong style={{ color: 'var(--gold)' }}>help ambitious brands grow faster through smart digital strategies.</strong></p>
          </div>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container">
          <SectionTitle label="Our Values" title={<>What <span className="gradient-gold">Drives</span> Us</>} />
          <div className="grid-why">
            {[
              { icon: 'fa-solid fa-bullseye', title: 'Results Focused', desc: 'Every decision is driven by measurable outcomes.' },
              { icon: 'fa-solid fa-handshake', title: 'Client First', desc: 'Your success is our success — always.' },
              { icon: 'fa-solid fa-lightbulb', title: 'Innovation', desc: 'We stay ahead of trends so you do too.' },
              { icon: 'fa-solid fa-lock', title: 'Integrity', desc: 'Honest, transparent, and ethical in everything.' },
              { icon: 'fa-solid fa-bolt', title: 'Speed', desc: 'Fast execution without compromising quality.' },
              { icon: 'fa-solid fa-heart', title: 'Passion', desc: 'We love what we do — and it shows.' },
            ].map((v, i) => (
              <div key={i} className="card card-hover" style={{ textAlign: 'center' }}>
                <i className={v.icon} style={{ color: 'var(--gold)', fontSize: '36px', marginBottom: '16px', display: 'block' }}></i>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>{v.title}</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '14px' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}