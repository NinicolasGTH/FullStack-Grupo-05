import { useEffect, useState } from 'react'
import { getWishlist, removeFromWishlist } from '../services/wishlist.js'

export default function Wishlist(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load(){
    setLoading(true); setError('')
    try{
      const data = await getWishlist()
      setItems(data.wishlist || data)
    }catch(err){ setError(err.response?.data?.error || err.message) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  async function remove(id){
    await removeFromWishlist(id)
    setItems(prev => prev.filter(g => (g._id || g.id) !== id))
  }

  if (loading) return <div className="flex justify-center py-16"><span className="loading loading-ring loading-lg"></span></div>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Minha Wishlist</h2>
      {items.length === 0 ? (
        <p className="opacity-80">Sua lista está vazia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(game => (
            <div key={game._id || game.id} className="card bg-base-100 shadow neon-box">
              {game.coverUrl && <figure><img src={game.coverUrl} alt={game.title} className="w-full h-48 object-cover"/></figure>}
              <div className="card-body">
                <h3 className="card-title">{game.title}</h3>
                <div className="card-actions justify-end">
                  <button className="btn btn-error btn-sm" onClick={()=> remove(game._id || game.id)}>Remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
