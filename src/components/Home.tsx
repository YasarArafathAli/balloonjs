import React from 'react';
import './Home.css';

interface HomeProps {
  onStartGame: (mode: 'easy' | 'medium' | 'hard') => void;
}

const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  return (
    <div className="home">
      <h1>
        <span className="bal">Balloon</span> <span className="mania">Mania</span>
      </h1>
      <p>
       Type the letters or words on the balloons before they vanish. 
       Complete the text to pop the balloon and score points!
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
      
      <div className="game-info">
        <div className="info controls">
          <h4>How To play</h4>
          <hr />
          <p>
            Type the letters or words on the balloons before they vanish. 
            Complete the text to pop the balloon and score points!
          </p>
        </div>
        <div className="info howtoplay">
          <h4>Controls</h4>
          <hr />
          <p>Type the letters/words on the balloons using your keyboard.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
