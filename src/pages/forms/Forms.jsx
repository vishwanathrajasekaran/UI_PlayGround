import { useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SPECIMEN_IDS = ['login', 'dependent-fields', 'reset']

export default function Forms() {
  const { isDone, toggle, completedCount, total } = useProgress('forms', SPECIMEN_IDS)

  // --- Login form state ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loginSubmitted, setLoginSubmitted] = useState(false)

  const emailValid = EMAIL_RE.test(email)
  const passwordValid = password.length >= 6
  const loginFormValid = emailValid && passwordValid

  function handleLoginSubmit(e) {
    e.preventDefault()
    if (loginFormValid) setLoginSubmitted(true)
  }

  // --- Dependent fields: shipping address only required if "different address" is checked ---
  const [differentAddress, setDifferentAddress] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('')

  // --- Reset behavior ---
  const [resetName, setResetName] = useState('')
  const [resetNotes, setResetNotes] = useState('')

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>FM — Forms</h1>
          <p>
            Realistic form patterns: client-side validation with a disabled submit button, fields
            that depend on another field's state, and a reset button that clears the whole form.
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
        id="login"
        title="Login — validation + disabled submit"
        done={isDone('login')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'login-form'],
          ['submit disabled until', 'valid email + password ≥ 6 chars'],
          ['data-testid', 'login-success (shown after submit)'],
        ]}
      >
        <form id="login-form" data-testid="login-form" onSubmit={handleLoginSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
            <div>
              <input
                id="login-email"
                data-testid="login-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setLoginSubmitted(false)
                }}
                aria-invalid={email.length > 0 && !emailValid}
              />
              {email.length > 0 && !emailValid && (
                <div data-testid="login-email-error" style={{ color: 'var(--color-fail)', fontSize: '0.78rem', marginTop: 4 }}>
                  Enter a valid email address.
                </div>
              )}
            </div>
            <div>
              <input
                id="login-password"
                data-testid="login-password"
                type="password"
                placeholder="Password (6+ chars)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setLoginSubmitted(false)
                }}
                aria-invalid={password.length > 0 && !passwordValid}
              />
              {password.length > 0 && !passwordValid && (
                <div data-testid="login-password-error" style={{ color: 'var(--color-fail)', fontSize: '0.78rem', marginTop: 4 }}>
                  Password must be at least 6 characters.
                </div>
              )}
            </div>
            <label style={{ fontSize: '0.85rem' }}>
              <input
                id="remember-me"
                data-testid="remember-me"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{' '}
              Remember me
            </label>
            <button id="login-submit" data-testid="login-submit" className="btn" type="submit" disabled={!loginFormValid}>
              Log in
            </button>
            {loginSubmitted && (
              <div data-testid="login-success" className="result-line">
                ✓ Logged in {remember ? '(session remembered)' : '(session only)'}
              </div>
            )}
          </div>
        </form>
      </Specimen>

      <Specimen
        id="dependent-fields"
        title="Field dependency — conditional required field"
        done={isDone('dependent-fields')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'different-address-checkbox'],
          ['reveals', 'shipping-address-input (id) when checked'],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
          <label style={{ fontSize: '0.85rem' }}>
            <input
              id="different-address-checkbox"
              data-testid="different-address-checkbox"
              type="checkbox"
              checked={differentAddress}
              onChange={(e) => setDifferentAddress(e.target.checked)}
            />{' '}
            Ship to a different address
          </label>
          {differentAddress && (
            <input
              id="shipping-address-input"
              data-testid="shipping-address-input"
              type="text"
              placeholder="Shipping address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          )}
        </div>
      </Specimen>

      <Specimen
        id="reset"
        title="Reset button — clears whole form"
        done={isDone('reset')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'reset-demo-form'],
          ['note', 'Reset restores both fields to empty, not to any pre-filled default'],
        ]}
      >
        <form
          id="reset-demo-form"
          data-testid="reset-demo-form"
          onSubmit={(e) => e.preventDefault()}
          onReset={() => {
            setResetName('')
            setResetNotes('')
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
            <input
              id="reset-name"
              data-testid="reset-name"
              type="text"
              placeholder="Name"
              value={resetName}
              onChange={(e) => setResetName(e.target.value)}
            />
            <textarea
              id="reset-notes"
              data-testid="reset-notes"
              placeholder="Notes"
              value={resetNotes}
              onChange={(e) => setResetNotes(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button id="reset-demo-submit" data-testid="reset-demo-submit" className="btn" type="submit">
                Save
              </button>
              <button id="reset-demo-reset" data-testid="reset-demo-reset" className="btn btn-outline" type="reset">
                Reset
              </button>
            </div>
          </div>
        </form>
      </Specimen>
    </>
  )
}
