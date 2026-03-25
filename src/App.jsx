import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Root from "./subdirectories/Root"
import Modpacks from "./subdirectories/Modpacks"
function App() {
  return (
    <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/downloads" element={<Modpacks />} />
    </Routes>
  )
}
export default App
