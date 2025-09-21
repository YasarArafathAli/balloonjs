import React, { useEffect, useRef } from 'react';
import './Balloon.css';
import type { BalloonColor, BalloonContent } from '../types';

interface BalloonProps {
  color: BalloonColor;
  left: number;
  content: BalloonContent;
  onPop: () => void;
  onMiss: () => void;
  isPaused: boolean;
}

const Balloon: React.FC<BalloonProps> = ({ color, left, content, onPop, onMiss, isPaused }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // onPop is kept for interface compatibility but not used (typing-based gameplay)
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
      // Don't move balloon or trigger miss when paused
      if (isPaused) return;
      
      if (position <= -40) {
        clearInterval(animationInterval);
        onMissRef.current();
      } else {
        position -= randomSpeed;
        balloon.style.top = `${position}vh`;
      }
    }, 10);

    return () => clearInterval(animationInterval);
  }, [isPaused]); // Add isPaused to dependency array

  return (
    <div
      ref={balloonRef}
      className={`balloon balloon-${color} ${content.isDistraction ? 'distraction' : ''}`}
      style={{ left: `${left}vw` }}
    >
      {!content.isDistraction && (
        <div className="balloon-text">
          <div className="balloon-target">{content.text}</div>
          <div className="balloon-typed">{content.typedText}</div>
        </div>
      )}
    </div>
  );
};

export default Balloon;
