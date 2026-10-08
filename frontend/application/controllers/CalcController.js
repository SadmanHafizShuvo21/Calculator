/* ========================================
   CALC CONTROLLER - Calculator Business Logic Orchestration
   ======================================== */

class CalcController {
    constructor() {
        this.evaluationQueue = [];
        this.isEvaluating = false;
        this.init();
    }

    init() {
        // Subscribe to state changes
        calculatorState.subscribe('expression', (value) => this._onExpressionChange(value));
        calculatorState.subscribe('displayValue', (value) => this._onDisplayChange(value));
        calculatorState.subscribe('error', (value) => this._onErrorChange(value));

        console.log('✓ Calculator Controller initialized');
    }

    /**
     * ============ EXPRESSION EVALUATION ============
     */

    /**
     * Evaluate expression
     */
    async evaluateExpression(expression, options = {}) {
        if (this.isEvaluating) {
            this.evaluationQueue.push({ expression, options });
            return;
        }

        this.isEvaluating = true;

        try {
            const startTime = performance.now();

            // Call WASM service
            const result = await wasmService.evaluate(
                expression,
                appState.getState('angleMode')
            );

            const duration = performance.now() - startTime;

            if (result.error) {
                calculatorState.setError(result.error);
                this._updatePerformanceMetrics(duration, false);
                return { error: result.error };
            }

            // Update display
            calculatorState.setState({
                displayValue: result.formatted || result.value,
                expression: result.value,
                error: null,
                newInput: true
            });

            // Save to history
            calculatorState.addToHistory(expression, result.value);

            // Update metrics
            this._updatePerformanceMetrics(duration, true);

            localDataService.saveCalculation(expression, result.value).catch(e => {
                console.warn('Failed to save calculation locally:', e);
            });

            appState.incrementCalculationCount();

            return { value: result.value, error: null };
        } catch (error) {
            calculatorState.setError(error.message);
            return { error: error.message };
        } finally {
            this.isEvaluating = false;

            // Process queued evaluations
            if (this.evaluationQueue.length > 0) {
                const queued = this.evaluationQueue.shift();
                this.evaluateExpression(queued.expression, queued.options);
            }
        }
    }

    /**
     * ============ EQUATION SOLVING ============
     */

    /**
     * Solve equation
     */
    async solveEquation(equation, type = 'linear') {
        const typeMap = { 'linear': 0, 'quadratic': 1, 'cubic': 2 };
        
        try {
            const result = await wasmService.solveEquation(
                equation,
                typeMap[type] || 0
            );

            if (result.error) {
                calculatorState.setError(result.error);
                return { solutions: [], error: result.error };
            }

            return { solutions: result.solutions, error: null };
        } catch (error) {
            return { solutions: [], error: error.message };
        }
    }

    /**
     * ============ STATE OBSERVERS ============
     */

    /**
     * Watch expression changes
     */
    _onExpressionChange(value) {
        // Update UI
        this._updateDisplayPreview(value);
    }

    /**
     * Watch display changes
     */
    _onDisplayChange(value) {
        const displayElement = document.getElementById('displayOutput');
        if (displayElement) {
            displayElement.textContent = value || '0';
            this._renderMathDisplay(value);
        }
    }

    /**
     * Watch error changes
     */
    _onErrorChange(error) {
        if (error) {
            this._showErrorNotification(error);
        }
    }

    /**
     * ============ UI UPDATES ============
     */

    /**
     * Update display preview
     */
    _updateDisplayPreview(expression) {
        const buffer = document.getElementById('inputBuffer');
        if (buffer) {
            buffer.textContent = expression || '';
        }
    }

    /**
     * Render mathematical display (Natural Display)
     */
    _renderMathDisplay(value) {
        const display = document.getElementById('displayOutput');
        if (!display) return;

        // Convert to MathJax format if needed
        let mathContent = this._convertToMathFormat(value);
        
        // Render using MathJax if available
        if (typeof MathJax !== 'undefined') {
            display.innerHTML = mathContent;
            MathJax.typesetPromise([display]).catch(e => {
                console.warn('MathJax rendering failed:', e);
            });
        } else {
            display.textContent = value;
        }
    }

    /**
     * Convert to math format
     */
    _convertToMathFormat(value) {
        if (!value) return '0';

        // Simple conversions for display
        let formatted = value
            .replace(/sqrt\(/gi, '√(')
            .replace(/\^/g, '^')
            .replace(/π/g, 'π')
            .replace(/e/g, 'e');

        return formatted;
    }

    /**
     * Show error notification
     */
    _showErrorNotification(error) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification notification-error';
        notification.textContent = error;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #c0392b;
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 300ms ease-out;
            z-index: 1000;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);

        // Play error sound
        if (appState.getState('soundEnabled')) {
            inputController._playSound('error');
        }
    }

    /**
     * ============ PERFORMANCE MONITORING ============
     */

    /**
     * Update performance metrics
     */
    _updatePerformanceMetrics(duration, success) {
        const metrics = {
            lastCalculationTime: duration,
            success: success,
            timestamp: Date.now()
        };

        // Store metrics for analysis
        if (window.performanceMetrics) {
            window.performanceMetrics.push(metrics);
            if (window.performanceMetrics.length > 100) {
                window.performanceMetrics.shift();
            }
        } else {
            window.performanceMetrics = [metrics];
        }

        // Log if exceeds budget (100ms)
        if (duration > 100) {
            console.warn(`Calculation took ${duration.toFixed(2)}ms (budget: 100ms)`);
        }
    }

    /**
     * Get performance stats
     */
    getPerformanceStats() {
        if (!window.performanceMetrics || window.performanceMetrics.length === 0) {
            return null;
        }

        const metrics = window.performanceMetrics;
        const times = metrics.map(m => m.lastCalculationTime);
        const average = times.reduce((a, b) => a + b, 0) / times.length;
        const max = Math.max(...times);
        const min = Math.min(...times);

        return {
            count: metrics.length,
            average: average.toFixed(2) + 'ms',
            max: max.toFixed(2) + 'ms',
            min: min.toFixed(2) + 'ms',
            successRate: ((metrics.filter(m => m.success).length / metrics.length) * 100).toFixed(1) + '%'
        };
    }

    /**
     * ============ BATCH OPERATIONS ============
     */

    /**
     * Perform batch calculations
     */
    async batchEvaluate(expressions) {
        const results = [];
        
        for (const expr of expressions) {
            const result = await this.evaluateExpression(expr);
            results.push(result);
            
            // Small delay between evaluations
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        return results;
    }

    /**
     * ============ UNDO/REDO ============
     */

    /**
     * Perform undo
     */
    undo() {
        calculatorState.undo();
        this._updateDisplayPreview(calculatorState.getState('expression'));
    }

    /**
     * Perform redo
     */
    redo() {
        calculatorState.redo();
        this._updateDisplayPreview(calculatorState.getState('expression'));
    }

    /**
     * ============ EXPORT/IMPORT ============
     */

    /**
     * Export calculation history as CSV
     */
    exportHistory() {
        const history = calculatorState.getState('history');
        let csv = 'Expression,Result,Timestamp,Mode\n';

        history.forEach(item => {
            csv += `"${item.expression}","${item.result}","${item.timestamp}","${item.mode}"\n`;
        });

        // Download file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calculation-history-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    /**
     * Get diagnostics
     */
    getDiagnostics() {
        return {
            isEvaluating: this.isEvaluating,
            queueLength: this.evaluationQueue.length,
            performanceStats: this.getPerformanceStats(),
            calculatorState: calculatorState.getDiagnostics()
        };
    }
}

// Create and export singleton instance
const calcController = new CalcController();

// Debug in console
window.calcController = calcController;
