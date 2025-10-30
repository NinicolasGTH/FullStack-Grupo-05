import { useState } from 'react'
import { login } from '../services/auth.js'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { loginSuccess } = useAuth()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const data = await login(email, password)
      loginSuccess(data)
      navigate('/games')
    }catch(err){
      setError(err.response?.data?.error || err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="cyber-auth-container">
      <div className="auth-background"></div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">🚀 Conectar ao Sistema</h1>
          <p className="auth-subtitle">Acesse sua conta neural</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">📧 Email Neural</label>
            <input 
              type="email" 
              className="cyber-input" 
              placeholder="usuario@matrix.com"
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">🔐 Código de Acesso</label>
            <input 
              type="password" 
              className="cyber-input" 
              placeholder="••••••••"
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <button 
            className="cyber-submit-btn" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Conectando...
              </>
            ) : (
              <>🔗 Conectar-se</>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Não possui acesso neural?</p>
          <Link to="/register" className="auth-link">
            🆕 Criar Nova Conta
          </Link>
        </div>
      </div>
    </div>
  )
}
