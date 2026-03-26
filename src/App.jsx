import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./subdirectories/Home"
import Modpacks from "./subdirectories/Modpacks"
import "./App.css"
function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloads" element={<Modpacks />} />
    </Routes>
  )
}
export default App
