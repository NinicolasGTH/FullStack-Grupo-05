"use client";
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function AdminPage(){
  const { user } = useAuth();
  if (!user) return <div className="p-4">Faça login</div>;
  if (user.role !== 'admin') return <div className="p-4">Acesso negado</div>;

  return (
    <section className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🛠️ Painel do Admin</h1>
      <div className="card p-4 space-y-3">
        <Link className="btn" href="/admin/games/new">🎮 Adicionar Jogo</Link>
      </div>
    </section>
  );
}
