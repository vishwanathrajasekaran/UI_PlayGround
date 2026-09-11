import { useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['trigger', 'delay', 'failure', 'response-viewer']

export default function ApiNetwork() {
  const { isDone, toggle, completedCount, total } = useProgress('api-network', SPECIMEN_IDS)

  const [lastResponse, setLastResponse] = useState(null)

  // --- Basic trigger ---
  const [triggerLoading, setTriggerLoading] = useState(false)

  async function fireTrigger() {
    setTriggerLoading(true)
    try {
      const res = await fetch('/api/network/success')
      const body = await res.json()
      setLastResponse({ source: 'trigger', status: res.status, body })
    } catch (err) {
      setLastResponse({ source: 'trigger', status: 0, body: { error: err.message } })
    } finally {
      setTriggerLoading(false)
    }
  }

  // --- Network delay with elapsed-time counter ---
  const [delayLoading, setDelayLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  async function fireDelay() {
    setDelayLoading(true)
    setElapsed(0)
    const start = Date.now()
    const tick = setInterval(() => setElapsed(Math.round((Date.now() - start) / 100) / 10), 100)
    try {
      const res = await fetch('/api/network/delay')
      const body = await res.json()
      setLastResponse({ source: 'delay', status: res.status, body })
    } catch (err) {
      setLastResponse({ source: 'delay', status: 0, body: { error: err.message } })
    } finally {
      clearInterval(tick)
      setDelayLoading(false)
    }
  }

  // --- Failure simulation ---
  const [failureLoading, setFailureLoading] = useState(false)
  const [failureError, setFailureError] = useState(false)

  async function fireFailure() {
    setFailureLoading(true)
    setFailureError(false)
    try {
      const res = await fetch('/api/network/fail')
      const body = await res.json()
      setLastResponse({ source: 'failure', status: res.status, body })
      setFailureError(!res.ok)
    } catch (err) {
      setLastResponse({ source: 'failure', status: 0, body: { error: err.message } })
      setFailureError(true)
    } finally {
      setFailureLoading(false)
    }
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>AN — API / Network</h1>
          <p>
            Real serverless endpoints (genuine <code>fetch</code> calls to Vercel functions, not
            client-side timers) covering a normal response, a genuinely slow 4s response with a
            live elapsed-time counter, a real server-side 500 failure with retry, and a shared
            viewer for whatever the most recent response was.
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
        id="trigger"
        title="API trigger — success response"
        done={isDone('trigger')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'api-trigger-btn'],
          ['note', 'updates the shared Response Viewer specimen below'],
        ]}
      >
        <button id="api-trigger-btn" data-testid="api-trigger-btn" className="btn" onClick={fireTrigger} disabled={triggerLoading}>
          {triggerLoading ? 'Calling…' : 'Call API'}
        </button>
      </Specimen>

      <Specimen
        id="delay"
        title="Network delay — 4s response with live counter"
        done={isDone('delay')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'api-delay-btn'],
          ['elapsed counter id', 'api-elapsed'],
        ]}
      >
        <button id="api-delay-btn" data-testid="api-delay-btn" className="btn" onClick={fireDelay} disabled={delayLoading}>
          {delayLoading ? 'Waiting…' : 'Call slow endpoint'}
        </button>
        {delayLoading && (
          <div id="api-elapsed" data-testid="api-elapsed" className="result-line" style={{ color: 'var(--color-ink-soft)' }}>
            Elapsed: {elapsed}s
          </div>
        )}
      </Specimen>

      <Specimen
        id="failure"
        title="Failure simulation — with retry"
        done={isDone('failure')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'api-failure-btn'],
          ['error message id', 'api-failure-error'],
          ['retry id', 'api-retry-btn'],
        ]}
      >
        <button id="api-failure-btn" data-testid="api-failure-btn" className="btn" onClick={fireFailure} disabled={failureLoading}>
          {failureLoading ? 'Calling…' : 'Call failing endpoint'}
        </button>
        {failureError && (
          <div style={{ marginTop: 10 }}>
            <div id="api-failure-error" data-testid="api-failure-error" style={{ color: 'var(--color-fail)', fontSize: '0.85rem' }}>
              500 — Internal Server Error
            </div>
            <button id="api-retry-btn" data-testid="api-retry-btn" className="btn btn-outline" style={{ marginTop: 8 }} onClick={fireFailure}>
              Retry
            </button>
          </div>
        )}
      </Specimen>

      <Specimen
        id="response-viewer"
        title="Response viewer — reflects the most recent call above"
        done={isDone('response-viewer')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'api-response-viewer'],
          ['updates from', 'trigger, delay, or failure — whichever ran most recently'],
        ]}
      >
        <pre
          id="api-response-viewer"
          data-testid="api-response-viewer"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-grid)',
            borderRadius: 6,
            padding: 12,
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            overflowX: 'auto',
          }}
        >
          {lastResponse ? JSON.stringify(lastResponse, null, 2) : '(no calls made yet)'}
        </pre>
      </Specimen>
    </>
  )
}
