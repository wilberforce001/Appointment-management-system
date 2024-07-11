import express from 'express';
import Appointment from '../models/AppointmentData.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = express.Router();

// Create a new appointment
router.post('/create', ensureAuthenticated, async (req, res) => {
    try {
        const { service, date, time } = req.body;
        const newAppointment = new Appointment({
            customer: req.user._id,
            service,
            date,
            time
        });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all appointments for the logged-in user
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const appointments = await find({ customer: req.user._id }).sort({ date: 1, time: 1 });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific appointment
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const appointment = await findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        if (appointment.customer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update appointment status
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const appointment = await findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        if (appointment.customer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        appointment.status = req.body.status || appointment.status;
        appointment.updatedAt = Date.now();
        await appointment.save();
        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an appointment
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const appointment = await findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        if (appointment.customer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        await appointment.remove();
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
