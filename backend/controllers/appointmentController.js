import Appointment from "../models/AppointmentDetails.js";

// Fetch all appointments for authenticated user
export const getAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find({ userId: req.user.id });
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };