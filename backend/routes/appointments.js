import express from 'express';
import Appointment from '../models/AppointmentDetails.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { getAppointments, updateAppointment, updateAppointmentStatus, deleteAppointment } from '../controllers/appointmentController.js';

const router = express.Router();

// Create a new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const appointment = new Appointment({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
    });

    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all appointments for a user
router.get('/', authenticateToken, getAppointments);

// Update appointment
router.put('/:id', authenticateToken, updateAppointment);

// Update appointment status
router.patch('/appointments/:id/status', authenticateToken, updateAppointmentStatus);

// Cancel appointment
router.delete('/:id', authenticateToken, deleteAppointment);

export default router;
