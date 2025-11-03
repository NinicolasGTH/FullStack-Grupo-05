import { io } from 'socket.io-client';
import { baseURL } from './api';

let socket = null;

export function connectSocket(token){
  if (socket?.connected) return socket;
  socket = io(baseURL, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    auth: { token },
  });
  return socket;
}

export function getSocket(){
  return socket;
}

export function disconnectSocket(){
  try { socket?.disconnect(); } catch {}
  socket = null;
}
