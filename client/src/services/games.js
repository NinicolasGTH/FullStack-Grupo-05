import api from './api.js'

export async function fetchGames({ q = '', page = 1, limit = 12, upcoming } = {}){
  const params = { q, page, limit }
  if (upcoming !== undefined) params.upcoming = upcoming
  const { data } = await api.get('/games', { params })
  return data
}
export async function fetchGame(id){
  const { data } = await api.get(`/games/${id}`)
  return data
}
export async function createGame(payload){
  const { data } = await api.post('/games', payload)
  return data
}
