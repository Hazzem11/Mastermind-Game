class MastermindGame {
    constructor() {
        this.difficultySettings = {
            easy: {
                colors: ["RED", "YELLOW", "BLUE", "GREEN", "ORANGE", "PINK", "PURPLE"],
                slots: 3
            },
            medium: {
                colors: ["RED", "YELLOW", "BLUE", "GREEN", "ORANGE", "PINK", "PURPLE", "CYAN", "SILVER", "TEAL"],
                slots: 4
            },
            hard: {
                colors: ["RED", "YELLOW", "BLUE", "GREEN", "ORANGE", "PINK", "PURPLE", "CYAN", "SILVER", "TEAL", "NAVY", "BROWN", "LIME"],
                slots: 5
            }
        };
        this.colors = [];
        this.slots = 4;
        this.code = [];
        this.guessCount = 0;
        this.playerName = "";
        this.currentGuess = [];
        this.selectedColor = null;
        this.gameOver = false;
        this.difficulty = "medium";
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('play-again').addEventListener('click', () => this.resetGame());
    }

    renderColorPicker() {
        const colorPicker = document.querySelector('.color-picker');
        colorPicker.innerHTML = '';
        this.colors.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-option';
            div.dataset.color = color;
            div.style.backgroundColor = this.getColorValue(color);
            div.addEventListener('click', (e) => {
                if (this.gameOver) return;
                this.selectedColor = e.target.dataset.color;
                document.querySelectorAll('.color-option').forEach(opt => opt.style.border = '2px solid transparent');
                e.target.style.border = '2px solid #1a73e8';
            });
            colorPicker.appendChild(div);
        });
    }

    renderGuessSlots() {
        const guessSlots = document.querySelector('.guess-slots');
        guessSlots.innerHTML = '';
        for (let i = 0; i < this.slots; i++) {
            const div = document.createElement('div');
            div.className = 'guess-slot';
            div.dataset.index = i;
            div.addEventListener('click', (e) => {
                if (this.selectedColor && !this.gameOver) {
                    const index = parseInt(e.target.dataset.index);
                    this.currentGuess[index] = this.selectedColor;
                    e.target.style.backgroundColor = this.getColorValue(this.selectedColor);
                }
            });
            guessSlots.appendChild(div);
        }
    }

    getColorValue(color) {
        const colorMap = {
            'RED': '#ff0000',
            'YELLOW': '#ffd700',
            'BLUE': '#0000ff',
            'GREEN': '#008000',
            'ORANGE': '#ffa500',
            'PINK': '#ffc0cb',
            'PURPLE': '#800080',
            'CYAN': '#00ffff',
            'SILVER': '#c0c0c0',
            'TEAL': '#008080',
            'NAVY': '#0e3249',
            'BROWN': '#3e1c00',
            'LIME': '#4eff45'
        };
        return colorMap[color] || color;
    }

    startGame() {
        this.difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        this.colors = this.difficultySettings[this.difficulty].colors;
        this.slots = this.difficultySettings[this.difficulty].slots;
        const nameInput = document.getElementById('player-name');
        this.playerName = nameInput.value.trim();
        if (!this.playerName) {
            this.showMessage('Please enter your name to start the game.');
            return;
        }
        this.code = [];
        const availableColors = [...this.colors];
        for (let i = 0; i < this.slots; i++) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            this.code.push(availableColors[randomIndex]);
            availableColors.splice(randomIndex, 1);
        }
        this.guessCount = 0;
        this.currentGuess = [];
        this.selectedColor = null;
        this.gameOver = false;
        document.getElementById('guess-count').textContent = this.guessCount;
        document.getElementById('guess-history').innerHTML = '';
        this.renderColorPicker();
        this.renderGuessSlots();
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('player-name-display').textContent = this.playerName;
        this.showMessage(`Welcome ${this.playerName}! The code has been generated. Start guessing!`);
        document.getElementById('submit-guess').onclick = () => this.submitGuess();
    }

    submitGuess() {
        if (this.gameOver) return;
        if (this.currentGuess.length !== this.slots || this.currentGuess.includes(undefined)) {
            alert(`You need to fill all ${this.slots} slots for each guess.`);
            return;
        }
        if (new Set(this.currentGuess).size !== this.slots) {
            alert(`You need to fill all ${this.slots} slots with different colors.`);
            return;
        }
        this.guessCount++;
        document.getElementById('guess-count').textContent = this.guessCount;
        const { black, white } = this.calculateScore();
        this.addGuessToHistory(this.currentGuess, black, white);
        if (black === this.slots) {
            this.endGame(true);
            return;
        }
        if (this.guessCount >= 10) {
            this.endGame(false, `Sorry ${this.playerName}, you ran out of guesses and lost the game`);
            return;
        }
        this.currentGuess = [];
        document.querySelectorAll('.guess-slot').forEach(slot => {
            slot.style.backgroundColor = '';
        });
    }

    endGame(won, customMessage) {
        this.gameOver = true;
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.remove('hidden');
        if (won) {
            document.getElementById('gameover-title').textContent = 'Congratulations!';
            document.getElementById('gameover-message').textContent = `You won the game, ${this.playerName}, with ${this.guessCount} guesses!`;
        } else {
            document.getElementById('gameover-title').textContent = 'Game Over';
            const codeDisplay = this.code.map(color => 
                `<div class="code-reveal-slot" style="background-color: ${this.getColorValue(color)}"></div>`
            ).join('');
            document.getElementById('gameover-message').innerHTML = `
                ${customMessage || `You lost the game, ${this.playerName}.`}<br><br>
                <strong>The secret code was:</strong><br>
                <div class="code-reveal">${codeDisplay}</div>
            `;
        }
    }

    resetGame() {
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('welcome-screen').classList.remove('hidden');
        document.getElementById('player-name').value = '';
    }

    calculateScore() {
        let black = 0;
        let white = 0;
        const codeCopy = [...this.code];
        const guessCopy = [...this.currentGuess];
        for (let i = 0; i < this.slots; i++) {
            if (guessCopy[i] === codeCopy[i]) {
                black++;
                codeCopy[i] = null;
                guessCopy[i] = null;
            }
        }
        for (let i = 0; i < this.slots; i++) {
            if (guessCopy[i] !== null) {
                const index = codeCopy.indexOf(guessCopy[i]);
                if (index !== -1) {
                    white++;
                    codeCopy[index] = null;
                }
            }
        }
        return { black, white };
    }

    addGuessToHistory(guess, black, white) {
        const guessHistory = document.getElementById('guess-history');
        const guessRow = document.createElement('div');
        guessRow.className = 'guess-row';
        guess.forEach(color => {
            const slot = document.createElement('div');
            slot.className = 'history-guess-slot';
            slot.style.backgroundColor = this.getColorValue(color);
            guessRow.appendChild(slot);
        });
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        for (let i = 0; i < black; i++) {
            const dot = document.createElement('div');
            dot.className = 'feedback-dot black';
            feedback.appendChild(dot);
        }
        for (let i = 0; i < white; i++) {
            const dot = document.createElement('div');
            dot.className = 'feedback-dot white';
            feedback.appendChild(dot);
        }
        guessRow.appendChild(feedback);
        guessHistory.insertBefore(guessRow, guessHistory.firstChild);
    }

    showMessage(message) {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = message;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new MastermindGame();
}); 