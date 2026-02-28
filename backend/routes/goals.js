import express from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalsController.js';

const router = express.Router();
router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
