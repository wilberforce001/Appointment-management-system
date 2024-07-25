import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const appointmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
