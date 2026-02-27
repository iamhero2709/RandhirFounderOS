const API_BASE = '/api'

export async function loadDataFromDB() {
  try {
    const res = await fetch(`${API_BASE}/data`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.data || null
  } catch (error) {
    console.warn('Failed to load from database, using localStorage:', error.message)
    return null
  }
}

export async function saveDataToDB(data) {
  try {
    const res = await fetch(`${API_BASE}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return true
  } catch (error) {
    console.warn('Failed to save to database:', error.message)
    return false
  }
}

export async function setupDatabase() {
  try {
    const res = await fetch(`${API_BASE}/setup`, { method: 'POST' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return true
  } catch (error) {
    console.warn('Database setup failed:', error.message)
    return false
  }
}
