import { useEffect, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['immediate', 'fixed-delay', 'variable-delay', 'animation', 'polling-condition']

export default function WaitStrategies() {
  const { isDone, toggle, completedCount, total } = useProgress('wait-strategies', SPECIMEN_IDS)

  // --- Fixed delay ---
  const [fixedLoading, setFixedLoading] = useState(false)
  const [fixedVisible, setFixedVisible] = useState(false)

  function triggerFixed() {
    setFixedVisible(false)
    setFixedLoading(true)
    setTimeout(() => {
      setFixedLoading(false)
      setFixedVisible(true)
    }, 2000)
  }

  // --- Variable delay ---
  const [variableLoading, setVariableLoading] = useState(false)
  const [variableVisible, setVariableVisible] = useState(false)
  const [lastVariableDelay, setLastVariableDelay] = useState(null)

  function triggerVariable() {
    setVariableVisible(false)
    setVariableLoading(true)
    const delay = 1000 + Math.random() * 3000
    setLastVariableDelay(Math.round(delay))
    setTimeout(() => {
      setVariableLoading(false)
      setVariableVisible(true)
    }, delay)
  }

  // --- Animation (fade in) ---
  const [animating, setAnimating] = useState(false)
  const [faded, setFaded] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)

  function triggerAnimation() {
    setAnimationDone(false)
    setFaded(false)
    setAnimating(true)
  }

  useEffect(() => {
    if (!animating) return undefined
    const raf = requestAnimationFrame(() => setFaded(true))
    return () => cancelAnimationFrame(raf)
  }, [animating])

  // --- Polling condition (counter climbs to a target) ---
  const [counter, setCounter] = useState(0)
  const [polling, setPolling] = useState(false)
  const TARGET = 5

  useEffect(() => {
    if (!polling) return undefined
    if (counter >= TARGET) {
      setPolling(false)
      return undefined
    }
    const t = setTimeout(() => setCounter((c) => c + 1), 500)
    return () => clearTimeout(t)
  }, [polling, counter])

  function startPolling() {
    setCounter(0)
    setPolling(true)
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>WS — Wait Strategies Lab</h1>
          <p>
            Elements with different timing characteristics — instant, fixed delay, unpredictable
            delay, CSS-animated appearance, and a value that only satisfies a condition after
            polling — for practicing implicit, explicit, and fluent waits.
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
        id="immediate"
        title="Immediate element"
        done={isDone('immediate')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'ws-immediate'],
          ['note', 'present as soon as the page renders — no wait needed, useful as a baseline'],
        ]}
      >
        <div id="ws-immediate" data-testid="ws-immediate" className="result-line">
          ✓ I was here from the start.
        </div>
      </Specimen>

      <Specimen
        id="fixed-delay"
        title="Fixed delay — exactly 2s"
        done={isDone('fixed-delay')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'ws-fixed-trigger'],
          ['element id', 'ws-fixed-element'],
          ['note', 'appears at a precise, repeatable 2000ms — good for testing exact explicit-wait timeouts'],
        ]}
      >
        <button id="ws-fixed-trigger" data-testid="ws-fixed-trigger" className="btn" onClick={triggerFixed} disabled={fixedLoading}>
          Trigger
        </button>
        {fixedLoading && <div style={{ color: 'var(--color-ink-soft)', fontSize: '0.82rem', marginTop: 8 }}>Waiting exactly 2s…</div>}
        {fixedVisible && (
          <div id="ws-fixed-element" data-testid="ws-fixed-element" className="result-line">
            ✓ Appeared after 2000ms
          </div>
        )}
      </Specimen>

      <Specimen
        id="variable-delay"
        title="Variable delay — 1 to 4s, unpredictable"
        done={isDone('variable-delay')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'ws-variable-trigger'],
          ['element id', 'ws-variable-element'],
          ['note', 'a fixed sleep won\u2019t reliably work here — use a polling/explicit wait instead'],
        ]}
      >
        <button id="ws-variable-trigger" data-testid="ws-variable-trigger" className="btn" onClick={triggerVariable} disabled={variableLoading}>
          Trigger
        </button>
        {variableLoading && <div style={{ color: 'var(--color-ink-soft)', fontSize: '0.82rem', marginTop: 8 }}>Waiting an unknown amount of time…</div>}
        {variableVisible && (
          <div id="ws-variable-element" data-testid="ws-variable-element" className="result-line">
            ✓ Appeared after ~{lastVariableDelay}ms this time
          </div>
        )}
      </Specimen>

      <Specimen
        id="animation"
        title="Animated appearance — fade in"
        done={isDone('animation')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'ws-animation-trigger'],
          ['element id', 'ws-animation-element'],
          ['done class', 'ws-animation-done (added via transitionend, ~500ms after showing)'],
        ]}
      >
        <button id="ws-animation-trigger" data-testid="ws-animation-trigger" className="btn" onClick={triggerAnimation}>
          Trigger
        </button>
        {animating && (
          <div
            id="ws-animation-element"
            data-testid="ws-animation-element"
            onTransitionEnd={() => setAnimationDone(true)}
            className={faded ? (animationDone ? 'ws-fade-el ws-fade-in ws-animation-done' : 'ws-fade-el ws-fade-in') : 'ws-fade-el'}
            style={{ marginTop: 10 }}
          >
            Faded in — the element existed before this was fully visible.
          </div>
        )}
      </Specimen>

      <Specimen
        id="polling-condition"
        title="Polling condition — wait for a value, not just visibility"
        done={isDone('polling-condition')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'ws-poll-trigger'],
          ['counter id', 'ws-poll-counter'],
          ['target', String(TARGET)],
        ]}
      >
        <button id="ws-poll-trigger" data-testid="ws-poll-trigger" className="btn" onClick={startPolling} disabled={polling}>
          Start counting
        </button>
        <div id="ws-poll-counter" data-testid="ws-poll-counter" className="result-line" style={{ color: counter >= TARGET ? 'var(--color-pass)' : 'var(--color-ink-soft)' }}>
          Value: {counter} {counter >= TARGET ? '(target reached)' : `(target: ${TARGET})`}
        </div>
      </Specimen>
    </>
  )
}
