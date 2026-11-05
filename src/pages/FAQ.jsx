const faqs = [
  { q: 'How long does a project take?', a: 'Timeline varies by project scope. Most projects complete within 1-2 weeks.' },
  { q: 'Do you offer revisions?', a: 'Yes! All packages include revisions. Premium packages include unlimited revisions.' },
  { q: 'What payment methods do you accept?', a: 'We accept bank transfer, JazzCash, EasyPaisa, and international payments.' },
  { q: 'Do you work with international clients?', a: 'Absolutely! We serve clients across Pakistan, UAE, UK, USA, and worldwide.' },
  { q: 'How do I place an order?', a: 'Fill out the order form on our website. We will contact you within 24 hours.' },
  { q: 'Can I request a custom package?', a: 'Yes! Contact us and we will create a tailored solution for your needs.' },
];

export default function FAQ() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-label">FAQ</span>
          <h1 className="section-title">Frequently Asked <span className="gradient-gold">Questions</span></h1>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((f, i) => (
              <details key={i} className="card" style={{ cursor: 'pointer' }}>
                <summary style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, listStyle: 'none' }}>{f.q}</summary>
                <p style={{ color: 'var(--gray-400)', marginTop: '16px', lineHeight: 1.6 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}