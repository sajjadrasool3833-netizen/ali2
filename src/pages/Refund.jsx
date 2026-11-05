export default function Refund() {
  return (
    <div>
      <div className="page-header">
        <div className="container"><h1 className="section-title">Refund <span className="gradient-gold">Policy</span></h1></div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Refund Eligibility</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '24px' }}>Refunds are available within 7 days of order placement if work has not yet begun.</p>
            <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Non-Refundable</h3>
            <p style={{ color: 'var(--gray-400)', lineHeight: 1.8 }}>Once project work has commenced, refunds are not available. However, we offer revisions until satisfaction.</p>
          </div>
        </div>
      </section>
    </div>
  );
}