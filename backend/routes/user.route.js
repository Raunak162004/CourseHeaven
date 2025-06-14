import express from 'express';
import { login, logout, purchases, signup } from '../controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/purchases',isLoggedIn,  purchases);

export default router;