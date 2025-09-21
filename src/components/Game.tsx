import React, { useState, useEffect, useCallback, useRef } from 'react';
import Cloud from './Cloud';
import GameOver from './GameOver';
import type { CloudColor, GameMode, CloudContent } from '../types';
import { generateContent } from '../utils/wordGenerator';
import { saveHighScore } from '../utils/highScore';
import './Game.css';

interface CloudData {
  id: number;
  color: CloudColor;
  top: number;
  content: CloudContent;
}

interface GameProps {
  mode: GameMode;
  onGameEnd: () => void;
}

const Game: React.FC<GameProps> = ({ mode, onGameEnd }) => {
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [clouds, setClouds] = useState<CloudData[]>([]);
  const [won, setWon] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const cloudIdRef = useRef(0);
  const intervalsRef = useRef<number[]>([]);
  const processedMissedClouds = useRef<Set<number>>(new Set());
  const modeRef = useRef(mode);
  const isPausedRef = useRef(isPaused);
  

  // Update refs when values change
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Reusable function to create cloud spawning intervals
  const createCloudInterval = useCallback((intervalMs: number, isDistraction: boolean = false) => {
    const colors: CloudColor[] = ['yellow', 'red', 'blue', 'violet', 'green'];
    return setInterval(() => {
      if (!isPausedRef.current) {
        if (isDistraction) {
          // Distraction cloud logic
          if (Math.random() < 0.6) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomPos = Math.round((Math.random() * 0.85 + 0.05) * 100); // Vertical position (0-100vh)
            const content: CloudContent = {
              text: '',
              typedText: '',
              isCompleted: false,
              isDistraction: true
            };
            setClouds(prev => {
              const newCloud = {
                id: cloudIdRef.current++,
                color: randomColor,
                top: randomPos,
                content
              };
              return [...prev, newCloud];
            });
          }
        } else {
          // Regular cloud logic
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomPos = Math.round((Math.random() * 0.85 + 0.05) * 100); // Vertical position (0-100vh)
          const text = generateContent(modeRef.current);
          const content: CloudContent = {
            text,
            typedText: '',
            isCompleted: false,
            isDistraction: false
          };
          setClouds(prev => [...prev, {
            id: cloudIdRef.current++,
            color: randomColor,
            top: randomPos,
            content
          }]);
        }
      }
    }, intervalMs);
  }, []);

  // Function to create cloud spawning intervals based on game mode
  const createModeIntervals = useCallback(() => {
    const intervals: number[] = [];
    
    if (mode === 'easy') {
      intervals.push(createCloudInterval(1200)); // 1.2 seconds - much faster spawning
      intervals.push(createCloudInterval(1800)); // 1.8 seconds - much faster spawning
    } else if (mode === 'medium') {
      intervals.push(createCloudInterval(1000)); // 1 second - much faster spawning
      intervals.push(createCloudInterval(1500)); // 1.5 seconds - much faster spawning
    } else { // hard mode
      intervals.push(createCloudInterval(800)); // 0.8 seconds - very fast spawning
      intervals.push(createCloudInterval(1200)); // 1.2 seconds - very fast spawning
      intervals.push(createCloudInterval(1500)); // 1.5 seconds - very fast spawning
    }

    // Add distraction cloud intervals
    intervals.push(createCloudInterval(800, true)); // 0.8 seconds - very fast spawning
    intervals.push(createCloudInterval(1200, true)); // 1.2 seconds - very fast spawning

    return intervals;
  }, [createCloudInterval, mode]);



  const handleCloudPop = useCallback((id: number) => {
    setClouds(prev => prev.filter(cloud => cloud.id !== id));
    setScore(prev => prev + 1);
  }, []);

  const handleCloudMiss = useCallback((id: number) => {
    console.log('Cloud miss called for ID:', id);
    
    // Use a more robust approach to prevent double counting
    setClouds(prev => {
      // Check if we've already processed this cloud
      if (processedMissedClouds.current.has(id)) {
        console.log('Cloud ID', id, 'already processed, skipping');
        return prev; // Return unchanged state
      }
      
      const cloudIndex = prev.findIndex(b => b.id === id);
      if (cloudIndex === -1) {
        console.log('Cloud not found, already removed');
        return prev; // Cloud already removed, don't count as missed
      }
      
      // Mark this cloud as processed BEFORE doing anything else
      processedMissedClouds.current.add(id);
      
      const cloud = prev[cloudIndex];
      const shouldCountAsMissed = cloud && !cloud.content.isDistraction;
      
      console.log('Cloud found at index:', cloudIndex, 'Should count as missed:', shouldCountAsMissed);
      
      // Update missed count if this cloud should count
      if (shouldCountAsMissed) {
        setMissed(prevMissed => {
          console.log('Updating missed count from', prevMissed, 'to', prevMissed + 1);
          return prevMissed + 1;
        });
      }
      
      // Remove the cloud from the array
      return prev.filter(cloud => cloud.id !== id);
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
    
    // Update clouds with typed text (skip distraction clouds)
    setClouds(prev => prev.map(cloud => {
      if (cloud.content.isCompleted || cloud.content.isDistraction) return cloud;
      
      const { text, typedText } = cloud.content;
      const expectedChar = text[typedText.length];
      
      if (key === expectedChar) {
        const newTypedText = typedText + key;
        const isCompleted = newTypedText === text;
        
        if (isCompleted) {
          // Pop the cloud after a short delay
          setTimeout(() => {
            setClouds(current => current.filter(b => b.id !== cloud.id));
            setScore(current => current + 1);
          }, 100);
        }
        
        return {
          ...cloud,
          content: {
            ...cloud.content,
            typedText: newTypedText,
            isCompleted
          }
        };
      }
      
      return cloud;
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
    
    // Game only ends when missed clouds reach 5 (losing condition)
    // No winning condition based on score anymore
    setWon(false);
    setShowGameOver(true);
  }, [score, mode]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setMissed(0);
    setClouds([]);
    setWon(false);
    setShowGameOver(false);
    setIsPaused(false);
    cloudIdRef.current = 0;
    processedMissedClouds.current.clear(); // Clear the processed clouds set
    
    // Clear existing intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    
    // Restart spawning with current mode using reusable function
    intervalsRef.current = createModeIntervals();
  }, [createModeIntervals]);

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
  }, [createModeIntervals]); // Run when mode changes


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
      
      {clouds.map(cloud => (
        <Cloud
          key={cloud.id}
          color={cloud.color}
          top={cloud.top}
          content={cloud.content}
          onPop={() => handleCloudPop(cloud.id)}
          onMiss={() => handleCloudMiss(cloud.id)}
          isPaused={isPaused}
          gameMode={mode}
          cloudId={cloud.id}
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