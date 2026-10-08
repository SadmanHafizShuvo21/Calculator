class LocalDataService {
    constructor() {
        this.user = null;
    }

    async initialize() {
        return true;
    }

    async signInAnonymously() {
        this.user = { uid: 'local-user', displayName: 'Local Player' };
        return { user: this.user, error: null };
    }

    async signInWithGoogle() {
        return { user: null, error: 'Google sign-in is unavailable in local mode.' };
    }

    async signOut() {
        this.user = null;
        return { error: null };
    }

    getCurrentUser() {
        return this.user;
    }

    async saveCalculation(expression, result) {
        await storageService.saveCalculation(expression, result);
        return { error: null };
    }

    async getCalculationHistory(limit = 50) {
        try {
            const history = await storageService.getCalculationHistory(limit);
            return { history, error: null };
        } catch (error) {
            return { history: [], error: error.message };
        }
    }

    async saveGameScore(scoreData) {
        try {
            const score = await storageService.saveGameScore({
                ...scoreData,
                userId: scoreData.userId || this.user?.uid || 'local-user',
                userName: scoreData.userName || this.user?.displayName || 'Local Player'
            });
            return { scoreId: score.id, error: null };
        } catch (error) {
            return { scoreId: null, error: error.message };
        }
    }

    async getLeaderboard(difficulty = null, limit = 100) {
        try {
            const scores = await storageService.getGameScores(difficulty, limit);
            const leaderboard = scores
                .filter(score => score.won)
                .map((score, index) => ({ rank: index + 1, ...score }));
            return { leaderboard, error: null };
        } catch (error) {
            return { leaderboard: [], error: error.message };
        }
    }

    async getPersonalStats() {
        try {
            const stats = await storageService.getSetting('personalStats');
            return { stats, error: stats ? null : 'No stats found' };
        } catch (error) {
            return { stats: null, error: error.message };
        }
    }

    async updatePersonalStats(stats) {
        try {
            await storageService.setSetting('personalStats', stats);
            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    }

    isOnline() {
        return navigator.onLine;
    }

    getStatus() {
        return {
            initialized: true,
            authenticated: this.user !== null,
            userId: this.user?.uid,
            isOnline: this.isOnline(),
            mode: 'local'
        };
    }
}

const localDataService = new LocalDataService();
window.localDataService = localDataService;
