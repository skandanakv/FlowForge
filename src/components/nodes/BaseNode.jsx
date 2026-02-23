import { Handle, Position } from '@xyflow/react'
import { NODE_CONFIGS } from '../../constants/nodeTypes'
import useWorkflowStore from '../../store/useWorkflowStore'

import { memo } from 'react'

function BaseNode({ id, type, data, showYesNo = false }) {
  const config = NODE_CONFIGS[type]
  const selectedNodeId = useWorkflowStore(s => s.selectedNodeId)
  const isSelected = selectedNodeId === id
  const isExecuting = useWorkflowStore(s => s.executingNodeId === id)
  const nodeStatuses = useWorkflowStore(s => s.nodeStatuses)
  const nodeStatus = nodeStatuses ? nodeStatuses[id] : null

  return (
    <div
      style={{
        background: config.bgColor,
        borderColor: isExecuting
          ? '#ffffff'
          : nodeStatus === 'success'
          ? '#22c55e'
          : nodeStatus === 'error'
          ? '#ef4444'
          : isSelected
          ? config.color
          : config.borderColor,
        boxShadow: isExecuting
          ? `0 0 20px ${config.color}, 0 0 40px ${config.color}44`
          : nodeStatus === 'success'
          ? '0 0 12px #22c55e66'
          : nodeStatus === 'error'
          ? '0 0 12px #ef444466'
          : isSelected
          ? `0 0 12px ${config.color}66`
          : 'none'
      }}
      className="w-[160px] rounded-lg border-2 transition-all duration-200"
    >
      {/* Input handle — top center, hidden for trigger */}
      {type !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !bg-[#30363d] !border-2 !border-[#8b949e]"
        />
      )}

      {/* Node header */}
      <div
        style={{ borderBottomColor: config.borderColor }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-opacity-40"
      >
        <span className="text-sm">{config.icon}</span>
        <span
          style={{ color: config.color }}
          className="text-[10px] font-semibold uppercase tracking-wider"
        >
          {config.label}
        </span>

        {/* Executing pulse indicator */}
        {isExecuting && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}

        {/* Completion status indicator */}
        {!isExecuting && nodeStatus === 'success' && (
          <span className="ml-auto text-[#22c55e] text-xs font-bold">✓</span>
        )}
        {!isExecuting && nodeStatus === 'error' && (
          <span className="ml-auto text-[#ef4444] text-xs font-bold">✕</span>
        )}
      </div>

      {/* Node body */}
      <div className="px-2.5 py-1.5">
        <p className="text-white text-xs font-medium truncate">
          {data.label}
        </p>
        {data.description && (
          <p className="text-[#8b949e] text-[10px] mt-0.5 truncate">
            {data.description}
          </p>
        )}
        {data.url && (
          <p className="text-[#8b949e] text-[10px] mt-0.5 truncate">
            {data.method} {data.url}
          </p>
        )}
        {data.duration && (
          <p className="text-[#8b949e] text-[10px] mt-0.5">
            {data.duration}s delay
          </p>
        )}
      </div>

      {/* Output handles */}
      {showYesNo ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            style={{ left: '30%' }}
            className="!w-2.5 !h-2.5 !bg-[#22c55e] !border-2 !border-[#16a34a]"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            style={{ left: '70%' }}
            className="!w-2.5 !h-2.5 !bg-[#ef4444] !border-2 !border-[#dc2626]"
          />
          <div className="flex justify-between px-3 pb-1">
            <span className="text-[9px] text-[#22c55e] font-medium">Yes</span>
            <span className="text-[9px] text-[#ef4444] font-medium">No</span>
          </div>
        </>
      ) : type !== 'end' ? (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !bg-[#30363d] !border-2 !border-[#8b949e]"
        />
      ) : null}
    </div>
  )
}

export default memo(BaseNode)