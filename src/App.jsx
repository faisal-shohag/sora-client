import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './routes/Home'
import Login from './routes/auth/Login'
import Signup from './routes/auth/Signup'
import AuthProvider from './providers/AuthProvider'
import ProtectedRoute from './routes/auth/ProtectedRoute'
import Dashboard from './routes/admin/dashboard'
import Lesson from './routes/user/lesson/page'
import Tutorial from './routes/user/tutorial/page'
import NavBar from './components/common/NavBar'

function App() {
  return (
    <>
    <AuthProvider>
    <NavBar/>
    <Routes>
      <Route path="/" element={<ProtectedRoute allowedRoles={['user']}><Home/></ProtectedRoute>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path='/lessons' element={<ProtectedRoute allowedRoles={['user']}><Lesson/></ProtectedRoute>}></Route>
      <Route path='/tutorials' element={<ProtectedRoute allowedRoles={['user']}><Tutorial/></ProtectedRoute>}></Route>
      <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['admin']}><Dashboard/></ProtectedRoute>}></Route>
    </Routes>
    </AuthProvider>
    </>
  )
}

export default App
