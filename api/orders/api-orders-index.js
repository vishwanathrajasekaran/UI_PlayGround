import { sql, ensureSchema } from '../_lib/db.js'
import { getOrCreateCartId } from '../_lib/cart.js'
import { PRODUCTS } from '../_lib/products.js'

export default async function handler(req, res) {
  await ensureSchema()
  const cartId = getOrCreateCartId(req, res)

  if (req.method === 'POST') {
    const { name, address } = req.body || {}
    if (!name || !address) return res.status(400).json({ error: 'Name and address are required' })

    const { rows: cartRows } = await sql`SELECT product_id, qty FROM cart_items WHERE cart_id = ${cartId}`
    if (cartRows.length === 0) return res.status(400).json({ error: 'Cart is empty' })

    const items = cartRows
      .map((r) => {
        const product = PRODUCTS.find((p) => p.id === r.product_id)
        return product ? { ...product, qty: r.qty } : null
      })
      .filter(Boolean)

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

    await sql`INSERT INTO orders (id, cart_id, name, address, total) VALUES (${orderId}, ${cartId}, ${name}, ${address}, ${total})`
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, name, price, qty)
        VALUES (${orderId}, ${item.id}, ${item.name}, ${item.price}, ${item.qty})
      `
    }
    await sql`DELETE FROM cart_items WHERE cart_id = ${cartId}`

    return res.status(200).json({ orderId, items, total, name })
  }

  if (req.method === 'GET') {
    const { rows } = await sql`
      SELECT id, name, address, total, created_at FROM orders
      WHERE cart_id = ${cartId}
      ORDER BY created_at DESC
    `
    return res.status(200).json({ orders: rows })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
