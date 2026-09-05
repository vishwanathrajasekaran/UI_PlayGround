import { NavLink } from 'react-router-dom'
import { catalog } from '../catalog.js'

export default function Sidebar() {
  return (
    <aside className="sidebar" data-testid="sidebar">
      <div className="sidebar-title">
        UI Automation Playground
        <span className="mono-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-ink-soft)' }}>
          rev. 0.1 — sheet 1 of 19
        </span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <span className="code">IDX</span> Index
        </NavLink>
        {catalog.map((item) =>
          item.path ? (
            <NavLink key={item.code} to={item.path}>
              <span className="code">{item.code}</span> {item.name}
            </NavLink>
          ) : (
            <span key={item.code} style={{ display: 'flex', gap: 8, padding: '7px 20px', fontSize: '0.88rem', color: 'var(--color-grid)' }}>
              <span className="code" style={{ color: 'var(--color-grid)' }}>
                {item.code}
              </span>
              {item.name}
            </span>
          ),
        )}
      </nav>
    </aside>
  )
}
