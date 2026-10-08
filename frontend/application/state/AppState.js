/* ========================================
   APP STATE - Global Application State & Observer Pattern
   ======================================== */

class AppState {
    constructor() {
        this.state = {
            // Theme
            theme: localStorage.getItem('theme') || 'light',
            
            // Calculator Mode
            calculatorMode: 'standard', // 'standard' or 'advanced'
            angleMode: 'DEG', // 'DEG', 'RAD', 'GRAD'
            displayMode: 'normal', // 'normal', 'scientific', 'fraction'
            
            // Memory
            memory: {
                M: 0,
                M1: 0, M2: 0, M3: 0, M4: 0,
                M5: 0, M6: 0, M7: 0, M8: 0, M9: 0
            },
            hasMemory: false,
            
            // UI State
            menuOpen: false,
            sidebarTab: 'history', // 'history' or 'game'
            modalOpen: null, // null or 'game' or 'settings'
            
            // User preferences
            soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
            vibrateEnabled: localStorage.getItem('vibrateEnabled') !== 'false',
            historyLimit: 50,
            
            // Connectivity
            isOnline: navigator.onLine,
            syncInProgress: false,
            
            // Analytics
            sessionStartTime: Date.now(),
            calculationCount: 0
        };

        // Observable pattern: listeners for state changes
        this.listeners = {};
        this.middlewares = [];
    }

    /**
     * Get a slice of state
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
        
        // Deep merge
        this._mergeState(this.state, updates);
        
        // Run middlewares
        for (const middleware of this.middlewares) {
            middleware(this.state, prevState, updates);
        }
        
        // Persist to localStorage if needed
        this._persistState();
        
        // Notify all listeners
        this._notifyListeners(updates, prevState, source);
    }

    /**
     * Subscribe to state changes
     * Returns unsubscribe function
     */
    subscribe(path, callback) {
        if (!this.listeners[path]) {
            this.listeners[path] = [];
        }
        this.listeners[path].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.listeners[path] = this.listeners[path].filter(cb => cb !== callback);
        };
    }

    /**
     * Subscribe to any state change
     */
    onStateChange(callback) {
        return this.subscribe('*', callback);
    }

    /**
     * Add middleware for state changes
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     * Theme management
     */
    setTheme(theme) {
        this.setState({ theme });
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Memory operations
     */
    setMemory(slot, value) {
        const memory = { ...this.state.memory };
        memory[slot] = value;
        this.setState({ memory, hasMemory: Object.values(memory).some(v => v !== 0) });
    }

    getMemory(slot) {
        return this.state.memory[slot];
    }

    addToMemory(slot, value) {
        const current = this.state.memory[slot];
        this.setMemory(slot, current + value);
    }

    clearMemory() {
        this.setState({
            memory: { M: 0, M1: 0, M2: 0, M3: 0, M4: 0, M5: 0, M6: 0, M7: 0, M8: 0, M9: 0 },
            hasMemory: false
        });
    }

    /**
     * Mode switching
     */
    setAngleMode(mode) {
        if (['DEG', 'RAD', 'GRAD'].includes(mode)) {
            this.setState({ angleMode: mode });
        }
    }

    toggleAngleMode() {
        const modes = ['DEG', 'RAD', 'GRAD'];
        const currentIndex = modes.indexOf(this.state.angleMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        this.setAngleMode(nextMode);
    }

    /**
     * UI State management
     */
    toggleMenu() {
        this.setState({ menuOpen: !this.state.menuOpen });
    }

    closeMenu() {
        this.setState({ menuOpen: false });
    }

    setSidebarTab(tab) {
        this.setState({ sidebarTab: tab });
    }

    openModal(modalType) {
        this.setState({ modalOpen: modalType });
    }

    closeModal() {
        this.setState({ modalOpen: null });
    }

    /**
     * User preferences
     */
    setSound(enabled) {
        this.setState({ soundEnabled: enabled });
        localStorage.setItem('soundEnabled', enabled);
    }

    setVibrate(enabled) {
        this.setState({ vibrateEnabled: enabled });
        localStorage.setItem('vibrateEnabled', enabled);
    }

    /**
     * Calculations tracking
     */
    incrementCalculationCount() {
        this.setState({
            calculationCount: this.state.calculationCount + 1
        });
    }

    getSessionDuration() {
        return Math.floor((Date.now() - this.state.sessionStartTime) / 1000);
    }

    /**
     * Connectivity
     */
    setOnlineStatus(isOnline) {
        this.setState({ isOnline });
    }

    setSyncInProgress(inProgress) {
        this.setState({ syncInProgress: inProgress });
    }

    /**
     * Private methods
     */
    _mergeState(target, source) {
        for (const key in source) {
            if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this._mergeState(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    _notifyListeners(updates, prevState, source) {
        // Notify wildcard listeners
        if (this.listeners['*']) {
            this.listeners['*'].forEach(callback => {
                callback(this.state, prevState, updates, source);
            });
        }

        // Notify specific path listeners
        for (const path in updates) {
            if (this.listeners[path]) {
                this.listeners[path].forEach(callback => {
                    callback(this.state[path], prevState[path], updates, source);
                });
            }
        }
    }

    _persistState() {
        // Persist only certain state to localStorage
        const persistable = {
            theme: this.state.theme,
            angleMode: this.state.angleMode,
            displayMode: this.state.displayMode,
            memory: this.state.memory,
            calculatorMode: this.state.calculatorMode,
            soundEnabled: this.state.soundEnabled,
            vibrateEnabled: this.state.vibrateEnabled
        };
        
        try {
            localStorage.setItem('appState', JSON.stringify(persistable));
        } catch (e) {
            console.warn('Failed to persist state to localStorage:', e);
        }
    }

    /**
     * Restore state from localStorage
     */
    restoreState() {
        try {
            const saved = localStorage.getItem('appState');
            if (saved) {
                const restored = JSON.parse(saved);
                this.setState(restored, 'restore');
            }
        } catch (e) {
            console.warn('Failed to restore state from localStorage:', e);
        }
    }

    /**
     * Reset to defaults
     */
    reset() {
        this.setState({
            calculatorMode: 'standard',
            angleMode: 'DEG',
            displayMode: 'normal',
            memory: { M: 0, M1: 0, M2: 0, M3: 0, M4: 0, M5: 0, M6: 0, M7: 0, M8: 0, M9: 0 },
            hasMemory: false,
            menuOpen: false,
            modalOpen: null,
            syncInProgress: false
        }, 'reset');
    }

    /**
     * Get diagnostic info
     */
    getDiagnostics() {
        return {
            state: this.state,
            listenersCount: Object.values(this.listeners).reduce((acc, arr) => acc + arr.length, 0),
            middlewaresCount: this.middlewares.length,
            sessionDuration: this.getSessionDuration(),
            storageUsage: JSON.stringify(this.state).length
        };
    }
}

// Create and export singleton instance
const appState = new AppState();

// Initialize
appState.restoreState();

// Listen for online/offline events
window.addEventListener('online', () => appState.setOnlineStatus(true));
window.addEventListener('offline', () => appState.setOnlineStatus(false));

// Debug in console
window.appState = appState;
