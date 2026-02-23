import { create } from 'zustand'
import { saveToStorage, loadFromStorage } from '../utils/storage'

const saved = loadFromStorage()

// Ensures every node has a valid { x, y } position before XYFlow ever sees it
const sanitizeNodes = (nodes = []) =>
  nodes.map(n => ({
    ...n,
    position:
      n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number'
        ? n.position
        : { x: 100, y: 100 }
  }))

const useWorkflowStore = create((set, get) => ({

  // ─── Core workflow state ───────────────────────────────
  nodes: sanitizeNodes(saved?.nodes),
  edges: saved?.edges || [],

  // ─── Selection ────────────────────────────────────────
  selectedNodeId: null,

  // ─── Undo/Redo ────────────────────────────────────────
  past: [],
  future: [],
  undoRedoFlag: 0,

  // ─── Execution state ──────────────────────────────────
  isRunning: false,
  executingNodeId: null,
  executionLogs: [],
  nodeStatuses: {},

  // ─── Validation ───────────────────────────────────────
  validationErrors: [],

  // ─── Theme ────────────────────────────────────────────
isDarkMode: true,
toggleTheme: () => set(s => ({ isDarkMode: !s.isDarkMode })),

  // ─── Snapshot helper ──────────────────────────────────
  saveSnapshot: () => {
    const { nodes, edges, past } = get()
    set({
      past: [...past, { nodes, edges }],
      future: []
    })
  },

  // ─── Sync from React Flow into Zustand ────────────────
  syncNodes: (nodes) => {
    const safe = sanitizeNodes(nodes)
    set({ nodes: safe })
    saveToStorage(safe, get().edges)
  },

  syncEdges: (edges) => {
    set({ edges })
    saveToStorage(get().nodes, edges)
  },

  // ─── Node operations ──────────────────────────────────
  addNode: (node) => {
    get().saveSnapshot()
    const newNodes = sanitizeNodes([...get().nodes, node])
    set({ nodes: newNodes })
    saveToStorage(newNodes, get().edges)
  },

  updateNodeData: (nodeId, newData) => {
    get().saveSnapshot()
    const updatedNodes = get().nodes.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, ...newData } }
        : n
    )
    set({ nodes: updatedNodes })
    saveToStorage(updatedNodes, get().edges)
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // ─── Undo ─────────────────────────────────────────────
  undo: () => {
    const { past, future, nodes, edges } = get()
    if (past.length === 0) return
    const previous = past[past.length - 1]
    const newPast = past.slice(0, past.length - 1)
    set({
      nodes: sanitizeNodes(previous.nodes),
      edges: previous.edges,
      past: newPast,
      future: [{ nodes, edges }, ...future],
      undoRedoFlag: get().undoRedoFlag + 1
    })
    saveToStorage(previous.nodes, previous.edges)
  },

  // ─── Redo ─────────────────────────────────────────────
  redo: () => {
    const { past, future, nodes, edges } = get()
    if (future.length === 0) return
    const next = future[0]
    const newFuture = future.slice(1)
    set({
      nodes: sanitizeNodes(next.nodes),
      edges: next.edges,
      past: [...past, { nodes, edges }],
      future: newFuture,
      undoRedoFlag: get().undoRedoFlag + 1
    })
    saveToStorage(next.nodes, next.edges)
  },

  // ─── Execution setters ────────────────────────────────
  setIsRunning: (val) => set({ isRunning: val }),
  setExecutingNodeId: (id) => set({ executingNodeId: id }),
  addExecutionLog: (log) => set({ executionLogs: [...get().executionLogs, log] }),
  clearExecutionLogs: () => set({ executionLogs: [] }),
  setNodeStatus: (nodeId, status) => set({
    nodeStatuses: { ...get().nodeStatuses, [nodeId]: status }
  }),
  clearNodeStatuses: () => set({ nodeStatuses: {} }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),

}))

export default useWorkflowStore
