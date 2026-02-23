export function buildAdjacencyList(nodes, edges) {
  const graph = {}
  nodes.forEach(n => { graph[n.id] = [] })
  edges.forEach(e => {
    if (graph[e.source]) {
      graph[e.source].push(e.target)
    }
  })
  return graph
}

export function hasCycle(nodes, edges) {
  const graph = buildAdjacencyList(nodes, edges)
  const visited = new Set()
  const recursionStack = new Set()

  function dfs(nodeId) {
    visited.add(nodeId)
    recursionStack.add(nodeId)
    for (const neighbor of graph[nodeId] || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true
      } else if (recursionStack.has(neighbor)) {
        return true
      }
    }
    recursionStack.delete(nodeId)
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true
    }
  }
  return false
}

export function topologicalSort(nodes, edges) {
  const graph = buildAdjacencyList(nodes, edges)
  const visited = new Set()
  const result = []

  function dfs(nodeId) {
    visited.add(nodeId)
    for (const neighbor of graph[nodeId] || []) {
      if (!visited.has(neighbor)) dfs(neighbor)
    }
    result.unshift(nodeId)
  }

  const triggerNodes = nodes.filter(n => n.type === 'trigger')
  triggerNodes.forEach(n => {
    if (!visited.has(n.id)) dfs(n.id)
  })

  nodes.forEach(n => {
    if (!visited.has(n.id)) dfs(n.id)
  })

  return result
}
