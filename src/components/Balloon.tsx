import React, { useEffect, useRef } from 'react';
import './Balloon.css';
import type { BalloonColor, BalloonContent } from '../types';

interface BalloonProps {
  color: BalloonColor;
  top: number;
  content: BalloonContent;
  onPop: () => void;
  onMiss: () => void;
  isPaused: boolean;
  gameMode: 'easy' | 'medium' | 'hard';
  balloonId: number;
}

const Balloon: React.FC<BalloonProps> = ({ color, top, content, onPop, onMiss, isPaused, gameMode, balloonId }) => {
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

    let position = 100; // Start from right side (100vw)
    // Adjust speed based on game mode (reduced by 30%)
    let baseSpeed = 0.21; // 0.3 * 0.7 = 0.21
    if (gameMode === 'medium') {
      baseSpeed = 0.245; // 0.35 * 0.7 = 0.245
    } else if (gameMode === 'hard') {
      baseSpeed = 0.315; // 0.45 * 0.7 = 0.315 (Faster movement in hard mode)
    }
    const randomSpeed = Math.random() * 0.21 + baseSpeed; // 0.3 * 0.7 = 0.21
    const animationInterval = setInterval(() => {
      // Don't move cloud or trigger miss when paused
      if (isPaused) return;
      
      if (position <= -40) {
        clearInterval(animationInterval);
        console.log('Cloud reached left edge, calling onMiss for cloud ID:', balloonId);
        onMissRef.current();
      } else {
        position -= randomSpeed;
        balloon.style.left = `${position}vw`;
      }
    }, 10);

    return () => clearInterval(animationInterval);
  }, [isPaused, gameMode, balloonId]); // Add balloonId to dependency array

  return (
    <div
      ref={balloonRef}
      className={`balloon balloon-${color} ${content.isDistraction ? 'distraction' : ''}`}
      style={{ top: `${top}vh` }}
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
