import useWorkflowStore from '../../store/useWorkflowStore'
import { validateWorkflow } from '../../engine/validation/validateWorkflow'
import { executeWorkflow } from '../../engine/execution/executeWorkflow'
import { exportAsJSON, importFromJSON } from '../../utils/storage'

function Toolbar() {
  const undo = useWorkflowStore(s => s.undo)
  const redo = useWorkflowStore(s => s.redo)
  const past = useWorkflowStore(s => s.past)
  const future = useWorkflowStore(s => s.future)
  const setValidationErrors = useWorkflowStore(s => s.setValidationErrors)
  const isRunning = useWorkflowStore(s => s.isRunning)
  const setIsRunning = useWorkflowStore(s => s.setIsRunning)
  const setExecutingNodeId = useWorkflowStore(s => s.setExecutingNodeId)
  const addExecutionLog = useWorkflowStore(s => s.addExecutionLog)
  const clearExecutionLogs = useWorkflowStore(s => s.clearExecutionLogs)
  const setNodeStatus = useWorkflowStore(s => s.setNodeStatus)
  const clearNodeStatuses = useWorkflowStore(s => s.clearNodeStatuses)
  const isDarkMode = useWorkflowStore(s => s.isDarkMode)      // ← ADDED
  const toggleTheme = useWorkflowStore(s => s.toggleTheme)    // ← ADDED

  // Always read live canvas state, not stale store state
  const getLiveNodes = () => window.__getNodes?.() ?? useWorkflowStore.getState().nodes
  const getLiveEdges = () => window.__getEdges?.() ?? useWorkflowStore.getState().edges

  const handleRun = async () => {
    const nodes = getLiveNodes()
    const edges = getLiveEdges()

    const { isValid, errors } = validateWorkflow(nodes, edges)
    setValidationErrors(errors)
    if (!isValid) return

    clearExecutionLogs()
    clearNodeStatuses()
    setValidationErrors([])
    setIsRunning(true)

    await executeWorkflow(nodes, edges, {
      onNodeStart: (nodeId) => {
        setExecutingNodeId(nodeId)
        setNodeStatus(nodeId, 'running')
      },
      onNodeComplete: (nodeId, success) => {
        setExecutingNodeId(null)
        setNodeStatus(nodeId, success ? 'success' : 'error')
      },
      onLog: (log) => {
        addExecutionLog(log)
      },
      onFinish: () => {
        setIsRunning(false)
        setExecutingNodeId(null)
      }
    })
  }

  const handleExport = () => {
    exportAsJSON(getLiveNodes(), getLiveEdges())
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      try {
        const data = await importFromJSON(file)
        useWorkflowStore.getState().syncNodes(data.nodes)
        useWorkflowStore.getState().syncEdges(data.edges)
        window.__setNodes && window.__setNodes(data.nodes)
        window.__setEdges && window.__setEdges(data.edges)
      } catch (err) {
        console.error('Error importing workflow file:', err)
        alert('Invalid workflow file')
      }
    }
    input.click()
  }

  const handleClear = () => {
    if (window.confirm('Clear the entire canvas?')) {
      useWorkflowStore.getState().syncNodes([])
      useWorkflowStore.getState().syncEdges([])
      window.__setNodes && window.__setNodes([])
      window.__setEdges && window.__setEdges([])
      useWorkflowStore.getState().clearExecutionLogs()
      useWorkflowStore.getState().clearNodeStatuses()
      useWorkflowStore.getState().setValidationErrors([])
    }
  }

  // ── ADDED: theme-aware styles ──────────────────────────
  const btn = isDarkMode
    ? 'px-3 py-1.5 text-sm bg-[#30363d] hover:bg-[#3d444d] text-white rounded-md transition-colors duration-200'
    : 'px-3 py-1.5 text-sm bg-[#e2e8f0] hover:bg-[#cbd5e1] text-gray-800 rounded-md transition-colors duration-200'

  const btnDisabled = btn + ' disabled:opacity-40 disabled:cursor-not-allowed'
  // ── END ADDED ──────────────────────────────────────────

  return (
    // ← CHANGED: was hardcoded dark, now theme-aware
    <div className={`h-12 border-b flex items-center px-4 gap-3 transition-colors duration-200
      ${isDarkMode ? 'bg-[#1c2128] border-[#30363d]' : 'bg-white border-gray-200'}`}>

      {/* ← CHANGED: was hardcoded text-white */}
      <span className={`font-semibold text-lg tracking-tight mr-auto
        ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        ⚡ FlowForge
      </span>

      {/* Run button — kept exactly as original, always blue */}
      <button
        onClick={handleRun}
        disabled={isRunning}
        className="px-3 py-1.5 text-sm bg-[#4f8ef7] hover:bg-[#3a7bd5] text-white 
                   rounded-md transition-colors duration-200 
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isRunning ? 'Running...' : 'Run'}
      </button>

      {/* ← CHANGED: using btnDisabled for theme support */}
      <button onClick={undo} disabled={past.length === 0} className={btnDisabled}>
        Undo
      </button>
      <button onClick={redo} disabled={future.length === 0} className={btnDisabled}>
        Redo
      </button>

      {/* ← CHANGED: using btn for theme support */}
      <button onClick={handleImport} className={btn}>
        Import
      </button>
      <button onClick={handleClear} className={btn}>
        Clear
      </button>
      <button onClick={handleExport} className={btn}>
        Export
      </button>

      {/* ← ADDED: theme toggle button */}
      <button onClick={toggleTheme} className={btn} title="Toggle light/dark mode">
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  )
}

export default Toolbar