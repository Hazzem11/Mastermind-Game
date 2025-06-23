import React, { useState, useEffect } from 'react';

const DIFFICULTY_SETTINGS = {
  easy: {
    colors: ['RED', 'YELLOW', 'BLUE', 'GREEN', 'ORANGE', 'PINK', 'PURPLE'],
    slots: 3,
    maxGuesses: 10,
  },
  medium: {
    colors: ['RED', 'YELLOW', 'BLUE', 'GREEN', 'ORANGE', 'PINK', 'PURPLE', 'CYAN', 'SILVER', 'TEAL'],
    slots: 4,
    maxGuesses: 10,
  },
  hard: {
    colors: ['RED', 'YELLOW', 'BLUE', 'GREEN', 'ORANGE', 'PINK', 'PURPLE', 'CYAN', 'SILVER', 'TEAL', 'NAVY', 'BROWN', 'LIME'],
    slots: 5,
    maxGuesses: 10,
  },
};

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

const DEFAULT_MESSAGE = "The code has been generated. Start guessing by clicking on a color and selecting a slot.";

function getRandomCode(colors, slots) {
  const available = [...colors];
  const code = [];
  for (let i = 0; i < slots; i++) {
    const idx = Math.floor(Math.random() * available.length);
    code.push(available[idx]);
    available.splice(idx, 1);
  }
  return code;
}

export default function GameBoard({ playerName, difficulty, onGameOver }) {
  const { colors = [], slots = 0, maxGuesses = 10 } = DIFFICULTY_SETTINGS[difficulty] || {};
  const [code, setCode] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(Array(slots).fill(null));
  const [selectedColor, setSelectedColor] = useState(null);
  const [guessHistory, setGuessHistory] = useState([]);
  const [guessCount, setGuessCount] = useState(0);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    setCode(getRandomCode(colors, slots));
    setCurrentGuess(Array(slots).fill(null));
    setGuessHistory([]);
    setGuessCount(0);
    setMessage(DEFAULT_MESSAGE);
    // eslint-disable-next-line
  }, [playerName, difficulty]);

  function handleSlotClick(idx) {
    if (selectedColor === null) return;
    const newGuess = [...currentGuess];
    newGuess[idx] = selectedColor;
    setCurrentGuess(newGuess);
  }

  function handleColorClick(color) {
    setSelectedColor(color);
  }

  function handleSubmitGuess() {
    setMessage(DEFAULT_MESSAGE); // Reset to default before checking

    if (currentGuess.includes(null)) {
      setMessage(`Fill all ${slots} slots!`);
      return;
    }
    if (new Set(currentGuess).size !== slots) {
      setMessage('No duplicate colors allowed!');
      return;
    }
    const { black, white } = calculateScore(currentGuess, code);
    const newHistory = [
      { guess: [...currentGuess], black, white },
      ...guessHistory,
    ];
    setGuessHistory(newHistory);
    setGuessCount(guessCount + 1);

    if (black === slots) {
      onGameOver({ won: true, code, guessCount: guessCount + 1, guessHistory: newHistory });
      return;
    }
    if (guessCount + 1 >= maxGuesses) {
      onGameOver({ won: false, code, guessCount: guessCount + 1, guessHistory: newHistory });
      return;
    }
    setCurrentGuess(Array(slots).fill(null));
    setSelectedColor(null);
    // Message will be reset to default above
  }

  function calculateScore(guess, code) {
    let black = 0, white = 0;
    const codeCopy = [...code];
    const guessCopy = [...guess];
    for (let i = 0; i < codeCopy.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        black++;
        codeCopy[i] = null;
        guessCopy[i] = null;
      }
    }
    for (let i = 0; i < codeCopy.length; i++) {
      if (guessCopy[i] && codeCopy.includes(guessCopy[i])) {
        white++;
        codeCopy[codeCopy.indexOf(guessCopy[i])] = null;
      }
    }
    return { black, white };
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <h2 style={{ textAlign: 'center', width: '100%' }}>
          Welcome, {playerName}!
        </h2>
        <div id="message-box">{message}</div>
        <div className="game-info">
          <p>Guesses: {guessCount}/{maxGuesses}</p>
        </div>
      </div>
      {colors.length > 0 && (
        <div className="color-picker" style={{ maxWidth: 600, margin: '0 auto' }}>
          {colors.map(color => (
            <div
              key={color}
              className="color-option"
              data-color={color}
              style={{
                backgroundColor: COLOR_MAP[color],
                border: selectedColor === color ? '4px solid #fc575e' : undefined,
              }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      )}
      {slots > 0 && (
        <div className="guess-slots" style={{ maxWidth: 600, margin: '0 auto' }}>
          {currentGuess.map((color, idx) => (
            <div
              key={idx}
              className="guess-slot"
              style={{ backgroundColor: color ? COLOR_MAP[color] : '#fff' }}
              onClick={() => handleSlotClick(idx)}
              data-index={idx}
            />
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <button onClick={handleSubmitGuess}>Submit Guess</button>
      </div>
      <div className="guess-history">
        {guessHistory.map((entry, i) => (
          <div className="guess-row" key={i}>
            {entry.guess.map((color, idx) => (
              <div
                key={idx}
                className="history-guess-slot"
                style={{ backgroundColor: COLOR_MAP[color] }}
              />
            ))}
            <div className="feedback">
              {Array(entry.black).fill(0).map((_, i) => (
                <div key={'b'+i} className="feedback-dot black" />
              ))}
              {Array(entry.white).fill(0).map((_, i) => (
                <div key={'w'+i} className="feedback-dot white" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}