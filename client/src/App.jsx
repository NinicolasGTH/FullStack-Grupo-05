import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Games from './pages/Games.jsx'
import Wishlist from './pages/Wishlist.jsx'
import NotFound from './pages/NotFound.jsx'
import Chat from './pages/Chat.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Admin from './pages/Admin.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import GameCreate from './pages/Admin/GameCreate.jsx'

export default function App(){
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/games" element={<Games/>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist/></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>} />
        <Route path="/admin/games/new" element={<AdminRoute><GameCreate/></AdminRoute>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  )
}
