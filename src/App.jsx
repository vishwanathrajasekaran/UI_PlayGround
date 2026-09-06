import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import BasicElements from './pages/basic-elements/BasicElements.jsx'
import Forms from './pages/forms/Forms.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basic-elements" element={<BasicElements />} />
          <Route path="/forms" element={<Forms />} />
        </Routes>
      </main>
    </div>
  )
}
