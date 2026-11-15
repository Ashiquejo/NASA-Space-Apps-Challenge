import React, { useState } from 'react';

interface SelfAssessmentFormProps {
  onComplete: (score: number, notes: string) => void;
}

const QUESTIONS = [
  { id: 'sl1', text: 'How well did you sleep last night?', category: 'Sleep' },
  { id: 'sl2', text: 'Did you feel rested upon waking?', category: 'Sleep' },
  { id: 'cg1', text: 'How focused and alert do you feel today?', category: 'Cognition' },
  { id: 'cg2', text: 'Any difficulty concentrating or memory lapses?', category: 'Cognition' },
  { id: 'md1', text: 'How would you rate your overall mood?', category: 'Mood' },
  { id: 'md2', text: 'Are you feeling motivated to perform duties?', category: 'Mood' },
  { id: 'md3', text: 'Have you felt anxious, irritable, or emotionally flat?', category: 'Mood' },
  { id: 'ph1', text: 'How is your energy during physical activity?', category: 'Physical' },
  { id: 'ph2', text: 'Any joint pain, back pain, or soreness?', category: 'Physical' },
  { id: 'ph3', text: 'Any headaches, vision changes, or dizziness?', category: 'Physical' },
  { id: 'im1', text: 'Any signs of illness (fever, rash, sore throat)?', category: 'Immune' },
  { id: 'im2', text: 'How is your appetite and digestion?', category: 'Immune' },
  { id: 'sc1', text: 'How is your relationship with crewmates?', category: 'Social' },
  { id: 'sc2', text: 'Do you feel supported by Mission Control?', category: 'Social' },
];

const CATS = Array.from(new Set(QUESTIONS.map(q => q.category)));

const CAT_COLORS: Record<string, string> = {
  Sleep: '#f59e0b', Cognition: '#fbbf24', Mood: '#d97706',
  Physical: '#34d399', Immune: '#f87171', Social: '#f97316',
};

const SelfAssessmentForm: React.FC<SelfAssessmentFormProps> = ({ onComplete }) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [group, setGroup] = useState(0);

  const cat = CATS[group];
  const qs = QUESTIONS.filter(q => q.category === cat);
  const allDone = QUESTIONS.every(q => responses[q.id] !== undefined);
  const isLast = group === CATS.length - 1;

  const handleSubmit = () => {
    const total = Object.values(responses).reduce((s, v) => s + v, 0);
    const pct = Math.round((total / (QUESTIONS.length * 5)) * 100);
    setSubmitted(true);
    onComplete(pct, notes);
  };

  if (submitted) {
    const total = Object.values(responses).reduce((s, v) => s + v, 0);
    const pct = Math.round((total / (QUESTIONS.length * 5)) * 100);
    const color = pct >= 70 ? '#34d399' : pct >= 50 ? '#f59e0b' : '#f87171';

    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 32, fontWeight: 700, color, marginBottom: 8 }}>
          {pct}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(254, 243, 199, 0.45)', marginBottom: 24 }}>Assessment Complete</div>
        <div className="glass-sm" style={{
          display: 'inline-block', padding: '12px 24px',
          fontSize: 13, color,
        }}>
          {pct >= 70 ? 'Status nominal. Continue protocols.' :
           pct >= 50 ? 'Needs attention. Review flagged areas.' :
           'Concerning. Contact medical team.'}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
        {CATS.map((c, i) => {
          const catDone = QUESTIONS.filter(q => q.category === c).every(q => responses[q.id] !== undefined);
          return (
            <button key={c} onClick={() => setGroup(i)} style={{
              padding: '5px 14px', borderRadius: 99, fontSize: 11, fontWeight: 500,
              border: `1px solid ${i === group ? CAT_COLORS[c] + '60' : catDone ? 'rgba(52,211,153,0.3)' : 'rgba(255,220,160,0.1)'}`,
              background: i === group ? `${CAT_COLORS[c]}20` : 'transparent',
              color: i === group ? CAT_COLORS[c] : catDone ? '#34d399' : 'rgba(254, 243, 199, 0.4)',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}>
              {catDone && '✓ '}{c}
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {qs.map(q => (
          <div key={q.id}>
            <div style={{ fontSize: 14, color: '#fef3c7', marginBottom: 10, lineHeight: 1.5 }}>{q.text}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(v => {
                const sel = responses[q.id] === v;
                const c = CAT_COLORS[q.category];
                return (
                  <button key={v} onClick={() => setResponses(p => ({ ...p, [q.id]: v }))}
                    style={{
                      flex: 1, padding: '12px 4px', borderRadius: 10,
                      border: `1px solid ${sel ? c + '80' : 'rgba(255,220,160,0.1)'}`,
                      background: sel ? `${c}25` : 'rgba(255,220,160,0.03)',
                      color: sel ? c : 'rgba(254, 243, 199, 0.4)',
                      fontSize: 15, fontWeight: sel ? 700 : 400,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      fontFamily: 'Orbitron, sans-serif',
                    }}
                  >{v}</button>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'rgba(254, 243, 199, 0.25)' }}>
              <span>Poor</span><span>Excellent</span>
            </div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
        <button
          onClick={() => setGroup(g => Math.max(0, g - 1))}
          disabled={group === 0}
          style={{
            padding: '8px 20px', borderRadius: 10, fontSize: 12,
            border: '1px solid rgba(255,220,160,0.1)', background: 'transparent',
            color: group === 0 ? 'rgba(254, 243, 199, 0.15)' : 'rgba(254, 243, 199, 0.5)',
            cursor: group === 0 ? 'not-allowed' : 'pointer',
          }}
        >← Back</button>

        {isLast ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Optional notes for medical team..."
              style={{
                width: '100%', height: 60, padding: '10px 14px', borderRadius: 12,
                background: 'rgba(255, 230, 200, 0.04)', border: '1px solid rgba(255, 220, 160, 0.1)',
                color: '#fef3c7', fontSize: 12, resize: 'none', outline: 'none',
              }}
            />
            <button onClick={handleSubmit} disabled={!allDone} style={{
              padding: '10px 28px', borderRadius: 10, border: 'none',
              background: allDone ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.05)',
              color: allDone ? '#0c0a08' : 'rgba(254, 243, 199, 0.3)',
              fontSize: 13, fontWeight: 700, cursor: allDone ? 'pointer' : 'not-allowed',
              fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.04em',
            }}>SUBMIT</button>
          </div>
        ) : (
          <button onClick={() => setGroup(g => Math.min(CATS.length - 1, g + 1))} style={{
            padding: '8px 20px', borderRadius: 10, fontSize: 12,
            border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.12)',
            color: '#fde68a', cursor: 'pointer', fontWeight: 600,
          }}>Next →</button>
        )}
      </div>
    </div>
  );
};

export default SelfAssessmentForm;
