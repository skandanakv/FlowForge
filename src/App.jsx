import { ReactFlowProvider } from '@xyflow/react'
import Layout from './components/layout/Layout'
import Sidebar from './components/sidebar/Sidebar'
import Canvas from './components/canvas/Canvas'
import ConfigPanel from './components/config/ConfigPanel'
import useWorkflowStore from './store/useWorkflowStore'

function App() {
  const isDarkMode = useWorkflowStore(s => s.isDarkMode)

  return (
    <div
      style={{ height: '100vh', colorScheme: isDarkMode ? 'dark' : 'light' }}
      className={isDarkMode ? 'dark' : 'light'}
    >
      <ReactFlowProvider>
        <Layout
          isDarkMode={isDarkMode}
          sidebar={<Sidebar isDarkMode={isDarkMode} />}
          canvas={<Canvas />}
          config={<ConfigPanel isDarkMode={isDarkMode} />}
        />
      </ReactFlowProvider>
    </div>
  )
}

export default App