/* ========================================
   GAME CONTROLLER - Guessing Game Orchestration
   ======================================== */

class GameController {
    constructor() {
        this.activeGame = null;
        this.difficultyLevels = {
            easy: { label: 'Easy', min: 1, max: 50, maxAttempts: 10 },
            medium: { label: 'Medium', min: 1, max: 500, maxAttempts: 7 },
            hard: { label: 'Hard', min: 1, max: 1000, maxAttempts: 5 }
        };
        this.init();
    }

    init() {
        // Subscribe to game state changes
        gameState.subscribe('gameStatus', (value) => this._onGameStatusChange(value));
        gameState.subscribe('currentScore', (value) => this._onScoreChange(value));

        // Setup UI listeners
        this._setupUIListeners();

        console.log('✓ Game Controller initialized');
    }

    /**
     * ============ GAME FLOW ============
     */

    /**
     * Start new game
     */
    startGame(difficulty = 'medium') {
        if (!this.difficultyLevels[difficulty]) {
            difficulty = 'medium';
        }

        const gameId = gameState.startGame(difficulty);
        this.activeGame = {
            id: gameId,
            difficulty: difficulty,
            startTime: Date.now(),
            guesses: []
        };

        this._showGameUI();
        return gameId;
    }

    /**
     * Make a guess
     */
    async makeGuess(guess) {
        if (!this.activeGame) {
            return { error: 'No active game' };
        }

        // Validate input
        const difficulty = this.difficultyLevels[gameState.getState('difficulty')];
        const guessNum = parseInt(guess);

        if (isNaN(guessNum)) {
            return { error: 'Please enter a valid number' };
        }

        if (guessNum < difficulty.min || guessNum > difficulty.max) {
            return { error: `Number must be between ${difficulty.min} and ${difficulty.max}` };
        }

        // Make guess
        const result = gameState.makeGuess(guessNum);

        this.activeGame.guesses.push({
            guess: guessNum,
            result: result.result,
            hint: result.hint,
            timestamp: Date.now()
        });

        // Update UI
        this._updateGameUI(result);

        // Handle game end
        if (result.result === 'win' || result.result === 'lost') {
            await this._handleGameEnd(result);
        }

        return result;
    }

    /**
     * Give up
     */
    async giveUp() {
        if (!this.activeGame) return;

        const result = gameState.giveUp();
        await this._handleGameEnd(result);
    }

    /**
     * ============ UI MANAGEMENT ============
     */

    /**
     * Setup UI listeners
     */
    _setupUIListeners() {
        // Start game button
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                appState.openModal('game');
                this._showGameDifficultySelector();
            });
        }

        // Game difficulty selector
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('difficulty-btn')) {
                const difficulty = e.target.dataset.difficulty;
                this.startGame(difficulty);
            }
        });

        // Game input
        document.addEventListener('keydown', (e) => {
            if (gameState.getState('gameStatus') === 'active' && e.key === 'Enter') {
                const input = document.getElementById('gameGuessInput');
                if (input) {
                    this.makeGuess(input.value);
                    input.value = '';
                    input.focus();
                }
            }
        });
    }

    /**
     * Show difficulty selector
     */
    _showGameDifficultySelector() {
        const modalBody = document.getElementById('gameModalBody');
        if (!modalBody) return;

        let html = '<div style="text-align: center; padding: 20px;">';
        html += '<h3>Select Difficulty</h3>';

        for (const [key, level] of Object.entries(this.difficultyLevels)) {
            html += `
                <button class="btn btn-primary difficulty-btn" data-difficulty="${key}" style="margin: 10px;">
                    ${level.label} (${level.min}-${level.max})
                </button>
            `;
        }

        html += '</div>';
        modalBody.innerHTML = html;
    }

    /**
     * Show game UI
     */
    _showGameUI() {
        const modalBody = document.getElementById('gameModalBody');
        if (!modalBody) return;

        const difficulty = gameState.getState('difficulty');
        const config = this.difficultyLevels[difficulty];

        let html = `
            <div style="padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h3>Guess the Number!</h3>
                    <p>Difficulty: <strong>${config.label}</strong></p>
                    <p>Range: ${config.min} - ${config.max}</p>
                    <p>Attempts: <span id="attemptsRemaining">${config.maxAttempts}</span>/${config.maxAttempts}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <input type="number" id="gameGuessInput" 
                        placeholder="Enter your guess..."
                        min="${config.min}" max="${config.max}"
                        style="width: 100%; padding: 10px; font-size: 16px;">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn-primary" id="guessBtn">Submit Guess</button>
                    <button class="btn" id="hintBtn" style="background: #f39c12; color: white;">Get Hint</button>
                </div>

                <div id="guessList" style="max-height: 200px; overflow-y: auto;"></div>
            </div>
        `;

        modalBody.innerHTML = html;

        // Attach event listeners
        const guessBtn = document.getElementById('guessBtn');
        const hintBtn = document.getElementById('hintBtn');
        const guessInput = document.getElementById('gameGuessInput');

        if (guessBtn) {
            guessBtn.addEventListener('click', () => {
                this.makeGuess(guessInput.value);
                guessInput.value = '';
                guessInput.focus();
            });
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                const hint = gameState.getSmartHint();
                alert(hint);
            });
        }

        if (guessInput) {
            guessInput.focus();
        }
    }

    /**
     * Update game UI with guess result
     */
    _updateGameUI(result) {
        const attemptsRemaining = gameState.getState('attemptsRemaining');
        const attemptsDisplay = document.getElementById('attemptsRemaining');
        if (attemptsDisplay) {
            attemptsDisplay.textContent = attemptsRemaining;
        }

        const guessList = document.getElementById('guessList');
        if (guessList) {
            const guesses = gameState.getState('guesses');
            let html = '<strong>Previous guesses:</strong><br>';
            guesses.forEach((guess, index) => {
                html += `<span style="margin: 5px; padding: 5px; background: #ecf0f1; border-radius: 4px; display: inline-block;">${guess}</span>`;
            });
            guessList.innerHTML = html;
        }

        // Show hint in toast
        if (result.hint) {
            this._showToast(result.hint);
        }
    }

    /**
     * Handle game end
     */
    async _handleGameEnd(result) {
        let message = '';
        let details = '';

        if (result.result === 'win') {
            message = '🎉 You Won!';
            details = `Score: ${gameState.getState('currentScore')}<br>Attempts: ${gameState.getState('totalAttempts')}`;
        } else {
            message = '💔 Game Over';
            details = `The number was: ${result.targetNumber}<br>Attempts: ${gameState.getState('totalAttempts')}`;
        }

        // Show results
        this._showGameResults(message, details, result);

        // Update leaderboard
        await this._updateLeaderboard();

        // Auto-hide modal after 3 seconds
        setTimeout(() => {
            appState.closeModal();
        }, 3000);
    }

    /**
     * Show game results
     */
    _showGameResults(title, details, result) {
        const modalBody = document.getElementById('gameModalBody');
        if (!modalBody) return;

        let html = `
            <div style="text-align: center; padding: 40px 20px;">
                <h2>${title}</h2>
                <div style="font-size: 18px; margin: 20px 0; line-height: 1.6;">
                    ${details}
                </div>
                <button class="btn btn-primary" id="playAgainBtn" style="margin-top: 20px;">
                    Play Again
                </button>
            </div>
        `;

        modalBody.innerHTML = html;

        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.startGame(gameState.getState('difficulty'));
            });
        }
    }

    /**
     * ============ LEADERBOARD ============
     */

    /**
     * Update leaderboard display
     */
    async _updateLeaderboard() {
        try {
            const { leaderboard } = await localDataService.getLeaderboard(
                gameState.getState('difficulty'),
                10
            );

            const leaderboardDiv = document.getElementById('leaderboardSection');
            if (leaderboardDiv && leaderboard.length > 0) {
                leaderboardDiv.style.display = 'block';

                let html = '<h3>Top Scores</h3><table style="width: 100%; text-align: left; border-collapse: collapse;">';
                html += '<tr style="border-bottom: 1px solid #ddd;"><th>Rank</th><th>Player</th><th>Score</th></tr>';

                leaderboard.slice(0, 10).forEach((item, index) => {
                    html += `<tr style="border-bottom: 1px solid #eee;">
                        <td>${index + 1}</td>
                        <td>${item.userName || 'Anonymous'}</td>
                        <td style="font-weight: bold; color: #f39c12;">${item.score}</td>
                    </tr>`;
                });

                html += '</table>';
                leaderboardDiv.innerHTML = html;
            }
        } catch (error) {
            console.warn('Failed to load leaderboard:', error);
        }
    }

    /**
     * ============ NOTIFICATIONS ============
     */

    /**
     * Show toast notification
     */
    _showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #2c3e50;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            animation: slideUp 300ms ease-out;
            z-index: 999;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    /**
     * ============ STATE OBSERVERS ============
     */

    /**
     * On game status change
     */
    _onGameStatusChange(status) {
        console.log('Game status:', status);
    }

    /**
     * On score change
     */
    _onScoreChange(score) {
        console.log('Score updated:', score);
    }

    /**
     * Get diagnostics
     */
    getDiagnostics() {
        return {
            activeGame: this.activeGame,
            gameState: gameState.getDiagnostics()
        };
    }
}

// Create and export singleton instance
const gameController = new GameController();

// Debug in console
window.gameController = gameController;
