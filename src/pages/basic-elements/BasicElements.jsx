import { useEffect, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

function useDynamicToken(intervalMs = 4000) {
  const [token, setToken] = useState(() => Math.random().toString(36).slice(2, 8))
  useEffect(() => {
    const id = setInterval(() => setToken(Math.random().toString(36).slice(2, 8)), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return token
}

const SPECIMEN_IDS = ['textbox', 'textarea', 'buttons', 'links', 'label-icon', 'image', 'dynamic-id', 'no-attrs']

export default function BasicElements() {
  const [textValue, setTextValue] = useState('')
  const [clickCount, setClickCount] = useState(0)
  const dynamicToken = useDynamicToken()
  const { isDone, toggle, completedCount, total } = useProgress('basic-elements', SPECIMEN_IDS)

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
        <div className="title-block-fields">
          <div>
            <span className="field-label">Progress</span>
            {completedCount} / {total} marked done
          </div>
        </div>
      </div>

      <Specimen
        id="textbox"
        title="Textbox — stable"
        done={isDone('textbox')}
        onToggleDone={toggle}
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
        id="textarea"
        title="Textarea — stable"
        done={isDone('textarea')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'bio-textarea'],
          ['data-testid', 'basic-textarea'],
        ]}
      >
        <textarea id="bio-textarea" data-testid="basic-textarea" placeholder="Write a short bio" />
      </Specimen>

      <Specimen
        id="buttons"
        title="Buttons — stable"
        done={isDone('buttons')}
        onToggleDone={toggle}
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
        id="links"
        title="Links"
        done={isDone('links')}
        onToggleDone={toggle}
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
        id="label-icon"
        title="Label, checkbox & icon"
        done={isDone('label-icon')}
        onToggleDone={toggle}
        annotations={[
          ['label htmlFor', 'newsletter-checkbox'],
          ['svg aria-label', 'star icon'],
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
        id="image"
        title="Image"
        done={isDone('image')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'specimen-image'],
          ['alt', 'placeholder specimen graphic'],
        ]}
      >
        <img
          id="specimen-image"
          data-testid="basic-image"
          alt="placeholder specimen graphic"
          width="120"
          height="80"
          style={{ borderRadius: 4, border: '1px solid var(--color-grid)' }}
          src="https://placehold.co/120x80/eaeff4/1c2a38?text=EL-01"
        />
      </Specimen>

      <Specimen
        id="dynamic-id"
        title="Dynamic ID textbox"
        hard
        done={isDone('dynamic-id')}
        onToggleDone={toggle}
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
        id="no-attrs"
        title="No stable attributes"
        hard
        done={isDone('no-attrs')}
        onToggleDone={toggle}
        annotations={[['locator hint', 'match by visible text only']]}
      >
        <button className={`btn btn-outline rnd-${dynamicToken}`} onClick={() => alert('Found me by text!')}>
          Click the button that says exactly this
        </button>
      </Specimen>
    </>
  )
}
