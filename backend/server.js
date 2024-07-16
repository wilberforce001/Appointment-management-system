import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectDB from './MongoDB.js';
import User from './models/User.js';
import authRoutes from './config/auth.js';
import appointmentRoutes from './routes/Appointments.js';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express
const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

// Registration Route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            'secretToken',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
})

// Login Route 
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            'secretToken',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Create Apointment Endpoint
router.post('/api/appointments', async (req, res) => {
    try {
        const { date, time, userId } = req.body;
        const appointment = new Appointment({ date, time, userId });
        await appointment.save();
        res.status(201).send('Appointment booked');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Server error');
    }
});

// GET /api/appointments
router.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await Appointment.find();
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).send('Server error');
    }
  });


// PUT /api/appointments/:id
router.put('/api/appointments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
      if (!appointment) {
        return res.status(404).send('Appointment not found');
      }
      res.status(200).send('Appointment status updated');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      res.status(500).send('Server error');
    }
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = router;
