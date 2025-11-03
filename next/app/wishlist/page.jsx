"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiDel, apiGet } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function WishlistPage(){
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load(){
    setLoading(true); setError('');
    try{
      const res = await apiGet('/wishlist');
      setItems(res.wishlist || []);
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{ if(user) load(); }, [user]);

  if (!user) return <div className="p-4">Faça login para ver sua wishlist.</div>;

  const skeletons = useMemo(() => Array.from({ length: 8 }).map((_,i) => (
    <div key={i} className="card overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-pink-900/20" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-pink-900/20 w-3/4 rounded" />
        <div className="h-3 bg-pink-900/10 w-1/2 rounded" />
      </div>
      <div className="p-3">
        <div className="h-9 bg-pink-900/10 rounded" />
      </div>
    </div>
  )), []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">🧩 Minha Wishlist</h1>
      {error && <div className="card p-3 text-red-300 mb-3">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skeletons}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-6 text-center">Sua lista está vazia.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(g => (
            <div key={g._id} className="card overflow-hidden flex flex-col">
              <img src={g.coverUrl} alt={g.title} className="w-full h-40 object-cover" />
              <div className="p-3 space-y-1 flex-1">
                <div className="font-bold">{g.title}</div>
                <div className="text-xs opacity-70">{new Date(g.releaseDate).toLocaleDateString()}</div>
              </div>
              <div className="p-3">
                <button className="btn w-full" onClick={async ()=>{
                  try{ await apiDel(`/wishlist/${g._id}`); toast('Removido da wishlist', 'success'); load(); }
                  catch(e){ toast(e.message || 'Erro ao remover', 'error'); }
                }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
