import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
});

const User = model('User', userSchema); 
export default User;
