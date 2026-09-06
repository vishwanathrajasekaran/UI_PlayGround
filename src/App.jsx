import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import BasicElements from './pages/basic-elements/BasicElements.jsx'
import Forms from './pages/forms/Forms.jsx'
import SelectionControls from './pages/selection-controls/SelectionControls.jsx'
import AdvancedControls from './pages/advanced-controls/AdvancedControls.jsx'
import Tables from './pages/tables/Tables.jsx'
import Navigation from './pages/navigation/Navigation.jsx'
import Popups from './pages/popups/Popups.jsx'
import MouseKeyboard from './pages/mouse-keyboard/MouseKeyboard.jsx'
import WindowsIframes from './pages/windows-iframes/WindowsIframes.jsx'
import DynamicBehavior from './pages/dynamic-behavior/DynamicBehavior.jsx'
import ApiNetwork from './pages/api-network/ApiNetwork.jsx'
import Authentication from './pages/authentication/Authentication.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basic-elements" element={<BasicElements />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/selection-controls" element={<SelectionControls />} />
          <Route path="/advanced-controls" element={<AdvancedControls />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/navigation" element={<Navigation />} />
          <Route path="/popups" element={<Popups />} />
          <Route path="/mouse-keyboard" element={<MouseKeyboard />} />
          <Route path="/windows-iframes" element={<WindowsIframes />} />
          <Route path="/dynamic-behavior" element={<DynamicBehavior />} />
          <Route path="/api-network" element={<ApiNetwork />} />
          <Route path="/authentication" element={<Authentication />} />
        </Routes>
      </main>
    </div>
  )
}
