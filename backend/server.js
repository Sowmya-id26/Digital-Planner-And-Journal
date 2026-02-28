import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { optionalAuth } from './middleware/auth.js';
import eventsRouter from './routes/events.js';
import tasksRouter from './routes/tasks.js';
import journalRouter from './routes/journal.js';
import goalsRouter from './routes/goals.js';
import moodRouter from './routes/mood.js';
import habitsRouter from './routes/habits.js';
import remindersRouter from './routes/reminders.js';
import userSettingsRouter from './routes/userSettings.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Digital Planner API' }));

app.use('/api', optionalAuth);
app.use('/api/events', eventsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/journal', journalRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/mood', moodRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/settings', userSettingsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
