import { NODE_CONFIGS, NODE_TYPES } from '../../constants/nodeTypes'
import useWorkflowStore from '../../store/useWorkflowStore'
import { memo } from 'react'

const nodeList = Object.values(NODE_TYPES)

const NodeCard = memo(function NodeCard({ type }) {
  const config = NODE_CONFIGS[type]

  const handleDragStart = (e) => {
    e.dataTransfer.setData('nodeType', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{ borderColor: config.borderColor, background: config.bgColor }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab 
                 hover:scale-[1.02] hover:brightness-125 
                 transition-all duration-150 active:cursor-grabbing select-none"
    >
      <span className="text-xl">{config.icon}</span>
      <div>
        <p style={{ color: config.color }} className="text-xs font-semibold uppercase tracking-wider">
          {config.label}
        </p>
      </div>
    </div>
  )
})

function Sidebar() {
  const nodes = useWorkflowStore(s => s.nodes)
  const edges = useWorkflowStore(s => s.edges)
  const isDarkMode = useWorkflowStore(s => s.isDarkMode)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className={`text-xs font-medium uppercase tracking-wider mb-2
          ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-500'}`}>
          Drag to add
        </p>
        {nodeList.map(type => (
          <NodeCard key={type} type={type} />
        ))}
      </div>

      {/* Footer stats */}
      <div className={`px-4 py-3 border-t transition-colors duration-200
        ${isDarkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className="flex justify-between">
          <span className={`text-[10px] uppercase tracking-wider
            ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-500'}`}>Nodes</span>
          <span className={`text-[10px] font-semibold
            ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{nodes.length}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-[10px] uppercase tracking-wider
            ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-500'}`}>Edges</span>
          <span className={`text-[10px] font-semibold
            ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{edges.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar