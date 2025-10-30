import { useEffect, useState } from 'react'
import { fetchGames } from '../services/games.js'
import GameCard from '../ui/GameCard.jsx'

export default function Games(){
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState({ data: [], meta: { total: 0, page: 1, pages: 1 }})

  async function load(){
    setLoading(true); setError('')
    try{
      const res = await fetchGames({ q, page, limit: 12 })
      setData(res)
    }catch(err){ setError(err.response?.data?.error || err.message) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [page])

  function onSearch(e){ e.preventDefault(); setPage(1); load() }

  return (
    <section>
      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input className="input input-bordered w-full" placeholder="Buscar por título" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn btn-primary">Buscar</button>
      </form>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-dots loading-lg"></span></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.data.map(game => <GameCard key={game._id || game.id} game={game} />)}
          </div>
          <div className="join justify-center mt-6 w-full flex">
            <button className="join-item btn" onClick={()=> setPage(p=> Math.max(1, p-1))} disabled={page<=1}>«</button>
            <button className="join-item btn">Página {page} / {data.meta.pages}</button>
            <button className="join-item btn" onClick={()=> setPage(p=> Math.min(data.meta.pages, p+1))} disabled={page>=data.meta.pages}>»</button>
          </div>
        </>
      )}
    </section>
  )
}
