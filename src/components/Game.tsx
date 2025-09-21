import React, { useState, useEffect, useCallback, useRef } from 'react';
import Balloon from './Balloon';
import GameOver from './GameOver';
import type { BalloonColor, GameMode, BalloonContent } from '../types';
import { generateContent } from '../utils/wordGenerator';
import { saveHighScore } from '../utils/highScore';
import './Game.css';

interface BalloonData {
  id: number;
  color: BalloonColor;
  left: number;
  content: BalloonContent;
}

interface GameProps {
  mode: GameMode;
  onGameEnd: () => void;
}

const Game: React.FC<GameProps> = ({ mode, onGameEnd }) => {
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [won, setWon] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const balloonIdRef = useRef(0);
  const intervalsRef = useRef<number[]>([]);
  const processedMissedBalloons = useRef<Set<number>>(new Set());
  
  const colors: BalloonColor[] = ['yellow', 'red', 'blue', 'violet', 'green'];

  const createRegularBalloon = useCallback(() => {
    if (isPaused) return; // Don't create balloons when paused
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Generate random position with better distribution across screen
    // Using Math.random() * 0.85 + 0.05 to get positions from 5% to 90%
    // This ensures balloons are well distributed and don't clip at screen edges
    const randomPos = Math.round((Math.random() * 0.85 + 0.05) * 100);
    
    // Regular balloon with text
    const text = generateContent(mode);
    const content: BalloonContent = {
      text,
      typedText: '',
      isCompleted: false,
      isDistraction: false
    };
    
    setBalloons(prev => [...prev, {
      id: balloonIdRef.current++,
      color: randomColor,
      left: randomPos,
      content
    }]);
  }, [colors, mode, isPaused]);

  const createDistractionBalloon = useCallback(() => {
    if (isPaused) return; // Don't create balloons when paused
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Generate random position with better distribution across screen
    const randomPos = Math.round((Math.random() * 0.85 + 0.05) * 100);
    
    // Distraction balloon - empty, no text
    const content: BalloonContent = {
      text: '',
      typedText: '',
      isCompleted: false,
      isDistraction: true
    };
    
    console.log('Creating distraction balloon:', { randomColor, randomPos, content });
    
    setBalloons(prev => [...prev, {
      id: balloonIdRef.current++,
      color: randomColor,
      left: randomPos,
      content
    }]);
  }, [colors, isPaused]);

  const startBalloonSpawning = useCallback(() => {
    // Clear any existing intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];

    // Regular balloon spawning intervals
    if (mode === 'easy') {
      const interval1 = setInterval(createRegularBalloon, 2000);
      intervalsRef.current = [interval1];
    } else if (mode === 'medium') {
      const interval1 = setInterval(createRegularBalloon, 2500);
      intervalsRef.current = [interval1];
    } else {
      // Hard mode: faster spawning and overlapping balloons
      const interval1 = setInterval(createRegularBalloon, 1500); // Reduced from 3000ms to 1500ms
      const interval2 = setInterval(createRegularBalloon, 2000); // Additional interval for overlapping balloons
      intervalsRef.current = [interval1, interval2];
    }

    // Independent distraction balloon spawning
    // Distraction balloons spawn every 3 seconds with random chance
    const distractionInterval = setInterval(() => {
      console.log('Distraction balloon check - random number:', Math.random());
      // 100% chance to spawn a distraction balloon each check (for testing)
      if (Math.random() < 1.0) {
        console.log('Spawning distraction balloon!');
        createDistractionBalloon();
      } else {
        console.log('No distraction balloon this time');
      }
    }, 3000);
    intervalsRef.current.push(distractionInterval);
    
    console.log('Started distraction balloon spawning (30% chance every 3 seconds)');
  }, [mode, createRegularBalloon, createDistractionBalloon]);

  const handleBalloonPop = useCallback((id: number) => {
    setBalloons(prev => prev.filter(balloon => balloon.id !== id));
    setScore(prev => prev + 1);
  }, []);

  const handleBalloonMiss = useCallback((id: number) => {
    console.log('Balloon miss called for ID:', id);
    
    // Use a more robust approach to prevent double counting
    setBalloons(prev => {
      // Check if we've already processed this balloon
      if (processedMissedBalloons.current.has(id)) {
        console.log('Balloon ID', id, 'already processed, skipping');
        return prev; // Return unchanged state
      }
      
      const balloonIndex = prev.findIndex(b => b.id === id);
      if (balloonIndex === -1) {
        console.log('Balloon not found, already removed');
        return prev; // Balloon already removed, don't count as missed
      }
      
      // Mark this balloon as processed BEFORE doing anything else
      processedMissedBalloons.current.add(id);
      
      const balloon = prev[balloonIndex];
      const shouldCountAsMissed = balloon && !balloon.content.isDistraction;
      
      console.log('Balloon found at index:', balloonIndex, 'Should count as missed:', shouldCountAsMissed);
      
      // Update missed count if this balloon should count
      if (shouldCountAsMissed) {
        setMissed(prevMissed => {
          console.log('Updating missed count from', prevMissed, 'to', prevMissed + 1);
          return prevMissed + 1;
        });
      }
      
      // Remove the balloon from the array
      return prev.filter(balloon => balloon.id !== id);
    });
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Handle ESC key for pause/resume
    if (event.key === 'Escape') {
      togglePause();
      return;
    }

    // Don't process typing when paused
    if (isPaused) return;

    const key = event.key.toUpperCase();
    
    // Update balloons with typed text (skip distraction balloons)
    setBalloons(prev => prev.map(balloon => {
      if (balloon.content.isCompleted || balloon.content.isDistraction) return balloon;
      
      const { text, typedText } = balloon.content;
      const expectedChar = text[typedText.length];
      
      if (key === expectedChar) {
        const newTypedText = typedText + key;
        const isCompleted = newTypedText === text;
        
        if (isCompleted) {
          // Pop the balloon after a short delay
          setTimeout(() => {
            setBalloons(current => current.filter(b => b.id !== balloon.id));
            setScore(current => current + 1);
          }, 100);
        }
        
        return {
          ...balloon,
          content: {
            ...balloon.content,
            typedText: newTypedText,
            isCompleted
          }
        };
      }
      
      return balloon;
    }));
  }, [isPaused, togglePause]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const endGame = useCallback(() => {
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    
    // Save high score
    saveHighScore(score, mode);
    
    // Game only ends when missed balloons reach 5 (losing condition)
    // No winning condition based on score anymore
    setWon(false);
    setShowGameOver(true);
  }, [score, mode]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setMissed(0);
    setBalloons([]);
    setWon(false);
    setShowGameOver(false);
    setIsPaused(false);
    balloonIdRef.current = 0;
    processedMissedBalloons.current.clear(); // Clear the processed balloons set
    startBalloonSpawning();
  }, [startBalloonSpawning]);

  const handleGoHome = useCallback(() => {
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    onGameEnd();
  }, [onGameEnd]);

  useEffect(() => {
    startBalloonSpawning();
    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval));
    };
  }, [startBalloonSpawning]);

  useEffect(() => {
    if (missed >= 5) {
      endGame();
    }
  }, [missed, endGame]);

  return (
    <div className="game-container">
      <div className="score">
        <p>Your score is <span>{score}</span></p>
        <p>Missed: <span className={missed >= 3 ? 'warning' : ''}>{missed}</span>/5</p>
        {isPaused && <p className="pause-indicator">PAUSED</p>}
        <button className="exit-btn" onClick={handleGoHome}>
          ← Exit
        </button>
      </div>
      
      {balloons.map(balloon => (
        <Balloon
          key={balloon.id}
          color={balloon.color}
          left={balloon.left}
          content={balloon.content}
          onPop={() => handleBalloonPop(balloon.id)}
          onMiss={() => handleBalloonMiss(balloon.id)}
          isPaused={isPaused}
          gameMode={mode}
          balloonId={balloon.id}
        />
      ))}
      
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-message">
            <h2>GAME PAUSED</h2>
            <p>Press ESC to resume</p>
          </div>
        </div>
      )}
      
      <GameOver
        isVisible={showGameOver}
        won={won}
        score={score}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />
    </div>
  );
};

export 