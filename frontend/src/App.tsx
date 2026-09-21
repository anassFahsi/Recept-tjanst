import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Pricing from './pages/Pricing'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/membership" element={<Pricing />} />
    </Routes>
  )
}


export default App