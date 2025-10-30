import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '../services/auth.js';
import { setAuthToken, clearAuthToken } from '../services/api.js';
import { connectSocket, disconnectSocket } from '../services/socket.js';

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      getMe().then((res)=>{
        const me = res.user || res
        setUser(me)
        // Conecta o socket após restaurar sessão com sucesso
        connectSocket(token)
      }).catch(()=>{
        clearAuthToken()
        localStorage.removeItem('token')
      }).finally(()=> setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  function loginSuccess({ token, user }){
    localStorage.setItem('token', token)
    setAuthToken(token)
    setUser(user)
    // Conecta o socket após login
    connectSocket(token)
  }

  function logout(){
    localStorage.removeItem('token')
    clearAuthToken()
    setUser(null)
    // Desconecta o socket após logout
    disconnectSocket()
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loginSuccess, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
