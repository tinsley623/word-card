import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WordCard from './pages/WordCard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/word/:word" element={<WordCard />} />
    </Routes>
  )
}
