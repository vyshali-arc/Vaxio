import Record from '../models/Record.js';
import Vaccine from '../models/Vaccine.js';
import { computeVaccineStatus } from '../utils/helpers.js';

/**
 * @desc    Get all completed vaccination records for the current user
 * @route   GET /api/records
 * @access  Private
 */
export const getRecords = async (req, res, next) => {
  try {
    const { search } = req.query;

    const query = { user: req.user._id };
    if (search && search.trim() !== '') {
      query.$or = [
        { vaccineName: { $regex: search.trim(), $options: 'i' } },
        { targetDisease: { $regex: search.trim(), $options: 'i' } },
        { administeredBy: { $regex: search.trim(), $options: 'i' } },
        { batchNumber: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const records = await Record.find(query).sort({ administeredDate: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single vaccination record
 * @route   GET /api/records/:id
 * @access  Private
 */
export const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found.',
      });
    }

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this record.',
      });
    }

    return res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a vaccination record & sync vaccine status
 * @route   DELETE /api/records/:id
 * @access  Private
 */
export const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found.',
      });
    }

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this record.',
      });
    }

    // Revert vaccine completion status to keep consistent state
    const vaccine = await Vaccine.findById(record.vaccine);
    if (vaccine) {
      vaccine.isCompleted = false;
      vaccine.administeredDate = null;
      vaccine.status = computeVaccineStatus(vaccine.scheduledDate, false, null);
      await vaccine.save();
    }

    await record.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Vaccination record deleted and schedule reverted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
