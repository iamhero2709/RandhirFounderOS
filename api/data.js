import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL)

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT data FROM founder_data WHERE id = 'default'
      `

      if (rows.length === 0) {
        return res.status(200).json({ data: null })
      }

      return res.status(200).json({ data: rows[0].data })
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid data' })
      }

      await sql`
        INSERT INTO founder_data (id, data, updated_at)
        VALUES ('default', ${JSON.stringify(body)}, NOW())
        ON CONFLICT (id) DO UPDATE
        SET data = ${JSON.stringify(body)}, updated_at = NOW()
      `

      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Server error', details: error.message })
  }
}
