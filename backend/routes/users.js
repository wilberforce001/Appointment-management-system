import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Define the route for user registration
router.post('/register', registerUser); 

// Define the route for user login
router.post('/login', loginUser);

export default router;
