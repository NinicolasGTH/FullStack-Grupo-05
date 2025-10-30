import { useState } from 'react'
import { createGame } from '../services/games.js'

export default function Admin(){
  const [form, setForm] = useState({
    title: '', description: '', coverUrl: '', releaseDate: '', genres: '', platforms: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  function onChange(e){
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e){
    e.preventDefault()
    setMsg(''); setErr(''); setLoading(true)
    try{
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        coverUrl: form.coverUrl.trim(),
        releaseDate: form.releaseDate,
        genres: form.genres.split(',').map(s=>s.trim()).filter(Boolean),
        platforms: form.platforms.split(',').map(s=>s.trim()).filter(Boolean)
      }
      await createGame(payload)
      setMsg('Jogo criado com sucesso!')
      setForm({ title:'', description:'', coverUrl:'', releaseDate:'', genres:'', platforms:'' })
    } catch (e){
      setErr(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Painel Admin</h2>
      <div className="card bg-base-100 neon-box">
        <div className="card-body">
          <h3 className="card-title">Criar novo jogo</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
            <input className="input input-bordered" name="title" placeholder="Título" value={form.title} onChange={onChange} required />
            <textarea className="textarea textarea-bordered" name="description" placeholder="Descrição" value={form.description} onChange={onChange} required />
            <input className="input input-bordered" name="coverUrl" placeholder="URL da capa" value={form.coverUrl} onChange={onChange} required />
            <input className="input input-bordered" type="date" name="releaseDate" placeholder="Data de lançamento" value={form.releaseDate} onChange={onChange} required />
            <input className="input input-bordered" name="genres" placeholder="Gêneros (separados por vírgula)" value={form.genres} onChange={onChange} required />
            <input className="input input-bordered" name="platforms" placeholder="Plataformas (separadas por vírgula)" value={form.platforms} onChange={onChange} required />
            {err && <div className="alert alert-error">{err}</div>}
            {msg && <div className="alert alert-success">{msg}</div>}
            <button className="btn btn-secondary" disabled={loading}>{loading ? 'Enviando...' : 'Criar jogo'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
