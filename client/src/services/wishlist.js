import api from './api.js'

export async function getWishlist(){
  const { data } = await api.get('/wishlist')
  return data
}
export async function addToWishlist(gameId){
  const { data } = await api.post(`/wishlist/${gameId}`)
  return data
}
export async function removeFromWishlist(gameId){
  const { data } = await api.delete(`/wishlist/${gameId}`)
  return data
}
