import express from 'express';
import {addToWishlist, removeFromWishlist, listWishlist} from '../controllers/wishlistController.js';
import {authMiddleware} from '../middleware/auth.js';

const router = express.Router();

router.post('/:gameId', authMiddleware, addToWishlist);
router.delete('/:gameId', authMiddleware, removeFromWishlist);
router.get('/', authMiddleware, listWishlist);


export default router;