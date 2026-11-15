import React from 'react';
import { HealthDomain } from '../types/health';
import StatusBadge from './StatusBadge';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface DomainOverviewProps {
  domains: HealthDomain[];
  selectedDomain: string | null;
  onSelectDomain: (id: string) => void;
}

const STATUS_COLORS = {
  nominal: '#34d399', warning: '#f59e0b', critical: '#f87171', unknown: '#a8a29e',
};

const DomainOverview: React.FC<DomainOverviewProps> = ({ domains, selectedDomain, onSelectDomain }) => {
  const radarData = domains.map(d => ({ domain: d.name.split(' ')[0], score: 100 - d.riskScore }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Radar */}
      <div className="glass" style={{ padding: 24 }}>
        <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16, letterSpacing: '0.08em' }}>
          SYSTEM HEALTH RADAR
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(254, 243, 199, 0.08)" />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 9, fill: 'rgba(254, 243, 199, 0.45)' }} />
              <Radar dataKey="score" stroke="rgba(245, 158, 11, 0.7)" fill="rgba(245, 158, 11, 0.15)" strokeWidth={1.5}
                dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {domains.map(domain => {
          const isSelected = selectedDomain === domain.id;
          const color = STATUS_COLORS[domain.overallStatus];
          const healthPct = 100 - domain.riskScore;

          return (
            <div
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              className="glass-sm glass-hover"
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                borderColor: isSelected ? 'rgba(245, 158, 11, 0.35)' : undefined,
                background: isSelected ? 'rgba(245, 158, 11, 0.08)' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{domain.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fef3c7' }}>{domain.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.35)' }}>
                    {domain.metrics.length} indicators
                  </div>
                </div>
                <StatusBadge status={domain.overallStatus} size="sm" />
              </div>

              {/* Health bar */}
              <div style={{ height: 3, background: 'rgba(255, 230, 200, 0.05)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${healthPct}%`, borderRadius: 2,
                  background: `linear-gradient(90deg, ${color}60, ${color})`,
                  transition: 'width 0.8s ease-out',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DomainOverview;
