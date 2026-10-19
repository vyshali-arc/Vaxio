import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  FileText,
  Search,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  UserCheck,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      const res = await api.getRecords(params);
      if (res.success) {
        setRecords(res.records);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch immunization records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: 700, fontSize: '0.85rem' }}>
            <FileCheck2 size={16} />
            <span>CERTIFIED IMMUNIZATION LOGS</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Vaccination Records
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Archived logs of completed immunizations with verification details and lot numbers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} />
            <span>Print Records</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '380px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Filter by vaccine, clinic, or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.5rem', borderRadius: 20 }}
        />
        <Search
          size={16}
          style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
        />
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

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
          <p style={{ color: 'var(--text-muted)' }}>Retrieving archived records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <FileText size={36} />
          </div>
          <h3 className="empty-title">
            {searchTerm ? 'No Matching Records' : 'No Completed Vaccinations Yet'}
          </h3>
          <p className="empty-desc">
            {searchTerm
              ? 'Try modifying your search criteria.'
              : 'When you mark a vaccination as completed on your schedule, its permanent immunization record and audit log will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {records.map((r) => (
            <div
              key={r._id}
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                alignItems: 'center',
                padding: '1.5rem',
                borderLeft: '5px solid #10b981',
              }}
            >
              <div>
                <span className="badge badge-completed" style={{ marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={13} />
                  <span>Verified Administered</span>
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
                  {r.vaccineName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {r.targetDisease ? `${r.targetDisease} • ` : ''}Dose {r.doseNumber} of {r.totalDoses}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  Administration Date
                </div>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                  <Calendar size={15} color="#059669" />
                  <span>
                    {new Date(r.administeredDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {r.batchNumber && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Lot/Batch: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.batchNumber}</span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  Healthcare Facility
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={15} color="var(--primary-600)" />
                  <span>{r.clinicLocation || 'Registered Medical Center'}</span>
                </div>
                {r.administeredBy && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <UserCheck size={14} />
                    <span>{r.administeredBy}</span>
                  </div>
                )}
              </div>

              {r.notes && (
                <div style={{ gridColumn: '1 / -1', background: 'var(--lavender-light)', padding: '0.65rem 0.9rem', borderRadius: 10, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong>Notes:</strong> {r.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
