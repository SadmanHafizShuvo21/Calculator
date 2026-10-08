/* ========================================
   GAME STATE - Guessing Game State Management
   ======================================== */

class GameState {
    constructor() {
        this.state = {
            // Game session data
            currentGameId: null,
            isGameActive: false,
            targetNumber: null,
            difficulty: null, // 'easy', 'medium', 'hard'
            
            // Game progress
            guesses: [],
            attemptsRemaining: 10,
            hintsRemaining: 3,
            totalAttempts: 0,
            
            // Timing
            gameStartTime: null,
            gameEndTime: null,
            
            // Scoring
            currentScore: 0,
            multiplier: 1,
            
            // Game state
            gameStatus: 'idle', // 'idle', 'active', 'won', 'lost'
            lastHint: null,
            
            // Leaderboard
            leaderboard: [],
            personalBest: {
                easy: 0,
                medium: 0,
                hard: 0
            },
            
            // Statistics
            totalGamesPlayed: 0,
            totalGamesWon: 0,
            winRate: 0,
            averageAttemptsEasy: 0,
            averageAttemptsMedium: 0,
            averageAttemptsHard: 0,
            
            // Daily stats
            dailyGames: 0,
            dailyWins: 0,
            
            // Achievements
            achievements: [],
            
            // Streaks
            currentWinStreak: 0,
            bestWinStreak: 0
        };

        this.listeners = {};
        this.difficultyConfig = {
            easy: {
                min: 1,
                max: 50,
                maxAttempts: 10,
                maxHints: 3,
                baseScore: 1000
            },
            medium: {
                min: 1,
                max: 500,
                maxAttempts: 7,
                maxHints: 2,
                baseScore: 2000
            },
            hard: {
                min: 1,
                max: 1000,
                maxAttempts: 5,
                maxHints: 1,
                baseScore: 3000
            }
        };

        this.loadStats();
    }

    /**
     * Get state value
     */
    getState(path) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let value = this.state;
        for (const key of keys) {
            value = value?.[key];
        }
        return value;
    }

    /**
     * Set state and notify listeners
     */
    setState(updates, source = 'direct') {
        const prevState = JSON.parse(JSON.stringify(this.state));
        
        // Merge updates
        for (const key in updates) {
            if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
                this.state[key] = { ...this.state[key], ...updates[key] };
            } else {
                this.state[key] = updates[key];
            }
        }

        this._notifyListeners(updates, prevState, source);
    }

    /**
     * Subscribe to state changes
     */
    subscribe(path, callback) {
        if (!this.listeners[path]) {
            this.listeners[path] = [];
        }
        this.listeners[path].push(callback);
        
        return () => {
            this.listeners[path] = this.listeners[path].filter(cb => cb !== callback);
        };
    }

    /**
     * Subscribe to any change
     */
    onStateChange(callback) {
        return this.subscribe('*', callback);
    }

    /**
     * ============ GAME FLOW ============
     */

    /**
     * Start new game
     */
    startGame(difficulty = 'medium') {
        if (!this.difficultyConfig[difficulty]) {
            difficulty = 'medium';
        }

        const config = this.difficultyConfig[difficulty];
        const targetNumber = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;

        const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        this.setState({
            currentGameId: gameId,
            isGameActive: true,
            targetNumber: targetNumber,
            difficulty: difficulty,
            guesses: [],
            attemptsRemaining: config.maxAttempts,
            hintsRemaining: config.maxHints,
            totalAttempts: 0,
            gameStartTime: Date.now(),
            gameEndTime: null,
            currentScore: 0,
            multiplier: 1,
            gameStatus: 'active',
            lastHint: null
        });

        // Increment game counter
        this.incrementGameCounter();

        return gameId;
    }

    /**
     * Make a guess
     */
    makeGuess(guess) {
        if (this.state.gameStatus !== 'active') {
            return { result: 'game_not_active', hint: null };
        }

        guess = parseInt(guess);

        // Validate guess
        const config = this.difficultyConfig[this.state.difficulty];
        if (guess < config.min || guess > config.max) {
            return { 
                result: 'invalid', 
                hint: `Please guess between ${config.min} and ${config.max}` 
            };
        }

        // Check if already guessed
        if (this.state.guesses.includes(guess)) {
            return { 
                result: 'duplicate', 
                hint: 'You already guessed this number!' 
            };
        }

        // Add guess to list
        const newGuesses = [...this.state.guesses, guess];
        this.setState({ guesses: newGuesses, totalAttempts: newGuesses.length });

        // Check result
        if (guess === this.state.targetNumber) {
            return this._handleGameWon(newGuesses.length);
        } else if (this.state.attemptsRemaining <= 1) {
            return this._handleGameLost();
        } else {
            // Provide hint
            const hint = guess < this.state.targetNumber ? 'Higher' : 'Lower';
            const attemptsRemaining = this.state.attemptsRemaining - 1;
            
            this.setState({ 
                attemptsRemaining: attemptsRemaining,
                lastHint: hint
            });

            return { 
                result: 'incorrect', 
                hint: hint,
                attemptsRemaining: attemptsRemaining,
                guesses: newGuesses
            };
        }
    }

    /**
     * ============ GAME EVENTS ============
     */

    /**
     * Handle winning game
     */
    _handleGameWon(attempts) {
        const timeTaken = (Date.now() - this.state.gameStartTime) / 1000;
        const score = this._calculateScore(attempts, timeTaken);

        this.setState({
            gameStatus: 'won',
            gameEndTime: Date.now(),
            isGameActive: false,
            currentScore: score,
            currentWinStreak: this.state.currentWinStreak + 1
        });

        // Update best streak
        if (this.state.currentWinStreak + 1 > this.state.bestWinStreak) {
            this.setState({ bestWinStreak: this.state.currentWinStreak + 1 });
        }

        // Update stats
        this._updateStats(true, attempts);

        // Check achievements
        this._checkAchievements();

        // Save locally (async)
        this.saveGameResult();

        return {
            result: 'win',
            score: score,
            attempts: attempts,
            timeTaken: timeTaken
        };
    }

    /**
     * Handle losing game
     */
    _handleGameLost() {
        this.setState({
            gameStatus: 'lost',
            gameEndTime: Date.now(),
            isGameActive: false,
            currentWinStreak: 0
        });

        // Update stats
        this._updateStats(false, this.state.totalAttempts);

        // Save locally
        this.saveGameResult();

        return {
            result: 'lost',
            targetNumber: this.state.targetNumber,
            attempts: this.state.totalAttempts
        };
    }

    /**
     * Use hint
     */
    useHint() {
        if (this.state.hintsRemaining <= 0) {
            return { result: 'no_hints', hint: 'No hints remaining!' };
        }

        const hint = this.state.targetNumber > this.state.previousGuess 
            ? 'The number is HIGHER' 
            : 'The number is LOWER';

        this.setState({
            hintsRemaining: this.state.hintsRemaining - 1,
            lastHint: hint
        });

        return { result: 'hint', hint: hint };
    }

    /**
     * Give up game
     */
    giveUp() {
        return this._handleGameLost();
    }

    /**
     * Resign game
     */
    resign() {
        this.setState({
            gameStatus: 'resigned',
            isGameActive: false,
            currentWinStreak: 0
        });

        return {
            result: 'resigned',
            targetNumber: this.state.targetNumber,
            attempts: this.state.totalAttempts
        };
    }

    /**
     * ============ SCORING ============
     */

    /**
     * Calculate score based on attempts and time
     */
    _calculateScore(attempts, timeTaken) {
        const config = this.difficultyConfig[this.state.difficulty];
        
        // Base score
        let score = config.baseScore;
        
        // Time bonus (60s max)
        const timeBonus = Math.max(0, 60 - timeTaken) * 50;
        
        // Attempt bonus
        const attemptBonus = Math.max(0, config.maxAttempts - attempts) * 100;
        
        // Multiplier bonus
        let multiplier = 1;
        if (this.state.currentWinStreak > 2) {
            multiplier = 1.1 + (Math.min(this.state.currentWinStreak, 10) * 0.05);
        }
        
        const total = Math.floor((score + timeBonus + attemptBonus) * multiplier);
        
        return total;
    }

    /**
     * Get hint for current game
     */
    getSmartHint() {
        if (this.state.hintsRemaining <= 0) {
            return 'No hints remaining';
        }

        const config = this.difficultyConfig[this.state.difficulty];
        const min = config.min;
        const max = config.max;
        const target = this.state.targetNumber;

        // Calculate remaining range based on guesses
        let lower = min;
        let upper = max;

        for (const guess of this.state.guesses) {
            if (guess < target) {
                lower = Math.max(lower, guess + 1);
            } else if (guess > target) {
                upper = Math.min(upper, guess - 1);
            }
        }

        // Provide smart hint based on range
        if (upper - lower < 10) {
            return `The number is between ${lower} and ${upper}`;
        } else if (target < (lower + upper) / 2) {
            return `Lower half: ${lower} to ${Math.floor((lower + upper) / 2)}`;
        } else {
            return `Upper half: ${Math.ceil((lower + upper) / 2)} to ${upper}`;
        }
    }

    /**
     * ============ STATISTICS ============
     */

    /**
     * Update statistics after game
     */
    _updateStats(won, attempts) {
        const stats = { ...this.state };
        
        stats.totalGamesPlayed += 1;
        if (won) {
            stats.totalGamesWon += 1;
        }
        stats.dailyGames += 1;
        if (won) stats.dailyWins += 1;

        // Update win rate
        stats.winRate = (stats.totalGamesWon / stats.totalGamesPlayed * 100).toFixed(1);

        // Update difficulty-specific stats
        if (this.state.difficulty === 'easy') {
            stats.averageAttemptsEasy = 
                ((stats.averageAttemptsEasy * stats.totalGamesWon) + attempts) / 
                (stats.totalGamesWon + (won ? 1 : 0));
        } else if (this.state.difficulty === 'medium') {
            stats.averageAttemptsMedium = 
                ((stats.averageAttemptsMedium * stats.totalGamesWon) + attempts) / 
                (stats.totalGamesWon + (won ? 1 : 0));
        } else if (this.state.difficulty === 'hard') {
            stats.averageAttemptsHard = 
                ((stats.averageAttemptsHard * stats.totalGamesWon) + attempts) / 
                (stats.totalGamesWon + (won ? 1 : 0));
        }

        // Update personal best
        if (won) {
            const bestKey = this.state.difficulty;
            if (this.state.currentScore > stats.personalBest[bestKey]) {
                stats.personalBest[bestKey] = this.state.currentScore;
            }
        }

        this.setState(stats);
        this.saveStats();
    }

    /**
     * Increment game counter
     */
    incrementGameCounter() {
        this.setState({
            totalGamesPlayed: this.state.totalGamesPlayed + 1,
            dailyGames: this.state.dailyGames + 1
        });
    }

    /**
     * Reset daily stats
     */
    resetDailyStats() {
        this.setState({
            dailyGames: 0,
            dailyWins: 0
        });
        this.saveStats();
    }

    /**
     * ============ ACHIEVEMENTS ============
     */

    /**
     * Check for achievements
     */
    _checkAchievements() {
        const achievements = [...this.state.achievements];

        // First Win
        if (!achievements.includes('first_win') && this.state.totalGamesWon === 1) {
            achievements.push('first_win');
        }

        // Perfect Game (1 attempt)
        if (this.state.totalAttempts === 1) {
            achievements.push(`perfect_${this.state.difficulty}_${Date.now()}`);
        }

        // Win Streak
        if (this.state.currentWinStreak === 5 && !achievements.includes('streak_5')) {
            achievements.push('streak_5');
        }
        if (this.state.currentWinStreak === 10 && !achievements.includes('streak_10')) {
            achievements.push('streak_10');
        }

        // Total Games
        if (this.state.totalGamesPlayed === 10 && !achievements.includes('games_10')) {
            achievements.push('games_10');
        }
        if (this.state.totalGamesPlayed === 50 && !achievements.includes('games_50')) {
            achievements.push('games_50');
        }

        this.setState({ achievements });
    }

    /**
     * ============ PERSISTENCE ============
     */

    /**
     * Save game result locally
     */
    async saveGameResult() {
        if (!window.localDataService) return;

        try {
            await window.localDataService.saveGameScore({
                userId: appState.getState('userId'),
                score: this.state.currentScore,
                difficulty: this.state.difficulty,
                attempts: this.state.totalAttempts,
                won: this.state.gameStatus === 'won',
                timeTaken: (this.state.gameEndTime - this.state.gameStartTime) / 1000,
                timestamp: new Date()
            });
        } catch (error) {
            console.warn('Failed to save game result:', error);
        }
    }

    /**
     * Save stats to localStorage
     */
    saveStats() {
        const stats = {
            totalGamesPlayed: this.state.totalGamesPlayed,
            totalGamesWon: this.state.totalGamesWon,
            winRate: this.state.winRate,
            personalBest: this.state.personalBest,
            bestWinStreak: this.state.bestWinStreak,
            achievements: this.state.achievements
        };

        try {
            localStorage.setItem('gameStats', JSON.stringify(stats));
        } catch (e) {
            console.warn('Failed to save game stats:', e);
        }
    }

    /**
     * Load stats from localStorage
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('gameStats');
            if (saved) {
                const stats = JSON.parse(saved);
                this.setState(stats);
            }
        } catch (e) {
            console.warn('Failed to load game stats:', e);
        }
    }

    /**
     * Private method for notifying listeners
     */
    _notifyListeners(updates, prevState, source) {
        if (this.listeners['*']) {
            this.listeners['*'].forEach(callback => {
                callback(this.state, prevState, updates, source);
            });
        }

        for (const path in updates) {
            if (this.listeners[path]) {
                this.listeners[path].forEach(callback => {
                    callback(this.state[path], prevState[path], updates, source);
                });
            }
        }
    }

    /**
     * Get diagnostics
     */
    getDiagnostics() {
        return {
            isGameActive: this.state.isGameActive,
            gameStatus: this.state.gameStatus,
            totalGamesPlayed: this.state.totalGamesPlayed,
            winRate: this.state.winRate,
            currentWinStreak: this.state.currentWinStreak,
            achievements: this.state.achievements.length
        };
    }
}

// Create and export singleton instance
const gameState = new GameState();

// Debug in console
window.gameState = gameState;
