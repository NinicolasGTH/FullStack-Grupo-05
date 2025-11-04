"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar(){
  const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-10 border-b border-pink-700/40 bg-black/40 backdrop-blur">
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--cp-cyan)] via-[var(--cp-yellow)] to-[var(--cp-magenta)] drop-shadow">
            <span className="glitch" data-text="Cybernet">Cybernet</span>
          </Link>
          <Link className="hover:underline opacity-90 hover:opacity-100" href="/games">Jogos</Link>
          <Link className="hover:underline opacity-90 hover:opacity-100" href="/chat">Chat</Link>
          <Link className="hover:underline opacity-90 hover:opacity-100" href="/wishlist">Wishlist</Link>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link className="btn" href="/login">Entrar</Link>
              <Link className="btn" href="/register">Registrar</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link className="btn" href="/admin">Admin</Link>
              )}
              <span className="text-sm opacity-80">{user.name || user.email}</span>
              <button className="btn" onClick={logout}>Sair</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
