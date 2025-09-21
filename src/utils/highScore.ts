// High Score Management Utility
export interface HighScore {
  score: number;
  mode: 'easy' | 'medium' | 'hard';
  date: string;
}

const HIGH_SCORE_KEY = 'balloon-mania-high-scores';

// Get all high scores from localStorage
export function getHighScores(): HighScore[] {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading high scores:', error);
    return [];
  }
}

// Get high score for a specific mode
export function getHighScoreForMode(mode: 'easy' | 'medium' | 'hard'): number {
  const highScores = getHighScores();
  const modeHighScore = highScores.find(hs => hs.mode === mode);
  return modeHighScore ? modeHighScore.score : 0;
}

// Save a new high score
export function saveHighScore(score: number, mode: 'easy' | 'medium' | 'hard'): boolean {
  try {
    const highScores = getHighScores();
    const modeHighScore = highScores.find(hs => hs.mode === mode);
    
    if (!modeHighScore || score > modeHighScore.score) {
      // Update or add new high score
      const newHighScore: HighScore = {
        score,
        mode,
        date: new Date().toISOString()
      };
      
      const updatedHighScores = highScores.filter(hs => hs.mode !== mode);
      updatedHighScores.push(newHighScore);
      
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(updatedHighScores));
      return true; // New high score!
    }
    
    return false; // Not a new high score
  } catch (error) {
    console.error('Error saving high score:', error);
    return false;
  }
}

// Clear all high scores (for testing purposes)
export function clearHighScores(): void {
  localStorage.removeItem(HIGH_SCORE_KEY);
}
