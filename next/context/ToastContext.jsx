"use client";
import { createContext, useContext, useMemo, useState } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([]);

  function toast(message, type = 'info', opts = {}){
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? 3000;
    setToasts((t) => [...t, { id, message, type }]);
    if (duration > 0){
      setTimeout(() => {
        setToasts((t) => t.filter(x => x.id !== id));
      }, duration);
    }
  }

  const value = useMemo(() => ({ toast }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {/* Container */}
      <div className="pointer-events-none fixed top-3 right-3 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id}
               className={`pointer-events-auto card px-4 py-3 shadow-lg border ${
                 t.type === 'success' ? 'border-emerald-500/40' : t.type === 'error' ? 'border-red-500/40' : 'border-pink-500/30'
               }`}
          >
            <span className={`text-sm ${t.type === 'error' ? 'text-red-300' : t.type === 'success' ? 'text-emerald-300' : 'text-pink-300'}`}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(){
  const ctx = useContext(ToastCtx);
  if(!ctx){ throw new Error('useToast deve ser usado dentro de <ToastProvider>'); }
  return ctx;
}
