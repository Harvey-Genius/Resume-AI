import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Editor from './pages/Editor'

/**
 * Main App component with routing
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/editor" element={<Editor />} />
    </Routes>
  )
}

export default App
