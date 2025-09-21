import React, { useState, useEffect, useCallback, useRef } from 'react';
import Balloon from './Balloon';
import GameOver from './GameOver';
import type { BalloonColor, GameMode, BalloonContent } from '../types';
import { generateContent } from '../utils/wordGenerator';
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
  
  const balloonIdRef = useRef(0);
  const intervalsRef = useRef<number[]>([]);
  
  const colors: BalloonColor[] = ['yellow', 'red', 'blue', 'violet', 'green'];
  const targetScore = mode === 'easy' ? 20 : mode === 'medium' ? 15 : 10;

  const createBalloon = useCallback(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Generate random position with better distribution across screen
    // Using Math.random() * 0.85 + 0.05 to get positions from 5% to 90%
    // This ensures balloons are well distributed and don't clip at screen edges
    const randomPos = Math.round((Math.random() * 0.85 + 0.05) * 100);
    
    const text = generateContent(mode);
    
    setBalloons(prev => [...prev, {
      id: balloonIdRef.current++,
      color: randomColor,
      left: randomPos,
      content: {
        text,
        typedText: '',
        isCompleted: false
      }
    }]);
  }, [colors, mode]);

  const startBalloonSpawning = useCallback(() => {
    // Clear any existing intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];

    if (mode === 'easy') {
      const interval1 = setInterval(createBalloon, 2000);
      intervalsRef.current = [interval1];
    } else if (mode === 'medium') {
      const interval1 = setInterval(createBalloon, 2500);
      intervalsRef.current = [interval1];
    } else {
      const interval1 = setInterval(createBalloon, 3000);
      intervalsRef.current = [interval1];
    }
  }, [mode, createBalloon]);

  const handleBalloonPop = useCallback((id: number) => {
    setBalloons(prev => prev.filter(balloon => balloon.id !== id));
    setScore(prev => prev + 1);
  }, []);

  const handleBalloonMiss = useCallback((id: number) => {
    setBalloons(prev => prev.filter(balloon => balloon.id !== id));
    setMissed(prev => prev + 1);
  }, []);

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    
    // Update balloons with typed text
    setBalloons(prev => prev.map(balloon => {
      if (balloon.content.isCompleted) return balloon;
      
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
  }, []);

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
    
    if (score >= targetScore) {
      setWon(true);
    } else {
      setWon(false);
    }
    setShowGameOver(true);
  }, [score, targetScore]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setMissed(0);
    setBalloons([]);
    setWon(false);
    setShowGameOver(false);
    balloonIdRef.current = 0;
    startBalloonSpawning();
  }, [startBalloonSpawning]);

  const handleGoHome = useCallback(() => {
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    onGameEnd();
  }, [onGameEnd]);

  useEffect(() => {
    startBalloonSpawning();
  }, [startBalloonSpawning]);

  useEffect(() => {
    if (missed > 5 || score >= targetScore) {
      endGame();
    }
  }, [missed, score, targetScore, endGame]);

  return (
    <div className="game-container">
      <div className="score">
        <p>Your score is <span>{score}</span></p>
        <p>Missed: <span className={missed >= 3 ? 'warning' : ''}>{missed}</span>/5</p>
      </div>
      
      {balloons.map(balloon => (
        <Balloon
          key={balloon.id}
          color={balloon.color}
          left={balloon.left}
          content={balloon.content}
          onPop={() => handleBalloonPop(balloon.id)}
          onMiss={() => handleBalloonMiss(balloon.id)}
        />
      ))}
      
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
