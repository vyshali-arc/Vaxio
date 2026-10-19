import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'vaxio_fallback_jwt_secret_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Consistently compute vaccine status based on project requirements:
 * - Completed: vaccination recorded as administered
 * - Upcoming: not completed and scheduled for today or a future date
 * - Overdue: not completed and scheduled before today
 */
export const computeVaccineStatus = (scheduledDate, isCompleted, administeredDate) => {
  if (isCompleted || administeredDate) {
    return 'completed';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sched = new Date(scheduledDate);
  sched.setHours(0, 0, 0, 0);

  if (isNaN(sched.getTime())) {
    return 'upcoming';
  }

  return sched < today ? 'overdue' : 'upcoming';
};
