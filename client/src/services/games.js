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
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const res = await fetch(`${baseURL}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro ao criar jogo');

  return data; // Retorna os dados do jogo {message, game}
}

export async function listGames(params = {}) {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${baseURL}/games${qs ? `?${qs}` : ''}`);
  const data = await res.json();
  if(!res.ok) throw new Error(data.error || 'Erro ao listar jogos');
  return data;
}
