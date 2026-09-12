import crypto from 'node:crypto'
import { parseCookies } from './auth.js'

const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function getOrCreateCartId(req, res) {
  const cookies = parseCookies(req.headers.cookie)
  let cartId = cookies.cart_id
  if (!cartId) {
    cartId = crypto.randomUUID()
    res.setHeader('Set-Cookie', `cart_id=${cartId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${CART_COOKIE_MAX_AGE}`)
  }
  return cartId
}
