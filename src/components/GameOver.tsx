import React from 'react';
import './GameOver.css';

interface GameOverProps {
  isVisible: boolean;
  won: boolean;
  score: number;
  onRestart: () => void;
  onGoHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ 
  isVisible, 
  won, 
  score, 
  onRestart, 
  onGoHome 
}) => {
  if (!isVisible) return null;

  return (
    <div className="shadow">
      <div className="block">
        <div className={`wrapper ${won ? 'win' : 'lose'}`}>
          <h4>Game Over!</h4>
          <img 
            src={won ? '/assets/images/happy.png' : '/assets/images/sad.png'} 
            alt={won ? 'happy' : 'sad'} 
          />
          <h4>Your score is <span>{score}</span></h4>
          <p>Try to beat your high score!</p>
          <button className="btn restart" onClick={onRestart}>
            Restart
          </button>
          <button className="btn gohome" onClick={onGoHome}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
