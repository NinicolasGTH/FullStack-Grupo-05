import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { addToWishlist, removeFromWishlist } from '../services/wishlist.js'

export default function GameCard({ game }){
  const { user } = useAuth()
  const [pending, setPending] = useState(false)
  const [added, setAdded] = useState(false)

  async function toggleWishlist(){
    if (!user) return
    setPending(true)
    try{
      if (!added){
        await addToWishlist(game._id || game.id)
        setAdded(true)
      } else {
        await removeFromWishlist(game._id || game.id)
        setAdded(false)
      }
    } finally { setPending(false) }
  }

  return (
    <div className="card bg-base-100 shadow neon-box">
      {game.coverUrl && <figure><img src={game.coverUrl} alt={game.title} className="w-full h-48 object-cover"/></figure>}
      <div className="card-body">
        <h3 className="card-title">{game.title}</h3>
        <p className="line-clamp-3 opacity-80">{game.description}</p>
        <div className="flex flex-wrap gap-2">
          {(game.genres || []).map((g, i)=> <span key={i} className="badge badge-secondary">{g}</span>)}
        </div>
        <div className="card-actions justify-end">
          {user ? (
            <button className={`btn btn-sm ${added ? 'btn-error' : 'btn-accent'}`} onClick={toggleWishlist} disabled={pending}>
              {added ? 'Remover' : 'Wishlist'}
            </button>
          ) : (
            <span className="text-sm opacity-70">Entre para adicionar à wishlist</span>
          )}
        </div>
      </div>
    </div>
  )
}
