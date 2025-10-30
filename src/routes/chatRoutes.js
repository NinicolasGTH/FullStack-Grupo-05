import express from 'express';
import { Message } from '../models/message.js';
import { User } from '../models/user.js';
import { authMiddleware } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Listar conversas do usuário (últimas mensagens de cada conversa)
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Busca as últimas mensagens de cada conversa
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { recipient: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationKey',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$readAt', null] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Buscar informações dos outros usuários
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const { lastMessage } = conv;
        const otherUserId = lastMessage.sender.toString() === userId 
          ? lastMessage.recipient 
          : lastMessage.sender;
        
        const otherUser = await User.findById(otherUserId).select('_id name email').lean();
        
        return {
          conversationKey: conv._id,
          otherUser,
          lastMessage: {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            isFromMe: lastMessage.sender.toString() === userId
          },
          unreadCount: conv.unreadCount
        };
      })
    );

    res.json({ conversations: conversationsWithUsers });
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar histórico de mensagens de uma conversa
router.get('/messages/:conversationKey', authMiddleware, async (req, res) => {
  try {
    const { conversationKey } = req.params;
    const userId = req.user.userId;
    let { page = 1, limit = 50 } = req.query;
    
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    
    // Verificar se o usuário faz parte desta conversa
    const [userIdA, userIdB] = conversationKey.split('|');
    if (userIdA !== userId && userIdB !== userId) {
      return res.status(403).json({ error: 'Acesso negado a esta conversa' });
    }
    
    const messages = await Message.find({ conversationKey })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', '_id name')
      .populate('recipient', '_id name')
      .lean();
    
    // Marcar mensagens como lidas (onde o usuário atual é recipient)
    await Message.updateMany(
      {
        conversationKey,
        recipient: userId,
        readAt: null
      },
      {
        readAt: new Date()
      }
    );
    
    res.json({ 
      messages: messages.reverse(), // Ordem cronológica para exibição
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;