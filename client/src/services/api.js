import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

export function setAuthToken(token){
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
export function clearAuthToken(){
  delete api.defaults.headers.common['Authorization']
}

export default api
