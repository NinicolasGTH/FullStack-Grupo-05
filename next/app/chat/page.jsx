"use client";
import { useEffect, useRef, useState } from 'react';
import { apiGet } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { connectSocket, getSocket } from '../../lib/socket';

export default function ChatPage(){
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('conversations'); // conversations | search | chat
  const [conversations, setConversations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const endRef = useRef(null);

  const meId = () => user?.userId || user?._id || user?.id;
  const senderIdOf = (msg) => (typeof msg.sender === 'string' ? msg.sender : msg.sender?._id);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    connectSocket(token);
    loadConversations();
  }, [user]);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;
    const handler = (message) => {
      if (activeChat && message.conversationKey === activeChat.conversationKey){
        setMessages((prev) => [...prev, message]);
      }
      loadConversations();
    };
    s.on('chat:new', handler);
    return () => { s.off('chat:new', handler); };
  }, [activeChat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadConversations(){
    try {
      const data = await apiGet('/chat/conversations');
      setConversations(data.conversations || []);
    } catch (err){ console.error(err); }
  }

  async function searchUsers(q){
    if (!q || q.trim().length < 2){ setSearchResults([]); return; }
    try{
      const data = await apiGet(`/users/search?q=${encodeURIComponent(q)}`);
      setSearchResults(data.users || []);
    }catch(err){ console.error(err); }
  }

  async function loadMessages(conversationKey){
    try{
      const data = await apiGet(`/chat/messages/${conversationKey}`);
      setMessages(data.messages || []);
    }catch(err){ console.error(err); }
  }

  function startChat(otherUser){
    const [a, b] = [meId(), otherUser._id].sort();
    const conversationKey = `${a}|${b}`;
    setActiveChat({ conversationKey, otherUser });
    setActiveView('chat');
    loadMessages(conversationKey);
  }

  function send(){
    const s = getSocket();
    if (!s || !newMessage.trim() || !activeChat) return;
    s.emit('chat:send', { to: activeChat.otherUser._id, content: newMessage.trim() }, (ack) => {
      if (ack?.ok){ setNewMessage(''); } else { alert(ack?.error || 'Erro'); }
    });
  }

  if (!user) return <div className="p-4">Faça login para acessar o chat.</div>;

  if (activeView === 'conversations'){
    return (
      <section className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">💬 Neural Messages</h1>
          <button className="btn" onClick={()=> setActiveView('search')}>🔍 Nova Conexão</button>
        </div>
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="card p-6 text-center">Nenhuma conversa. Inicie uma conexão.</div>
          ) : conversations.map((c) => (
            <div key={c.conversationKey} className="card p-3 flex items-center justify-between cursor-pointer" onClick={()=> startChat(c.otherUser)}>
              <div>
                <div className="font-bold">{c.otherUser.name}</div>
                <div className="text-sm opacity-70">{c.lastMessage.isFromMe ? 'Você: ' : ''}{c.lastMessage.content}</div>
              </div>
              <div className="text-xs opacity-60">{new Date(c.lastMessage.createdAt).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (activeView === 'search'){
    return (
      <section className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button className="btn" onClick={()=> setActiveView('conversations')}>← Voltar</button>
          <h1 className="text-2xl font-bold">🔗 Nova Conexão</h1>
        </div>
        <input className="input w-full" placeholder="Buscar usuários..." value={searchQuery} onChange={(e)=>{ setSearchQuery(e.target.value); searchUsers(e.target.value); }} />
        <div className="space-y-2">
          {searchResults.map((u) => (
            <div key={u._id} className="card p-3 flex items-center justify-between">
              <div>
                <div className="font-bold">{u.name}</div>
                <div className="text-xs opacity-70">{u.email}</div>
              </div>
              <button className="btn" onClick={()=> startChat(u)}>Conectar</button>
            </div>
          ))}
          {searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="card p-6 text-center">Nenhum usuário encontrado.</div>
          )}
        </div>
      </section>
    );
  }

  if (activeView === 'chat' && activeChat){
    return (
      <section className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button className="btn" onClick={()=> setActiveView('conversations')}>← Voltar</button>
          <h1 className="text-2xl font-bold">{activeChat.otherUser.name}</h1>
        </div>
        <div className="card h-[420px] overflow-y-auto p-3 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${senderIdOf(m) === meId() ? 'items-end' : 'items-start'}`}>
              <div className={`${senderIdOf(m) === meId() ? 'bg-pink-600 text-white' : 'bg-white/10'} px-3 py-2 rounded-2xl max-w-[70%]`}>
                {m.content}
              </div>
              <div className="text-xs opacity-60 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2">
          <input className="input w-full" placeholder="Mensagem..." value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && send()} />
          <button className="btn" onClick={send}>Enviar</button>
        </div>
      </section>
    );
  }

  return null;
}
