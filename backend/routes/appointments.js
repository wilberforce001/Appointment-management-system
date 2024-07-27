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

// Get available time slots 
router.get('/appointments/available', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'available' })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// Book an appointment
router.post('/book/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    appointment.status = 'booked'
    appointment.userId = req.body.userId
    await appointment.save()

    res.json({ message: 'Appointment booked successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get all appointments for a user
router.get('/', authenticateToken, getAppointments);

// Update appointment
router.put('/:id', authenticateToken, updateAppointment);

// Update appointment status
router.put('/:id/status', authenticateToken, updateAppointmentStatus);

// Cancel appointment
router.delete('/:id', authenticateToken, deleteAppointment);

export default router;
