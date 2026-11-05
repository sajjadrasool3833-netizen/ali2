export default function Privacy() {
  return (
    <div>
      <div className="page-header">
        <div className="container"><h1 className="section-title">Privacy <span className="gradient-gold">Policy</span></h1></div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Information We Collect</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '24px' }}>We collect information you provide directly, such as name, email, and project details.</p>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>How We Use Your Data</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '24px' }}>We use your information to deliver services, communicate with you, and improve our offerings.</p>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Data Security</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8 }}>We implement industry-standard security measures to protect your data.</p>
          </div>
        </div>
      </section>
    </div>
  );
}