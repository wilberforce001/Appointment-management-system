// Import dependencies: mongoose for interacting with
// MongoDB and bcryptjs for hashing passwords
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema that defines the stracture of user documents
// in the MongoDB collection
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Password comparison method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User Model
const User = mongoose.model('User', UserSchema);
module.exports = User;