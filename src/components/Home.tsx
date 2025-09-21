import React, { useEffect, useState } from 'react';
import { getHighScoreForMode } from '../utils/highScore';
import './Home.css';

interface HomeProps {
  onStartGame: (mode: 'easy' | 'medium' | 'hard') => void;
  refreshTrigger?: number; // Used to trigger high score refresh
}

const Home: React.FC<HomeProps> = ({ onStartGame, refreshTrigger }) => {
  const [highScores, setHighScores] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });

  useEffect(() => {
    // Load high scores when component mounts or refreshTrigger changes
    setHighScores({
      easy: getHighScoreForMode('easy'),
      medium: getHighScoreForMode('medium'),
      hard: getHighScoreForMode('hard')
    });
  }, [refreshTrigger]);

  return (
    <div className="home">
      <h1>
        <span className="bal">Cloud</span> <span className="mania">Typer</span>
      </h1>
      <p>
       Type the letters or words on the clouds before they drift away. 
       Complete the text to clear the cloud and score points!
      </p>

    
      <div className="btns">
        <button className="btn" onClick={() => onStartGame('easy')}>
          Easy - Single Letters
        </button>
        <button className="btn" onClick={() => onStartGame('medium')}>
          Medium - 3-4 Letter Words
        </button>
        <button className="btn" onClick={() => onStartGame('hard')}>
          Hard - 5+ Letter Words
        </button>
      </div>
      <div className="high-scores">
        <h3>High Scores</h3>
        <div className="score-board">
          <div className="score-item">
            <span className="mode">Easy:</span>
            <span className="highscore">{highScores.easy}</span>
          </div>
          <div className="score-item">
            <span className="mode">Medium:</span>
            <span className="highscore">{highScores.medium}</span>
          </div>
          <div className="score-item">
            <span className="mode">Hard:</span>
            <span className="highscore">{highScores.hard}</span>
          </div>
        </div>
      </div>

      {/* <div className="game-info">
        <div className="info controls">
          <h4>How To Play</h4>
          <hr />
          <p>
            Type the letters or words on the clouds before they drift away. 
            Complete the text to clear the cloud and score points!
          </p>
        </div>
        <div className="info howtoplay">
          <h4>Controls</h4>
          <hr />
          <p>
            • Type letters/words using your keyboard<br/>
            • Press ESC to pause/resume<br/>
            • Game ends when you miss 5 clouds
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
