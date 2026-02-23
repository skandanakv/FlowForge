# ⚡ FlowForge — Visual Workflow Builder

A frontend-only visual workflow automation builder built with React and Zustand.  
Create, configure, validate, simulate, and persist workflows — entirely in the browser, no backend required.

---

## 📸 Screenshots

### 1. Empty Canvas — Three Panel Layout
[placeholder for img — Image 1: empty canvas]  
> Three-panel layout: Node Library (left), Canvas (center), Properties Panel (right).  
> Toolbar: **Run** · **Undo** · **Redo** · **Import** · **Clear** · **Export** · **☀️/🌙 Theme Toggle**

---

### 2. Drag and Drop Nodes
[placeholder for img — Image 2: trigger node dropped]  
> Drag any node from the left sidebar onto the canvas. Node count updates in real time at the bottom of the sidebar.

---

### 3. Full Workflow + Execution Log
[placeholder for img — Image 3: full workflow running]  
> Complete workflow: Trigger → Action → Condition → (Yes) Delay / (No) HTTP Request → End.  
> Right panel shows live execution log with timestamps, step status, and branch decisions.

---

### 4. Node Configuration Panel
[placeholder for img — Image 4: HTTP request config panel]  
> Click any node to open its config in the right panel. Edit name, method, URL etc. Changes reflect on the canvas node in real time.

---

### 5. Validation Engine
[placeholder for img — Image 5: validation error panel]  
> Clicking Run before a valid workflow triggers the validation engine. Errors and warnings are displayed before execution begins, blocking invalid runs.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation
```bash
git clone https://github.com/skandanakv/FlowForge.git
cd FlowForge
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🧱 Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| @xyflow/react | Canvas, drag-drop, edges, handles |
| Zustand | Global state management |
| Tailwind CSS | Styling |
| Vite | Build tool |

---

## 📁 Folder Structure
```
src/
├── components/
│   ├── canvas/          # ReactFlow canvas, drag-drop, edge logic
│   ├── config/          # Right panel — node config forms + execution log
│   ├── layout/          # Three-panel layout shell
│   ├── nodes/           # BaseNode + per-type node components
│   ├── sidebar/         # Left panel — node library
│   └── simulation/      # ValidationPanel, ExecutionPanel
├── constants/
│   └── nodeTypes.js     # NODE_CONFIGS — colors, icons, defaultData per type
├── engine/
│   ├── execution/       # executeWorkflow.js — topological sort + simulation
│   ├── graph/           # graphUtils.js — adjacency list, cycle detection, topoSort
│   └── validation/      # validateWorkflow.js — all validation rules
├── store/
│   └── useWorkflowStore.js  # Zustand store — nodes, edges, undo/redo, theme
└── utils/
    └── storage.js       # localStorage save/load, JSON import/export
```

---

## ✨ Features

### Workflow Management
- Drag nodes from sidebar onto canvas
- Connect nodes by dragging from handles
- Delete nodes and edges with Backspace
- Move nodes with drag-and-drop
- MiniMap for large workflows

### Node Types
| Node | Description |
|---|---|
| ⚡ Trigger | Entry point — manual, scheduled, or webhook |
| ⚙️ Action | Generic step with label and description |
| ◆ Condition | Branches into Yes/No paths |
| ⏱ Delay | Waits N seconds before continuing |
| 🌐 HTTP Request | Simulates GET/POST/PUT/DELETE call |
| ⏹ End | Terminates the workflow |

### Validation Engine
Runs before every execution and checks:
- At least one Trigger node exists
- No cyclic dependencies (infinite loop detection)
- Required fields are filled (URL for HTTP Request, duration for Delay)
- Condition nodes have both Yes and No branches connected
- Disconnected nodes are warned about

### Execution Simulation
- Topological sort determines correct execution order
- Nodes execute step-by-step with animated highlight
- Condition nodes follow only the chosen branch (Yes/No)
- HTTP Request has simulated 20% failure rate
- Failed nodes stop downstream execution
- Full timestamped execution log in right panel

### State Management
- Zustand store for all global state
- Undo/Redo with full past/future history stack
- Immutable state updates throughout (map + spread pattern)
- React.memo on node components to prevent unnecessary re-renders

### Persistence
- Auto-saves to localStorage on every change
- Export workflow as JSON file
- Import workflow from JSON file
- Sanitizes node positions on load to prevent crashes

### UI/UX
- Dark and Light mode toggle (☀️/🌙)
- Smooth transitions on theme change
- Color-coded nodes per type
- Execution status indicators (✓ success, ✕ error, pulse = running)
- MiniMap, zoom controls, fit-to-view

---

## 🏗️ Architecture

See architecture diagram below.

### Data Flow
```
User Action
    ↓
Canvas.jsx (React Flow events)
    ↓
Zustand Store (useWorkflowStore)
    ↓
React Flow re-renders + localStorage sync
```

### Execution Flow
```
Run clicked
    ↓
validateWorkflow(nodes, edges)
    ↓ (if valid)
topologicalSort(nodes, edges)
    ↓
executeWorkflow() — walks sorted nodes
    ↓
onNodeStart → onNodeComplete → onLog
    ↓
Zustand store updates nodeStatuses
    ↓
BaseNode re-renders with color/glow
```

### Undo/Redo Pattern
```
Action happens → saveSnapshot() → push {nodes, edges} to past[]
Undo → pop from past[], push to future[], restore previous state
Redo → pop from future[], push to past[], restore next state
```

---

## 🏛️ Architecture Diagram

> Build this diagram yourself using the flowchart below:
```
┌─────────────────────────────────────────────────────┐
│                      App.jsx                        │
│                  ReactFlowProvider                  │
└───────────────────────┬─────────────────────────────┘
                        │
          ┌─────────────▼──────────────┐
          │         Layout.jsx          │
          │   Toolbar | Canvas | Config │
          └──┬──────────┬──────────┬───┘
             │          │          │
      ┌──────▼──┐ ┌─────▼────┐ ┌──▼───────┐
      │Sidebar  │ │Canvas    │ │ConfigPanel│
      │NodeCard │ │ReactFlow │ │Forms      │
      │drag src │ │BaseNode  │ │ExecLog    │
      └─────────┘ └────┬─────┘ └──────────┘
                       │
              ┌────────▼────────┐
              │ useWorkflowStore│  ←── Zustand
              │ nodes, edges    │
              │ undo/redo stack │
              │ execution state │
              │ theme/validation│
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
   ┌──────▼───┐ ┌──────▼───┐ ┌────▼──────┐
   │graphUtils│ │validate  │ │execute    │
   │hasCycle  │ │Workflow  │ │Workflow   │
   │topoSort  │ │          │ │topoSort + │
   └──────────┘ └──────────┘ │simulate  │
                              └──────────┘
                                   │
                              ┌────▼──────┐
                              │localStorage│
                              │save/load  │
                              └───────────┘
```

**Recommended tool to draw this:** https://excalidraw.com — free, looks great, export as PNG.

---

## 📋 Rubric Coverage

| Criteria | Implementation |
|---|---|
| Architecture & Folder Structure | Feature-based modular structure, separation of engine/UI/state |
| State Management & Undo/Redo | Zustand with past/future stack, immutable updates |
| Graph Logic & Validation Engine | hasCycle, topologicalSort, validateWorkflow with 5 rules |
| Execution Simulation Engine | Topological walk, async step delay, branch skipping |
| UI/UX Quality & Responsiveness | Dark/light mode, animations, color-coded nodes |
| Performance Optimization | React.memo on BaseNode and NodeCard |
| Code Quality | Modular, named functions, consistent naming |
| Documentation | This README + architecture diagram |

---

## 👤 Author

Skandana KV  
https://github.com/skandanakv
