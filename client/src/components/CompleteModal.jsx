import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Building, UserCheck } from 'lucide-react';

export const CompleteModal = ({ isOpen, onClose, onComplete, vaccine }) => {
  const [formData, setFormData] = useState({
    administeredDate: new Date().toISOString().split('T')[0],
    administeredBy: '',
    batchNumber: '',
    clinicLocation: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vaccine) {
      setFormData({
        administeredDate: vaccine.administeredDate
          ? new Date(vaccine.administeredDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        administeredBy: vaccine.administeredBy || '',
        batchNumber: vaccine.batchNumber || '',
        clinicLocation: vaccine.clinicLocation || '',
        notes: vaccine.notes || '',
      });
    }
    setError('');
  }, [vaccine, isOpen]);

  if (!isOpen || !vaccine) return null;

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

    if (!formData.administeredDate) {
      setError('Please select the date when the vaccine was administered.');
      return;
    }

    try {
      setSubmitting(true);
      await onComplete(vaccine._id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to complete vaccination.');
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
                background: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
              }}
            >
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 className="modal-title">Record Administration</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {vaccine.vaccineName} • Dose {vaccine.doseNumber} of {vaccine.totalDoses}
              </p>
            </div>
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
            <label className="form-label">Date Administered *</label>
            <input
              type="date"
              name="administeredDate"
              className="form-input"
              value={formData.administeredDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Administered By (Doctor / Healthcare Worker)</label>
            <input
              type="text"
              name="administeredBy"
              className="form-input"
              placeholder="e.g. Dr. Jennifer Adams"
              value={formData.administeredBy}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Batch / Lot Number</label>
              <input
                type="text"
                name="batchNumber"
                className="form-input"
                placeholder="e.g. LOT-AB-9842"
                value={formData.batchNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinic / Hospital</label>
              <input
                type="text"
                name="clinicLocation"
                className="form-input"
                placeholder="e.g. City Health Center"
                value={formData.clinicLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Administration Notes / Observations</label>
            <textarea
              name="notes"
              className="form-textarea"
              placeholder="e.g. Left deltoid, no immediate reaction, next dose advised in 6 months."
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
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? 'Confirming...' : 'Save & Mark as Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
