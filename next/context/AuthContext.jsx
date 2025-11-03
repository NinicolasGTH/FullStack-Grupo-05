"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { apiGet, setToken as setApiToken, clearToken as clearApiToken } from '../lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token){ setLoading(false); return; }
    setApiToken(token);
    apiGet('/auth/me')
      .then((res) => setUser(res.user || res))
      .catch(() => { localStorage.removeItem('token'); clearApiToken(); })
      .finally(() => setLoading(false));
  }, []);

  function loginSuccess({ token, user: me }){
    localStorage.setItem('token', token);
    setApiToken(token);
    setUser(me);
  }

  function logout(){
    localStorage.removeItem('token');
    clearApiToken();
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, loading, loginSuccess, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(){
  return useContext(AuthCtx);
}
