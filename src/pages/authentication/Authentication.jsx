import { useEffect, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['login', 'logout', 'session-timeout', 'remember-me', 'role-access']
const VALID_USER = 'admin'
const VALID_PASS = 'password123'
const REMEMBER_KEY = 'au-remembered-username'
const SESSION_SECONDS = 10

export default function Authentication() {
  const { isDone, toggle, completedCount, total } = useProgress('authentication', SPECIMEN_IDS)

  // --- Shared login/logout state ---
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      setUsername(saved)
      setRemember(true)
    }
  }, [])

  function handleLogin(e) {
    e.preventDefault()
    if (username === VALID_USER && password === VALID_PASS) {
      setLoggedIn(true)
      setLoginError(false)
      if (remember) localStorage.setItem(REMEMBER_KEY, username)
      else localStorage.removeItem(REMEMBER_KEY)
    } else {
      setLoginError(true)
    }
  }

  function handleLogout() {
    setLoggedIn(false)
    setPassword('')
  }

  // --- Session timeout (self-contained demo) ---
  const [sessionActive, setSessionActive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    if (!sessionActive) return undefined
    if (secondsLeft <= 0) {
      setSessionActive(false)
      setSessionExpired(true)
      return undefined
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [sessionActive, secondsLeft])

  function startSession() {
    setSessionActive(true)
    setSessionExpired(false)
    setSecondsLeft(SESSION_SECONDS)
  }

  function stayLoggedIn() {
    setSecondsLeft(SESSION_SECONDS)
  }

  // --- Role-based access ---
  const [role, setRole] = useState('guest')

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>AU — Authentication</h1>
          <p>
            Login/logout with fixed demo credentials (<code>admin</code> / <code>password123</code>
            ), a self-contained session-timeout countdown, a "remember me" persisted via
            localStorage, and role-gated content.
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
        title="Login"
        done={isDone('login')}
        onToggleDone={toggle}
        annotations={[
          ['form id', 'auth-login-form'],
          ['valid creds', 'admin / password123'],
          ['error id', 'auth-login-error'],
        ]}
      >
        {loggedIn ? (
          <div data-testid="auth-already-logged-in" className="result-line">
            ✓ Logged in as {username}
          </div>
        ) : (
          <form id="auth-login-form" data-testid="auth-login-form" onSubmit={handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280 }}>
              <input
                id="auth-username"
                data-testid="auth-username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                id="auth-password"
                data-testid="auth-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label style={{ fontSize: '0.85rem' }}>
                <input id="auth-remember" data-testid="auth-remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />{' '}
                Remember me
              </label>
              <button id="auth-login-btn" data-testid="auth-login-btn" className="btn" type="submit">
                Log in
              </button>
              {loginError && (
                <div id="auth-login-error" data-testid="auth-login-error" style={{ color: 'var(--color-fail)', fontSize: '0.82rem' }}>
                  Invalid credentials.
                </div>
              )}
            </div>
          </form>
        )}
      </Specimen>

      <Specimen
        id="logout"
        title="Logout"
        done={isDone('logout')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'auth-logout-btn'],
          ['note', 'only enabled once logged in via the Login specimen above'],
        ]}
      >
        <button id="auth-logout-btn" data-testid="auth-logout-btn" className="btn btn-outline" onClick={handleLogout} disabled={!loggedIn}>
          Log out
        </button>
        {!loggedIn && <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>Not currently logged in.</div>}
      </Specimen>

      <Specimen
        id="session-timeout"
        title="Session timeout"
        done={isDone('session-timeout')}
        onToggleDone={toggle}
        annotations={[
          ['start button id', 'session-start-btn'],
          ['countdown id', 'session-countdown'],
          ['expired message id', 'session-expired'],
          ['note', `self-contained ${SESSION_SECONDS}s demo, independent of the login above`],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          <button id="session-start-btn" data-testid="session-start-btn" className="btn" onClick={startSession} disabled={sessionActive}>
            Start session
          </button>
          {sessionActive && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span id="session-countdown" data-testid="session-countdown" className="result-line" style={{ color: 'var(--color-ink-soft)' }}>
                Expires in {secondsLeft}s
              </span>
              <button id="session-stay-btn" data-testid="session-stay-btn" className="btn btn-outline" onClick={stayLoggedIn}>
                Stay logged in
              </button>
            </div>
          )}
          {sessionExpired && (
            <div id="session-expired" data-testid="session-expired" style={{ color: 'var(--color-fail)', fontSize: '0.85rem' }}>
              Session expired.
            </div>
          )}
        </div>
      </Specimen>

      <Specimen
        id="remember-me"
        title="Remember me — persisted across visits"
        done={isDone('remember-me')}
        onToggleDone={toggle}
        annotations={[
          ['readout id', 'remembered-username-value'],
          ['storage key', REMEMBER_KEY],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <div id="remembered-username-value" data-testid="remembered-username-value" className="result-line" style={{ color: 'var(--color-ink)' }}>
            Remembered username: {localStorage.getItem(REMEMBER_KEY) || '(none)'}
          </div>
          <button
            id="clear-remembered-btn"
            data-testid="clear-remembered-btn"
            className="btn btn-outline"
            onClick={() => {
              localStorage.removeItem(REMEMBER_KEY)
              setRemember(false)
            }}
          >
            Clear remembered username
          </button>
        </div>
      </Specimen>

      <Specimen
        id="role-access"
        title="Role-based access"
        done={isDone('role-access')}
        onToggleDone={toggle}
        annotations={[
          ['select id', 'role-select'],
          ['admin panel id', 'admin-panel (rendered only when role = admin)'],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          <select id="role-select" data-testid="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="guest">Guest</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          {role === 'admin' ? (
            <div id="admin-panel" data-testid="admin-panel" className="result-line">
              ✓ Admin-only panel visible
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>Admin panel is hidden for role "{role}".</div>
          )}
        </div>
      </Specimen>
    </>
  )
}
