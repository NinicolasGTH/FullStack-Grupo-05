"use client";
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { apiGet, apiDel, apiPost } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function GamesPage(){
  const { user } = useAuth();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], meta: { total: 0, page: 1, pages: 1 }});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [wishSet, setWishSet] = useState(new Set());
  const [pendingId, setPendingId] = useState(null);

  async function load(){
    setLoading(true); setError('');
    try{
      const res = await apiGet(`/games?q=${encodeURIComponent(q)}&page=${page}&limit=12`);
      setData(res);
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{ load(); }, [page]);

  // Load wishlist of current user to reflect button state
  useEffect(() => {
    let cancelled = false;
    async function loadWishlist(){
      try{
        if(!user){ setWishSet(new Set()); return; }
        const res = await apiGet('/wishlist');
        const ids = new Set((res?.wishlist || []).map(g => String(g._id || g.id)));
        if(!cancelled) setWishSet(ids);
      } catch { /* ignore */ }
    }
    loadWishlist();
    return () => { cancelled = true; };
  }, [user]);

  function onSearch(e){ e.preventDefault(); setPage(1); load(); }

  const skeletons = useMemo(() => Array.from({ length: 8 }).map((_,i) => (
    <div key={i} className="card overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-pink-900/20" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-pink-900/20 w-3/4 rounded" />
        <div className="h-3 bg-pink-900/10 w-1/2 rounded" />
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        <div className="h-9 bg-pink-900/10 rounded" />
        <div className="h-9 bg-pink-900/10 rounded" />
      </div>
    </div>
  )), []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">🎮 Jogos</h2>
        {user?.role === 'admin' && (
          <Link className="btn" href="/admin/games/new">+ Adicionar Jogo</Link>
        )}
      </div>
      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input className="input w-full" placeholder="Buscar por título" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn">Buscar</button>
      </form>
      {error && <div className="card p-3 text-red-300 mb-3">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skeletons}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.data.length === 0 && (
              <div className="col-span-full card p-6 text-center opacity-80">Nenhum jogo encontrado.</div>
            )}
            {data.data.map(g => {
              const id = String(g._id || g.id);
              const isWish = wishSet.has(id);
              return (
                <div key={id} className="card overflow-hidden flex flex-col">
                  <img src={g.coverUrl} alt={g.title} className="w-full h-40 object-cover" />
                  <div className="p-3 space-y-1 flex-1">
                    <div className="font-bold">{g.title}</div>
                    <div className="text-xs opacity-70">{new Date(g.releaseDate).toLocaleDateString()}</div>
                  </div>
                  <div className="p-3 flex gap-2">
                    {user && (
                      <button
                        className={`btn flex-1 ${isWish ? 'btn-error' : ''}`}
                        disabled={pendingId === id}
                        onClick={async ()=>{
                          if(pendingId) return;
                          setPendingId(id);
                          try{
                            if(isWish){
                              await apiDel(`/wishlist/${id}`);
                              setWishSet(prev => { const s = new Set(prev); s.delete(id); return s; });
                              toast('Removido da wishlist', 'success');
                            } else {
                              await apiPost(`/wishlist/${id}`);
                              setWishSet(prev => { const s = new Set(prev); s.add(id); return s; });
                              toast('Adicionado à wishlist', 'success');
                            }
                          } catch(e){
                            toast(e.message || 'Erro ao atualizar wishlist', 'error');
                          } finally { setPendingId(null); }
                        }}
                      >{pendingId === id ? '...' : (isWish ? '💔 Remover' : '❤️ Wishlist')}</button>
                    )}
                    {user?.role === 'admin' && (
                      <>
                        <Link className="btn flex-1" href={`/games/${id}/edit`}>✏️ Editar</Link>
                        <button
                          className="btn flex-1"
                          onClick={()=> setConfirmId(id)}
                        >🗑️ Excluir</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 justify-center mt-6">
            <button className="btn" onClick={()=> setPage(p=> Math.max(1, p-1))} disabled={page<=1}>«</button>
            <span className="px-3 py-2">Página {page} / {data.meta.pages}</span>
            <button className="btn" onClick={()=> setPage(p=> Math.min(data.meta.pages, p+1))} disabled={page>=data.meta.pages}>»</button>
          </div>
          <ConfirmDialog
            open={!!confirmId}
            title="Excluir jogo"
            message="Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita."
            confirmText="Excluir"
            cancelText="Cancelar"
            onClose={()=> setConfirmId(null)}
            onConfirm={async ()=>{
              const id = confirmId; setConfirmId(null);
              try{ await apiDel(`/games/${id}`); toast('Jogo excluído', 'success'); load(); }
              catch(e){ toast(e.message || 'Erro ao excluir', 'error'); }
            }}
          />
        </>
      )}
    </section>
  );
}
