import React from 'react';
import { AstronautProfile } from '../types/health';

interface HeaderProps {
  profile: AstronautProfile;
  currentTime: Date;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

const TABS = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'domains', label: 'Health Domains' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'actions', label: 'Actions' },
  { id: 'assess', label: 'Self-Assess' },
  { id: 'radiation', label: 'Radiation' },
];

const Header: React.FC<HeaderProps> = ({ profile, currentTime, onTabChange, activeTab }) => {
  const progressPct = (profile.missionDay / profile.missionDuration) * 100;
  const scoreColor = profile.overallHealthScore >= 80 ? '#34d399' : profile.overallHealthScore >= 60 ? '#f59e0b' : '#f87171';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(14, 11, 9, 0.75)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderBottom: '1px solid rgba(255, 220, 160, 0.05)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', gap: 32,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(180, 83, 9, 0.15))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15,
          }}>🚀</div>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 700, color: '#fef3c7', letterSpacing: '0.06em' }}>
              ASTROHEALTH
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Mission info pill */}
        <div className="glass-sm" style={{
          padding: '8px 20px',
          display: 'flex', alignItems: 'center', gap: 20,
          borderRadius: 99,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>CREW</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fde68a' }}>{profile.name.split(' ').pop()}</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255, 200, 120, 0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>DAY</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fef3c7', fontFamily: 'Orbitron, sans-serif' }}>{profile.missionDay}</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255, 200, 120, 0.08)' }} />
          <div style={{ minWidth: 80 }}>
            <div style={{ height: 3, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progressPct}%`, borderRadius: 2,
                background: 'linear-gradient(90deg, #f59e0b, #d97706)',
              }} />
            </div>
            <div style={{ fontSize: 8, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', marginTop: 3, textAlign: 'center' }}>
              {profile.missionDuration - profile.missionDay}d left
            </div>
          </div>
        </div>

        {/* Health score */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 16px',
          background: `${scoreColor}10`,
          border: `1px solid ${scoreColor}30`,
          borderRadius: 99,
        }}>
          <span style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 700, color: scoreColor,
          }}>{profile.overallHealthScore}</span>
          <span style={{ fontSize: 9, color: 'rgba(254, 243, 199, 0.35)' }}>/100</span>
        </div>

        {/* Clock */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(254, 243, 199, 0.5)',
            letterSpacing: '0.1em',
          }}>
            {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 32px 0',
        display: 'flex', gap: 4,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #f59e0b' : '2px solid transparent',
              borderRadius: '8px 8px 0 0',
              color: activeTab === tab.id ? '#fef3c7' : 'rgba(254, 243, 199, 0.35)',
              fontSize: 12, fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
