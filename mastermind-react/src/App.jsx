import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameBoard from './components/GameBoard';
import GameOverScreen from './components/GameOverScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState('welcome');
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [gameState, setGameState] = useState(null);

  return (
    <div className="container">
      {screen === 'welcome' && (
        <WelcomeScreen
          playerName={playerName}
          setPlayerName={setPlayerName}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onStart={() => setScreen('game')}
        />
      )}
      {screen === 'game' && (
        <GameBoard
          playerName={playerName}
          difficulty={difficulty}
          onGameOver={result => {
            setGameState(result);
            setScreen('gameover');
          }}
        />
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          playerName={playerName}
          gameState={gameState}
          onPlayAgain={() => {
            setPlayerName('');
            setGameState(null);
            setScreen('welcome');
          }}
        />
      )}
    </div>
  );
}

export default App;