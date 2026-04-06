import { useRef, useState, useCallback } from 'react';
import './TiltCard.css';

export default function TiltCard({ children, className = '', intensity = 15, glare = true, ...props }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`);

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
        opacity: 1,
      });
    }
  }, [intensity, glare]);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Touch support for mobile
  const handleTouchMove = useCallback((e) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -(intensity * 0.5);
    const rotateY = ((x - centerX) / centerX) * (intensity * 0.5);

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  }, [intensity]);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${isHovered ? 'tilt-card--hovered' : ''} ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      {...props}
    >
      {children}
      {glare && <div className="tilt-card__glare" style={glareStyle} />}
    </div>
  );
}
