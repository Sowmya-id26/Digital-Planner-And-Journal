// import express from 'express';
// import { getEntries, getEntryByDate, createOrUpdateEntry, deleteEntry } from '../controllers/journalController.js';

// const router = express.Router();
// router.get('/', getEntries);
// router.get('/date/:date', getEntryByDate);
// router.post('/', createOrUpdateEntry);
// router.delete('/:id', deleteEntry);

// export default router;
import express from 'express';
import {
  getEntries,
  getEntryByDate,
  saveEntry,
  deleteEntry
} from '../controllers/journalController.js';

const router = express.Router();

router.get('/', getEntries);
router.get('/date/:date', getEntryByDate);
router.post('/', saveEntry);
router.delete('/:id', deleteEntry);

export default router;