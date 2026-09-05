export default function Specimen({ title, hard, annotations, children }) {
  return (
    <section className="specimen" data-hard={hard ? 'true' : 'false'}>
      <div className="specimen-header">
        <h3>{title}</h3>
        {hard && <span className="hard-badge">hard mode</span>}
      </div>
      <div className="specimen-body">{children}</div>
      {annotations && (
        <div className="specimen-annotation">
          {annotations.map(([label, value]) => (
            <span key={label}>
              <strong>{label}:</strong> {value}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
