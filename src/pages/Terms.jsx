export default function Terms() {
  return (
    <div>
      <div className="page-header">
        <div className="container"><h1 className="section-title">Terms & <span className="gradient-gold">Conditions</span></h1></div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>1. Services</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '24px' }}>Ali Hamza Digital Hub provides digital marketing, design, and web development services.</p>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>2. Payment</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '24px' }}>50% advance required. Remaining 50% upon delivery.</p>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>3. Revisions</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8 }}>Revisions are included per project scope.</p>
          </div>
        </div>
      </section>
    </div>
  );
}