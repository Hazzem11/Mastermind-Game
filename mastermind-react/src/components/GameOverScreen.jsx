import React from 'react';

const COLOR_MAP = {
  RED: '#ff0000',
  YELLOW: '#ffd700',
  BLUE: '#0000ff',
  GREEN: '#008000',
  ORANGE: '#ffa500',
  PINK: '#ffc0cb',
  PURPLE: '#800080',
  CYAN: '#00ffff',
  SILVER: '#c0c0c0',
  TEAL: '#008080',
  NAVY: '#0e3249',
  BROWN: '#3e1c00',
  LIME: '#4eff45',
};

export default function GameOverScreen({ playerName, gameState, onPlayAgain }) {
  return (
    <div id="gameover-screen" className="screen">
      <h2 id="gameover-title">
        {gameState.won ? 'Congratulations!' : 'Game Over'}
      </h2>
      <p id="gameover-message" style={{ color: "#222" }}>
        {gameState.won
          ? `You won the game, ${playerName}, with ${gameState.guessCount} guesses!`
          : `Sorry ${playerName}, you lost the game after ${gameState.guessCount} guesses.`}
      </p>
      {!gameState.won && (
        <>
          <strong>The secret code was:</strong>
          <div className="code-reveal" style={{ marginTop: '1rem' }}>
            {gameState.code.map((color, idx) => (
              <div
                key={idx}
                className="code-reveal-slot"
                style={{
                  backgroundColor: COLOR_MAP[color],
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #222',
                  boxShadow: '2px 2px 0 #f7b42c',
                  display: 'inline-block',
                  marginRight: 8,
                }}
              />
            ))}
          </div>
        </>
      )}
      <br />
      <button id="play-again" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
}