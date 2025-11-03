"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '../../lib/api';

export default function Register(){
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  async function onSubmit(e){
    e.preventDefault(); setError(''); setOk('');
    try{
      await apiPost('/auth/register', { name, email, password });
      setOk('Registrado! Faça login.');
      setTimeout(()=> router.push('/login'), 800);
    }catch(err){ setError(err.message); }
  }

  return (
    <section className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Registrar</h1>
      {error && <div className="card p-3 text-red-300">{error}</div>}
      {ok && <div className="card p-3 text-green-300">{ok}</div>}
      <form onSubmit={onSubmit} className="card p-4 space-y-3">
        <input className="input w-full" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input w-full" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full">Cadastrar</button>
      </form>
    </section>
  );
}
