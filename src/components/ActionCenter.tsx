import React, { useState } from 'react';
import { ActionItem } from '../types/health';

interface ActionCenterProps {
  actions: ActionItem[];
  onToggle: (id: string) => void;
}

const PRI = {
  high:   { color: '#f87171', label: 'HIGH' },
  medium: { color: '#f59e0b', label: 'MED' },
  low:    { color: '#fbbf24', label: 'LOW' },
};

const ActionCenter: React.FC<ActionCenterProps> = ({ actions, onToggle }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('pending');

  const filtered = actions
    .filter(a => filter === 'all' ? true : filter === 'pending' ? !a.completed : a.completed)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  const done = actions.filter(a => a.completed).length;
  const pct = Math.round((done / actions.length) * 100);

  return (
    <div>
      {/* Progress */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.4)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
            TODAY'S PROTOCOL
          </span>
          <span style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>
            {done}/{actions.length}
          </span>
        </div>
        <div style={{ height: 3, background: 'rgba(255, 230, 200, 0.05)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`, borderRadius: 2,
            background: 'linear-gradient(90deg, #f59e0b, #34d399)',
            transition: 'width 0.6s ease-out',
          }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {(['all', 'pending', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 16px', borderRadius: 99,
            border: '1px solid', fontSize: 11, fontWeight: 500,
            borderColor: filter === f ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 220, 160, 0.08)',
            background: filter === f ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
            color: filter === f ? '#fde68a' : 'rgba(254, 243, 199, 0.4)',
            cursor: 'pointer', transition: 'all 0.2s ease',
            textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(254, 243, 199, 0.3)', fontSize: 13 }}>
            {filter === 'done' ? 'Completed items appear here' : '🎯 All tasks complete!'}
          </div>
        )}
        {filtered.map(action => {
          const p = PRI[action.priority];
          return (
            <div key={action.id} onClick={() => onToggle(action.id)} className="glass-sm glass-hover" style={{
              padding: '16px 20px', cursor: 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: 14,
              opacity: action.completed ? 0.4 : 1,
            }}>
              {/* Checkbox */}
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                border: `1.5px solid ${action.completed ? '#34d399' : 'rgba(245, 158, 11, 0.3)'}`,
                background: action.completed ? 'rgba(52,211,153,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                {action.completed && <svg width="10" height="8" viewBox="0 0 12 9"><path d="M1 4L4.5 7.5L11 1" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                    padding: '2px 8px', borderRadius: 4,
                    background: `${p.color}15`, color: p.color, letterSpacing: '0.06em',
                  }}>{p.label}</span>
                  <span style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.4)' }}>{action.domain}</span>
                </div>
                <div style={{
                  fontSize: 13, color: action.completed ? 'rgba(254, 243, 199, 0.3)' : '#fef3c7',
                  textDecoration: action.completed ? 'line-through' : 'none',
                  lineHeight: 1.5,
                }}>{action.action}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionCenter;
