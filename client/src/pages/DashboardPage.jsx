import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { VaccineModal } from '../components/VaccineModal';
import { CompleteModal } from '../components/CompleteModal';
import {
  Syringe,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVaccines: 0,
    completedVaccinations: 0,
    upcomingVaccinations: 0,
    overdueVaccinations: 0,
    completionRate: 0,
    nextScheduledVaccination: null,
  });
  const [recentVaccines, setRecentVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVaccineForComplete, setSelectedVaccineForComplete] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, vaccinesRes] = await Promise.all([
        api.getDashboardStats(),
        api.getVaccines(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (vaccinesRes.success) {
        setRecentVaccines(vaccinesRes.vaccines.slice(0, 5));
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveVaccine = async (vaccineData) => {
    await api.addVaccine(vaccineData);
    await fetchDashboardData();
  };

  const handleCompleteVaccine = async (id, completeData) => {
    await api.completeVaccine(id, completeData);
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div
          style={{
            width: 44,
            height: 44,
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--primary-600)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading your live immunization metrics...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Top Greeting Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--primary-700)', fontWeight: 700 }}>
              IMMUNIZATION DASHBOARD
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Here is your real-time vaccination overview and schedule status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <Plus size={18} />
          <span>Schedule Vaccination</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Overdue Alert banner if any exist */}
      {stats.overdueVaccinations > 0 && (
        <div
          style={{
            background: '#fff1f2',
            border: '1.5px solid #fecdd3',
            borderRadius: 16,
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#fee2e2',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#9f1239', fontSize: '1.05rem' }}>
                Attention: {stats.overdueVaccinations} Overdue Vaccination{stats.overdueVaccinations > 1 ? 's' : ''}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#be123c', marginTop: '0.15rem' }}>
                You have vaccinations scheduled in the past that have not yet been marked as administered.
              </p>
            </div>
          </div>
          <Link to="/vaccines?status=overdue" className="btn btn-danger btn-sm" style={{ padding: '0.55rem 1rem' }}>
            View Overdue Vaccines
          </Link>
        </div>
      )}

      {/* 4 Database-Backed Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Syringe size={26} />
          </div>
          <div className="stat-meta">
            <span className="stat-value">{stats.totalVaccines}</span>
            <span className="stat-title">Total Vaccines</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-meta">
            <span className="stat-value">{stats.completedVaccinations}</span>
            <span className="stat-title">Completed Doses</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon upcoming">
            <Calendar size={26} />
          </div>
          <div className="stat-meta">
            <span className="stat-value">{stats.upcomingVaccinations}</span>
            <span className="stat-title">Upcoming Doses</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon overdue">
            <AlertCircle size={26} />
          </div>
          <div className="stat-meta">
            <span className="stat-value">{stats.overdueVaccinations}</span>
            <span className="stat-title">Overdue Doses</span>
          </div>
        </div>
      </div>

      {/* Completion Progress Bar */}
      {stats.totalVaccines > 0 && (
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Overall Immunization Progress
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {stats.completionRate}% Completed
            </span>
          </div>
          <div style={{ height: 10, width: '100%', background: 'var(--lavender-mid)', borderRadius: 20, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${stats.completionRate}%`,
                background: 'linear-gradient(90deg, var(--primary-500), #10b981)',
                borderRadius: 20,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Next Scheduled Vaccination Spotlight OR Empty State */}
      {stats.totalVaccines === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Syringe size={36} />
          </div>
          <h3 className="empty-title">No Vaccinations Scheduled Yet</h3>
          <p className="empty-desc">
            Your vaccination timeline is clear. Add your first planned or past vaccine to begin tracking doses, reminders, and health records.
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Schedule Your First Vaccine</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Spotlight Next Scheduled Vaccine */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff, var(--lavender-light))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Clock size={16} />
              <span>NEXT SCHEDULED APPOINTMENT</span>
            </div>

            {stats.nextScheduledVaccination ? (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {stats.nextScheduledVaccination.vaccineName}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  {stats.nextScheduledVaccination.targetDisease ? `Target: ${stats.nextScheduledVaccination.targetDisease} • ` : ''}
                  Dose {stats.nextScheduledVaccination.doseNumber} of {stats.nextScheduledVaccination.totalDoses}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.5rem 0.85rem', background: '#fff', borderRadius: 12, border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Calendar size={16} color="var(--primary-600)" />
                    <span>
                      {new Date(stats.nextScheduledVaccination.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="badge badge-upcoming">Upcoming</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setSelectedVaccineForComplete(stats.nextScheduledVaccination)}
                    className="btn btn-success btn-sm"
                    style={{ flex: 1 }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Completed</span>
                  </button>
                  <Link to={`/vaccines`} className="btn btn-secondary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem 0' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  No upcoming appointments pending. All current vaccinations are up to date!
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '1rem' }}
                >
                  <Plus size={16} />
                  <span>Add Next Booster</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Schedule Overview */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Vaccinations</h3>
              <Link to="/vaccines" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentVaccines.map((v) => (
                <div
                  key={v._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    background: 'var(--lavender-light)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {v.vaccineName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Dose {v.doseNumber}/{v.totalDoses} • {new Date(v.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge badge-${v.status}`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Medical Disclaimer Note */}
      <div className="disclaimer-banner">
        <ShieldCheck size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Clinical Note:</strong> Vaxio is a personal immunization tracking tool and does not replace medical advice. Always consult your certified pediatrician or physician regarding recommended schedules.
        </span>
      </div>

      {/* Modals */}
      <VaccineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveVaccine}
      />

      <CompleteModal
        isOpen={Boolean(selectedVaccineForComplete)}
        onClose={() => setSelectedVaccineForComplete(null)}
        onComplete={handleCompleteVaccine}
        vaccine={selectedVaccineForComplete}
      />
    </div>
  );
};
