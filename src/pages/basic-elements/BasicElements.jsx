import { useEffect, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'

function useDynamicToken(intervalMs = 4000) {
  const [token, setToken] = useState(() => Math.random().toString(36).slice(2, 8))
  useEffect(() => {
    const id = setInterval(() => setToken(Math.random().toString(36).slice(2, 8)), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return token
}

export default function BasicElements() {
  const [textValue, setTextValue] = useState('')
  const [clickCount, setClickCount] = useState(0)
  const dynamicToken = useDynamicToken()

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>EL — Basic Elements</h1>
          <p>
            Every element below is a real automation target. Most carry a stable{' '}
            <code>id</code>/<code>data-testid</code>. A few, marked "hard mode", regenerate their
            attributes on purpose — those are for practicing text- and structure-based locators
            instead of ID-based ones.
          </p>
        </div>
      </div>

      <Specimen
        title="Textbox — stable"
        annotations={[
          ['id', 'username-input'],
          ['data-testid', 'basic-textbox'],
          ['value', textValue || '(empty)'],
        ]}
      >
        <input
          id="username-input"
          data-testid="basic-textbox"
          type="text"
          placeholder="Type a username"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
      </Specimen>

      <Specimen
        title="Textarea — stable"
        annotations={[
          ['id', 'bio-textarea'],
          ['data-testid', 'basic-textarea'],
        ]}
      >
        <textarea id="bio-textarea" data-testid="basic-textarea" placeholder="Write a short bio" />
      </Specimen>

      <Specimen
        title="Buttons — stable"
        annotations={[
          ['id', 'submit-btn / reset-btn'],
          ['data-testid', 'basic-submit / basic-reset'],
          ['clicks', String(clickCount)],
        ]}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <button id="submit-btn" data-testid="basic-submit" className="btn" onClick={() => setClickCount((c) => c + 1)}>
            Submit
          </button>
          <button id="reset-btn" data-testid="basic-reset" className="btn btn-outline" onClick={() => setClickCount(0)}>
            Reset count
          </button>
          <button id="disabled-btn" data-testid="basic-disabled" className="btn" disabled>
            Disabled
          </button>
        </div>
      </Specimen>

      <Specimen
        title="Links"
        annotations={[
          ['id', 'internal-link / external-link'],
          ['href', '/  ·  https://example.com'],
        ]}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <a id="internal-link" data-testid="basic-link-internal" href="/">
            Back to index
          </a>
          <a id="external-link" data-testid="basic-link-external" href="https://example.com" target="_blank" rel="noreferrer">
            Opens in new tab
          </a>
        </div>
      </Specimen>

      <Specimen
        title="Labels, image & icon"
        annotations={[
          ['label htmlFor', 'newsletter-checkbox'],
          ['img alt', 'placeholder specimen graphic'],
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <label htmlFor="newsletter-checkbox" id="newsletter-label">
            <input id="newsletter-checkbox" data-testid="basic-checkbox" type="checkbox" /> Subscribe
          </label>
          <svg width="28" height="28" viewBox="0 0 24 24" data-testid="basic-icon" aria-label="star icon">
            <path
              fill="var(--color-accent)"
              d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01z"
            />
          </svg>
        </div>
      </Specimen>

      <Specimen
        title="Dynamic ID textbox"
        hard
        annotations={[
          ['id', `field-${dynamicToken}`],
          ['note', 'id regenerates every 4s — use data-role instead'],
        ]}
      >
        <input
          key={dynamicToken}
          id={`field-${dynamicToken}`}
          data-role="dynamic-textbox"
          type="text"
          placeholder="My id changes — find me by data-role"
        />
      </Specimen>

      <Specimen
        title="No stable attributes"
        hard
        annotations={[
          ['locator hint', 'match by visible text only'],
        ]}
      >
        <button className={`btn btn-outline rnd-${dynamicToken}`} onClick={() => alert('Found me by text!')}>
          Click the button that says exactly this
        </button>
      </Specimen>
    </>
  )
}
