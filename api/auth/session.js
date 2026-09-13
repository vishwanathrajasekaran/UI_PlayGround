import { verify, parseCookies } from '../_lib/auth.js'

export default function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie)
  const payload = verify(cookies.session)
  if (!payload) return res.status(401).json({ error: 'Not authenticated' })
  return res.status(200).json({ username: payload.username, role: payload.role })
}
