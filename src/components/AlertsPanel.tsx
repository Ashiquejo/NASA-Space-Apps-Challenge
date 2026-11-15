import React from 'react';
import { Alert } from '../types/health';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

const SEV = {
  critical: { color: '#f87171', icon: '🔴', label: 'CRITICAL' },
  warning:  { color: '#f59e0b', icon: '🟡', label: 'WARNING' },
  info:     { color: '#fbbf24', icon: '🟠', label: 'INFO' },
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  const unack = alerts.filter(a => !a.acknowledged);
  const acked = alerts.filter(a => a.acknowledged);

  const timeAgo = (d: Date) => {
    const h = Math.floor((Date.now() - d.getTime()) / 3600000);
    return h > 0 ? `${h}h ago` : `${Math.floor((Date.now() - d.getTime()) / 60000)}m ago`;
  };

  const Item = ({ alert }: { alert: Alert }) => {
    const s = SEV[alert.severity];
    return (
      <div className="glass" style={{
        padding: '20px 24px',
        opacity: alert.acknowledged ? 0.45 : 1,
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: s.color, fontWeight: 600, letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(254, 243, 199, 0.45)', marginTop: 2 }}>
                {alert.domain} · {alert.metric}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
              {timeAgo(alert.timestamp)}
            </span>
            {!alert.acknowledged && (
              <button
                onClick={(e) => { e.stopPropagation(); onAcknowledge(alert.id); }}
                style={{
                  background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 8, color: '#fde68a', fontSize: 10, padding: '4px 12px',
                  cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(245, 158, 11, 0.2)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(245, 158, 11, 0.1)'; }}
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#fef3c7', margin: '0 0 16px', lineHeight: 1.6 }}>
          {alert.message}
        </p>

        {!alert.acknowledged && (
          <div className="glass-sm" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 9, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6, fontWeight: 600, letterSpacing: '0.06em' }}>
              RECOMMENDED ACTION
            </div>
            <p style={{ fontSize: 12, color: 'rgba(254, 243, 199, 0.65)', margin: 0, lineHeight: 1.6 }}>
              {alert.recommendation}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {unack.length === 0 && acked.length === 0 && (
        <div className="glass" style={{ textAlign: 'center', padding: 48, color: '#34d399' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
          All systems nominal
        </div>
      )}
      {unack.map(a => <Item key={a.id} alert={a} />)}
      {acked.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.3)', fontFamily: 'JetBrains Mono, monospace', marginTop: 12, letterSpacing: '0.06em' }}>
            ACKNOWLEDGED ({acked.length})
          </div>
          {acked.map(a => <Item key={a.id} alert={a} />)}
        </>
      )}
    </div>
  );
};

export default AlertsPanel;
