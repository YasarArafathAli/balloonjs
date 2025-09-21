// Word and letter generation for different game modes

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const easyWords = [
  'CAT', 'DOG', 'SUN', 'MOON', 'TREE', 'CAR', 'HAT', 'BAG', 'CUP', 'PEN',
  'BALL', 'BOOK', 'FISH', 'BIRD', 'CAKE', 'GAME', 'JUMP', 'WALK', 'RUN', 'PLAY'
];

const mediumWords = [
  'HOUSE', 'LIGHT', 'WATER', 'MUSIC', 'DANCE', 'SMART', 'QUICK', 'BRAVE', 'PEACE', 'DREAM',
  'HAPPY', 'POWER', 'MAGIC', 'STORM', 'OCEAN', 'FOREST', 'GARDEN', 'WINTER', 'SUMMER', 'SPRING'
];

const hardWords = [
  'ADVENTURE', 'BEAUTIFUL', 'CREATIVITY', 'ELEPHANT', 'FANTASTIC', 'GENEROUS', 'HAPPINESS', 'IMAGINATION',
  'JOURNEY', 'KNOWLEDGE', 'LEADERSHIP', 'MYSTERIOUS', 'NATURE', 'OPPORTUNITY', 'PASSIONATE', 'QUESTION',
  'REVOLUTION', 'SUNSHINE', 'TREASURE', 'UNIVERSAL', 'VICTORY', 'WONDERFUL', 'EXCELLENCE', 'YESTERDAY', 'ZEBRA'
];

export const generateContent = (mode: 'easy' | 'medium' | 'hard'): string => {
  switch (mode) {
    case 'easy':
      // Single letters
      return letters[Math.floor(Math.random() * letters.length)];
    
    case 'medium':
      // 3-4 letter words
      return easyWords[Math.floor(Math.random() * easyWords.length)];
    
    case 'hard': {
      // 5+ letter words
      const hardWordList = [...mediumWords, ...hardWords];
      return hardWordList[Math.floor(Math.random() * hardWordList.length)];
    }
    
    default:
      return letters[Math.floor(Math.random() * letters.length)];
  }
};
