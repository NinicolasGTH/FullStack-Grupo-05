"use client";
import React from 'react';

export default function ConfirmDialog({ open, title = 'Confirmar', message = 'Tem certeza?', confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onClose }){
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative card w-[95%] max-w-md p-5 border border-pink-600/30">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="opacity-80 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <button className="btn" onClick={onClose}>{cancelText}</button>
          <button className="btn" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
