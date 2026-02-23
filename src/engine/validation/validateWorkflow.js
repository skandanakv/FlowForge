import { hasCycle } from '../graph/graphUtils'

export function validateWorkflow(nodes, edges) {
  console.log('Validating nodes:', nodes)
  const errors = []

  // Rule 1 — must have at least one trigger
  const triggerNodes = nodes.filter(n => n.type === 'trigger')
  if (triggerNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have at least one Trigger node'
    })
  }

  if (triggerNodes.length > 1) {
    errors.push({
      type: 'warning',
      message: `Multiple Trigger nodes found (${triggerNodes.length}). Only first will execute.`
    })
  }

  // Rule 2 — no cycles
  if (hasCycle(nodes, edges)) {
    errors.push({
      type: 'error',
      message: 'Workflow contains a cyclic dependency (infinite loop detected)'
    })
  }

  // Rule 3 — required fields
  nodes.forEach(node => {
    if (!node.data.label || node.data.label.trim() === '') {
      errors.push({
        type: 'warning',
        message: `A ${node.type} node has no label set`
      })
    }

    if (node.type === 'httpRequest') {
      if (!node.data.url || node.data.url.trim() === '') {
        errors.push({
          type: 'error',
          message: `HTTP Request node "${node.data.label || 'unnamed'}" is missing a URL`
        })
      }
    }

    if (node.type === 'delay') {
      if (!node.data.duration || node.data.duration <= 0) {
        errors.push({
          type: 'error',
          message: `Delay node "${node.data.label || 'unnamed'}" has invalid duration`
        })
      }
    }

    // Rule 5 — condition nodes must have both Yes and No branches connected
    if (node.type === 'condition') {
      const outgoingEdges = edges.filter(e => e.source === node.id)
      const hasYes = outgoingEdges.some(e => e.sourceHandle === 'yes')
      const hasNo = outgoingEdges.some(e => e.sourceHandle === 'no')

      if (!hasYes || !hasNo) {
        errors.push({
          type: 'error',
          message: `Condition node "${node.data.label || 'unnamed'}" must have both Yes and No branches connected`
        })
      }
    }
  })

  // Rule 4 — disconnected nodes warning
  const connectedNodeIds = new Set()
  edges.forEach(e => {
    connectedNodeIds.add(e.source)
    connectedNodeIds.add(e.target)
  })

  if (nodes.length > 1) {
    nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id)) {
        errors.push({
          type: 'warning',
          message: `Node "${node.data.label || node.type}" is not connected to any other node`
        })
      }
    })
  }

  return {
    isValid: errors.filter(e => e.type === 'error').length === 0,
    errors
  }
}