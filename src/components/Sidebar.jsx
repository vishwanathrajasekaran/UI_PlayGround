import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { catalog } from '../catalog.js'
import Icon from './Icon.jsx'

export default function Sidebar({ collapsed = false, mobileOpen = false, onClose, onToggle }) {
  const [query, setQuery] = useState('')
  const availableCount = catalog.filter((item) => item.path).length
  const normalizedQuery = query.trim().toLowerCase()
  const filteredCatalog = useMemo(
    () =>
      catalog.filter((item) => {
        if (!normalizedQuery) return true
        return `${item.code} ${item.name} ${item.description}`.toLowerCase().includes(normalizedQuery)
      }),
    [normalizedQuery],
  )

  const handleLinkClick = () => {
    onClose?.()
  }

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-open' : ''}`} data-testid="sidebar">
      <div className="sidebar-brand-row">
        <Link to="/" className="sidebar-brand" onClick={handleLinkClick}>
          <span className="sidebar-logo-wrap">
            <img src="/logo-mark.png" alt="" width="30" height="30" className="sidebar-logo" />
          </span>
          <span className="sidebar-brand-copy">
            <strong>UI Playground</strong>
            <span>Automation practice lab</span>
          </span>
        </Link>
        <button className="icon-button sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}>
          <Icon name="close" size={17} />
        </button>
      </div>

      <div className="sidebar-search">
        <Icon name="search" size={16} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search labs"
          aria-label="Search labs"
          data-testid="sidebar-search"
        />
        {query && (
          <button type="button" className="sidebar-search-clear" aria-label="Clear lab search" onClick={() => setQuery('')}>
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <div className="sidebar-section">
          <span className="sidebar-section-label">Workspace</span>
          <NavLink to="/" end onClick={handleLinkClick} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="sidebar-nav-icon"><Icon name="grid" size={16} /></span>
            <span className="sidebar-nav-label">Overview</span>
            <span className="sidebar-nav-code">IDX</span>
          </NavLink>
          <NavLink to="/challenges" onClick={handleLinkClick} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="sidebar-nav-icon"><Icon name="spark" size={16} /></span>
            <span className="sidebar-nav-label">Challenge path</span>
            <span className="sidebar-nav-code">CH</span>
          </NavLink>
        </div>

        <div className="sidebar-section sidebar-section-labs">
          <div className="sidebar-section-heading">
            <span className="sidebar-section-label">Practice labs</span>
            <span className="sidebar-count">{availableCount}</span>
          </div>
          {filteredCatalog.length === 0 && <p className="sidebar-empty">No labs match that search.</p>}
          {filteredCatalog.map((item) =>
            item.path ? (
              <NavLink key={item.code} to={item.path} onClick={handleLinkClick} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="sidebar-nav-icon sidebar-nav-code-label">{item.code}</span>
                <span className="sidebar-nav-label">{item.name}</span>
                <span className="sidebar-nav-status" aria-label="Ready"><span /></span>
              </NavLink>
            ) : (
              <div key={item.code} className="sidebar-nav-item planned" title="Coming soon">
                <span className="sidebar-nav-icon sidebar-nav-code-label">{item.code}</span>
                <span className="sidebar-nav-label">{item.name}</span>
                <span className="sidebar-nav-status" aria-label="Planned"><span /></span>
              </div>
            ),
          )}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-progress-ring" aria-hidden="true"><span>∞</span></div>
        <div className="sidebar-footer-copy">
          <strong>Small steps, real skill.</strong>
          <span>Interact → verify → mark done.</span>
        </div>
        <button
          className="icon-button sidebar-collapse"
          type="button"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          onClick={onToggle}
        >
          <Icon name="chevron" size={16} />
        </button>
      </div>
    </aside>
  )
}
