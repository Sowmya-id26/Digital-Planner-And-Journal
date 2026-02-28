import express from 'express';
import { getTasks, createTask, updateTask, reorderTasks, deleteTask } from '../controllers/tasksController.js';

const router = express.Router();
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.post('/reorder', reorderTasks);
router.delete('/:id', deleteTask);

export default router;
