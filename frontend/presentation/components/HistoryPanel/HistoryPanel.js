/* ========================================
   HISTORY PANEL COMPONENT - Calculation History Management
   ======================================== */

class HistoryPanel {
    constructor() {
        this.historyList = document.getElementById('historyList');
        this.maxDisplayItems = 50;
        this.init();
    }

    init() {
        // Subscribe to history changes
        calculatorState.subscribe('history', (value) => this._renderHistory(value));

        // Setup event delegation
        this._setupEventListeners();

        console.log('✓ History Panel initialized');
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        if (!this.historyList) return;

        // Event delegation for history items
        this.historyList.addEventListener('click', (e) => {
            const item = e.target.closest('.history-item');
            if (!item) return;

            const id = parseInt(item.dataset.id);
            const action = e.target.dataset.action;

            switch (action) {
                case 'reuse':
                    this._reuseCalculation(id);
                    break;
                case 'delete':
                    this._deleteCalculation(id);
                    break;
                case 'copy':
                    this._copyToClipboard(id);
                    break;
            }
        });
    }

    /**
     * Render history list
     */
    _renderHistory(history) {
        if (!this.historyList) return;

        if (!history || history.length === 0) {
            this.historyList.innerHTML = '<div class="empty-state">No calculations yet</div>';
            return;
        }

        let html = '';

        history.slice(0, this.maxDisplayItems).forEach(item => {
            const timestamp = new Date(item.timestamp).toLocaleTimeString();
            const expression = this._truncate(item.expression, 30);
            const result = this._truncate(item.result, 20);

            html += `
                <div class="history-item" data-id="${item.id}">
                    <div class="history-expression" title="${item.expression}">
                        ${this._escapeHtml(expression)}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="history-result">${this._escapeHtml(result)}</div>
                        <div style="display: flex; gap: 8px; font-size: 12px;">
                            <button data-action="reuse" class="history-action-btn" title="Reuse calculation">↻</button>
                            <button data-action="copy" class="history-action-btn" title="Copy result">📋</button>
                            <button data-action="delete" class="history-action-btn" title="Delete">🗑</button>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
                        ${timestamp} • ${item.mode || 'DEG'}
                    </div>
                </div>
            `;
        });

        this.historyList.innerHTML = html;

        // Add animation to new items
        const items = this.historyList.querySelectorAll('.history-item');
        items.forEach((item, index) => {
            item.style.animation = `slideDown 300ms ease-out ${index * 50}ms both`;
        });
    }

    /**
     * Reuse calculation
     */
    _reuseCalculation(id) {
        calculatorState.reuseHistoryItem(id);

        // Scroll to calculator
        const calc = document.querySelector('.calculator-panel');
        if (calc) {
            calc.scrollIntoView({ behavior: 'smooth' });
        }

        // Visual feedback
        const input = document.getElementById('gameGuessInput');
        if (input) {
            input.focus();
        }
    }

    /**
     * Delete calculation
     */
    _deleteCalculation(id) {
        if (confirm('Delete this calculation?')) {
            calculatorState.deleteHistoryItem(id);
        }
    }

    /**
     * Copy result to clipboard
     */
    _copyToClipboard(id) {
        const item = calculatorState.getHistoryItem(id);
        if (item) {
            navigator.clipboard.writeText(item.result)
                .then(() => {
                    this._showNotification('Copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    this._showNotification('Failed to copy', 'error');
                });
        }
    }

    /**
     * Clear all history
     */
    clearHistory() {
        if (confirm('Clear all calculation history?')) {
            calculatorState.clearHistory();
            this._showNotification('History cleared', 'info');
        }
    }

    /**
     * Export history as JSON
     */
    exportHistoryJSON() {
        const history = calculatorState.getState('history');
        const json = JSON.stringify(history, null, 2);
        this._downloadFile(json, 'calculation-history.json', 'application/json');
    }

    /**
     * Export history as CSV
     */
    exportHistoryCSV() {
        const history = calculatorState.getState('history');
        let csv = 'Expression,Result,Time,Mode\n';

        history.forEach(item => {
            csv += `"${item.expression}","${item.result}","${item.timestamp}","${item.mode}"\n`;
        });

        this._downloadFile(csv, 'calculation-history.csv', 'text/csv');
    }

    /**
     * Search history
     */
    searchHistory(query) {
        const history = calculatorState.getState('history');
        
        return history.filter(item => {
            const expr = item.expression.toLowerCase();
            const result = item.result.toLowerCase();
            const q = query.toLowerCase();

            return expr.includes(q) || result.includes(q);
        });
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const history = calculatorState.getState('history');

        if (history.length === 0) {
            return {
                totalCalculations: 0,
                averageExpressionLength: 0,
                mostFrequentOperator: null,
                dateRange: null
            };
        }

        const operators = {};
        let totalLength = 0;

        history.forEach(item => {
            totalLength += item.expression.length;

            // Count operators
            const ops = item.expression.match(/[+\-*/^]/g);
            if (ops) {
                ops.forEach(op => {
                    operators[op] = (operators[op] || 0) + 1;
                });
            }
        });

        const mostFrequent = Object.entries(operators)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            totalCalculations: history.length,
            averageExpressionLength: Math.round(totalLength / history.length),
            mostFrequentOperator: mostFrequent ? mostFrequent[0] : null,
            oldestCalculation: history[history.length - 1]?.timestamp,
            newestCalculation: history[0]?.timestamp
        };
    }

    /**
     * ============ UTILITY METHODS ============
     */

    /**
     * Truncate text
     */
    _truncate(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length - 3) + '...';
    }

    /**
     * Escape HTML
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show notification
     */
    _showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#c0392b' : '#3498db'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            animation: slideUp 300ms ease-out;
            z-index: 1000;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    /**
     * Download file
     */
    _downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);

        this._showNotification(`Downloaded: ${filename}`, 'success');
    }

    /**
     * Get diagnostics
     */
    getDiagnostics() {
        return {
            historySize: calculatorState.getState('history').length,
            statistics: this.getStatistics()
        };
    }
}

// Initialize on load
const historyPanel = new HistoryPanel();
window.historyPanel = historyPanel;
