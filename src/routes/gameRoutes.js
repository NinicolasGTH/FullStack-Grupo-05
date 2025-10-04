import express from "express";
import { createGame, listGames, getGame, updateGame, deleteGame } from '../controllers/gameController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Públicos
router.get('/', listGames);
router.get('/:id', getGame);

// Protegidos (admin via controller)
router.post('/', authMiddleware, createGame);
router.put('/:id', authMiddleware, updateGame);
router.delete('/:id', authMiddleware, deleteGame);

export default router;