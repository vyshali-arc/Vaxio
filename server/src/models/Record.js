import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    vaccine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vaccine',
      required: [true, 'Vaccine reference is required'],
      index: true,
    },
    vaccineName: {
      type: String,
      required: [true, 'Vaccine name is required'],
      trim: true,
    },
    targetDisease: {
      type: String,
      trim: true,
      default: '',
    },
    doseNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    totalDoses: {
      type: Number,
      required: true,
      min: 1,
    },
    administeredDate: {
      type: Date,
      required: [true, 'Administered date is required'],
    },
    administeredBy: {
      type: String,
      trim: true,
      default: '',
    },
    batchNumber: {
      type: String,
      trim: true,
      default: '',
    },
    clinicLocation: {
      type: String,
      trim: true,
      default: '',
    },
    certificateNumber: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate completion record for the same user, vaccine, and dose number
recordSchema.index({ user: 1, vaccine: 1, doseNumber: 1 }, { unique: true });

const Record = mongoose.model('Record', recordSchema);
export default Record;
