export type CloudColor = 'yellow' | 'red' | 'blue' | 'violet' | 'green';
export type GameMode = 'easy' | 'medium' | 'hard';

export interface CloudContent {
  text: string;
  typedText: string;
  isCompleted: boolean;
  isDistraction?: boolean; // True for distraction clouds that don't count
}
