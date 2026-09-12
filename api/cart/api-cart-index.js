import { sql, ensureSchema } from '../_lib/db.js'
import { getOrCreateCartId } from '../_lib/cart.js'
import { PRODUCTS } from '../_lib/products.js'

async function getCartItems(cartId) {
  const { rows } = await sql`SELECT product_id, qty FROM cart_items WHERE cart_id = ${cartId}`
  return rows
    .map((r) => {
      const product = PRODUCTS.find((p) => p.id === r.product_id)
      return product ? { ...product, qty: r.qty } : null
    })
    .filter(Boolean)
}

export default async function handler(req, res) {
  await ensureSchema()
  const cartId = getOrCreateCartId(req, res)

  if (req.method === 'GET') {
    return res.status(200).json({ items: await getCartItems(cartId) })
  }

  if (req.method === 'POST') {
    const { productId, delta } = req.body || {}
    if (!productId || !PRODUCTS.find((p) => p.id === productId)) {
      return res.status(400).json({ error: 'Invalid product' })
    }
    const change = typeof delta === 'number' ? delta : 1
    await sql`
      INSERT INTO cart_items (cart_id, product_id, qty)
      VALUES (${cartId}, ${productId}, GREATEST(${change}, 0))
      ON CONFLICT (cart_id, product_id)
      DO UPDATE SET qty = GREATEST(cart_items.qty + ${change}, 0)
    `
    await sql`DELETE FROM cart_items WHERE cart_id = ${cartId} AND qty <= 0`
    return res.status(200).json({ items: await getCartItems(cartId) })
  }

  if (req.method === 'DELETE') {
    const { productId } = req.body || {}
    await sql`DELETE FROM cart_items WHERE cart_id = ${cartId} AND product_id = ${productId}`
    return res.status(200).json({ items: await getCartItems(cartId) })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
