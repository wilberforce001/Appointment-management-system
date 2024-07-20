import express from 'express';
import { addTimeSlot } from '../controllers/timeSlotController.js';


const router = express.Router();

router.post('/timeSlots', addTimeSlot);

export default router;