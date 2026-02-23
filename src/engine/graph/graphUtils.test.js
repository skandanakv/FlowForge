import { describe, it, expect } from 'vitest'
import { hasCycle, topologicalSort } from './graphUtils.js'

const mockNodes = (ids) => ids.map(id => ({ id, type: 'action', data: {} }))

describe('hasCycle', () => {
  it('returns false when no cycle exists', () => {
    const nodes = mockNodes(['a', 'b', 'c'])
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' }
    ]
    expect(hasCycle(nodes, edges)).toBe(false)
  })

  it('returns true when cycle exists', () => {
    const nodes = mockNodes(['a', 'b', 'c'])
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'a' }
    ]
    expect(hasCycle(nodes, edges)).toBe(true)
  })
})

describe('topologicalSort', () => {
  it('starts from trigger node', () => {
    const nodes = [
      { id: 'a', type: 'trigger', data: {} },
      { id: 'b', type: 'action', data: {} },
      { id: 'c', type: 'end', data: {} }
    ]
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' }
    ]
    const sorted = topologicalSort(nodes, edges)
    expect(sorted[0]).toBe('a')
    expect(sorted[2]).toBe('c')
  })
})