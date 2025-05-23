import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/developers', userController.getDevelopers);
router.get('/developers/:id', userController.getDeveloperById);

// Protected routes
router.use(authenticate);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

export default router;