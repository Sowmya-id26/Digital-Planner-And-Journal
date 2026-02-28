import express from 'express';
import { getMoodLogs, logMood, deleteMoodLog } from '../controllers/moodController.js';

const router = express.Router();
router.get('/', getMoodLogs);
router.post('/', logMood);
router.delete('/:id', deleteMoodLog);

export default router;
