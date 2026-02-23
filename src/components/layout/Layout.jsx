import Toolbar from './Toolbar'
import useWorkflowStore from '../../store/useWorkflowStore'

function Layout({ sidebar, canvas, config }) {
  const isDarkMode = useWorkflowStore(s => s.isDarkMode)

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden transition-colors duration-200
      ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f0f2f5]'}`}>
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <div className={`w-64 border-r flex flex-col overflow-y-auto transition-colors duration-200
          ${isDarkMode ? 'bg-[#1c2128] border-[#30363d]' : 'bg-white border-gray-200'}`}>
          {sidebar}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          {canvas}
        </div>

        {/* Right Config Panel */}
        <div className={`w-72 border-l flex flex-col overflow-y-auto transition-colors duration-200
          ${isDarkMode ? 'bg-[#1c2128] border-[#30363d]' : 'bg-white border-gray-200'}`}>
          <div className={`px-4 py-2 border-b transition-colors duration-200
            ${isDarkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <p className={`text-xs font-medium uppercase tracking-wider
              ${isDarkMode ? 'text-[#8b949e]' : 'text-gray-500'}`}>
              Properties
            </p>
          </div>
          {config}
        </div>

      </div>
    </div>
  )
}

export default Layout