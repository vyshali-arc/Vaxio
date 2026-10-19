import React, { useState, useEffect } from 'react';
import { X, Calendar, Syringe, AlertCircle } from 'lucide-react';

export const VaccineModal = ({ isOpen, onClose, onSave, vaccine = null }) => {
  const isEditing = Boolean(vaccine);

  const [formData, setFormData] = useState({
    vaccineName: '',
    targetDisease: '',
    doseNumber: 1,
    totalDoses: 1,
    scheduledDate: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vaccine) {
      setFormData({
        vaccineName: vaccine.vaccineName || '',
        targetDisease: vaccine.targetDisease || '',
        doseNumber: vaccine.doseNumber || 1,
        totalDoses: vaccine.totalDoses || 1,
        scheduledDate: vaccine.scheduledDate
          ? new Date(vaccine.scheduledDate).toISOString().split('T')[0]
          : '',
        notes: vaccine.notes || '',
      });
    } else {
      // Default scheduled date to today
      const todayStr = new Date().toISOString().split('T')[0];
      setFormData({
        vaccineName: '',
        targetDisease: '',
        doseNumber: 1,
        totalDoses: 1,
        scheduledDate: todayStr,
        notes: '',
      });
    }
    setError('');
  }, [vaccine, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.vaccineName.trim()) {
      setError('Please provide a vaccine name.');
      return;
    }

    if (!formData.scheduledDate) {
      setError('Please select a scheduled date.');
      return;
    }

    if (Number(formData.doseNumber) > Number(formData.totalDoses)) {
      setError('Dose number cannot exceed the total number of doses.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave({
        ...formData,
        doseNumber: Number(formData.doseNumber),
        totalDoses: Number(formData.totalDoses),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save vaccination.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--lavender-mid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-700)',
              }}
            >
              <Syringe size={20} />
            </div>
            <h3 className="modal-title">
              {isEditing ? 'Edit Vaccination' : 'Schedule New Vaccination'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vaccine Name *</label>
            <input
              type="text"
              name="vaccineName"
              className="form-input"
              placeholder="e.g. Hepatitis B, MMR, COVID-19 Booster"
              value={formData.vaccineName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Disease / Category</label>
            <input
              type="text"
              name="targetDisease"
              className="form-input"
              placeholder="e.g. Hepatitis B, Influenza, Tetanus"
              value={formData.targetDisease}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Dose Number</label>
              <input
                type="number"
                name="doseNumber"
                className="form-input"
                min="1"
                max="10"
                value={formData.doseNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Doses in Series</label>
              <input
                type="number"
                name="totalDoses"
                className="form-input"
                min="1"
                max="10"
                value={formData.totalDoses}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Scheduled Date *</label>
            <input
              type="date"
              name="scheduledDate"
              className="form-input"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Instructions (Optional)</label>
            <textarea
              name="notes"
              className="form-textarea"
              placeholder="e.g. Fasting not required, bring vaccination card..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Schedule' : 'Schedule Vaccine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
