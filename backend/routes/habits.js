import express from 'express';
import { getHabits, getHabitCompletions, createHabit, toggleHabitCompletion, updateHabit, deleteHabit } from '../controllers/habitsController.js';

const router = express.Router();
router.get('/', getHabits);
router.get('/completions', getHabitCompletions);
router.post('/', createHabit);
router.post('/toggle', toggleHabitCompletion);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);

export default router;
