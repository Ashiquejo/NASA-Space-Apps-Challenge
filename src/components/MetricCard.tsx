import React from 'react';
import { HealthMetric } from '../types/health';
import StatusBadge from './StatusBadge';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

interface MetricCardProps {
  metric: HealthMetric;
}

const COLOR_MAP = {
  nominal: '#34d399',
  warning: '#f59e0b',
  critical: '#f87171',
  unknown: '#a8a29e',
};

const TREND = {
  improving: { icon: '↑', color: '#34d399' },
  stable: { icon: '→', color: '#fbbf24' },
  declining: { icon: '↓', color: '#f87171' },
  fluctuating: { icon: '~', color: '#f59e0b' },
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string | number;
}

const TT: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(28, 22, 17, 0.95)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 10,
      padding: '8px 12px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
    }}>
      <div style={{ color: 'rgba(254, 243, 199, 0.45)', marginBottom: 2 }}>Day {label}</div>
      <div style={{ color: '#fef3c7', fontWeight: 600 }}>{payload[0].value.toFixed(2)}</div>
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const color = COLOR_MAP[metric.status];
  const trend = TREND[metric.trend];
  const change = metric.baselineValue !== 0
    ? ((metric.value - metric.baselineValue) / metric.baselineValue * 100).toFixed(1)
    : '0.0';
  const changeNum = parseFloat(change);

  return (
    <div className="glass glass-hover" style={{ padding: 24, cursor: 'default' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.3)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4, letterSpacing: '0.08em' }}>
            {metric.id.toUpperCase()}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fef3c7' }}>{metric.name}</div>
        </div>
        <StatusBadge status={metric.status} size="sm" />
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
        <span style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 700, color,
          lineHeight: 1,
        }}>
          {typeof metric.value === 'number' && metric.value % 1 !== 0 ? metric.value.toFixed(2) : metric.value}
        </span>
        <span style={{ fontSize: 12, color: 'rgba(254, 243, 199, 0.35)' }}>{metric.unit}</span>
        <span style={{
          marginLeft: 'auto', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          color: trend.color, display: 'flex', alignItems: 'center', gap: 3,
        }}>
          {trend.icon} {changeNum > 0 ? '+' : ''}{change}%
        </span>
      </div>

      {/* Range bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', height: 4, background: 'rgba(255, 230, 200, 0.05)', borderRadius: 2 }}>
          <div style={{
            position: 'absolute', height: '100%', borderRadius: 2,
            left: 0, width: `${Math.max(0, Math.min(100, ((metric.value - metric.min) / (metric.max - metric.min)) * 100))}%`,
            background: color, opacity: 0.7,
            transition: 'width 1s ease-out',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 9, color: 'rgba(254, 243, 199, 0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
            Baseline: {metric.baselineValue}
          </span>
          <span style={{ fontSize: 9, color: 'rgba(254, 243, 199, 0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
            {metric.max} {metric.unit}
          </span>
        </div>
      </div>

      {/* Trend chart */}
      {metric.history.length > 2 && (
        <div style={{ height: 60, marginBottom: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metric.history}>
              <XAxis dataKey="day" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip content={<TT />} />
              <ReferenceLine y={metric.baselineValue} stroke="rgba(254, 243, 199, 0.1)" strokeDasharray="4 4" />
              <Line
                type="monotone" dataKey="value"
                stroke={color} strokeWidth={1.5} strokeOpacity={0.8}
                dot={false} activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Description */}
      <p style={{ fontSize: 11, color: 'rgba(254, 243, 199, 0.45)', lineHeight: 1.6, margin: 0 }}>
        {metric.description}
      </p>
    </div>
  );
};

export default MetricCard;
