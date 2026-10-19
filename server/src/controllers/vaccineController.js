import Vaccine from '../models/Vaccine.js';
import Record from '../models/Record.js';
import { computeVaccineStatus } from '../utils/helpers.js';

/**
 * @desc    Get all vaccinations for the current logged-in user
 * @route   GET /api/vaccines
 * @access  Private
 */
export const getVaccines = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const query = { user: req.user._id };

    if (search && search.trim() !== '') {
      query.$or = [
        { vaccineName: { $regex: search.trim(), $options: 'i' } },
        { targetDisease: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const rawVaccines = await Vaccine.find(query).sort({ scheduledDate: 1 });

    // Sync computed status for accuracy based on the current date
    const vaccines = await Promise.all(
      rawVaccines.map(async (vaccine) => {
        const computed = computeVaccineStatus(
          vaccine.scheduledDate,
          vaccine.isCompleted,
          vaccine.administeredDate
        );
        if (vaccine.status !== computed) {
          vaccine.status = computed;
          await vaccine.save();
        }
        return vaccine;
      })
    );

    // Filter by computed status if requested
    const filteredVaccines = status
      ? vaccines.filter((v) => v.status === status)
      : vaccines;

    return res.status(200).json({
      success: true,
      count: filteredVaccines.length,
      vaccines: filteredVaccines,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single vaccination by ID
 * @route   GET /api/vaccines/:id
 * @access  Private
 */
export const getVaccineById = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);

    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found.',
      });
    }

    // Enforce ownership
    if (vaccine.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this vaccination.',
      });
    }

    const computed = computeVaccineStatus(
      vaccine.scheduledDate,
      vaccine.isCompleted,
      vaccine.administeredDate
    );
    if (vaccine.status !== computed) {
      vaccine.status = computed;
      await vaccine.save();
    }

    return res.status(200).json({
      success: true,
      vaccine,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new vaccination
 * @route   POST /api/vaccines
 * @access  Private
 */
export const addVaccine = async (req, res, next) => {
  try {
    const {
      vaccineName,
      targetDisease,
      doseNumber,
      totalDoses,
      scheduledDate,
      administeredDate,
      administeredBy,
      batchNumber,
      clinicLocation,
      notes,
      isCompleted,
    } = req.body;

    if (!vaccineName || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Vaccine name and scheduled date are required.',
      });
    }

    const completed = Boolean(isCompleted || administeredDate);
    const computedStatus = computeVaccineStatus(
      scheduledDate,
      completed,
      administeredDate
    );

    const vaccine = await Vaccine.create({
      user: req.user._id,
      vaccineName: vaccineName.trim(),
      targetDisease: targetDisease ? targetDisease.trim() : '',
      doseNumber: Number(doseNumber) || 1,
      totalDoses: Number(totalDoses) || 1,
      scheduledDate: new Date(scheduledDate),
      status: computedStatus,
      isCompleted: completed,
      administeredDate: completed
        ? (administeredDate ? new Date(administeredDate) : new Date())
        : null,
      administeredBy: administeredBy ? administeredBy.trim() : '',
      batchNumber: batchNumber ? batchNumber.trim() : '',
      clinicLocation: clinicLocation ? clinicLocation.trim() : '',
      notes: notes ? notes.trim() : '',
    });

    // If marked completed, generate vaccination record
    if (completed) {
      await Record.findOneAndUpdate(
        {
          user: req.user._id,
          vaccine: vaccine._id,
          doseNumber: vaccine.doseNumber,
        },
        {
          user: req.user._id,
          vaccine: vaccine._id,
          vaccineName: vaccine.vaccineName,
          targetDisease: vaccine.targetDisease,
          doseNumber: vaccine.doseNumber,
          totalDoses: vaccine.totalDoses,
          administeredDate: vaccine.administeredDate || new Date(),
          administeredBy: vaccine.administeredBy,
          batchNumber: vaccine.batchNumber,
          clinicLocation: vaccine.clinicLocation,
          notes: vaccine.notes,
        },
        { upsert: true, new: true }
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Vaccination added successfully.',
      vaccine,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit a vaccination
 * @route   PUT /api/vaccines/:id
 * @access  Private
 */
export const updateVaccine = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);

    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found.',
      });
    }

    // Enforce ownership
    if (vaccine.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to modify this vaccination.',
      });
    }

    const {
      vaccineName,
      targetDisease,
      doseNumber,
      totalDoses,
      scheduledDate,
      isCompleted,
      administeredDate,
      administeredBy,
      batchNumber,
      clinicLocation,
      notes,
    } = req.body;

    if (vaccineName !== undefined) vaccine.vaccineName = vaccineName.trim();
    if (targetDisease !== undefined) vaccine.targetDisease = targetDisease.trim();
    if (doseNumber !== undefined) vaccine.doseNumber = Number(doseNumber) || 1;
    if (totalDoses !== undefined) vaccine.totalDoses = Number(totalDoses) || 1;
    if (scheduledDate !== undefined) vaccine.scheduledDate = new Date(scheduledDate);
    if (administeredBy !== undefined) vaccine.administeredBy = administeredBy.trim();
    if (batchNumber !== undefined) vaccine.batchNumber = batchNumber.trim();
    if (clinicLocation !== undefined) vaccine.clinicLocation = clinicLocation.trim();
    if (notes !== undefined) vaccine.notes = notes.trim();

    if (isCompleted !== undefined) {
      vaccine.isCompleted = Boolean(isCompleted);
      if (vaccine.isCompleted && !vaccine.administeredDate) {
        vaccine.administeredDate = administeredDate ? new Date(administeredDate) : new Date();
      } else if (!vaccine.isCompleted) {
        vaccine.administeredDate = null;
      }
    } else if (administeredDate !== undefined) {
      if (administeredDate) {
        vaccine.isCompleted = true;
        vaccine.administeredDate = new Date(administeredDate);
      } else {
        vaccine.isCompleted = false;
        vaccine.administeredDate = null;
      }
    }

    vaccine.status = computeVaccineStatus(
      vaccine.scheduledDate,
      vaccine.isCompleted,
      vaccine.administeredDate
    );

    const updatedVaccine = await vaccine.save();

    // Sync corresponding Record
    if (updatedVaccine.isCompleted) {
      await Record.findOneAndUpdate(
        {
          user: req.user._id,
          vaccine: updatedVaccine._id,
          doseNumber: updatedVaccine.doseNumber,
        },
        {
          user: req.user._id,
          vaccine: updatedVaccine._id,
          vaccineName: updatedVaccine.vaccineName,
          targetDisease: updatedVaccine.targetDisease,
          doseNumber: updatedVaccine.doseNumber,
          totalDoses: updatedVaccine.totalDoses,
          administeredDate: updatedVaccine.administeredDate || new Date(),
          administeredBy: updatedVaccine.administeredBy,
          batchNumber: updatedVaccine.batchNumber,
          clinicLocation: updatedVaccine.clinicLocation,
          notes: updatedVaccine.notes,
        },
        { upsert: true, new: true }
      );
    } else {
      // If toggled off from completed, remove the record
      await Record.deleteOne({
        user: req.user._id,
        vaccine: updatedVaccine._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vaccination updated successfully.',
      vaccine: updatedVaccine,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a vaccination as completed
 * @route   PATCH /api/vaccines/:id/complete
 * @access  Private
 */
export const completeVaccine = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);

    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found.',
      });
    }

    if (vaccine.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to modify this vaccination.',
      });
    }

    const { administeredDate, administeredBy, batchNumber, clinicLocation, notes } =
      req.body;

    vaccine.isCompleted = true;
    vaccine.status = 'completed';
    vaccine.administeredDate = administeredDate
      ? new Date(administeredDate)
      : new Date();
    if (administeredBy !== undefined) vaccine.administeredBy = administeredBy.trim();
    if (batchNumber !== undefined) vaccine.batchNumber = batchNumber.trim();
    if (clinicLocation !== undefined) vaccine.clinicLocation = clinicLocation.trim();
    if (notes !== undefined) vaccine.notes = notes.trim();

    const savedVaccine = await vaccine.save();

    // Create or update record (preventing duplicate completion records)
    const record = await Record.findOneAndUpdate(
      {
        user: req.user._id,
        vaccine: savedVaccine._id,
        doseNumber: savedVaccine.doseNumber,
      },
      {
        user: req.user._id,
        vaccine: savedVaccine._id,
        vaccineName: savedVaccine.vaccineName,
        targetDisease: savedVaccine.targetDisease,
        doseNumber: savedVaccine.doseNumber,
        totalDoses: savedVaccine.totalDoses,
        administeredDate: savedVaccine.administeredDate,
        administeredBy: savedVaccine.administeredBy,
        batchNumber: savedVaccine.batchNumber,
        clinicLocation: savedVaccine.clinicLocation,
        notes: savedVaccine.notes,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Vaccination marked as completed and record created.',
      vaccine: savedVaccine,
      record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a vaccination
 * @route   DELETE /api/vaccines/:id
 * @access  Private
 */
export const deleteVaccine = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);

    if (!vaccine) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found.',
      });
    }

    if (vaccine.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this vaccination.',
      });
    }

    // Delete associated record
    await Record.deleteMany({ vaccine: vaccine._id, user: req.user._id });
    await vaccine.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Vaccination and associated records deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get real, database-backed dashboard statistics
 * @route   GET /api/vaccines/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all user vaccines to compute exact live statuses
    const rawVaccines = await Vaccine.find({ user: userId }).sort({
      scheduledDate: 1,
    });

    let totalVaccines = rawVaccines.length;
    let completedVaccinations = 0;
    let upcomingVaccinations = 0;
    let overdueVaccinations = 0;
    let nextScheduledVaccination = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const vaccine of rawVaccines) {
      const computed = computeVaccineStatus(
        vaccine.scheduledDate,
        vaccine.isCompleted,
        vaccine.administeredDate
      );

      if (computed === 'completed') {
        completedVaccinations++;
      } else if (computed === 'overdue') {
        overdueVaccinations++;
      } else {
        upcomingVaccinations++;
        if (!nextScheduledVaccination) {
          nextScheduledVaccination = vaccine;
        }
      }
    }

    // Calculate completion rate percentage
    const completionRate =
      totalVaccines > 0
        ? Math.round((completedVaccinations / totalVaccines) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalVaccines,
        completedVaccinations,
        upcomingVaccinations,
        overdueVaccinations,
        completionRate,
        nextScheduledVaccination,
      },
    });
  } catch (error) {
    next(error);
  }
};
