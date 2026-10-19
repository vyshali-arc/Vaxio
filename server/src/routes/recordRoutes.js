import express from 'express';
import {
  getRecords,
  getRecordById,
  deleteRecord,
} from '../controllers/recordController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getRecords);
router.get('/:id', getRecordById);
router.delete('/:id', deleteRecord);

export default router;
