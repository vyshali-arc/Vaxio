import React from 'react';
import { Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#7c3aed' }}>
          <Shield size={18} />
          <span>Vaxio — Smart Vaccination Schedule Tracker</span>
        </div>
        <p style={{ maxWidth: '650px', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
          <strong>Medical Notice:</strong> Vaxio is an organizational and tracking platform. It does not prescribe medical schedules or diagnosis. Please consult a qualified physician or healthcare provider for authorized medical guidance.
        </p>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Crafted with</span>
          <Heart size={14} color="#ec4899" fill="#ec4899" />
          <span>for Academic Submission • October 2026</span>
        </div>
      </div>
    </footer>
  );
};
