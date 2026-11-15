import React, { useState, useEffect, useCallback } from 'react';
import Starfield from './components/Starfield';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import AlertsPanel from './components/AlertsPanel';
import ActionCenter from './components/ActionCenter';
import SelfAssessmentForm from './components/SelfAssessmentForm';
import RadiationPanel from './components/RadiationPanel';
import DomainOverview from './components/DomainOverview';
import StatusBadge from './components/StatusBadge';
import {
  healthDomains,
  astronautProfile,
  activeAlerts as initialAlerts,
  actionItems as initialActions,
  radiationData,
} from './data/nasaHealthData';
import { Alert, ActionItem, HealthDomain } from './types/health';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from 'recharts';

type TabId = 'dashboard' | 'domains' | 'alerts' | 'actions' | 'assess' | 'radiation';

const STATUS_COLORS = {
  nominal: '#34d399', warning: '#f59e0b', critical: '#f87171', unknown: '#a8a29e',
};

/* ─── Section Title ─── */
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="fade-in-up">
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 20, fontWeight: 700, color: '#fef3c7', margin: 0, letterSpacing: '0.02em' }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: 13, color: 'rgba(254, 243, 199, 0.45)', margin: '6px 0 0', lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

/* ─── Dashboard ─── */
const DashboardView: React.FC<{
  domains: HealthDomain[];
  onSelectDomain: (id: string, tab: TabId) => void;
}> = ({ domains, onSelectDomain }) => {
  const allMetrics = domains.flatMap(d => d.metrics);
  const nominal = allMetrics.filter(m => m.status === 'nominal').length;
  const warning = allMetrics.filter(m => m.status === 'warning').length;
  const critical = allMetrics.filter(m => m.status === 'critical').length;

  const riskData = domains.map(d => ({ name: d.name.split(' ')[0], risk: d.riskScore }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'INDICATORS', value: allMetrics.length, color: '#f59e0b' },
          { label: 'NOMINAL', value: nominal, color: '#34d399' },
          { label: 'WARNING', value: warning, color: '#fbbf24' },
          { label: 'CRITICAL', value: critical, color: '#f87171' },
        ].map(item => (
          <div key={item.label} className="glass" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 32, fontWeight: 700, color: item.color,
              lineHeight: 1, marginBottom: 8,
            }}>{item.value}</div>
            <div style={{ fontSize: 9, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Risk chart */}
        <div className="glass" style={{ padding: 28 }}>
          <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 20, letterSpacing: '0.06em' }}>
            DOMAIN RISK SCORES
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} barSize={32}>
                <CartesianGrid stroke="rgba(255, 220, 160, 0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(254, 243, 199, 0.35)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'rgba(254, 243, 199, 0.3)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(28, 22, 17, 0.95)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 10,
                    fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#fef3c7',
                  }}
                  formatter={(v: number) => [v, 'Risk']}
                />
                <Bar dataKey="risk" fill="rgba(245, 158, 11, 0.65)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health timeline */}
        <div className="glass" style={{ padding: 28 }}>
          <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.35)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 20, letterSpacing: '0.06em' }}>
            HEALTH INDEX OVER MISSION
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { day: 0, score: 95 }, { day: 20, score: 90 }, { day: 40, score: 86 },
                { day: 60, score: 83 }, { day: 80, score: 78 }, { day: 100, score: 75 },
                { day: 120, score: 72 }, { day: 142, score: 71 },
              ]}>
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255, 220, 160, 0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'rgba(254, 243, 199, 0.35)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 9, fill: 'rgba(254, 243, 199, 0.3)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(28, 22, 17, 0.95)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 10,
                    fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#fef3c7',
                  }}
                  labelFormatter={v => `Day ${v}`}
                  formatter={(v: number) => [v, 'Health']}
                />
                <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={1.5} fill="url(#hg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domain cards */}
      <div>
        <div style={{ fontSize: 10, color: 'rgba(254, 243, 199, 0.3)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16, letterSpacing: '0.06em' }}>
          HEALTH DOMAINS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {domains.map(domain => {
            const color = STATUS_COLORS[domain.overallStatus];
            const topMetric = domain.metrics.find(m => m.status !== 'nominal') || domain.metrics[0];
            return (
              <div
                key={domain.id}
                onClick={() => onSelectDomain(domain.id, 'domains')}
                className="glass glass-hover"
                style={{ padding: 24, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{domain.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fef3c7' }}>{domain.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(254, 243, 199, 0.35)' }}>{domain.metrics.length} indicators</div>
                    </div>
                  </div>
                  <StatusBadge status={domain.overallStatus} size="sm" />
                </div>

                {/* Risk bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ height: 3, background: 'rgba(255, 230, 200, 0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${domain.riskScore}%`, borderRadius: 2,
                      background: `linear-gradient(90deg, rgba(52,211,153,0.4), ${color})`,
                    }} />
                  </div>
                </div>

                {/* Flagged metric */}
                {topMetric && topMetric.status !== 'nominal' && (
                  <div style={{ fontSize: 12, color: 'rgba(254, 243, 199, 0.55)', lineHeight: 1.5 }}>
                    <span style={{ color }}>{topMetric.name}:</span>{' '}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fef3c7' }}>
                      {typeof topMetric.value === 'number' && topMetric.value % 1 !== 0 ? topMetric.value.toFixed(2) : topMetric.value} {topMetric.unit}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Source note */}
      <div className="glass-sm" style={{ padding: '14px 20px', fontSize: 10, color: 'rgba(254, 243, 199, 0.35)', lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace' }}>
        📡 NASA HRP Evidence Reports (2020–2024) · Scott Kelly Twins Study (2019) · NCRP Report 132
      </div>
    </div>
  );
};

/* ─── Domains Detail ─── */
const DomainsView: React.FC<{
  domains: HealthDomain[];
  selectedDomain: string | null;
  onSelectDomain: (id: string) => void;
}> = ({ domains, selectedDomain, onSelectDomain }) => {
  const active = domains.find(d => d.id === selectedDomain) || domains[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' }}>
      <DomainOverview domains={domains} selectedDomain={active?.id || null} onSelectDomain={onSelectDomain} />

      <div>
        {active && (
          <>
            {/* Domain header */}
            <div className="glass" style={{ padding: '24px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{active.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 17, fontWeight: 700, color: '#fef3c7' }}>
                    {active.name}
                  </div>
                  <StatusBadge status={active.overallStatus} size="sm" />
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(254, 243, 199, 0.45)', margin: 0, lineHeight: 1.6 }}>
                {active.description}
              </p>
            </div>

            {/* Metric grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {active.metrics.map(m => <MetricCard key={m.id} metric={m} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── App ─── */
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedDomain, setSelectedDomain] = useState<string>('cardiovascular');
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleAck = useCallback((id: string) => {
    setAlerts(p => p.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  const handleToggle = useCallback((id: string) => {
    setActions(p => p.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  }, []);

  const handleSelectDomain = useCallback((id: string, tab?: TabId) => {
    setSelectedDomain(id);
    if (tab) setActiveTab(tab);
  }, []);

  const handleAssess = useCallback((_score: number, _notes: string) => {}, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#0c0a08' }}>
      <Starfield count={80} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header
          profile={astronautProfile}
          currentTime={currentTime}
          activeTab={activeTab}
          onTabChange={t => setActiveTab(t as TabId)}
        />

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 80px' }}>
          {activeTab === 'dashboard' && (
            <Section title="Mission Overview" subtitle="Real-time health summary across all monitored domains">
              <DashboardView domains={healthDomains} onSelectDomain={handleSelectDomain} />
            </Section>
          )}

          {activeTab === 'domains' && (
            <Section title="Health Domains" subtitle="Drill into individual health indicators and their trends">
              <DomainsView domains={healthDomains} selectedDomain={selectedDomain} onSelectDomain={setSelectedDomain} />
            </Section>
          )}

          {activeTab === 'alerts' && (
            <Section title="Alerts" subtitle={`${alerts.filter(a => !a.acknowledged).length} unacknowledged alerts requiring attention`}>
              <div style={{ maxWidth: 700 }}>
                <AlertsPanel alerts={alerts} onAcknowledge={handleAck} />
              </div>
            </Section>
          )}

          {activeTab === 'actions' && (
            <Section title="Daily Protocol" subtitle="Prescribed countermeasures for today's mission schedule">
              <div className="glass" style={{ maxWidth: 620, padding: 28 }}>
                <ActionCenter actions={actions} onToggle={handleToggle} />
              </div>
            </Section>
          )}

          {activeTab === 'assess' && (
            <Section title="Self-Assessment" subtitle="Weekly health questionnaire adapted from NASA HRP behavioral protocols">
              <div className="glass" style={{ maxWidth: 580, padding: 32 }}>
                <SelfAssessmentForm onComplete={handleAssess} />
              </div>
            </Section>
          )}

          {activeTab === 'radiation' && (
            <Section title="Radiation Monitor" subtitle="Dose tracking against NCRP Report 132 occupational career limits">
              <div style={{ maxWidth: 700 }}>
                <RadiationPanel data={radiationData} />
              </div>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
