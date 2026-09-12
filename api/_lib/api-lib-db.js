import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
export const sql = neon(connectionString)

let schemaReady = null

export async function ensureSchema() {
  if (schemaReady) return schemaReady
  schemaReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        cart_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        qty INTEGER NOT NULL,
        PRIMARY KEY (cart_id, product_id)
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        cart_id TEXT NOT NULL,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        total NUMERIC NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        qty INTEGER NOT NULL
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM admin_users`
    if (rows[0].count === 0) {
      await sql`
        INSERT INTO admin_users (name, email) VALUES
        ('Priya Nair', 'priya@example.com'),
        ('Tom Becker', 'tom@example.com'),
        ('Lucia Fernandez', 'lucia@example.com')
      `
    }
  })()
  return schemaReady
}
