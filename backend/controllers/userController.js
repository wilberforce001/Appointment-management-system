import User from '../models/UserData.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const role = req.body.role || 'user';

    const user = new User({
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      email: req.body.email,
      password: hashedPassword,
      role,
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Registration Error:', err); 
    res.status(400).json({ message: err.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
