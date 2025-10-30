import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socket.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Chat() {
  const { user } = useAuth();
  // Normaliza o ID do usuário atual independentemente da origem (login vs /auth/me)
  const getCurrentUserId = () => user?.userId || user?._id || user?.id;
  const [activeView, setActiveView] = useState('conversations'); // 'conversations', 'search', 'chat'
  const [conversations, setConversations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const getSenderId = (msg) => (typeof msg.sender === 'string' ? msg.sender : msg.sender?._id);

  // Carregar conversas ao montar o componente
  useEffect(() => {
    loadConversations();
  }, []);

  // Configurar socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('chat:new', (message) => {
      // Se estamos no chat ativo, adicionar à lista de mensagens
      if (activeChat && message.conversationKey === activeChat.conversationKey) {
        setMessages(prev => [...prev, message]);
      }
      
      // Atualizar lista de conversas
      loadConversations();
    });

    return () => {
      socket.off('chat:new');
    };
  }, [activeChat]);

  // Scroll automático quando novas mensagens chegam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseURL}/chat/conversations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseURL}/users/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const startChat = (otherUser) => {
    const me = getCurrentUserId();
    const [a, b] = [me, otherUser._id].sort();
    const conversationKey = `${a}|${b}`;
    
    setActiveChat({
      conversationKey,
      otherUser,
      messages: []
    });
    setActiveView('chat');
    loadMessages(conversationKey);
  };

  const loadMessages = async (conversationKey) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseURL}/chat/messages/${conversationKey}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !newMessage.trim() || !activeChat) return;

    socket.emit('chat:send', {
      to: activeChat.otherUser._id,
      content: newMessage.trim()
    }, (response) => {
      if (response?.ok) {
        setNewMessage('');
      } else {
        console.error('Erro ao enviar:', response?.error);
        alert('Erro: ' + response?.error);
      }
    });
  };

  // View: Lista de conversas
  if (activeView === 'conversations') {
    return (
      <div className="chat-container" style={{maxWidth: 720, margin: '24px auto'}}>
        <div className="chat-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h2 className="text-2xl font-bold">💬 Neural Messages</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveView('search')}
          >
            🔍 Nova Conexão
          </button>
        </div>
        
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="card text-center" style={{padding:'40px'}}>
              <p style={{marginBottom:'16px'}}>🌐 Nenhuma conexão neural ativa</p>
              <button 
                className="btn btn-outline"
                onClick={() => setActiveView('search')}
              >
                🚀 Iniciar primeira conexão
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.conversationKey} 
                className="card conversation-item"
                onClick={() => startChat(conv.otherUser)}
                style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px', marginBottom:'8px', cursor:'pointer'}}
              >
                <div className="conversation-info" style={{flex:1}}>
                  <div className="user-name" style={{fontWeight:'bold', marginBottom:'4px'}}>{conv.otherUser.name}</div>
                  <div className="last-message" style={{color:'#666', fontSize:'14px'}}>
                    {conv.lastMessage.isFromMe && "Você: "}
                    {conv.lastMessage.content}
                  </div>
                  <div className="message-time" style={{color:'#999', fontSize:'12px', marginTop:'4px'}}>
                    {new Date(conv.lastMessage.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="unread-badge" style={{backgroundColor:'#007bff', color:'white', borderRadius:'50%', width:'24px', height:'24px',Display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px'}}>
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // View: Buscar usuários
  if (activeView === 'search') {
    return (
      <div className="chat-container" style={{maxWidth: 720, margin: '24px auto'}}>
        <div className="chat-header" style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px'}}>
          <button 
            className="btn btn-ghost"
            onClick={() => setActiveView('conversations')}
          >
            ← Voltar
          </button>
          <h2 className="text-2xl font-bold">🔗 Nova Conexão</h2>
        </div>
        
        <div className="search-section" style={{marginBottom:'20px'}}>
          <input
            type="text"
            placeholder="🔍 Buscar usuários na rede neural..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            className="input search-input"
            style={{width:'100%'}}
          />
        </div>

        <div className="search-results">
          {searchResults.map((user) => (
            <div 
              key={user._id} 
              className="card user-item"
              style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px', marginBottom:'8px'}}
            >
              <div className="user-info">
                <div className="user-name" style={{fontWeight:'bold', marginBottom:'4px'}}>{user.name}</div>
                <div className="user-email" style={{color:'#666', fontSize:'14px'}}>{user.email}</div>
              </div>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => startChat(user)}
              >
                🚀 Conectar
              </button>
            </div>
          ))}
          {searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="card text-center" style={{padding:'40px'}}>
              <p>🤖 Nenhum usuário encontrado na rede</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // View: Chat individual
  if (activeView === 'chat' && activeChat) {
    return (
      <div className="chat-container" style={{maxWidth: 720, margin: '24px auto'}}>
        <div className="chat-header" style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px'}}>
          <button 
            className="btn btn-ghost"
            onClick={() => setActiveView('conversations')}
          >
            ← Voltar
          </button>
          <h2 className="text-2xl font-bold">{activeChat.otherUser.name}</h2>
        </div>
        
        <div className="messages-container card" style={{height:'400px', overflowY:'auto', padding:'16px', marginBottom:'16px'}}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${getSenderId(msg) === getCurrentUserId() ? 'message-sent' : 'message-received'}`}
              style={{
                display:'flex', 
                flexDirection:'column',
                alignItems: getSenderId(msg) === getCurrentUserId() ? 'flex-end' : 'flex-start',
                marginBottom:'12px'
              }}
            >
              <div 
                className="message-content"
                style={{
                  backgroundColor: getSenderId(msg) === getCurrentUserId() ? '#007bff' : '#e9ecef',
                  color: getSenderId(msg) === getCurrentUserId() ? 'white' : 'black',
                  padding:'8px 12px',
                  borderRadius:'16px',
                  maxWidth:'70%'
                }}
              >
                {msg.content}
              </div>
              <div className="message-time" style={{fontSize:'12px', color:'#666', marginTop:'4px'}}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input-container" style={{display:'flex', gap:'8px'}}>
          <input
            type="text"
            placeholder="💭 Transmitir mensagem neural..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="input message-input"
            style={{flex:1}}
          />
          <button onClick={sendMessage} className="btn btn-primary">
            ⚡ Enviar
          </button>
        </div>
      </div>
    );
  }

  return null;
}
