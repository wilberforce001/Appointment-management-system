import Appointment from "../models/AppointmentDetails.js";

// Fetch all appointments for authenticated use
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'canceled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  } 

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
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


export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment cancelled successfully' }); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



