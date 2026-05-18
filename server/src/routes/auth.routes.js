import express from 'express';
import { register } from '../controllers/auth/register.controller.js';
import { login } from '../controllers/auth/login.controller.js';
import { logout } from '../controllers/auth/logout.controller.js';
import { myProfile } from '../controllers/auth/myProfile.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, myProfile);

export default router;
