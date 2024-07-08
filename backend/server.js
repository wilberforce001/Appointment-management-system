import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectDB from './MongoDB.js';
import User from './models/User.js';
import authRoutes from './config/auth.js';
import appointmentRoutes from './router/Appointments.js';
import dotenv from 'dotenv';
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express
const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use Routes
app.use('/appointments', appointmentRoutes);

// Express Session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
import configurePassport from './config/Passport.js';
configurePassport(passport);

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
