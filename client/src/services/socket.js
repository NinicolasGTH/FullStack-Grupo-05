import {io} from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
    if(socket?.connected) return socket;
    socket = io(import.meta.env.VITE_API_URL, {
        auth: { token },
        autoConnect: true 
    });
    socket.on('connect', () => console.log('[socket] conectado', socket.id));
    socket.on('connect_error', (e) => console.error('[socket] erro de conexão', e.message));
    socket.on('disconnect', (reason) => console.log('[socket] desconectado', reason));
    return socket;
}

export function getSocket(){
    return socket;
}

export function disconnectSocket(){
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}