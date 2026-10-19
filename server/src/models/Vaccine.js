import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    vaccineName: {
      type: String,
      required: [true, 'Vaccine name is required'],
      trim: true,
      maxlength: [100, 'Vaccine name cannot exceed 100 characters'],
    },
    targetDisease: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Target disease cannot exceed 100 characters'],
    },
    doseNumber: {
      type: Number,
      required: [true, 'Dose number is required'],
      min: [1, 'Dose number must be at least 1'],
      default: 1,
    },
    totalDoses: {
      type: Number,
      required: [true, 'Total doses count is required'],
      min: [1, 'Total doses must be at least 1'],
      default: 1,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'overdue'],
      default: 'upcoming',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    administeredDate: {
      type: Date,
      default: null,
    },
    administeredBy: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Administered by cannot exceed 120 characters'],
    },
    batchNumber: {
      type: String,
      trim: true,
      default: '',
      maxlength: [60, 'Batch number cannot exceed 60 characters'],
    },
    clinicLocation: {
      type: String,
      trim: true,
      default: '',
      maxlength: [150, 'Clinic location cannot exceed 150 characters'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual or helper to determine computed status consistently
vaccineSchema.methods.getComputedStatus = function () {
  if (this.isCompleted || this.status === 'completed' || this.administeredDate) {
    return 'completed';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduled = new Date(this.scheduledDate);
  scheduled.setHours(0, 0, 0, 0);

  return scheduled < today ? 'overdue' : 'upcoming';
};

const Vaccine = mongoose.model('Vaccine', vaccineSchema);
export default Vaccine;
