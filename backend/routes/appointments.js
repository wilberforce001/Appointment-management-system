import express from 'express';
import Appointment from '../models/AppointmentDetails.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = express.Router();

// Create a new appointment
router.post('/', authMiddleware, async (req, res) => {
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
router.get('/', authMiddleware, getAppointments);

router.patch('/appointments/:id/status', updateAppointmentStatus);

export default router;
