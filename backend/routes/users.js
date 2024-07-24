import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define the route for user registration
router.post('/register', registerUser); 

// Define the route for user login
router.post('/login', loginUser);

// Route that allows access for admins alone
router.get('/admin-only-route', authenticateToken, authorizeRole('admin'));


export default router;
