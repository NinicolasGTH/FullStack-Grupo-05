import express from 'express';
import { register, login, profile, promoteToAdmin } from '../controllers/authController.js';
import {authMiddleware} from '../middleware/auth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, profile);
// DEV ONLY: promover usuário a admin (remover em produção)
router.post('/promote', promoteToAdmin);

export default router;