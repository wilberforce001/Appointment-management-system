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

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Logic to update the status of the appointment
    // e.g., finding the appointment by ID and updating its status
    // const appointment = await Appointment.findById(id);
    // appointment.status = status;
    // await appointment.save();
    
    res.status(200).json({ message: 'Appointment status updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
