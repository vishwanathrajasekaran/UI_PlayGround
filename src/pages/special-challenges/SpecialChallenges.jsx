import { useEffect, useRef, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['shadow-dom', 'infinite-scroll', 'virtualized-list', 'stale-element', 'race-condition', 'flaky-element', 'captcha']

const ITEM_HEIGHT = 28
const VIEWPORT_HEIGHT = 150
const TOTAL_ROWS = 5000

function randomMathProblem() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  return { a, b, answer: a + b }
}

export default function SpecialChallenges() {
  const { isDone, toggle, completedCount, total } = useProgress('special-challenges', SPECIMEN_IDS)

  // --- Shadow DOM ---
  const shadowHostRef = useRef(null)
  const [shadowClicks, setShadowClicks] = useState(0)

  useEffect(() => {
    const host = shadowHostRef.current
    if (!host || host.shadowRoot) return
    const root = host.attachShadow({ mode: 'open' })
    const btn = document.createElement('button')
    btn.id = 'shadow-btn'
    btn.setAttribute('data-testid', 'shadow-btn')
    btn.textContent = 'Click me (inside shadow root)'
    btn.className = 'btn btn-outline'
    btn.addEventListener('click', () => setShadowClicks((c) => c + 1))
    root.appendChild(btn)
  }, [])

  // --- Infinite scroll ---
  const [infiniteItems, setInfiniteItems] = useState(Array.from({ length: 15 }, (_, i) => i + 1))
  const [loadingMore, setLoadingMore] = useState(false)

  function handleInfiniteScroll(e) {
    const el = e.target
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20
    if (nearBottom && !loadingMore) {
      setLoadingMore(true)
      setTimeout(() => {
        setInfiniteItems((items) => [...items, ...Array.from({ length: 10 }, (_, i) => items.length + i + 1)])
        setLoadingMore(false)
      }, 500)
    }
  }

  // --- Virtualized list ---
  const [scrollTop, setScrollTop] = useState(0)
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 2)
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT) + 4
  const endIndex = Math.min(TOTAL_ROWS, startIndex + visibleCount)
  const visibleRows = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i)

  // --- Stale element ---
  const [staleKey, setStaleKey] = useState(0)

  function replaceElement() {
    setStaleKey((k) => k + 1)
  }

  // --- Race condition ---
  const [raceResult, setRaceResult] = useState('')
  const raceRunId = useRef(0)

  function runRace() {
    const runId = ++raceRunId.current
    setRaceResult('')
    const delayA = 300 + Math.random() * 700
    const delayB = 300 + Math.random() * 700
    setTimeout(() => {
      if (raceRunId.current === runId) setRaceResult((prev) => prev + 'A')
    }, delayA)
    setTimeout(() => {
      if (raceRunId.current === runId) setRaceResult((prev) => prev + 'B')
    }, delayB)
  }

  // --- Flaky element ---
  const [flakyAttempts, setFlakyAttempts] = useState(0)
  const [flakySuccesses, setFlakySuccesses] = useState(0)
  const [flakyLastResult, setFlakyLastResult] = useState(null)

  function tryFlaky() {
    setFlakyAttempts((a) => a + 1)
    const success = Math.random() < 0.4
    if (success) setFlakySuccesses((s) => s + 1)
    setFlakyLastResult(success)
  }

  // --- CAPTCHA (simple math challenge) ---
  const [captchaProblem, setCaptchaProblem] = useState(randomMathProblem)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaResult, setCaptchaResult] = useState(null)

  function checkCaptcha(e) {
    e.preventDefault()
    const correct = Number(captchaAnswer) === captchaProblem.answer
    setCaptchaResult(correct)
    if (!correct) setCaptchaProblem(randomMathProblem())
    setCaptchaAnswer('')
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>SP — Special Challenges</h1>
          <p>
            The genuinely tricky automation scenarios: Shadow DOM, infinite scroll, a virtualized
            list where most rows don't exist in the DOM, a stale element reference, a real race
            condition, an intentionally flaky action, and a simple CAPTCHA.
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
        id="shadow-dom"
        title="Shadow DOM"
        done={isDone('shadow-dom')}
        onToggleDone={toggle}
        annotations={[
          ['host id', 'shadow-host'],
          ['inner button id', 'shadow-btn (inside the shadow root — regular querySelector on the document won\u2019t find it)'],
          ['clicks', String(shadowClicks)],
        ]}
      >
        <div id="shadow-host" ref={shadowHostRef} data-testid="shadow-host" />
        <div className="result-line" style={{ marginTop: 8 }}>
          Clicks registered: {shadowClicks}
        </div>
      </Specimen>

      <Specimen
        id="infinite-scroll"
        title="Infinite scroll"
        done={isDone('infinite-scroll')}
        onToggleDone={toggle}
        annotations={[
          ['scroll container id', 'infinite-scroll-box'],
          ['note', 'more items load automatically as you scroll near the bottom'],
        ]}
      >
        <div
          id="infinite-scroll-box"
          data-testid="infinite-scroll-box"
          onScroll={handleInfiniteScroll}
          style={{ height: 150, overflowY: 'auto', border: '1px solid var(--color-grid)', borderRadius: 6, padding: '4px 14px', maxWidth: 300 }}
        >
          {infiniteItems.map((n) => (
            <div key={n} data-testid={`infinite-item-${n}`} style={{ padding: '4px 0', fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>
              Row {n}
            </div>
          ))}
          {loadingMore && <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-soft)' }}>Loading more…</div>}
        </div>
      </Specimen>

      <Specimen
        id="virtualized-list"
        title="Virtualized list"
        done={isDone('virtualized-list')}
        onToggleDone={toggle}
        annotations={[
          ['container id', 'virtualized-list-box'],
          ['total rows', String(TOTAL_ROWS)],
          ['note', `only ~${visibleCount} rows exist in the DOM at once — querying "all rows" will never find them all without scrolling`],
        ]}
      >
        <div
          id="virtualized-list-box"
          data-testid="virtualized-list-box"
          onScroll={(e) => setScrollTop(e.target.scrollTop)}
          style={{ height: VIEWPORT_HEIGHT, overflowY: 'auto', border: '1px solid var(--color-grid)', borderRadius: 6, maxWidth: 300, position: 'relative' }}
        >
          <div style={{ height: TOTAL_ROWS * ITEM_HEIGHT, position: 'relative' }}>
            {visibleRows.map((i) => (
              <div
                key={i}
                data-testid={`virtual-row-${i}`}
                style={{
                  position: 'absolute',
                  top: i * ITEM_HEIGHT,
                  height: ITEM_HEIGHT,
                  left: 0,
                  right: 0,
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--color-ink-soft)',
                  borderBottom: '1px solid var(--color-grid)',
                }}
              >
                Row {i + 1} of {TOTAL_ROWS}
              </div>
            ))}
          </div>
        </div>
      </Specimen>

      <Specimen
        id="stale-element"
        title="Stale element reference"
        done={isDone('stale-element')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'replace-element-btn'],
          ['target id', 'stale-target (a NEW DOM node each time, even though it looks identical)'],
          ['renders', String(staleKey + 1)],
        ]}
      >
        <button id="replace-element-btn" data-testid="replace-element-btn" className="btn btn-outline" onClick={replaceElement}>
          Replace element
        </button>
        <div key={staleKey} id="stale-target" data-testid="stale-target" className="result-line" style={{ color: 'var(--color-ink)' }}>
          Render #{staleKey + 1} — a reference captured before clicking "Replace" no longer points to this node.
        </div>
      </Specimen>

      <Specimen
        id="race-condition"
        title="Race condition"
        done={isDone('race-condition')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'run-race-btn'],
          ['result id', 'race-result'],
          ['note', 'two async operations finish in a random order each run — don\u2019t assert on which one wins'],
        ]}
      >
        <button id="run-race-btn" data-testid="run-race-btn" className="btn" onClick={runRace}>
          Run both operations
        </button>
        <div id="race-result" data-testid="race-result" className="result-line">
          Finish order: {raceResult || '(not run yet)'}
        </div>
      </Specimen>

      <Specimen
        id="flaky-element"
        title="Flaky element — succeeds ~40% of the time"
        done={isDone('flaky-element')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'flaky-btn'],
          ['stats id', 'flaky-stats'],
          ['note', 'good for practicing retry-until-success logic rather than assuming one attempt is enough'],
        ]}
      >
        <button id="flaky-btn" data-testid="flaky-btn" className="btn" onClick={tryFlaky}>
          Attempt action
        </button>
        <div id="flaky-stats" data-testid="flaky-stats" className="result-line" style={{ color: flakyLastResult === false ? 'var(--color-fail)' : 'var(--color-ink-soft)' }}>
          Attempts: {flakyAttempts} · Successes: {flakySuccesses}
          {flakyLastResult !== null && (flakyLastResult ? ' · last: success' : ' · last: failed')}
        </div>
      </Specimen>

      <Specimen
        id="captcha"
        title="CAPTCHA simulation — simple math challenge"
        done={isDone('captcha')}
        onToggleDone={toggle}
        annotations={[
          ['form id', 'captcha-form'],
          ['question id', 'captcha-question'],
          ['note', 'a wrong answer generates a new problem — no image distortion, just a gating step'],
        ]}
      >
        <form id="captcha-form" data-testid="captcha-form" onSubmit={checkCaptcha}>
          <div id="captcha-question" data-testid="captcha-question" style={{ marginBottom: 8, fontSize: '0.88rem' }}>
            What is {captchaProblem.a} + {captchaProblem.b}?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="captcha-answer-input"
              data-testid="captcha-answer-input"
              type="number"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              style={{ width: 80 }}
            />
            <button data-testid="captcha-submit-btn" className="btn" type="submit">
              Verify
            </button>
          </div>
        </form>
        {captchaResult !== null && (
          <div data-testid="captcha-result" className="result-line" style={{ color: captchaResult ? 'var(--color-pass)' : 'var(--color-fail)' }}>
            {captchaResult ? '✓ Correct' : '✗ Incorrect — try the new problem'}
          </div>
        )}
      </Specimen>
    </>
  )
}
