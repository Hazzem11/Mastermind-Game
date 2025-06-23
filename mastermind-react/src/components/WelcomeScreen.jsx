import React from 'react';

export default function WelcomeScreen({
  playerName,
  setPlayerName,
  difficulty,
  setDifficulty,
  onStart
}) {
  return (
    <div className="welcome-screen screen">
      <h1>Mastermind Game</h1>
      <div className="difficulty-group">
        <label>
          <input
            type="radio"
            name="difficulty"
            value="easy"
            checked={difficulty === 'easy'}
            onChange={() => setDifficulty('easy')}
          /> Easy
        </label>
        <label>
          <input
            type="radio"
            name="difficulty"
            value="medium"
            checked={difficulty === 'medium'}
            onChange={() => setDifficulty('medium')}
          /> Medium
        </label>
        <label>
          <input
            type="radio"
            name="difficulty"
            value="hard"
            checked={difficulty === 'hard'}
            onChange={() => setDifficulty('hard')}
          /> Hard
        </label>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
        />
        <button onClick={onStart} disabled={!playerName.trim()}>
          Start Game
        </button>
      </div>
    </div>
  );
}