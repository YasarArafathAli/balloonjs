import React, { useEffect, useRef } from 'react';
import './Cloud.css';
import type { CloudColor, CloudContent } from '../types';

interface CloudProps {
  color: CloudColor;
  top: number;
  content: CloudContent;
  onPop: () => void;
  onMiss: () => void;
  isPaused: boolean;
  gameMode: 'easy' | 'medium' | 'hard';
  cloudId: number;
}

const Cloud: React.FC<CloudProps> = ({ color, top, content, onPop, onMiss, isPaused, gameMode, cloudId }) => {
  // onPop is kept for interface compatibility but not used (typing-based gameplay)
  const cloudRef = useRef<HTMLDivElement>(null);
  const onMissRef = useRef(onMiss);

  // Update the ref when onMiss changes
  useEffect(() => {
    onMissRef.current = onMiss;
  }, [onMiss]);

  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) return;

    let position = 100; // Start from right side (100vw)
    // Set initial position
    cloud.style.left = `${position}vw`;
    
    // Adjust speed based on game mode (much slower for clear word visibility)
    let baseSpeed = 0.2; // Much slower for clear reading
    if (gameMode === 'medium') {
      baseSpeed = 0.25;
    } else if (gameMode === 'hard') {
      baseSpeed = 0.3; // Slightly faster in hard mode
    }
    const randomSpeed = Math.random() * 0.05 + baseSpeed; // Minimal variation
    
    const animationInterval = setInterval(() => {
      // Don't move cloud or trigger miss when paused
      if (isPaused) return;
      
      if (position <= -40) {
        clearInterval(animationInterval);
        console.log('Cloud reached left edge, calling onMiss for cloud ID:', cloudId);
        onMissRef.current();
      } else {
        position -= randomSpeed;
        cloud.style.left = `${position}vw`;
      }
    }, 16); // ~60fps for smoother animation

    return () => clearInterval(animationInterval);
  }, [isPaused, gameMode, cloudId]); // Add cloudId to dependency array

  return (
    <div
      ref={cloudRef}
      className={`cloud cloud-${color} ${content.isDistraction ? 'distraction' : ''}`}
      style={{ top: `${top}vh` }}
    >
      {!content.isDistraction && (
        <div className="cloud-text">
          <div className="cloud-target">{content.text}</div>
          <div className="cloud-typed">{content.typedText}</div>
        </div>
      )}
    </div>
  );
};

export default Cloud;
