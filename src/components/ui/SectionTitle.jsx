export default function SectionTitle({ label, title, subtitle, children }) {
  return (
    <div className="section-title-wrap">
      {label && <span className="section-label">{label}</span>}
      <h2 className="section-title">{title} {children}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}