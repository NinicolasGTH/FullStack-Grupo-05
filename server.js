import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';
import swagger from 'swagger-ui-express';
import {swaggerDocument} from './docs/swagger.js';


dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use('/wishlist', wishlistRoutes);

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

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
  });
});