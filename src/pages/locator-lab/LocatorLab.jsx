import { useRef, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['sandbox', 'css-tester', 'xpath-tester']

export default function LocatorLab() {
  const { isDone, toggle, completedCount, total } = useProgress('locator-lab', SPECIMEN_IDS)
  const sandboxRef = useRef(null)

  const [cssQuery, setCssQuery] = useState('')
  const [cssResult, setCssResult] = useState(null) // { count, error }

  const [xpathQuery, setXpathQuery] = useState('')
  const [xpathResult, setXpathResult] = useState(null)

  function clearHighlights() {
    sandboxRef.current?.querySelectorAll('.ll-highlight').forEach((el) => el.classList.remove('ll-highlight'))
  }

  function runCss() {
    clearHighlights()
    if (!cssQuery.trim()) {
      setCssResult(null)
      return
    }
    try {
      const matches = sandboxRef.current.querySelectorAll(cssQuery)
      matches.forEach((el) => el.classList.add('ll-highlight'))
      setCssResult({ count: matches.length, error: null })
    } catch (err) {
      setCssResult({ count: 0, error: err.message })
    }
  }

  function runXpath() {
    clearHighlights()
    if (!xpathQuery.trim()) {
      setXpathResult(null)
      return
    }
    try {
      const result = document.evaluate(xpathQuery, sandboxRef.current, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      const matches = []
      for (let i = 0; i < result.snapshotLength; i++) matches.push(result.snapshotItem(i))
      matches.forEach((el) => el.classList && el.classList.add('ll-highlight'))
      setXpathResult({ count: result.snapshotLength, error: null })
    } catch (err) {
      setXpathResult({ count: 0, error: err.message })
    }
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>LL — Locator Lab</h1>
          <p>
            A sandbox DOM with duplicate classes, a few elements with no <code>id</code>, and
            data attributes — type a CSS selector or an XPath expression below and see exactly
            what it matches, highlighted live.
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
        id="sandbox"
        title="Sandbox DOM"
        done={isDone('sandbox')}
        onToggleDone={toggle}
        annotations={[
          ['container id', 'll-sandbox'],
          ['note', 'this is the DOM the CSS and XPath testers below query against'],
        ]}
      >
        <div id="ll-sandbox" ref={sandboxRef} data-testid="ll-sandbox" style={{ border: '1px dashed var(--color-grid)', borderRadius: 6, padding: 14 }}>
          <button id="ll-btn-1" className="ll-item primary btn btn-outline" style={{ marginRight: 8 }}>
            One
          </button>
          <button id="ll-btn-2" className="ll-item btn btn-outline" style={{ marginRight: 8 }}>
            Two
          </button>
          <button className="ll-item primary btn btn-outline">Three (no id)</button>
          <div style={{ marginTop: 10 }}>
            <span data-role="label" style={{ marginRight: 10 }}>
              Label A
            </span>
            <span data-role="label">Label B</span>
          </div>
          <ul style={{ marginTop: 10 }}>
            <li>Apple</li>
            <li>Banana</li>
            <li>Cherry</li>
          </ul>
        </div>
      </Specimen>

      <Specimen
        id="css-tester"
        title="CSS selector tester"
        done={isDone('css-tester')}
        onToggleDone={toggle}
        annotations={[
          ['input id', 'css-query-input'],
          ['try', '.ll-item  ·  #ll-btn-1  ·  [data-role="label"]  ·  li:nth-child(2)'],
          ['result', cssResult ? cssResult.error ? `error: ${cssResult.error}` : `${cssResult.count} match(es)` : '(not run yet)'],
        ]}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <input id="css-query-input" data-testid="css-query-input" type="text" placeholder=".ll-item" value={cssQuery} onChange={(e) => setCssQuery(e.target.value)} style={{ maxWidth: 260 }} />
          <button data-testid="css-run-btn" className="btn" onClick={runCss}>
            Run
          </button>
        </div>
        {cssResult && (
          <div data-testid="css-result" className="result-line" style={{ color: cssResult.error ? 'var(--color-fail)' : 'var(--color-pass)' }}>
            {cssResult.error ? `Invalid selector: ${cssResult.error}` : `${cssResult.count} element(s) matched and highlighted above.`}
          </div>
        )}
      </Specimen>

      <Specimen
        id="xpath-tester"
        title="XPath tester"
        done={isDone('xpath-tester')}
        onToggleDone={toggle}
        annotations={[
          ['input id', 'xpath-query-input'],
          ['try', './/li  ·  .//button[text()="Two"]  ·  .//*[@data-role="label"]'],
          ['result', xpathResult ? xpathResult.error ? `error: ${xpathResult.error}` : `${xpathResult.count} match(es)` : '(not run yet)'],
        ]}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <input id="xpath-query-input" data-testid="xpath-query-input" type="text" placeholder=".//li" value={xpathQuery} onChange={(e) => setXpathQuery(e.target.value)} style={{ maxWidth: 260 }} />
          <button data-testid="xpath-run-btn" className="btn" onClick={runXpath}>
            Run
          </button>
        </div>
        {xpathResult && (
          <div data-testid="xpath-result" className="result-line" style={{ color: xpathResult.error ? 'var(--color-fail)' : 'var(--color-pass)' }}>
            {xpathResult.error ? `Invalid XPath: ${xpathResult.error}` : `${xpathResult.count} element(s) matched and highlighted above.`}
          </div>
        )}
      </Specimen>
    </>
  )
}
