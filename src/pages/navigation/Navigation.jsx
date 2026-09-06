import { useEffect, useRef, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['navbar', 'tabs', 'accordion', 'breadcrumb', 'dropdown-menu']

export default function Navigation() {
  const { isDone, toggle, completedCount, total } = useProgress('navigation', SPECIMEN_IDS)

  // --- Navbar (demo — not real routing) ---
  const [activeNavItem, setActiveNavItem] = useState('home')

  // --- Tabs ---
  const [activeTab, setActiveTab] = useState('overview')

  // --- Accordion (single-open) ---
  const [openPanel, setOpenPanel] = useState(null)
  const faqs = [
    { id: 'faq-1', q: 'What is this playground for?', a: 'Practicing UI automation locators and interaction patterns.' },
    { id: 'faq-2', q: 'Is there a backend?', a: 'Not yet — phase 1 is frontend-only.' },
    { id: 'faq-3', q: 'Can I contribute a new sheet?', a: 'Yes — follow the Specimen pattern documented in the README.' },
  ]

  // --- Dropdown menu ---
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>NV — Navigation</h1>
          <p>
            Navbar with active-state highlighting, tabs, a single-open accordion, a breadcrumb
            trail, and a dropdown menu that closes on outside click or Escape.
          </p>
        </div>
        <div className="title-block-fields">
          <div>
            <span className="field-label">Progress</span>
            {completedCount} / {total} marked done
          </div>
        </div>
      </div>

      <Specimen
        id="navbar"
        title="Navbar — active state"
        done={isDone('navbar')}
        onToggleDone={toggle}
        annotations={[
          ['nav id', 'demo-navbar'],
          ['active item', activeNavItem],
          ['note', 'active link carries aria-current="page"'],
        ]}
      >
        <nav id="demo-navbar" data-testid="demo-navbar" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-grid)' }}>
          {['home', 'products', 'about'].map((item) => (
            <button
              key={item}
              data-testid={`navbar-${item}`}
              aria-current={activeNavItem === item ? 'page' : undefined}
              onClick={() => setActiveNavItem(item)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '8px 14px',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '0.88rem',
                borderBottom: activeNavItem === item ? '2px solid var(--color-accent)' : '2px solid transparent',
                color: activeNavItem === item ? 'var(--color-ink)' : 'var(--color-ink-soft)',
                fontWeight: activeNavItem === item ? 600 : 400,
              }}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
      </Specimen>

      <Specimen
        id="tabs"
        title="Tabs"
        done={isDone('tabs')}
        onToggleDone={toggle}
        annotations={[
          ['tablist id', 'demo-tabs'],
          ['active tab', activeTab],
          ['panel id', `panel-${activeTab}`],
        ]}
      >
        <div>
          <div role="tablist" id="demo-tabs" data-testid="demo-tabs" style={{ display: 'flex', gap: 8 }}>
            {['overview', 'details', 'reviews'].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                data-testid={`tab-${tab}`}
                className={activeTab === tab ? 'btn' : 'btn btn-outline'}
                onClick={() => setActiveTab(tab)}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            data-testid={`panel-${activeTab}`}
            style={{ padding: '14px 4px', fontSize: '0.88rem', color: 'var(--color-ink-soft)' }}
          >
            {activeTab === 'overview' && 'This is the overview panel.'}
            {activeTab === 'details' && 'This is the details panel.'}
            {activeTab === 'reviews' && 'This is the reviews panel.'}
          </div>
        </div>
      </Specimen>

      <Specimen
        id="accordion"
        title="Accordion — single open panel"
        done={isDone('accordion')}
        onToggleDone={toggle}
        annotations={[
          ['header buttons', 'data-testid="accordion-header-{id}"'],
          ['open panel', openPanel || '(none)'],
        ]}
      >
        <div id="faq-accordion" data-testid="faq-accordion">
          {faqs.map((f) => (
            <div key={f.id} style={{ borderBottom: '1px solid var(--color-grid)' }}>
              <button
                data-testid={`accordion-header-${f.id}`}
                aria-expanded={openPanel === f.id}
                onClick={() => setOpenPanel((cur) => (cur === f.id ? null : f.id))}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 4px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontWeight: 500,
                }}
              >
                {openPanel === f.id ? '▾' : '▸'} {f.q}
              </button>
              {openPanel === f.id && (
                <div data-testid={`accordion-panel-${f.id}`} style={{ padding: '0 4px 12px', color: 'var(--color-ink-soft)', fontSize: '0.86rem' }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen
        id="breadcrumb"
        title="Breadcrumb"
        done={isDone('breadcrumb')}
        onToggleDone={toggle}
        annotations={[
          ['nav id', 'demo-breadcrumb'],
          ['current page', 'marked with aria-current="page"'],
        ]}
      >
        <nav id="demo-breadcrumb" data-testid="demo-breadcrumb" aria-label="Breadcrumb">
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: '0.86rem' }}>
            <li>
              <a href="/" data-testid="crumb-home">
                Home
              </a>
            </li>
            <li>›</li>
            <li>
              <a href="/navigation" data-testid="crumb-navigation">
                Navigation
              </a>
            </li>
            <li>›</li>
            <li aria-current="page" data-testid="crumb-current" style={{ color: 'var(--color-ink-soft)' }}>
              Breadcrumb specimen
            </li>
          </ol>
        </nav>
      </Specimen>

      <Specimen
        id="dropdown-menu"
        title="Dropdown menu — outside click / Escape closes"
        done={isDone('dropdown-menu')}
        onToggleDone={toggle}
        annotations={[
          ['trigger id', 'menu-trigger'],
          ['menu id', 'menu-dropdown'],
          ['state', menuOpen ? 'open' : 'closed'],
        ]}
      >
        <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button id="menu-trigger" data-testid="menu-trigger" className="btn btn-outline" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            Options ▾
          </button>
          {menuOpen && (
            <ul
              id="menu-dropdown"
              data-testid="menu-dropdown"
              style={{
                listStyle: 'none',
                margin: '4px 0 0',
                padding: 4,
                position: 'absolute',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-grid)',
                borderRadius: 4,
                minWidth: 160,
                zIndex: 1,
              }}
            >
              {['Rename', 'Duplicate', 'Delete'].map((item) => (
                <li key={item}>
                  <button
                    data-testid={`menu-item-${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit' }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Specimen>
    </>
  )
}
