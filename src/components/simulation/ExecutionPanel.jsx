import useWorkflowStore from '../../store/useWorkflowStore'

function LogEntry({ log }) {
  const colors = {
    running: { text: '#4f8ef7', bg: '#0c1a3d', border: '#2563eb', icon: '⟳' },
    success: { text: '#22c55e', bg: '#052e16', border: '#16a34a', icon: '✓' },
    error: { text: '#ef4444', bg: '#2d0a0a', border: '#dc2626', icon: '✕' },
  }
  const style = colors[log.status] || colors.running

  return (
    <div
      className="flex items-start gap-2 px-2.5 py-2 rounded-md text-xs"
      style={{ background: style.bg, borderLeft: `3px solid ${style.border}` }}
    >
      <span style={{ color: style.text }} className="font-bold mt-0.5 text-sm">
        {style.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span style={{ color: style.text }} className="font-semibold truncate">
            {log.nodeLabel}
          </span>
          <span className="text-[#8b949e] text-[10px] shrink-0">
            {log.timestamp}
          </span>
        </div>
        <p className="text-[#8b949e] text-[10px] mt-0.5 truncate">
          {log.message}
        </p>
      </div>
    </div>
  )
}

function ExecutionPanel() {
  const executionLogs = useWorkflowStore(s => s.executionLogs)
  const isRunning = useWorkflowStore(s => s.isRunning)

  if (executionLogs.length === 0 && !isRunning) return null

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50
                    bg-[#1c2128] border border-[#30363d] rounded-lg
                    shadow-xl w-[420px]">

      {/* Header */}
      <div className="px-3 py-2 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-semibold uppercase tracking-wider">
            Execution Log
          </span>
          {isRunning && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] animate-pulse" />
          )}
        </div>
        <span className="text-[#8b949e] text-[10px]">
          {executionLogs.length} steps
        </span>
      </div>

      {/* Logs */}
      <div className="p-2 flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
        {executionLogs.map((log, i) => (
          <LogEntry key={i} log={log} />
        ))}
        {isRunning && executionLogs.length === 0 && (
          <p className="text-[#8b949e] text-xs text-center py-2">
            Starting execution...
          </p>
        )}
      </div>

    </div>
  )
}

export default ExecutionPanel