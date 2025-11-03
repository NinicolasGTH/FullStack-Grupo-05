"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPut } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';

export default function EditGamePage(){
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({ title:'', description:'', genres:'', platforms:'', coverUrl:'', releaseDate:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{
    if (!id) return;
    (async () => {
      try{
        const g = await apiGet(`/games/${id}`);
        setForm({
          title: g.title || '',
          description: g.description || '',
          genres: (g.genres || []).join(', '),
          platforms: (g.platforms || []).join(', '),
          coverUrl: g.coverUrl || '',
          releaseDate: g.releaseDate ? g.releaseDate.substring(0,10) : '',
        });
      }catch(e){ setError(e.message); }
    })();
  }, [id]);

  if (!user) return <div className="p-4">Faça login</div>;
  if (user.role !== 'admin') return <div className="p-4">Acesso negado</div>;

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const split = (s) => s.split(',').map(x=>x.trim()).filter(Boolean);

  async function onSubmit(e){
    e.preventDefault(); setError('');
    try{
      setLoading(true);
      await apiPut(`/games/${id}`, {
        title: form.title,
        description: form.description,
        genres: split(form.genres),
        platforms: split(form.platforms),
        coverUrl: form.coverUrl,
        releaseDate: form.releaseDate,
      });
      router.push('/games');
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  }

  return (
    <section className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button className="btn" onClick={()=> router.back()}>← Voltar</button>
        <h1 className="text-2xl font-bold">✏️ Editar Jogo</h1>
      </div>
      {error && <div className="card p-3 text-red-300">{error}</div>}
      <form onSubmit={onSubmit} className="card p-4 space-y-3">
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
        <button className="btn" disabled={loading}>{loading ? 'Salvando…' : 'Salvar'}</button>
      </form>
    </section>
  );
}
