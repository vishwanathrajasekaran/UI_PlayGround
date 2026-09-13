import crypto from 'node:crypto'

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

export function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const hmac = crypto.createHmac('sha256', SECRET).update(data).digest('base64url')
  return `${data}.${hmac}`
}

export function verify(token) {
  if (!token) return null
  const [data, hmac] = token.split('.')
  if (!data || !hmac) return null
  const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url')
  if (expected !== hmac) return null
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function parseCookies(header) {
  const list = {}
  if (!header) return list
  header.split(';').forEach((part) => {
    const [name, ...rest] = part.split('=')
    if (!name) return
    list[name.trim()] = decodeURIComponent(rest.join('=').trim())
  })
  return list
}
