import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import swagger from 'swagger-ui-express';
import {swaggerDocument} from './docs/swagger.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import {Message} from './src/models/message.js';
import mongoose from 'mongoose';


dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);

// Rota raiz opcional
app.get('/', (req, res) => {
  res.send('API de Jogos - use /health para status.');
});

// Rota de health-check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'dev',
    timestamp: new Date().toISOString()
  });
});

// Cria o servidor HTTP e instancia o Socket.IO (fora do then para manter escopo)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }
});

// Auth no handshake do socket via JWT
io.use((socket, next) => {
  try {
    const authHeader = socket.handshake.headers?.authorization || '';
    const token = socket.handshake.auth?.token || authHeader.replace('Bearer ', '');
    if (!token) return next(new Error('não autorizado'));
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { userId: payload.userId, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    next(new Error('não autorizado'));
  }
});

io.on('connection', (socket) => {
  const { userId } = socket.user;
  socket.join(`user:${userId}`);
  console.log("Socket conectado:", socket.user);

  socket.on('ping', (cb) => cb?.('pong'));
  socket.on('disconnect', (reason) => {
    console.log('Socket desconectado:', userId, reason);
  });

  // Envio de mensagem (chat)
  socket.on('chat:send', async ({ to, content }, ack) => {
    try {
      const senderId = socket.user.userId;
      if (!to || !mongoose.isValidObjectId(to)) throw new Error('Destinatário inválido');
      if (String(to) === String(senderId)) throw new Error('não é permitido enviar mensagem para si mesmo');

      const text = String(content || '').trim();
      if (!text) throw new Error('mensagem vazia');
      if (text.length > 2000) throw new Error('mensagem muito longa');

      const [a, b] = [String(senderId), String(to)].sort();
      const conversationKey = `${a}|${b}`;

      const doc = await Message.create({
        sender: senderId,
        recipient: to,
        content: text,
        conversationKey
      });

      const message = {
        _id: doc._id,
        sender: doc.sender,
        recipient: doc.recipient,
        content: doc.content,
        conversationKey: doc.conversationKey,
        createdAt: doc.createdAt,
        readAt: doc.readAt || null
      };

      // Emite para o destinatário e ecoa para o remetente
      socket.to(`user:${to}`).emit('chat:new', message);
      io.to(`user:${senderId}`).emit('chat:new', message);

      ack?.({ ok: true, message });
    } catch (err) {
      ack?.({ ok: false, error: err.message || 'erro ao enviar mensagem' });
    }
  });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
  });
});