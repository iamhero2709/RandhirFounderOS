import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)

    await sql`
      CREATE TABLE IF NOT EXISTS founder_data (
        id TEXT PRIMARY KEY DEFAULT 'default',
        data JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    await sql`
      INSERT INTO founder_data (id, data)
      VALUES ('default', '{}')
      ON CONFLICT (id) DO NOTHING
    `

    return res.status(200).json({ success: true, message: 'Database setup complete' })
  } catch (error) {
    console.error('Setup error:', error)
    return res.status(500).json({ error: 'Database setup failed', details: error.message })
  }
}
