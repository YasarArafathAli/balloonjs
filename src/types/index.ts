export type BalloonColor = 'yellow' | 'red' | 'blue' | 'violet' | 'green';
export type GameMode = 'easy' | 'medium' | 'hard';

export interface BalloonContent {
  text: string;
  typedText: string;
  isCompleted: boolean;
  isDistraction?: boolean; // True for distraction balloons that don't count
}
