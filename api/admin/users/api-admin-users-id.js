import { sql, ensureSchema } from '../../_lib/db.js'

export default async function handler(req, res) {
  await ensureSchema()
  const { id } = req.query

  if (req.method === 'PATCH') {
    const { name } = req.body || {}
    if (!name) return res.status(400).json({ error: 'Name is required' })
    const { rows } = await sql`UPDATE admin_users SET name = ${name} WHERE id = ${id} RETURNING id, name, email`
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json({ user: rows[0] })
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM admin_users WHERE id = ${id}`
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
