import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { VaccineModal } from '../components/VaccineModal';
import { CompleteModal } from '../components/CompleteModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  Syringe,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Edit2,
  Trash2,
  Check,
  Filter,
  FileCheck,
} from 'lucide-react';

export const MyVaccinesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  // Modals state
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [activeVaccine, setActiveVaccine] = useState(null);
  const [completeVaccineTarget, setCompleteVaccineTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus) params.status = selectedStatus;
      if (searchTerm) params.search = searchTerm;

      const res = await api.getVaccines(params);
      if (res.success) {
        setVaccines(res.vaccines);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vaccinations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, [selectedStatus, searchTerm]);

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const handleSaveVaccine = async (data) => {
    if (modalMode === 'edit' && activeVaccine) {
      await api.updateVaccine(activeVaccine._id, data);
    } else {
      await api.addVaccine(data);
    }
    setModalMode(null);
    setActiveVaccine(null);
    await fetchVaccines();
  };

  const handleCompleteSubmit = async (id, data) => {
    await api.completeVaccine(id, data);
    setCompleteVaccineTarget(null);
    await fetchVaccines();
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await api.deleteVaccine(deleteTarget._id);
      setDeleteTarget(null);
      await fetchVaccines();
    }
  };

  return (
    <div>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Vaccine Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage upcoming doses, record administered vaccines, and update immunization timelines.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveVaccine(null);
            setModalMode('add');
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add New Vaccine</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleFilterChange('')}
            className={`btn btn-sm ${selectedStatus === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Vaccines
          </button>
          <button
            onClick={() => handleFilterChange('upcoming')}
            className={`btn btn-sm ${selectedStatus === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`btn btn-sm ${selectedStatus === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Completed
          </button>
          <button
            onClick={() => handleFilterChange('overdue')}
            className={`btn btn-sm ${selectedStatus === 'overdue' ? 'btn-danger' : 'btn-secondary'}`}
          >
            Overdue
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search vaccine or disease..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.4rem', paddingRight: '1rem', paddingY: '0.5rem', borderRadius: 20 }}
          />
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Vaccines Grid / List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--primary-600)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Retrieving your immunization records...</p>
        </div>
      ) : vaccines.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Syringe size={36} />
          </div>
          <h3 className="empty-title">
            {searchTerm || selectedStatus ? 'No Matching Vaccinations Found' : 'No Vaccinations Added Yet'}
          </h3>
          <p className="empty-desc">
            {searchTerm || selectedStatus
              ? 'Try adjusting your filters or search terms to locate your records.'
              : 'Add your planned or historical vaccines to keep an accurate, organized immunization record.'}
          </p>
          <button
            onClick={() => {
              setSelectedStatus('');
              setSearchTerm('');
              setActiveVaccine(null);
              setModalMode('add');
            }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Add Vaccine</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {vaccines.map((v) => (
            <div key={v._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Card Top: Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <span className={`badge badge-${v.status}`}>
                    {v.status === 'completed' && <Check size={13} />}
                    {v.status === 'upcoming' && <Calendar size={13} />}
                    {v.status === 'overdue' && <AlertCircle size={13} />}
                    <span>{v.status}</span>
                  </span>

                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: 'var(--lavender-light)',
                      color: 'var(--primary-800)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 12,
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    Dose {v.doseNumber} of {v.totalDoses}
                  </span>
                </div>

                {/* Card Title & Target */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {v.vaccineName}
                </h3>
                {v.targetDisease && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Protects against: <strong>{v.targetDisease}</strong>
                  </p>
                )}

                {/* Dates Info */}
                <div style={{ background: 'var(--lavender-light)', padding: '0.75rem 1rem', borderRadius: 12, marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Scheduled Date:</span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {new Date(v.scheduledDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </strong>
                  </div>

                  {v.isCompleted && v.administeredDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#047857' }}>
                      <span>Administered On:</span>
                      <strong>
                        {new Date(v.administeredDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>
                  )}

                  {v.administeredBy && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Administered By:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{v.administeredBy}</strong>
                    </div>
                  )}

                  {v.batchNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Batch / Lot:</span>
                      <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{v.batchNumber}</strong>
                    </div>
                  )}
                </div>

                {v.notes && (
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                    "{v.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: '0.5rem',
                  gap: '0.5rem',
                }}
              >
                {!v.isCompleted ? (
                  <button
                    onClick={() => setCompleteVaccineTarget(v)}
                    className="btn btn-success btn-sm"
                    style={{ flex: 1 }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Completed</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#047857', fontSize: '0.82rem', fontWeight: 700 }}>
                    <FileCheck size={16} />
                    <span>Record Archived</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      setActiveVaccine(v);
                      setModalMode('edit');
                    }}
                    className="btn btn-secondary btn-sm"
                    title="Edit vaccination details"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(v)}
                    className="btn btn-secondary btn-sm"
                    title="Delete vaccination"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add or Edit Modal */}
      <VaccineModal
        isOpen={Boolean(modalMode)}
        onClose={() => {
          setModalMode(null);
          setActiveVaccine(null);
        }}
        onSave={handleSaveVaccine}
        vaccine={activeVaccine}
      />

      {/* Complete Vaccine Modal */}
      <CompleteModal
        isOpen={Boolean(completeVaccineTarget)}
        onClose={() => setCompleteVaccineTarget(null)}
        onComplete={handleCompleteSubmit}
        vaccine={completeVaccineTarget}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemTitle={deleteTarget?.vaccineName}
      />
    </div>
  );
};
