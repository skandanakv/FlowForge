const STORAGE_KEY = 'flowforge_workflow'

export function saveToStorage(nodes, edges) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }))
  } catch (e) {
    console.error('Failed to save workflow:', e)
  }
}

export function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    const parsed = JSON.parse(data)

    // Sanitize — ensure every node has a valid position
    const nodes = (parsed.nodes || []).map(n => ({
      ...n,
      position: n.position && typeof n.position.x === 'number'
        ? n.position
        : { x: 100, y: 100 }
    }))

    return { nodes, edges: parsed.edges || [] }
  } catch (e) {
    console.error('Failed to load workflow:', e)
    return null
  }
}

export function exportAsJSON(nodes, edges) {
  const data = JSON.stringify({ nodes, edges }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flowforge-workflow-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.nodes && data.edges) {
          // Sanitize imported nodes too
          const nodes = data.nodes.map(n => ({
            ...n,
            position: n.position && typeof n.position.x === 'number'
              ? n.position
              : { x: 100, y: 100 }
          }))
          resolve({ nodes, edges: data.edges })
        } else {
          reject(new Error('Invalid workflow file'))
        }
      } catch {
        reject(new Error('Failed to parse file'))
      }
    }
    reader.readAsText(file)
  })
}