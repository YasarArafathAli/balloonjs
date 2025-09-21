# Balloon Mania - Typing Game 🎈⌨️

A fun typing game where you pop balloons by typing letters and words! Migrated from vanilla JavaScript to React 19 with Vite and transformed into an engaging typing experience.

## Features

- **Three Difficulty Modes**: Easy (single letters), Medium (3-4 letter words), Hard (5+ letter words)
- **Typing-Based Gameplay**: Type the exact letters/words displayed on balloons to pop them
- **Real-time Balloon Spawning**: Balloons appear at random positions across the screen
- **Visual Typing Feedback**: See your progress as you type with highlighted text
- **Score Tracking**: Track your score and missed balloons with visual warnings
- **Beautiful Background**: Custom background image with enhanced UI contrast
- **Responsive Design**: Works perfectly on mobile and desktop devices
- **Modern React Architecture**: Built with React 19, TypeScript, and Vite

## Game Rules

### How to Play
- Type the letters or words displayed on balloons before they disappear
- Complete the full text to pop the balloon and score points
- Use your keyboard to type - no clicking required!

### Difficulty Levels
- **Easy Mode**: Single letters (A-Z) - Score 20 points to win
- **Medium Mode**: 3-4 letter words (CAT, DOG, SUN, etc.) - Score 15 points to win  
- **Hard Mode**: 5+ letter words (HOUSE, LIGHT, ADVENTURE, etc.) - Score 10 points to win

### Game Over Conditions
- Miss 5 balloons and you lose
- Each completed balloon gives you 1 point
- Reach the target score to win!

## Technology Stack

- **React 19** - Latest React with new features and improved performance
- **TypeScript** - Full type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and development server
- **CSS3** - Modern styling with animations and responsive design
- **Custom Word Generator** - Intelligent word/letter generation system
- **Keyboard Event Handling** - Real-time typing detection and validation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the provided local URL (usually http://localhost:5173/)

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Balloon.tsx      # Individual balloon component with text display
│   ├── Balloon.css      # Balloon styles with text overlay
│   ├── Game.tsx         # Main game logic with keyboard input handling
│   ├── Game.css         # Game container styles with background
│   ├── GameOver.tsx     # Game over modal component
│   ├── GameOver.css     # Modal styles
│   ├── Home.tsx         # Home screen with difficulty selection
│   └── Home.css         # Home screen styles with background
├── utils/
│   └── wordGenerator.ts # Word and letter generation for different modes
├── types/
│   └── index.ts         # TypeScript type definitions
├── assets/
│   └── background.jpg   # Game background image
├── App.tsx              # Main app component with routing
├── App.css              # Global app styles
└── main.tsx             # Application entry point

public/
└── assets/
    ├── images/          # Balloon images (red, blue, green, yellow, violet)
    └── sounds/          # Background music and sound effects
```

## Key Features & Improvements

### 🎮 Gameplay Transformation
- **From Click-to-Pop to Typing Game**: Completely transformed from mouse-clicking to keyboard typing
- **Three Difficulty Modes**: Easy (letters), Medium (short words), Hard (long words)
- **Real-time Typing Feedback**: Visual progress tracking as you type
- **Smart Word Generation**: Intelligent word/letter selection for each difficulty level

### 🎨 Visual Enhancements
- **Custom Background**: Beautiful background image with enhanced UI contrast
- **Text Overlay System**: Clear text display on balloons with progress indicators
- **Responsive Design**: Optimized for both mobile and desktop experiences
- **Enhanced Typography**: Improved fonts and text shadows for better readability

### ⚡ Technical Improvements
- **React 19 Migration**: Latest React features and performance improvements
- **TypeScript Integration**: Full type safety across the entire codebase
- **Modern Architecture**: Component-based design with proper separation of concerns
- **Performance Optimized**: Efficient rendering and memory management
- **Keyboard Event Handling**: Real-time input detection and validation

## Development Features

The project showcases modern React development patterns:
- **Functional Components with Hooks**: useState, useEffect, useCallback, useRef
- **TypeScript Interfaces**: Comprehensive type definitions for game state
- **Component-Scoped Styling**: CSS modules with proper encapsulation
- **Custom Utilities**: Word generation and game logic utilities
- **Event Management**: Proper cleanup of intervals and event listeners
- **State Management**: Efficient state updates and re-rendering optimization

## Game Mechanics

### Balloon Spawning
- **Random Positioning**: Balloons spawn at random horizontal positions (5%-90% of screen width)
- **Mode-Specific Timing**: Different spawn intervals for each difficulty level
- **Smooth Animation**: Continuous upward movement with variable speeds

### Typing System
- **Character-by-Character Matching**: Real-time validation of typed input
- **Progress Tracking**: Visual feedback showing typed vs. target text
- **Completion Detection**: Automatic balloon popping when text is complete
- **Error Handling**: Graceful handling of incorrect keystrokes

### Scoring System
- **Point Accumulation**: 1 point per completed balloon
- **Missed Balloon Tracking**: Visual counter with warning animations
- **Win/Lose Conditions**: Target scores and missed balloon limits per mode

## Contributing

This project demonstrates modern React development practices and can serve as a learning resource for:
- React 19 features and best practices
- TypeScript integration in React applications
- Game development with React
- Component architecture and state management
- CSS styling and responsive design

## License

This project is open source and available under the MIT License.