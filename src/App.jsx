import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ModeToggle } from './components/common/ThemeToggle'
import Home from './routes/Home'
import Login from './routes/auth/Login'
import Signup from './routes/auth/Signup'

function App() {

  return (
    <>
    <ModeToggle/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
    </>
  )
}

export default App
