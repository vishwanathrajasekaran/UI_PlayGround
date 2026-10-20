import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Icon from './components/Icon.jsx'
import { catalog } from './catalog.js'
import Home from './pages/Home.jsx'
import BasicElements from './pages/basic-elements/BasicElements.jsx'
import Forms from './pages/forms/Forms.jsx'
import SelectionControls from './pages/selection-controls/SelectionControls.jsx'
import AdvancedControls from './pages/advanced-controls/AdvancedControls.jsx'
import Tables from './pages/tables/Tables.jsx'
import Navigation from './pages/navigation/Navigation.jsx'
import Popups from './pages/popups/Popups.jsx'
import MouseKeyboard from './pages/mouse-keyboard/MouseKeyboard.jsx'
import WindowsIframes from './pages/windows-iframes/WindowsIframes.jsx'
import DynamicBehavior from './pages/dynamic-behavior/DynamicBehavior.jsx'
import ApiNetwork from './pages/api-network/ApiNetwork.jsx'
import Authentication from './pages/authentication/Authentication.jsx'
import Ecommerce from './pages/ecommerce/Ecommerce.jsx'
import Admin from './pages/admin/Admin.jsx'
import LocatorLab from './pages/locator-lab/LocatorLab.jsx'
import TestDataLab from './pages/test-data-lab/TestDataLab.jsx'
import WaitStrategies from './pages/wait-strategies/WaitStrategies.jsx'
import Challenges from './pages/challenges/Challenges.jsx'
import SpecialChallenges from './pages/special-challenges/SpecialChallenges.jsx'

export default function App() {
  const location = useLocation()
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ui-playground-theme') || 'day'
    } catch {
      return 'day'
    }
  })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentPage = useMemo(() => {
    if (location.pathname === '/') return { code: 'IDX', name: 'Overview' }
    return catalog.find((item) => item.path === location.pathname) || { code: 'LAB', name: 'Practice lab' }
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('ui-playground-theme', theme)
    } catch {
      // Theme still works for the current visit when storage is unavailable.
    }
  }, [theme])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  function handleSidebarToggle() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      setSidebarOpen((open) => !open)
      return
    }

    setSidebarCollapsed((collapsed) => !collapsed)
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''} ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={handleSidebarToggle}
      />
      {sidebarOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <div className="app-frame">
        <header className="topbar">
          <div className="topbar-leading">
            <button
              className="icon-button menu-toggle"
              type="button"
              aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              onClick={handleSidebarToggle}
            >
              <Icon name="menu" />
            </button>
            <div className="topbar-context">
              <span className="topbar-kicker">Learning control room</span>
              <div className="topbar-location">
                <span className="topbar-code">{currentPage.code}</span>
                <span>{currentPage.name}</span>
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <a
              className="topbar-link"
              href="https://vishwanathrajasekaran.in/"
              aria-label="Open About page"
            >
              <span>About</span>
              <Icon name="arrow" size={15} />
            </a>
            <Link className="topbar-link" to="/challenges" aria-label="Open practice path">
              <span>Practice path</span>
              <Icon name="arrow" size={15} />
            </Link>
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === 'day' ? 'midnight' : 'daylight'} theme`}
              aria-pressed={theme === 'day'}
              onClick={() => setTheme((current) => (current === 'day' ? 'night' : 'day'))}
            >
              <Icon name={theme === 'day' ? 'sun' : 'moon'} size={16} />
              <span>{theme === 'day' ? 'Daylight' : 'Midnight'}</span>
            </button>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/basic-elements" element={<BasicElements />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/selection-controls" element={<SelectionControls />} />
            <Route path="/advanced-controls" element={<AdvancedControls />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/navigation" element={<Navigation />} />
            <Route path="/popups" element={<Popups />} />
            <Route path="/mouse-keyboard" element={<MouseKeyboard />} />
            <Route path="/windows-iframes" element={<WindowsIframes />} />
            <Route path="/dynamic-behavior" element={<DynamicBehavior />} />
            <Route path="/api-network" element={<ApiNetwork />} />
            <Route path="/authentication" element={<Authentication />} />
            <Route path="/ecommerce" element={<Ecommerce />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/locator-lab" element={<LocatorLab />} />
            <Route path="/test-data-lab" element={<TestDataLab />} />
            <Route path="/wait-strategies" element={<WaitStrategies />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/special-challenges" element={<SpecialChallenges />} />
            </Routes>
        </main>
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Vishwanath Rajasekaran | SDET | Automation Engineer</span>
        </footer>
      </div>
    </div>
  )
}
