import { useState } from 'react'
import { registerUser } from '../services/auth.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try{
      await registerUser(name, email, password)
      setSuccess('Registrado com sucesso! Você já pode entrar.')
      setTimeout(()=> navigate('/login'), 800)
    }catch(err){
      setError(err.response?.data?.message || err.message)
    }finally{ setLoading(false) }
  }

  return (
    <div className="cyber-auth-container">
      <div className="auth-background"></div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">🆕 Criar Conta Neural</h1>
          <p className="auth-subtitle">Junte-se à rede cyberpunk</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">👤 Nome de Usuário</label>
            <input 
              type="text" 
              className="cyber-input" 
              placeholder="Digite seu nome"
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
              required 
            />
          </div>
          
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
            <label className="input-label">🔐 Código de Segurança</label>
            <input 
              type="password" 
              className="cyber-input" 
              placeholder="Crie uma senha forte"
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
          
          {success && (
            <div className="success-message">
              ✅ {success}
            </div>
          )}
          
          <button 
            className="cyber-submit-btn cyber-submit-secondary" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Criando conta...
              </>
            ) : (
              <>🚀 Conectar à Matrix</>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Já possui acesso neural?</p>
          <Link to="/login" className="auth-link">
            🔗 Fazer Login
          </Link>
        </div>
      </div>
    </div>
  )
}
