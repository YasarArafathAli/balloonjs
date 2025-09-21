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
  gameMode: 'easy' | 'medium' | 'hard';
  balloonId: number;
}

const Balloon: React.FC<BalloonProps> = ({ color, left, content, onPop, onMiss, isPaused, gameMode, balloonId }) => {
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
    // Adjust speed based on game mode
    let baseSpeed = 0.3;
    if (gameMode === 'medium') {
      baseSpeed = 0.35;
    } else if (gameMode === 'hard') {
      baseSpeed = 0.45; // Faster balloons in hard mode
    }
    const randomSpeed = Math.random() * 0.3 + baseSpeed;
    const animationInterval = setInterval(() => {
      // Don't move balloon or trigger miss when paused
      if (isPaused) return;
      
      if (position <= -40) {
        clearInterval(animationInterval);
        console.log('Balloon reached top, calling onMiss for balloon ID:', balloonId);
        onMissRef.current();
      } else {
        position -= randomSpeed;
        balloon.style.top = `${position}vh`;
      }
    }, 10);

    return () => clearInterval(animationInterval);
  }, [isPaused, gameMode]); // Add isPaused and gameMode to dependency array

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
