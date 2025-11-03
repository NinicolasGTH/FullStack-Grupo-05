"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';

export default function GameCreate(){
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title:'', description:'', genres:'', platforms:'', coverUrl:'', releaseDate:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return <div className="p-4">Faça login</div>;
  if (user.role !== 'admin') return <div className="p-4">Acesso negado</div>;

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const split = (s) => s.split(',').map(x=>x.trim()).filter(Boolean);

  async function onSubmit(e){
    e.preventDefault(); setError('');
    const payload = { ...form, genres: split(form.genres), platforms: split(form.platforms) };
    if (!payload.title || !payload.description || !payload.coverUrl || !payload.releaseDate || !payload.genres.length || !payload.platforms.length){
      setError('Preencha todos os campos obrigatórios.'); return;
    }
    try{
      setLoading(true);
      await apiPost('/games', payload);
      router.push('/games');
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  }

  return (
    <section className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button className="btn" onClick={()=> router.back()}>← Voltar</button>
        <h1 className="text-2xl font-bold">🎮 Adicionar Jogo</h1>
      </div>

      <form onSubmit={onSubmit} className="card p-4 space-y-3">
        {error && <div className="card p-3 text-red-300">{error}</div>}
        <input name="title" value={form.title} onChange={onChange} className="input w-full" placeholder="Título" />
        <textarea name="description" value={form.description} onChange={onChange} className="input w-full" placeholder="Descrição" rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="genres" value={form.genres} onChange={onChange} className="input w-full" placeholder="Gêneros (vírgula)" />
          <input name="platforms" value={form.platforms} onChange={onChange} className="input w-full" placeholder="Plataformas (vírgula)" />
        </div>
        <input name="coverUrl" value={form.coverUrl} onChange={onChange} className="input w-full" placeholder="URL da Capa" />
        {form.coverUrl && (
          <img src={form.coverUrl} alt="preview" className="w-full h-40 object-cover rounded-md" />
        )}
        <input type="date" name="releaseDate" value={form.releaseDate} onChange={onChange} className="input w-full" />
        <button className="btn" disabled={loading}>{loading ? 'Salvando…' : 'Salvar Jogo'}</button>
      </form>
    </section>
  );
}
