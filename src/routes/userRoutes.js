import express from 'express';
import { User } from '../models/user.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Buscar usuários por nome/email (exceto o próprio usuário)
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.userId;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query deve ter pelo menos 2 caracteres' });
    }
    
    const query = q.trim();
    const users = await User.find({
      _id: { $ne: currentUserId }, // Excluir o próprio usuário
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('_id name email') // Só retorna campos necessários
    .limit(20) // Limita a 20 resultados
    .lean();
    
    res.json({ users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;