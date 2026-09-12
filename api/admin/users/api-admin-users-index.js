import { sql, ensureSchema } from '../_lib/db.js'

export default async function handler(req, res) {
  await ensureSchema()

  if (req.method === 'GET') {
    const { rows } = await sql`SELECT id, name, email FROM admin_users ORDER BY id`
    return res.status(200).json({ users: rows })
  }

  if (req.method === 'POST') {
    const { name, email } = req.body || {}
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' })
    const { rows } = await sql`INSERT INTO admin_users (name, email) VALUES (${name}, ${email}) RETURNING id, name, email`
    return res.status(200).json({ user: rows[0] })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
