import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import passport from 'passport';

const router = express.Router();

// Define the route for user registration
router.post('/register', registerUser); 

// Define the route for user login
router.post('/login', loginUser);

// Google login route
router.get('auth/google', passport.authenticate('google', { scope: ['profile', 'email' ] }));

// Google callback route
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/UserDashboard');
    }
  );

// Google login route
router.get('auth/facebook', passport.authenticate('facebook', { scope: ['profile', 'email' ] }));

// Facebook callback route
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/UserDashboard');
  }
);
// Route that allows access for admins alone
router.get('/admin-only-route', authenticateToken, authorizeRole('admin'));


export default router;
