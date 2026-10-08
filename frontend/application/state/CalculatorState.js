/* ========================================
   CALCULATOR STATE - Calculator-specific State Management
   ======================================== */

class CalculatorState {
    constructor() {
        this.state = {
            // Current expression being built
            expression: '',
            
            // Display value (what user sees)
            displayValue: '0',
            
            // Previous result (for next calculation)
            previousResult: 0,
            
            // Is expecting a new input after equals
            newInput: true,
            
            // Last operator
            lastOperator: null,
            
            // Error state
            error: null,
            
            // Calculation history
            history: this.loadHistory(),
            
            // Undo/Redo stacks
            undoStack: [],
            redoStack: [],
            
            // Calculation cache (for repeated operations)
            cache: {},
            
            // Complex numbers support
            useComplex: false,
            
            // Matrix mode
            matrixMode: false,
            currentMatrix: null,
            
            // Table mode
            tableMode: false,
            tableFunction: null,
            tableStart: -5,
            tableEnd: 5,
            tableStep: 1,
            
            // Solver mode
            solverMode: false,
            equationToSolve: null
        };

        this.listeners = {};
        this.maxHistorySize = 50;
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
     * ============ INPUT MANAGEMENT ============
     */

    /**
     * Append digit to expression
     */
    appendDigit(digit) {
        if (this.state.error) {
            this.clearError();
        }

        if (this.state.newInput) {
            this.setState({
                expression: digit.toString(),
                newInput: false
            });
        } else {
            // Prevent leading zeros
            if (this.state.expression === '0' && digit !== '.') {
                this.setState({ expression: digit.toString() });
            } else {
                this.setState({ 
                    expression: this.state.expression + digit 
                });
            }
        }
    }

    /**
     * Append operator
     */
    appendOperator(operator) {
        if (this.state.error) {
            this.clearError();
        }

        // Auto-evaluate if operator follows another operator
        if (this.state.lastOperator && !this.state.newInput) {
            this.evaluate();
        }

        this.setState({
            lastOperator: operator,
            newInput: true
        });
    }

    /**
     * Append function call
     */
    appendFunction(func) {
        if (this.state.error) {
            this.clearError();
        }

        const expr = this.state.newInput ? '' : this.state.expression;
        this.setState({
            expression: expr + func + '(',
            newInput: false
        });
    }

    /**
     * Set display value
     */
    setDisplayValue(value) {
        this.setState({
            displayValue: value.toString(),
            newInput: true
        });
    }

    /**
     * ============ CALCULATION OPERATIONS ============
     */

    /**
     * Evaluate expression (calls WASM engine)
     */
    async evaluate() {
        if (!this.state.expression) return;

        try {
            // This will be connected to WASM service
            const result = await window.wasmService?.evaluate(this.state.expression);
            
            if (result && !result.error) {
                this.setState({
                    displayValue: result.value,
                    previousResult: parseFloat(result.value),
                    expression: result.value,
                    newInput: true,
                    error: null
                });

                // Add to history
                this.addToHistory(this.state.expression, result.value);
            } else {
                this.setError(result?.error || 'Calculation error');
            }
        } catch (error) {
            this.setError(error.message || 'Unknown error');
        }
    }

    /**
     * Clear display and expression
     */
    clear() {
        this.setState({
            expression: '',
            displayValue: '0',
            previousResult: 0,
            lastOperator: null,
            newInput: true,
            error: null,
            useComplex: false
        });

        // Clear redo stack on new operation
        this.state.redoStack = [];
    }

    /**
     * Clear everything including history
     */
    clearAll() {
        this.clear();
        this.setState({
            history: [],
            cache: {},
            undoStack: [],
            redoStack: []
        });
        this.saveHistory([]);
    }

    /**
     * Backspace - remove last character
     */
    backspace() {
        const expr = this.state.expression;
        if (expr.length > 0) {
            this.setState({
                expression: expr.slice(0, -1) || '0',
                newInput: false
            });
        }
    }

    /**
     * Delete last operation
     */
    delete() {
        if (this.state.expression) {
            this.setState({
                expression: '0',
                newInput: true
            });
        }
    }

    /**
     * ============ HISTORY MANAGEMENT ============
     */

    /**
     * Add calculation to history
     */
    addToHistory(expression, result) {
        const entry = {
            id: Date.now(),
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleTimeString(),
            mode: appState.getState('angleMode')
        };

        let history = [entry, ...this.state.history];
        if (history.length > this.maxHistorySize) {
            history = history.slice(0, this.maxHistorySize);
        }

        this.setState({ history });
        this.saveHistory(history);
    }

    /**
     * Get history item
     */
    getHistoryItem(id) {
        return this.state.history.find(item => item.id === id);
    }

    /**
     * Delete history item
     */
    deleteHistoryItem(id) {
        const history = this.state.history.filter(item => item.id !== id);
        this.setState({ history });
        this.saveHistory(history);
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.setState({ history: [] });
        this.saveHistory([]);
    }

    /**
     * Reuse calculation from history
     */
    reuseHistoryItem(id) {
        const item = this.getHistoryItem(id);
        if (item) {
            this.setState({
                expression: item.expression,
                displayValue: item.result,
                newInput: true
            });
        }
    }

    /**
     * Save history to localStorage
     */
    saveHistory(history) {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Failed to save history:', e);
        }
    }

    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('calculatorHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Failed to load history:', e);
            return [];
        }
    }

    /**
     * ============ UNDO/REDO ============
     */

    /**
     * Undo last action
     */
    undo() {
        if (this.state.undoStack.length > 0) {
            const redoState = JSON.parse(JSON.stringify(this.state));
            this.state.redoStack.push(redoState);

            const previousState = this.state.undoStack.pop();
            Object.assign(this.state, previousState);
            this._notifyListeners(previousState, {}, 'undo');
        }
    }

    /**
     * Redo last undone action
     */
    redo() {
        if (this.state.redoStack.length > 0) {
            const undoState = JSON.parse(JSON.stringify(this.state));
            this.state.undoStack.push(undoState);

            const redoState = this.state.redoStack.pop();
            Object.assign(this.state, redoState);
            this._notifyListeners(redoState, {}, 'redo');
        }
    }

    /**
     * Push current state to undo stack
     */
    pushUndoState() {
        this.state.undoStack.push(JSON.parse(JSON.stringify(this.state)));
        this.state.redoStack = []; // Clear redo on new action
    }

    /**
     * ============ ERROR HANDLING ============
     */

    /**
     * Set error message
     */
    setError(message) {
        this.setState({
            error: message,
            displayValue: 'Error',
            newInput: true
        });
    }

    /**
     * Clear error
     */
    clearError() {
        this.setState({ error: null });
    }

    /**
     * ============ MODE MANAGEMENT ============
     */

    /**
     * Enable/disable complex number mode
     */
    setComplexMode(enabled) {
        this.setState({ useComplex: enabled });
    }

    /**
     * Enable/disable matrix mode
     */
    setMatrixMode(enabled, matrix = null) {
        this.setState({ matrixMode: enabled, currentMatrix: matrix });
    }

    /**
     * Enable/disable table mode
     */
    setTableMode(enabled, func = null) {
        this.setState({ 
            tableMode: enabled, 
            tableFunction: func,
            tableStart: -5,
            tableEnd: 5,
            tableStep: 1
        });
    }

    /**
     * Set table parameters
     */
    setTableParameters(start, end, step) {
        this.setState({
            tableStart: start,
            tableEnd: end,
            tableStep: step
        });
    }

    /**
     * Enable equation solver
     */
    setSolverMode(enabled, equation = null) {
        this.setState({
            solverMode: enabled,
            equationToSolve: equation
        });
    }

    /**
     * ============ CACHING ============
     */

    /**
     * Cache result
     */
    cacheResult(key, value) {
        this.state.cache[key] = {
            value,
            timestamp: Date.now()
        };
    }

    /**
     * Get cached result
     */
    getCachedResult(key, maxAge = 60000) {
        const cached = this.state.cache[key];
        if (cached && Date.now() - cached.timestamp < maxAge) {
            return cached.value;
        }
        return null;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.setState({ cache: {} });
    }

    /**
     * ============ PRIVATE METHODS ============
     */

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

    /**
     * Get diagnostics
     */
    getDiagnostics() {
        return {
            expressionLength: this.state.expression.length,
            historySize: this.state.history.length,
            cacheSize: Object.keys(this.state.cache).length,
            undoStackSize: this.state.undoStack.length,
            redoStackSize: this.state.redoStack.length,
            errorState: this.state.error
        };
    }
}

// Create and export singleton instance
const calculatorState = new CalculatorState();

// Debug in console
window.calculatorState = calculatorState;
