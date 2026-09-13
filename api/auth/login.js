import { sign } from '../_lib/auth.js'

const VALID_USER = 'admin'
const VALID_PASS = 'password123'
const SHORT_SESSION_MS = 30 * 60 * 1000 // 30 minutes
const REMEMBER_SESSION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { username, password, remember } = req.body || {}
  if (username === VALID_USER && password === VALID_PASS) {
    const sessionMs = remember ? REMEMBER_SESSION_MS : SHORT_SESSION_MS
    const token = sign({ username, role: 'admin', exp: Date.now() + sessionMs })
    res.setHeader('Set-Cookie', `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionMs / 1000}`)
    return res.status(200).json({ username, role: 'admin', remember: Boolean(remember) })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
}
