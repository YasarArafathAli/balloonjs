import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import './App.css';

type GameState = 'home' | 'playing';

interface GameConfig {
  mode: 'easy' | 'medium' | 'hard';
}

function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({ mode: 'easy' });

  const handleStartGame = (mode: 'easy' | 'medium' | 'hard') => {
    setGameConfig({ mode });
    setGameState('playing');
  };

  const handleGameEnd = () => {
    setGameState('home');
  };

  return (
    <div className="App">
      {gameState === 'home' && (
        <Home onStartGame={handleStartGame} />
      )}
      {gameState === 'playing' && (
        <Game 
          mode={gameConfig.mode} 
          onGameEnd={handleGameEnd}
        />
      )}
    </div>
  );
}

export default App;