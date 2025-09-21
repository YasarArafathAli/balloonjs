import React, { useEffect, useRef } from 'react';
import './Balloon.css';
import type { BalloonColor, BalloonContent } from '../types';

interface BalloonProps {
  color: BalloonColor;
  left: number;
  content: BalloonContent;
  onPop: () => void;
  onMiss: () => void;
}

const Balloon: React.FC<BalloonProps> = ({ color, left, content, onPop, onMiss }) => {
  // onPop is kept for interface compatibility but not used (typing-based gameplay)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const balloonRef = useRef<HTMLDivElement>(null);
  const onMissRef = useRef(onMiss);

  // Update the ref when onMiss changes
  useEffect(() => {
    onMissRef.current = onMiss;
  }, [onMiss]);

  useEffect(() => {
    const balloon = balloonRef.current;
    if (!balloon) return;

    let position = 100;
    const randomSpeed = Math.random() * 0.3 + 0.3;
    const animationInterval = setInterval(() => {
      if (position <= -40) {
        clearInterval(animationInterval);
        onMissRef.current();
      } else {
        position -= randomSpeed;
        balloon.style.top = `${position}vh`;
      }
    }, 10);

    return () => clearInterval(animationInterval);
  }, []); // Empty dependency array - animation only runs once

  return (
    <div
      ref={balloonRef}
      className={`balloon balloon-${color}`}
      style={{ left: `${left}vw` }}
    >
      <div className="balloon-text">
        <div className="balloon-target">{content.text}</div>
        <div className="balloon-typed">{content.typedText}</div>
      </div>
    </div>
  );
};

export default Balloon;
