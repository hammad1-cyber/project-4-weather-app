import React from 'react';

const R = 26;
const CIRC = 2 * Math.PI * R;

export default function StatDial({ label, value, unit, pct, icon: Icon }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = CIRC - (clamped / 100) * CIRC;

  return (
    <div className="stat-dial">
      <div className="stat-dial-ring">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <circle cx="32" cy="32" r={R} fill="none" stroke="var(--line)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={R} fill="none" stroke="var(--amber)" strokeWidth="4"
            strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"
            transform="rotate(-90 32 32)"
          />
        </svg>
        <Icon size={16} strokeWidth={1.8} className="stat-dial-icon" />
      </div>
      <div className="stat-dial-body">
        <span className="stat-dial-value mono">{value}<span className="stat-dial-unit">{unit}</span></span>
        <span className="stat-dial-label mono">{label}</span>
      </div>
    </div>
  );
}
