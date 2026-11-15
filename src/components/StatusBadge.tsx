import React from 'react';
import { HealthStatus } from '../types/health';

interface StatusBadgeProps {
  status: HealthStatus;
  size?: 'sm' | 'md';
  label?: string;
}

const CFG = {
  nominal:  { text: 'NOMINAL',  color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
  warning:  { text: 'WARNING',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  critical: { text: 'CRITICAL', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
  unknown:  { text: 'UNKNOWN',  color: '#a8a29e', bg: 'rgba(168,162,158,0.08)', border: 'rgba(168,162,158,0.15)' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', label }) => {
  const c = CFG[status] || CFG.unknown;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '3px 10px' : '4px 12px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 99,
      fontSize: size === 'sm' ? 9 : 10,
      fontFamily: 'JetBrains Mono, monospace',
      fontWeight: 600, color: c.color,
      letterSpacing: '0.06em',
      userSelect: 'none',
    }}>
      <span style={{
        width: size === 'sm' ? 5 : 6, height: size === 'sm' ? 5 : 6,
        borderRadius: '50%', background: c.color, flexShrink: 0,
        boxShadow: `0 0 6px ${c.color}`,
      }} />
      {label || c.text}
    </span>
  );
};

export default StatusBadge;
