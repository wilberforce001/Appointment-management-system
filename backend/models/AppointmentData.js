import { Schema as _Schema, model } from 'mongoose';


const Schema = _Schema;

const appointmentSchema = new Schema({
    customer: { 
        type: _Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    service: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Cancelled'], 
        default: 'Scheduled'
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default model('Appointment', appointmentSchema);