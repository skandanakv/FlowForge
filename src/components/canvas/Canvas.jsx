import { useRef, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import useWorkflowStore from '../../store/useWorkflowStore'
import { nodeTypes } from '../nodes'
import { NODE_CONFIGS } from '../../constants/nodeTypes'
import ValidationPanel from '../simulation/ValidationPanel'


function Canvas() {
  const syncNodes = useWorkflowStore(s => s.syncNodes)
  const syncEdges = useWorkflowStore(s => s.syncEdges)
  const saveSnapshot = useWorkflowStore(s => s.saveSnapshot)
  const setSelectedNodeId = useWorkflowStore(s => s.setSelectedNodeId)
  const addNode = useWorkflowStore(s => s.addNode)
  const storeNodes = useWorkflowStore(s => s.nodes) ?? []
  const storeEdges = useWorkflowStore(s => s.edges) ?? []
  const undoRedoFlag = useWorkflowStore(s => s.undoRedoFlag)

  // ✅ NO square brackets — storeNodes/storeEdges are already arrays
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges)

  const reactFlowWrapper = useRef(null)
  const { screenToFlowPosition, fitView } = useReactFlow()

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.2 }), 100)
  }, [])

  useEffect(() => {
    if (undoRedoFlag > 0) {
      setNodes(storeNodes)
      setEdges(storeEdges)
    }
  }, [undoRedoFlag])

  useEffect(() => {
    window.__setNodes = setNodes
    window.__setEdges = setEdges
    window.__getNodes = () => nodes
    window.__getEdges = () => edges
  }, [setNodes, setEdges, nodes, edges])
  
  useEffect(() => {
    if (nodes.length > 0) {
      syncNodes(nodes)
    }
  }, [nodes])

  const handleNodeDragStop = useCallback((_, __, currentNodes) => {
    saveSnapshot()
    syncNodes(currentNodes)
  }, [saveSnapshot, syncNodes])



  const handleConnect = useCallback((connection) => {
    saveSnapshot()
    const newEdges = addEdge({ ...connection, animated: true }, edges)
    setEdges(newEdges)
    syncEdges(newEdges)
  }, [edges, saveSnapshot, syncEdges, setEdges])

  const handleNodesDelete = useCallback((deleted) => {
    saveSnapshot()
    const remaining = nodes.filter(n => !deleted.find(d => d.id === n.id))
    syncNodes(remaining)
  }, [nodes, saveSnapshot, syncNodes])

  const handleEdgesDelete = useCallback((deleted) => {
    saveSnapshot()
    const remaining = edges.filter(e => !deleted.find(d => d.id === e.id))
    syncEdges(remaining)
  }, [edges, saveSnapshot, syncEdges])

  const handleSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    if (selectedNodes.length === 1) {
      setSelectedNodeId(selectedNodes[0].id)
    } else {
      setSelectedNodeId(null)
    }
  }, [setSelectedNodeId])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('nodeType')
    if (!type) return

    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    const config = NODE_CONFIGS[type]

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { ...config.defaultData }
    }

    addNode(newNode)
    setNodes(prev => [...prev, newNode])
  }, [screenToFlowPosition, addNode, setNodes])

  const handleNodeDataUpdate = useCallback((nodeId, newData) => {
    setNodes(prev =>
      prev.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n)
    )
  }, [setNodes])

  useEffect(() => {
    window.__updateNodeData = handleNodeDataUpdate
  }, [handleNodeDataUpdate])

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ValidationPanel />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeDragStop={handleNodeDragStop}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
        onSelectionChange={handleSelectionChange}
        // onNodeClick={handleNodeClick}
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        deleteKeyCode="Backspace"
      >
        <Background color="#30363d" gap={20} />
        <Controls />
        <MiniMap
          nodeColor="#4f8ef7"
          maskColor="rgba(0,0,0,0.6)"
          style={{ background: '#1c2128' }}
        />
      </ReactFlow>
    </div>
  )
}

export default Canvas