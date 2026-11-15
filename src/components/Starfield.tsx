import React, { useMemo } from 'react';

const Starfield: React.FC<{ count?: number }> = ({ count = 60 }) => {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3,
      duration: (Math.random() * 6 + 3).toFixed(1),
      delay: (Math.random() * 8).toFixed(1),
    })),
  [count]);

  return (
    <div className="ambient-bg" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default Starfield;
