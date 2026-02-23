# ⚡ FlowForge — Visual Workflow Builder

A professional frontend-only visual workflow automation builder built with React and Zustand.

## Features
- Drag and drop 6 node types onto a visual canvas
- Connect nodes with directional edges
- Configure each node via properties panel
- Validation engine with cycle detection
- Step-by-step execution simulation with live logs
- Undo/Redo with past/present/future pattern
- Auto-save to localStorage
- Import/Export workflows as JSON

## Tech Stack
- React + Vite
- Zustand (state management)
- @xyflow/react (canvas)
- Tailwind CSS

## Setup
cd flowforge
nvm use 20
npm install
npm run dev

## Architecture
- components/layout — toolbar and three-panel shell
- components/nodes — custom node type components
- components/sidebar — node palette with drag to add
- components/config — dynamic config panel per node type
- components/simulation — execution log display
- store/ — Zustand store with undo/redo
- engine/graph — cycle detection, topological sort
- engine/validation — workflow validation rules
- engine/execution — async simulation runner
- utils/ — localStorage and JSON helpers
- constants/ — node type definitions and colors