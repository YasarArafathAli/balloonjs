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
  top: number;
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
  const modeRef = useRef(mode);
  const isPausedRef = useRef(isPaused);
  
  const colors: BalloonColor[] = ['yellow', 'red', 'blue', 'violet', 'green'];

  // Update refs when values change
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Reusable function to create cloud spawning intervals
  const createBalloonInterval = useCallback((intervalMs: number, isDistraction: boolean = false) => {
    return setInterval(() => {
      if (!isPausedRef.current) {
        if (isDistraction) {
          // Distraction cloud logic
          if (Math.random() < 0.6) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomPos = Math.round((Math.random() * 0.85 + 0.05) * 100); // Vertical position (0-100vh)
            const content: BalloonContent = {
              text: '',
              typedText: '',
              isCompleted: false,
              isDistraction: true
            };
            setBalloons(prev => {
              const newBalloon = {
                id: balloonIdRef.current++,
                color: randomColor,
                top: randomPos,
                content
              };
              return [...prev, newBalloon];
            });
          }
        } else {
          // Regular cloud logic
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomPos = Math.round((Math.random() * 0.85 + 0.05) * 100); // Vertical position (0-100vh)
          const text = generateContent(modeRef.current);
          const content: BalloonContent = {
            text,
            typedText: '',
            isCompleted: false,
            isDistraction: false
          };
          setBalloons(prev => [...prev, {
            id: balloonIdRef.current++,
            color: randomColor,
            top: randomPos,
            content
          }]);
        }
      }
    }, intervalMs);
  }, [colors]);

  // Function to create cloud spawning intervals based on game mode
  const createModeIntervals = useCallback(() => {
    const intervals: number[] = [];
    
    if (mode === 'easy') {
      intervals.push(createBalloonInterval(1200)); // 1.2 seconds - much faster spawning
      intervals.push(createBalloonInterval(1800)); // 1.8 seconds - much faster spawning
    } else if (mode === 'medium') {
      intervals.push(createBalloonInterval(1000)); // 1 second - much faster spawning
      intervals.push(createBalloonInterval(1500)); // 1.5 seconds - much faster spawning
    } else { // hard mode
      intervals.push(createBalloonInterval(800)); // 0.8 seconds - very fast spawning
      intervals.push(createBalloonInterval(1200)); // 1.2 seconds - very fast spawning
      intervals.push(createBalloonInterval(1500)); // 1.5 seconds - very fast spawning
    }

    // Add distraction cloud intervals
    intervals.push(createBalloonInterval(800, true)); // 0.8 seconds - very fast spawning
    intervals.push(createBalloonInterval(1200, true)); // 1.2 seconds - very fast spawning

    return intervals;
  }, [mode, createBalloonInterval]);



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
    
    // Clear existing intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    
    // Restart spawning with current mode using reusable function
    intervalsRef.current = createModeIntervals();
  }, [mode, createModeIntervals]);

  const handleGoHome = useCallback(() => {
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    onGameEnd();
  }, [onGameEnd]);

  useEffect(() => {
    // Always clear existing intervals first
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    
    // Create intervals using the reusable function
    intervalsRef.current = createModeIntervals();
    
    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval));
    };
  }, [mode, createModeIntervals]); // Run when mode changes


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
          top={balloon.top}
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

export default Game;