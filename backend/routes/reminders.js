import express from 'express';
import { getReminders, createReminder, updateReminder, deleteReminder } from '../controllers/remindersController.js';

const router = express.Router();
router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
