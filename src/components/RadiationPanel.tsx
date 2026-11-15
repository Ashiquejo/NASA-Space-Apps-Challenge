import React from 'react';
import { RadiationData } from '../types/health';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RadiationPanelProps {
  data: RadiationData;
}

const RadiationPanel: React.FC<RadiationPanelProps> = ({ data }) => {
  const pct = data.percentUsed;
  const color = pct > 60 ? '#f87171' : pct > 30 ? '#f59e0b' : '#34d399';
  const circ = 2 * Math.PI * 52;
  const offset = circ - (circ * pct) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Gauge + Stats */}
      <div className="glass" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 40 }}>
        {/* SVG gauge */}
        <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
          <svg width="130" height="130" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255, 230, 200, 0.05)" strokeWidth="8" />
            <circle cx="60" cy="60" r="52" fill="none"
              stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1.2s ease-out', filter: `drop-shadow(0 0 8px ${color}50)` }}
            />
            <text x="60" y="56" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontSize="18" fontWeight="700" fill={color}>
              {pct.toFixed(1)}%
            </text>
            <text x="60" y="72" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(254, 243, 199, 0.35)">
              CAREER LIMIT
            </text>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4, letterSpacing: '0.06em' }}>
              TOTAL ACCUMULATED
            </div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 700, color }}>
              {data.totalDose.toFixed(1)} <span style={{ fontSize: 14, color: 'rgba(254, 243, 199, 0.35)' }}>mGy</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'DAILY RATE', value: `${data.dailyDose} mGy/d`, color: '#f59e0b' },
              { label: 'GCR', value: `${data.galacticCosmicRays.toFixed(1)} mGy`, color: '#fbbf24' },
              { label: 'SOLAR EVENTS', value: `${data.solarParticleEvents.toFixed(1)} mGy`, color: '#d97706' },
              { label: 'REMAINING', value: `${(data.limit - data.totalDose).toFixed(0)} mGy`, color: '#34d399' },
            ].map(item => (
              <div key={item.label} className="glass-sm" style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 8, color: 'rgba(254, 243, 199, 0.3)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4, letterSpacing: '0.06em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass" style={{ padding: 24 }}>
        <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16, letterSpacing: '0.06em' }}>
          CUMULATIVE DOSE OVER MISSION
        </div>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="radGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day"
                tick={{ fontSize: 9, fill: 'rgba(254, 243, 199, 0.3)' }}
                axisLine={{ stroke: 'rgba(255, 220, 160, 0.08)' }} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: 'rgba(254, 243, 199, 0.3)' }}
                axisLine={false} tickLine={false} width={35}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(28, 22, 17, 0.95)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 10,
                  fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#fef3c7',
                }}
                labelFormatter={v => `Day ${v}`}
                formatter={(v: number) => [`${v.toFixed(1)} mGy`, '']}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill="url(#radGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RadiationPanel;
