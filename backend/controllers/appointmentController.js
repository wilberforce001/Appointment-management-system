import Appointment from "../models/AppointmentDetails.js";

// Fetch all appointments for authenticated user
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    // Update the appointment fields
    appointment.title = req.body.title || appointment.title;
    appointment.description = req.body.description || appointment.description;
    appointment.date = req.body.date || appointment.date;

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    // Update the appointment status
    appointment.status = req.body.status || appointment.status;

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



