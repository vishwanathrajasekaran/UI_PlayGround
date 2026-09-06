export default function Specimen({ id, title, hard, annotations, done, onToggleDone, children }) {
  return (
    <section className="specimen" data-hard={hard ? 'true' : 'false'} data-done={done ? 'true' : 'false'}>
      <div className="specimen-header">
        <h3>{title}</h3>
        <div className="specimen-header-actions">
          {hard && <span className="hard-badge">hard mode</span>}
          {onToggleDone && (
            <button
              type="button"
              className="mark-done-btn"
              data-testid={id ? `mark-done-${id}` : undefined}
              onClick={() => onToggleDone(id)}
            >
              {done ? '✓ Completed' : 'Mark done'}
            </button>
          )}
        </div>
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
