import express from 'express';
import {
  getVaccines,
  getVaccineById,
  addVaccine,
  updateVaccine,
  deleteVaccine,
  completeVaccine,
  getDashboardStats,
} from '../controllers/vaccineController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Enforce authentication for all vaccine operations

router.get('/dashboard/stats', getDashboardStats);
router.get('/', getVaccines);
router.post('/', addVaccine);
router.get('/:id', getVaccineById);
router.put('/:id', updateVaccine);
router.patch('/:id/complete', completeVaccine);
router.delete('/:id', deleteVaccine);

export default router;
