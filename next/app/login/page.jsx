"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function Login(){
  const { loginSuccess } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e){
    e.preventDefault(); setError('');
    try {
      setLoading(true);
      const res = await apiPost('/auth/login', { email, password });
      loginSuccess(res);
      router.push('/games');
    } catch (err){
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <section className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      {error && <div className="card p-3 text-red-300">{error}</div>}
      <form onSubmit={onSubmit} className="card p-4 space-y-3">
        <input className="input w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input w-full" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </section>
  );
}
