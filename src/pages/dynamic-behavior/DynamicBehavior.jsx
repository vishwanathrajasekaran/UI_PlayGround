import { useEffect, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['ajax', 'delayed', 'spinner', 'dynamic-id', 'dynamic-text', 'enable-disable', 'hidden']

const STATUS_CYCLE = ['Connecting…', 'Syncing…', 'Done']

export default function DynamicBehavior() {
  const { isDone, toggle, completedCount, total } = useProgress('dynamic-behavior', SPECIMEN_IDS)

  // --- AJAX ---
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [ajaxResult, setAjaxResult] = useState('')

  function fireAjax() {
    setAjaxLoading(true)
    setAjaxResult('')
    setTimeout(() => {
      setAjaxLoading(false)
      setAjaxResult('Data loaded: 42 items')
    }, 1200)
  }

  // --- Delayed element (appears automatically after mount) ---
  const [delayedVisible, setDelayedVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDelayedVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  // --- Loading spinner (generic) ---
  const [spinnerRunning, setSpinnerRunning] = useState(false)
  const [spinnerDone, setSpinnerDone] = useState(false)

  function runSpinner() {
    setSpinnerRunning(true)
    setSpinnerDone(false)
    setTimeout(() => {
      setSpinnerRunning(false)
      setSpinnerDone(true)
    }, 2000)
  }

  // --- Dynamic IDs (new item gets a fresh generated id each time) ---
  const [items, setItems] = useState([])
  function addItem() {
    const id = Math.random().toString(36).slice(2, 9)
    setItems((prev) => [...prev, { id, label: `Item ${prev.length + 1}` }])
  }

  // --- Dynamic text (cycles automatically) ---
  const [statusIndex, setStatusIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_CYCLE.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // --- Enable / disable ---
  const [agreed, setAgreed] = useState(false)

  // --- Hidden elements ---
  const [panelVisible, setPanelVisible] = useState(false)

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>DB — Dynamic Behavior</h1>
          <p>
            AJAX loading states, an element that appears on its own after a delay, a generic
            spinner, freshly-generated IDs, auto-cycling text, a conditionally-enabled button, and
            an element toggled via CSS visibility rather than removed from the DOM.
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
        id="ajax"
        title="AJAX request"
        done={isDone('ajax')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'fire-ajax-btn'],
          ['loading indicator', 'ajax-loading (present only while pending)'],
          ['result', 'ajax-result'],
        ]}
      >
        <button id="fire-ajax-btn" data-testid="fire-ajax-btn" className="btn" onClick={fireAjax} disabled={ajaxLoading}>
          Fetch data
        </button>
        {ajaxLoading && (
          <div id="ajax-loading" data-testid="ajax-loading" className="result-line" style={{ color: 'var(--color-ink-soft)' }}>
            Loading…
          </div>
        )}
        {ajaxResult && (
          <div id="ajax-result" data-testid="ajax-result" className="result-line">
            {ajaxResult}
          </div>
        )}
      </Specimen>

      <Specimen
        id="delayed"
        title="Delayed element"
        done={isDone('delayed')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'delayed-element'],
          ['note', 'appears 3 seconds after this page mounts — not present in the initial DOM'],
        ]}
      >
        {delayedVisible ? (
          <div id="delayed-element" data-testid="delayed-element" className="result-line">
            ✓ I appeared after a 3-second delay.
          </div>
        ) : (
          <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>Waiting…</span>
        )}
      </Specimen>

      <Specimen
        id="spinner"
        title="Loading spinner"
        done={isDone('spinner')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'run-spinner-btn'],
          ['spinner id', 'generic-spinner (role="status")'],
        ]}
      >
        <button id="run-spinner-btn" data-testid="run-spinner-btn" className="btn" onClick={runSpinner} disabled={spinnerRunning}>
          Start process
        </button>
        {spinnerRunning && (
          <div id="generic-spinner" data-testid="generic-spinner" role="status" aria-live="polite" className="result-line" style={{ color: 'var(--color-ink-soft)' }}>
            ⟳ Processing…
          </div>
        )}
        {spinnerDone && !spinnerRunning && (
          <div data-testid="spinner-done" className="result-line">
            ✓ Process complete
          </div>
        )}
      </Specimen>

      <Specimen
        id="dynamic-id"
        title="Freshly-generated IDs"
        done={isDone('dynamic-id')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'add-item-btn'],
          ['note', 'each new item gets a random id — locate the newest one by text/order, not by a fixed id'],
        ]}
      >
        <button id="add-item-btn" data-testid="add-item-btn" className="btn btn-outline" onClick={addItem}>
          Add item
        </button>
        <ul data-testid="dynamic-item-list" style={{ marginTop: 10, paddingLeft: 18 }}>
          {items.map((item) => (
            <li key={item.id} id={`item-${item.id}`} data-testid="dynamic-item">
              {item.label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-ink-soft)' }}>#{item.id}</span>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen
        id="dynamic-text"
        title="Auto-cycling text"
        done={isDone('dynamic-text')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'dynamic-text-label'],
          ['note', 'text changes every 2 seconds on its own — poll or use an explicit wait for the new value'],
        ]}
      >
        <div id="dynamic-text-label" data-testid="dynamic-text-label" className="result-line" style={{ color: 'var(--color-ink)' }}>
          {STATUS_CYCLE[statusIndex]}
        </div>
      </Specimen>

      <Specimen
        id="enable-disable"
        title="Conditionally enabled button"
        done={isDone('enable-disable')}
        onToggleDone={toggle}
        annotations={[
          ['checkbox id', 'agree-checkbox'],
          ['button id', 'continue-btn'],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          <label style={{ fontSize: '0.85rem' }}>
            <input id="agree-checkbox" data-testid="agree-checkbox" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} /> I
            agree to the terms
          </label>
          <button id="continue-btn" data-testid="continue-btn" className="btn" disabled={!agreed}>
            Continue
          </button>
        </div>
      </Specimen>

      <Specimen
        id="hidden"
        title="Hidden element — CSS visibility, not removal"
        done={isDone('hidden')}
        onToggleDone={toggle}
        annotations={[
          ['toggle button id', 'toggle-panel-btn'],
          ['panel id', 'hidden-panel'],
          ['note', 'panel stays in the DOM the whole time — only its display style changes'],
        ]}
      >
        <button id="toggle-panel-btn" data-testid="toggle-panel-btn" className="btn btn-outline" onClick={() => setPanelVisible((v) => !v)}>
          {panelVisible ? 'Hide panel' : 'Show panel'}
        </button>
        <div
          id="hidden-panel"
          data-testid="hidden-panel"
          style={{
            display: panelVisible ? 'block' : 'none',
            marginTop: 10,
            padding: 12,
            border: '1px solid var(--color-grid)',
            borderRadius: 6,
            fontSize: '0.85rem',
            color: 'var(--color-ink-soft)',
          }}
        >
          This panel was always in the DOM — only its visibility changed.
        </div>
      </Specimen>
    </>
  )
}
