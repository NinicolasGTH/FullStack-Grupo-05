import {Link, Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

export default function Admin(){
  const {user, loading} = useAuth();
  if (loading) return null; 
  if (!user) return <Navigate to="/login" replace />;
  if(user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="chat-container" style={{maxWidth: 720, margin: '24px auto'}}>
    <div className="chat-header" style={{display:'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
    <h2 className="text-2x1 font-bold">Painel do Admin</h2>
    </div>

    <div className="card" style={{padding: 16}}>
    <p style = {{marginBottom: 12, opacity: 0.9}}>
      Bem vindo, {user.name}. Selecione uma ação:
    </p>

    <div style={{display: 'grid', gap: 12}}>
      <Link className="btn btn-primary" to="/admin/games/new">
      🎮 Adicionar Jogo
      </Link>

      {/* Outras ações administrativas podem ser adicionadas aqui */}
    </div>
    </div>
    </div>
    
  );
}