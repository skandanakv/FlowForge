import useWorkflowStore from '../../store/useWorkflowStore'

function ValidationPanel() {
  const validationErrors = useWorkflowStore(s => s.validationErrors)

  if (validationErrors.length === 0) return null

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 
                    bg-[#1c2128] border border-[#30363d] rounded-lg 
                    shadow-xl w-[380px] max-h-[200px] overflow-y-auto">
      <div className="px-3 py-2 border-b border-[#30363d] flex items-center justify-between">
        <span className="text-white text-xs font-semibold uppercase tracking-wider">
          Validation Issues
        </span>
        <span className="text-[#8b949e] text-xs">
          {validationErrors.filter(e => e.type === 'error').length} errors,{' '}
          {validationErrors.filter(e => e.type === 'warning').length} warnings
        </span>
      </div>
      <div className="p-2 flex flex-col gap-1.5">
        {validationErrors.map((err, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-2 py-1.5 rounded-md"
            style={{
              background: err.type === 'error' ? '#2d0a0a' : '#1c1500',
              borderLeft: `3px solid ${err.type === 'error' ? '#ef4444' : '#eab308'}`
            }}
          >
            <span className="text-sm mt-0.5">
              {err.type === 'error' ? '✕' : '⚠'}
            </span>
            <p
              className="text-xs"
              style={{ color: err.type === 'error' ? '#fca5a5' : '#fde68a' }}
            >
              {err.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ValidationPanel


//show validation errors in a panel above the canvas. This component subscribes to the validationErrors state in the workflow store and renders a list of errors and warnings. Each error/warning is styled differently for clarity. The panel is only visible when there are validation issues to display.