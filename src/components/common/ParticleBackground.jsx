import { useMemo } from 'react';
import './ParticleBackground.css';

export default function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 12,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * -20,
      opacity: 0.03 + Math.random() * 0.06,
      color: i % 3 === 0
        ? 'rgba(56, 189, 248, VAR_OPACITY)'   // cyan
        : i % 3 === 1
        ? 'rgba(129, 140, 248, VAR_OPACITY)'  // indigo
        : 'rgba(52, 211, 153, VAR_OPACITY)',   // emerald
    }));
  }, []);

  return (
    <div className="particle-bg" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle-bg__orb"
          style={{
            width: p.size + 'px',
            height: p.size + 'px',
            left: p.x + '%',
            top: p.y + '%',
            background: p.color.replace('VAR_OPACITY', p.opacity),
            boxShadow: `0 0 ${p.size * 3}px ${p.color.replace('VAR_OPACITY', p.opacity * 2)}`,
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}

      {/* Large gradient orbs for depth */}
      <div className="particle-bg__gradient-orb particle-bg__gradient-orb--1" />
      <div className="particle-bg__gradient-orb particle-bg__gradient-orb--2" />
      <div className="particle-bg__gradient-orb particle-bg__gradient-orb--3" />
    </div>
  );
}
