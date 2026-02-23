import { topologicalSort } from '../graph/graphUtils'

const STEP_DELAY = 1000

function simulateNodeExecution(node) {
  if (node.type === 'httpRequest') {
    const success = Math.random() > 0.2
    return {
      success,
      message: success
        ? `${node.data.method || 'GET'} ${node.data.url || 'unknown'} → 200 OK`
        : `${node.data.method || 'GET'} ${node.data.url || 'unknown'} → 500 Error`,
      chosenHandle: null
    }
  }
  if (node.type === 'delay') {
    return { success: true, message: `Waited ${node.data.duration || 1}s`, chosenHandle: null }
  }
  if (node.type === 'condition') {
    const takesYes = node.data.testValue !== 'false'
    return {
      success: true,
      message: `Condition evaluated → took ${takesYes ? 'Yes' : 'No'} branch`,
      chosenHandle: takesYes ? 'yes' : 'no'
    }
  }
  if (node.type === 'end') {
    return { success: true, message: 'Workflow completed', chosenHandle: null }
  }
  return {
    success: true,
    message: `${node.data.label || node.type} executed successfully`,
    chosenHandle: null
  }
}

export async function executeWorkflow(nodes, edges, callbacks) {
  const { onNodeStart, onNodeComplete, onLog, onFinish } = callbacks
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  // ✅ Use topological sort instead of BFS
  const sortedIds = topologicalSort(nodes, edges)
  const skipped = new Set()

  for (const nodeId of sortedIds) {
    const node = nodeMap[nodeId]
    if (!node || skipped.has(nodeId)) continue

    onNodeStart(nodeId)
    onLog({
      nodeId,
      nodeLabel: node.data.label || node.type,
      status: 'running',
      message: `Executing ${node.data.label || node.type}...`,
      timestamp: new Date().toLocaleTimeString()
    })

    const delay = node.type === 'delay'
      ? (node.data.duration || 1) * 1000
      : STEP_DELAY

    await new Promise(resolve => setTimeout(resolve, delay))

    const result = simulateNodeExecution(node)

    onNodeComplete(nodeId, result.success)
    onLog({
      nodeId,
      nodeLabel: node.data.label || node.type,
      status: result.success ? 'success' : 'error',
      message: result.message,
      timestamp: new Date().toLocaleTimeString()
    })

    await new Promise(resolve => setTimeout(resolve, 200))

    // For condition nodes, skip the branch that wasn't chosen
    if (node.type === 'condition' && result.chosenHandle) {
      const outgoing = edges.filter(e => e.source === nodeId)
      const skippedEdge = outgoing.find(e => e.sourceHandle !== result.chosenHandle)
      if (skippedEdge) skipped.add(skippedEdge.target)
    }

    // Stop execution chain on error
    if (!result.success) {
      const outgoing = edges.filter(e => e.source === nodeId)
      outgoing.forEach(e => skipped.add(e.target))
    }
  }

  onFinish()
}