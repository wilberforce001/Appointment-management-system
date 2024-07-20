// controllers/timeSlotController.js
export const addTimeSlot = async (req, res) => {
    try {
      const { date, startTime, endTime } = req.body;
      // Logic to add a new time slot
      // e.g., creating a new TimeSlot document
      // const timeSlot = new TimeSlot({ date, startTime, endTime });
      // await timeSlot.save();
  
      res.status(201).json({ message: 'Time slot added successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  