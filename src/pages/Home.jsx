import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalog } from '../catalog.js'
import Icon from '../components/Icon.jsx'

const LEARNING_STEPS = [
  {
    number: '01',
    title: 'Pick one small lab',
    description: 'Start with Basic Elements if this is your first visit.',
    to: '/basic-elements',
    action: 'Start here',
  },
  {
    number: '02',
    title: 'Interact with the target',
    description: 'Type, click, select, wait, or navigate just like a real test.',
    to: '/basic-elements',
    action: 'See an example',
  },
  {
    number: '03',
    title: 'Verify and mark done',
    description: 'Use the locator notes, confirm the result, then keep your streak moving.',
    to: '/challenges',
    action: 'Open checklist',
  },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const builtCount = catalog.filter((item) => item.path).length
  const normalizedQuery = query.trim().toLowerCase()
  const visibleCatalog = useMemo(
    () =>
      catalog.filter((item) => {
        const matchesQuery = `${item.code} ${item.name} ${item.description}`.toLowerCase().includes(normalizedQuery)
        const matchesAvailability = !availableOnly || item.path
        return matchesQuery && matchesAvailability
      }),
    [availableOnly, normalizedQuery],
  )

  return (
    <>
      <section className="home-hero" data-testid="title-block">
        <div className="home-hero-content">
          <div className="eyebrow"><span className="eyebrow-dot" /> Guided practice workspace</div>
          <h1>Build confident automation habits, one interaction at a time.</h1>
          <p>
            A calm, hands-on playground for Selenium, Playwright, and Cypress. Each lab gives you a
            focused target, a clear locator hint, and a small win you can verify.
          </p>
          <div className="hero-actions">
            <Link to="/basic-elements" className="btn btn-primary">
              Start with the basics <Icon name="arrow" size={16} />
            </Link>
            <Link to="/challenges" className="btn btn-quiet">
              Explore the challenge path <Icon name="spark" size={15} />
            </Link>
          </div>
          <div className="hero-trust-row">
            <span><Icon name="check" size={14} /> No setup required</span>
            <span><Icon name="check" size={14} /> Progress saves locally</span>
            <span><Icon name="check" size={14} /> Beginner-friendly steps</span>
          </div>
        </div>
        <div className="home-hero-visual" aria-hidden="true">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-core">
            <span className="hero-core-kicker">READY</span>
            <strong>{builtCount}</strong>
            <span>labs to explore</span>
          </div>
          <div className="hero-float-card hero-float-card-top"><span className="hero-float-dot" /> locator practice</div>
          <div className="hero-float-card hero-float-card-bottom"><Icon name="check" size={13} /> progress saved</div>
        </div>
      </section>

      <section className="home-stat-grid" aria-label="Playground overview">
        <div className="home-stat-card">
          <span className="home-stat-label">Practice labs</span>
          <strong>{builtCount}</strong>
          <span>ready to open</span>
        </div>
        <div className="home-stat-card">
          <span className="home-stat-label">Learning modes</span>
          <strong>03</strong>
          <span>stable · dynamic · hard mode</span>
        </div>
        <div className="home-stat-card home-stat-card-accent">
          <span className="home-stat-label">Best next move</span>
          <strong>Start small</strong>
          <span>then build your streak</span>
        </div>
      </section>

      <section className="learning-path-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Your first session</span>
            <h2>Three easy steps to get moving</h2>
          </div>
          <span className="section-heading-note">Designed for momentum, not memorization.</span>
        </div>
        <div className="learning-path-grid">
          {LEARNING_STEPS.map((step) => (
            <Link to={step.to} className="learning-step" key={step.number}>
              <span className="learning-step-number">{step.number}</span>
              <div className="learning-step-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="text-link">{step.action} <Icon name="arrow" size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="catalog-section" data-testid="catalog-grid">
        <div className="section-heading catalog-heading">
          <div>
            <span className="eyebrow">The lab index</span>
            <h2>Choose your next practice target</h2>
          </div>
          <span className="section-heading-note">{visibleCatalog.length} of {catalog.length} shown</span>
        </div>

        <div className="catalog-toolbar">
          <label className="search-field">
            <Icon name="search" size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by skill, lab, or code"
              aria-label="Search practice labs"
              data-testid="catalog-search"
            />
            {query && (
              <button type="button" className="search-field-clear" aria-label="Clear lab search" onClick={() => setQuery('')}>
                <Icon name="close" size={14} />
              </button>
            )}
          </label>
          <button
            type="button"
            className={`filter-chip ${availableOnly ? 'is-active' : ''}`}
            aria-pressed={availableOnly}
            onClick={() => setAvailableOnly((active) => !active)}
          >
            <span className="filter-chip-dot" />
            {availableOnly ? 'Showing ready labs' : 'Show ready labs only'}
          </button>
        </div>

        {visibleCatalog.length === 0 ? (
          <div className="empty-state">
            <Icon name="search" size={22} />
            <strong>No labs found</strong>
            <span>Try a different keyword or clear the filter.</span>
            <button type="button" className="btn btn-outline" onClick={() => { setQuery(''); setAvailableOnly(false) }}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="catalog-grid">
            {visibleCatalog.map((item, index) =>
              item.path ? (
                <Link key={item.code} to={item.path} className="catalog-card" data-available="true">
                  <div className="catalog-card-top">
                    <span className="code">{item.code}</span>
                    <span className="catalog-card-status"><span className="status-dot" /> Ready <Icon name="arrow" size={14} /></span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="catalog-card-footer">
                    <span>Open lab</span>
                    <span className="catalog-card-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </Link>
              ) : (
                <article key={item.code} className="catalog-card" data-available="false">
                  <div className="catalog-card-top">
                    <span className="code">{item.code}</span>
                    <span className="catalog-card-status is-planned">Planned</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="catalog-card-footer"><span>Coming soon</span><span className="catalog-card-index">{String(index + 1).padStart(2, '0')}</span></div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </>
  )
}
