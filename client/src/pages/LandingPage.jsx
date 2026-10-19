import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  BellRing,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Next-Generation Healthcare Tracking</span>
        </div>

        <h1 className="hero-title">
          Stay Protected. <br />
          <span className="highlight">Stay on Schedule.</span>
        </h1>

        <p className="hero-subtitle">
          Vaxio empowers individuals and families to effortlessly track vaccination schedules, monitor upcoming doses, prevent overdue immunizations, and maintain tamper-proof health records.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            <span>Create Your Free Account</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <span>Sign In to Dashboard</span>
          </Link>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Engineered for Precision & Peace of Mind
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            A comprehensive, patient-centered vaccination tracking suite designed to keep you and your loved ones protected.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Calendar size={24} />
            </div>
            <h3 className="feature-title">Dynamic Scheduling</h3>
            <p className="feature-desc">
              Organize multi-dose vaccine series (Dose 1, Dose 2, Boosters) with automated timeline calculations and real-time status updates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <BellRing size={24} />
            </div>
            <h3 className="feature-title">Overdue Interventions</h3>
            <p className="feature-desc">
              Instantly identify missed or overdue vaccinations with priority color-coded alerts so you never lose immunity coverage.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Award size={24} />
            </div>
            <h3 className="feature-title">Verified Records Vault</h3>
            <p className="feature-desc">
              Store comprehensive administration logs including administering physicians, clinic facilities, and vaccine batch numbers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Lock size={24} />
            </div>
            <h3 className="feature-title">Strict Data Isolation</h3>
            <p className="feature-desc">
              Your health data is private. Built with secure JSON Web Tokens, bcrypt password encryption, and isolated database partitions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="card" style={{ padding: '3rem 2rem', marginBottom: '4rem', background: 'linear-gradient(135deg, #ffffff, var(--lavender-light))' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Simple & Transparent Workflow
          </span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem' }}>
            How Vaxio Keeps You On Track
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              1
            </div>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Register & Build Profile</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Sign up securely and save your personal details, emergency contact info, and blood group.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              2
            </div>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Schedule Your Vaccinations</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Add planned doses or boosters with their target disease categories and scheduled dates.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              3
            </div>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Record Administration</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Once received, mark as completed to archive batch numbers, clinic details, and practitioner logs.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              4
            </div>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Instant Health History</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Access full verified records anytime for school admissions, international travel, or doctor visits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', background: 'linear-gradient(135deg, var(--lavender-mid), var(--lavender-light))' }}>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--primary-900)' }}>
          Ready to take control of your immunization timeline?
        </h2>
        <p style={{ color: 'var(--primary-800)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 2rem' }}>
          Join Vaxio today. It takes less than 30 seconds to schedule your first vaccination dose.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
          Start Tracking Now
        </Link>
      </section>
    </div>
  );
};
