import useWorkflowStore from '../../store/useWorkflowStore'
import { NODE_CONFIGS } from '../../constants/nodeTypes'

function FieldGroup({ label, children, isDarkMode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-xs font-medium uppercase tracking-wider
        ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-500'}`}>
        {label}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, isDarkMode }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border rounded-md px-3 py-2 text-sm
                 focus:outline-none focus:border-[#4f8ef7] transition-colors duration-150
                 ${isDarkMode
                   ? 'bg-[#0f0f0f] border-[#30363d] text-white placeholder-[#8b949e]'
                   : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
    />
  )
}

function SelectInput({ value, onChange, options, isDarkMode }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className={`w-full border rounded-md px-3 py-2 text-sm
                 focus:outline-none focus:border-[#4f8ef7] transition-colors duration-150
                 ${isDarkMode
                   ? 'bg-[#0f0f0f] border-[#30363d] text-white'
                   : 'bg-white border-gray-300 text-gray-900'}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

function NumberInput({ value, onChange, min = 1, max = 60, isDarkMode }) {
  return (
    <input
      type="number"
      value={value || ''}
      onChange={e => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className={`w-full border rounded-md px-3 py-2 text-sm
                 focus:outline-none focus:border-[#4f8ef7] transition-colors duration-150
                 ${isDarkMode
                   ? 'bg-[#0f0f0f] border-[#30363d] text-white'
                   : 'bg-white border-gray-300 text-gray-900'}`}
    />
  )
}

function TextAreaInput({ value, onChange, placeholder, isDarkMode }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className={`w-full border rounded-md px-3 py-2 text-sm resize-none
                 focus:outline-none focus:border-[#4f8ef7] transition-colors duration-150
                 ${isDarkMode
                   ? 'bg-[#0f0f0f] border-[#30363d] text-white placeholder-[#8b949e]'
                   : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
    />
  )
}

function TriggerConfig({ data, onChange, isDarkMode }) {
  return (
    <>
      <FieldGroup label="Name" isDarkMode={isDarkMode}>
        <TextInput isDarkMode={isDarkMode} value={data.label} onChange={v => onChange('label', v)} placeholder="Trigger name" />
      </FieldGroup>
      <FieldGroup label="Trigger Type" isDarkMode={isDarkMode}>
        <SelectInput
          isDarkMode={isDarkMode}
          value={data.triggerType}
          onChange={v => onChange('triggerType', v)}
          options={[
            { value: 'manual', label: 'Manual' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'webhook', label: 'Webhook' },
          ]}
        />
      </FieldGroup>
    </>
  )
}

function ActionConfig({ data, onChange, isDarkMode }) {
  return (
    <>
      <FieldGroup label="Name" isDarkMode={isDarkMode}>
        <TextInput isDarkMode={isDarkMode} value={data.label} onChange={v => onChange('label', v)} placeholder="Action name" />
      </FieldGroup>
      <FieldGroup label="Description" isDarkMode={isDarkMode}>
        <TextAreaInput isDarkMode={isDarkMode} value={data.description} onChange={v => onChange('description', v)} placeholder="What does this action do?" />
      </FieldGroup>
    </>
  )
}

function ConditionConfig({ data, onChange, isDarkMode }) {
  return (
    <>
      <FieldGroup label="Name" isDarkMode={isDarkMode}>
        <TextInput isDarkMode={isDarkMode} value={data.label} onChange={v => onChange('label', v)} placeholder="Condition name" />
      </FieldGroup>
      <FieldGroup label="Condition Expression" isDarkMode={isDarkMode}>
        <TextInput isDarkMode={isDarkMode} value={data.conditionLabel} onChange={v => onChange('conditionLabel', v)} placeholder="e.g. status === 200" />
      </FieldGroup>
      <FieldGroup label="Test Value" isDarkMode={isDarkMode}>
        <SelectInput
          isDarkMode={isDarkMode}
          value={data.testValue || 'true'}
          onChange={v => onChange('testValue', v)}
          options={[
            { value: 'true', label: 'True → Yes branch' },
            { value: 'false', label: 'False → No branch' },
          ]}
        />
      </FieldGroup>
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          <span className="text-[#22c55e] text-xs">Yes branch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="text-[#ef4444] text-xs">No branch</span>
        </div>
      </div>
    </>
  )
}

function DelayConfig({ data, onChange, isDarkMode }) {
  return (
    <>
      <FieldGroup label="Name" isDarkMode={isDarkMode}>
        <TextInput isDarkMode={isDarkMode} value={data.label} onChange={v => onChange('label', v)} placeholder="Delay name" />
      </FieldGroup>
      <FieldGroup label="Duration (seconds)" isDarkMode={isDarkMode}>
        <NumberInput isDarkMode={isDarkMode} value={data.duration} onChange={v => onChange('duration', v)} min={1} max={60} />
      </FieldGroup>
    </>
  )
}

function HttpRequestConfig({ data, onChange, isDarkMode }) {
  return (
    <>
      <FieldGroup label="Name" isDarkMode={isDarkMode}>
        <TextInput isDarkMode={isDarkMode} value={data.label} onChange={v => onChange('label', v)} placeholder="Request name" />
      </FieldGroup>
      <FieldGroup label="Method" isDarkMode={isDarkMode}>
        <SelectInput
          isDarkMode={isDarkMode}
          value={data.method}
          onChange={v => onChange('method', v)}
          options={[
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' },
            { value: 'DELETE', label: 'DELETE' },
          ]}
        />
      </FieldGroup>
      <FieldGroup label="URL" isDarkMode={isDarkMode}>
        <TextInput isDarkMode={isDarkMode} value={data.url} onChange={v => onChange('url', v)} placeholder="https://api.example.com" />
      </FieldGroup>
    </>
  )
}

function EndConfig({ data, onChange, isDarkMode }) {
  return (
    <FieldGroup label="Label" isDarkMode={isDarkMode}>
      <TextInput isDarkMode={isDarkMode} value={data.label} onChange={v => onChange('label', v)} placeholder="End label" />
    </FieldGroup>
  )
}

const configForms = {
  trigger: TriggerConfig,
  action: ActionConfig,
  condition: ConditionConfig,
  delay: DelayConfig,
  httpRequest: HttpRequestConfig,
  end: EndConfig,
}

// ─── Execution Log ─────────────────────────────────────

const logColors = {
  running: { text: '#4f8ef7', bg: '#0c1a3d', border: '#2563eb', icon: '⟳' },
  success: { text: '#22c55e', bg: '#052e16', border: '#16a34a', icon: '✓' },
  error: { text: '#ef4444', bg: '#2d0a0a', border: '#dc2626', icon: '✕' },
}

function ExecutionLog({ isDarkMode }) {
  const executionLogs = useWorkflowStore(s => s.executionLogs)
  const isRunning = useWorkflowStore(s => s.isRunning)

  if (executionLogs.length === 0 && !isRunning) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full gap-3">
        <span className="text-4xl opacity-20">⚙️</span>
        <p className={`text-sm text-center ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-400'}`}>
          Select a node to configure its properties
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className={`px-4 py-3 border-b flex items-center justify-between
        ${isDarkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <p className={`text-xs font-medium uppercase tracking-wider
            ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-500'}`}>
            Execution Log
          </p>
          {isRunning && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] animate-pulse" />
          )}
        </div>
        <span className={`text-[10px] ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-400'}`}>
          {executionLogs.length} steps
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
        {executionLogs.map((log, i) => {
          const style = logColors[log.status] || logColors.running
          return (
            <div
              key={i}
              className="flex items-start gap-2 px-2.5 py-2 rounded-md"
              style={{ background: style.bg, borderLeft: `3px solid ${style.border}` }}
            >
              <span style={{ color: style.text }} className="font-bold mt-0.5 text-sm">
                {style.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span style={{ color: style.text }} className="text-xs font-semibold truncate">
                    {log.nodeLabel}
                  </span>
                  <span className={`text-[10px] shrink-0 ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-400'}`}>
                    {log.timestamp}
                  </span>
                </div>
                <p className={`text-[10px] mt-0.5 truncate ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-400'}`}>
                  {log.message}
                </p>
              </div>
            </div>
          )
        })}
        {isRunning && executionLogs.length === 0 && (
          <p className={`text-xs text-center py-4 ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-400'}`}>
            Starting execution...
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main ConfigPanel ──────────────────────────────────

function ConfigPanel() {
  const selectedNodeId = useWorkflowStore(s => s.selectedNodeId)
  const nodes = useWorkflowStore(s => s.nodes)
  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const updateNodeData = useWorkflowStore(s => s.updateNodeData)
  const isDarkMode = useWorkflowStore(s => s.isDarkMode)

  if (!selectedNode) {
    return <ExecutionLog isDarkMode={isDarkMode} />
  }

  const config = NODE_CONFIGS[selectedNode.type]
  const ConfigForm = configForms[selectedNode.type]

  const handleChange = (field, value) => {
    updateNodeData(selectedNode.id, { [field]: value })
    if (window.__updateNodeData) {
      window.__updateNodeData(selectedNode.id, { [field]: value })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div
        style={{ borderBottomColor: config.borderColor }}
        className="px-4 py-3 border-b flex items-center gap-2"
      >
        <span className="text-lg">{config.icon}</span>
        <div>
          <p style={{ color: config.color }} className="text-xs font-semibold uppercase tracking-wider">
            {config.label}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {ConfigForm && (
          <ConfigForm data={selectedNode.data} onChange={handleChange} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  )
}

export default ConfigPanel