import { useEffect, useRef, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['alert', 'confirm', 'prompt', 'modal', 'tooltip', 'toast', 'popover']

export default function Popups() {
  const { isDone, toggle, completedCount, total } = useProgress('popups', SPECIMEN_IDS)

  const [confirmResult, setConfirmResult] = useState('')
  const [promptResult, setPromptResult] = useState('')

  // --- Modal ---
  const [modalOpen, setModalOpen] = useState(false)
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') setModalOpen(false)
    }
    if (modalOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modalOpen])

  // --- Toast ---
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef(null)

  function showToast() {
    setToastVisible(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000)
  }

  // --- Popover ---
  const [popoverOpen, setPopoverOpen] = useState(false)
  const popoverRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setPopoverOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>PO — Popups &amp; Overlays</h1>
          <p>
            Native browser dialogs (alert/confirm/prompt — practice switching to the browser's
            native dialog handler), plus custom modal, tooltip, toast, and popover components.
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
        id="alert"
        title="Native alert()"
        done={isDone('alert')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'trigger-alert'],
          ['note', 'this is a real browser-native dialog, not a styled div'],
        ]}
      >
        <button id="trigger-alert" data-testid="trigger-alert" className="btn" onClick={() => window.alert('This is a native browser alert.')}>
          Trigger alert
        </button>
      </Specimen>

      <Specimen
        id="confirm"
        title="Native confirm()"
        done={isDone('confirm')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'trigger-confirm'],
          ['last result', confirmResult || '(not yet answered)'],
        ]}
      >
        <button
          id="trigger-confirm"
          data-testid="trigger-confirm"
          className="btn"
          onClick={() => setConfirmResult(window.confirm('Proceed with this action?') ? 'OK' : 'Cancel')}
        >
          Trigger confirm
        </button>
        {confirmResult && (
          <div data-testid="confirm-result" className="result-line">
            You chose: {confirmResult}
          </div>
        )}
      </Specimen>

      <Specimen
        id="prompt"
        title="Native prompt()"
        done={isDone('prompt')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'trigger-prompt'],
          ['last value', promptResult || '(none)'],
        ]}
      >
        <button
          id="trigger-prompt"
          data-testid="trigger-prompt"
          className="btn"
          onClick={() => setPromptResult(window.prompt('Enter a nickname:') || '')}
        >
          Trigger prompt
        </button>
        {promptResult && (
          <div data-testid="prompt-result" className="result-line">
            You entered: {promptResult}
          </div>
        )}
      </Specimen>

      <Specimen
        id="modal"
        title="Modal — backdrop click / Escape closes"
        done={isDone('modal')}
        onToggleDone={toggle}
        annotations={[
          ['trigger id', 'open-modal-btn'],
          ['modal id', 'demo-modal'],
          ['close', 'click backdrop, press Escape, or click the close button'],
        ]}
      >
        <button id="open-modal-btn" data-testid="open-modal-btn" className="btn" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
        {modalOpen && (
          <div
            data-testid="modal-backdrop"
            onClick={() => setModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(28, 42, 56, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div
              id="demo-modal"
              data-testid="demo-modal"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-ink)', borderRadius: 6, padding: 24, width: 320 }}
            >
              <h3 style={{ marginTop: 0 }}>Confirm deletion</h3>
              <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.88rem' }}>This can't be undone.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button data-testid="modal-cancel" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button data-testid="modal-confirm" className="btn" onClick={() => setModalOpen(false)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Specimen>

      <Specimen
        id="tooltip"
        title="Tooltip — hover reveals"
        done={isDone('tooltip')}
        onToggleDone={toggle}
        annotations={[
          ['trigger id', 'tooltip-trigger'],
          ['tooltip id', 'tooltip-bubble'],
          ['note', 'tooltip only exists in the DOM while hovered'],
        ]}
      >
        <span style={{ position: 'relative' }} className="tooltip-wrapper">
          <button id="tooltip-trigger" data-testid="tooltip-trigger" className="btn btn-outline">
            Hover me
          </button>
          <span id="tooltip-bubble" data-testid="tooltip-bubble" className="tooltip-bubble">
            Extra context shown on hover
          </span>
        </span>
      </Specimen>

      <Specimen
        id="toast"
        title="Toast — auto-dismisses"
        done={isDone('toast')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'show-toast-btn'],
          ['toast id', 'demo-toast'],
          ['note', 'disappears on its own after 3 seconds — practice waiting for it to vanish'],
        ]}
      >
        <button id="show-toast-btn" data-testid="show-toast-btn" className="btn" onClick={showToast}>
          Show toast
        </button>
        {toastVisible && (
          <div
            id="demo-toast"
            data-testid="demo-toast"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'var(--color-ink)',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: 6,
              fontSize: '0.86rem',
              zIndex: 20,
            }}
          >
            Saved successfully.
          </div>
        )}
      </Specimen>

      <Specimen
        id="popover"
        title="Popover — click-triggered info panel"
        done={isDone('popover')}
        onToggleDone={toggle}
        annotations={[
          ['trigger id', 'popover-trigger'],
          ['popover id', 'popover-panel'],
          ['close', 'click outside'],
        ]}
      >
        <div ref={popoverRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button id="popover-trigger" data-testid="popover-trigger" className="btn btn-outline" onClick={() => setPopoverOpen((v) => !v)}>
            ⓘ More info
          </button>
          {popoverOpen && (
            <div
              id="popover-panel"
              data-testid="popover-panel"
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-grid)',
                borderRadius: 6,
                padding: 14,
                width: 220,
                fontSize: '0.82rem',
                color: 'var(--color-ink-soft)',
                zIndex: 1,
              }}
            >
              This panel stays open until you click somewhere outside it.
            </div>
          )}
        </div>
      </Specimen>
    </>
  )
}
