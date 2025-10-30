import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar(){
  const { user, logout } = useAuth()
  return (
    <nav className="navbar" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div className="navbar-brand">
        <Link to="/" className="brand">GAMES.hub</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">🏠 Home</Link>
        <Link to="/games">🎮 Games</Link>
        <Link to="/wishlist">⭐ Wishlist</Link>
        <Link to="/chat">💬 Chat</Link>
        {user ? (
          <button className="btn" onClick={logout}>🚪 Sair</button>
        ) : (
          <Link className="btn" to="/login">🚀 Entrar</Link>
        )}
      </div>
    </nav>
  )
}
