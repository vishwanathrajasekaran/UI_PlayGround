import { Link } from 'react-router-dom'
import { catalog } from '../catalog.js'

export default function Home() {
  const builtCount = catalog.filter((c) => c.path).length

  return (
    <>
      <div className="title-block" data-testid="title-block">
        <div className="title-block-main">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <img src="/logo-mark.png" alt="" width="44" height="44" style={{ borderRadius: 6 }} />
            <h1 style={{ margin: 0 }}>UI Automation Playground</h1>
          </div>
          <p>
            A catalog of interactive specimens for practicing Selenium, Playwright, and Cypress —
            from stable, well-labeled elements to deliberately unstable ones. Pick a sheet from the
            index to begin.
          </p>
        </div>
        <div className="title-block-fields">
          <div>
            <span className="field-label">Sheets built</span>
            {builtCount} / {catalog.length}
          </div>
          <div>
            <span className="field-label">Stack</span>
            React + Vite, no backend (phase 1)
          </div>
          <div>
            <span className="field-label">Status</span>
            In progress
          </div>
        </div>
      </div>

      <div className="catalog-grid" data-testid="catalog-grid">
        {catalog.map((item) =>
          item.path ? (
            <Link key={item.code} to={item.path} className="catalog-card" data-available="true">
              <span className="status">available</span>
              <span className="code">{item.code}-01</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </Link>
          ) : (
            <div key={item.code} className="catalog-card" data-available="false">
              <span className="status">planned</span>
              <span className="code">{item.code}-01</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ),
        )}
      </div>
    </>
  )
}
