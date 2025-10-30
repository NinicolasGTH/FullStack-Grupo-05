import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home(){
  const { user } = useAuth()
  
  return (
    <div className="cyber-home">
      <section className="hero-section">
        <div className="cyber-grid"></div>
        <div className="hero-content">
          <div className="hero-grid">
            <div className="hero-brand">
              <h1 className="cyber-title">
                <span className="neon-text">GAMES</span>
                <span className="dot">.</span>
                <span className="neon-text-alt">hub</span>
              </h1>
              <p className="cyber-subtitle">🌐 Plataforma Neural de Gaming 🎮</p>
            </div>
            <div className="hero-right">
              <p className="cyber-description">
                Conecte-se à matriz dos jogos. Gerencie sua wishlist neural, descubra novos mundos digitais
                e converse com outros gamers na rede cyberpunk.
              </p>
              <div className="action-buttons">
                {user ? (
                  <>
                    <Link to="/games" className="btn btn-cyber-primary">🎮 Explorar Matriz</Link>
                    <Link to="/chat" className="btn btn-cyber-secondary">💬 Neural Chat</Link>
                    <Link to="/wishlist" className="btn btn-cyber-accent">⭐ Minha Wishlist</Link>
                  </>
                ) : (
                  <>
                    <Link to="/games" className="btn btn-cyber-primary">🎮 Explorar Jogos</Link>
                    <Link to="/login" className="btn btn-cyber-secondary">🚀 Conectar-se</Link>
                    <Link to="/register" className="btn btn-cyber-accent">🔗 Criar Conta</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <h2 className="section-title neon-text">🔥 Recursos da Matrix</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Catálogo Neural</h3>
            <p>Milhares de jogos organizados em uma interface cyberpunk</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Wishlist Inteligente</h3>
            <p>Sistema de desejos com notificações automáticas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Chat em Tempo Real</h3>
            <p>Conecte-se com outros gamers instantaneamente</p>
          </div>
        </div>
      </section>
    </div>
  )
}
