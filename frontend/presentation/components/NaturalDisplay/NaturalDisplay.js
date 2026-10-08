/* ========================================
   NATURAL DISPLAY COMPONENT - Mathematical Display Rendering
   ======================================== */

class NaturalDisplay {
    constructor() {
        this.displayElement = document.getElementById('displayOutput');
        this.inputBuffer = document.getElementById('inputBuffer');
        this.init();
    }

    init() {
        // Subscribe to calculator state
        calculatorState.subscribe('displayValue', (value) => this._render(value));
        calculatorState.subscribe('expression', (value) => this._renderExpression(value));

        // Subscribe to app state for angle mode
        appState.subscribe('angleMode', () => this._updateModeIndicator());

        console.log('✓ Natural Display initialized');
    }

    /**
     * Render display value
     */
    _render(value) {
        if (!this.displayElement) return;

        // Format value for display
        const formatted = this._formatValue(value);

        // Use MathJax if available for nice rendering
        if (typeof MathJax !== 'undefined') {
            this.displayElement.innerHTML = this._toMathJax(formatted);
            MathJax.typesetPromise([this.displayElement]).catch(e => {
                // Fallback to plain text
                this.displayElement.textContent = formatted;
            });
        } else {
            this.displayElement.textContent = formatted;
        }

        // Add glow effect
        this._addGlowEffect();
    }

    /**
     * Render expression in input buffer
     */
    _renderExpression(expr) {
        if (!this.inputBuffer) return;

        // Convert expression to readable format
        const readable = this._formatExpression(expr);
        this.inputBuffer.textContent = readable;
    }

    /**
     * Format value for display
     */
    _formatValue(value) {
        if (!value) return '0';

        // Handle error states
        if (value === 'Error' || value === 'NaN' || value === 'Infinity') {
            return value;
        }

        // Remove unnecessary trailing zeros
        let formatted = value.toString();

        // Handle scientific notation
        if (formatted.includes('e')) {
            return formatted;
        }

        // Limit decimal places
        const num = parseFloat(formatted);
        if (!isNaN(num)) {
            // Round to 10 significant digits
            if (Math.abs(num) < 1e-9 || Math.abs(num) > 1e10) {
                formatted = num.toExponential(8);
            } else {
                // Limit to reasonable decimal places
                formatted = parseFloat(formatted).toPrecision(12);
                // Remove trailing zeros
                formatted = formatted.replace(/\.?0+$/, '');
            }
        }

        return formatted;
    }

    /**
     * Format expression for display
     */
    _formatExpression(expr) {
        if (!expr) return '';

        let formatted = expr
            // Replace operators with symbols
            .replace(/\*/g, '×')
            .replace(/\//g, '÷')
            .replace(/\^/g, '^')
            .replace(/sqrt/gi, '√')
            .replace(/pi/gi, 'π')
            .replace(/e/gi, 'e');

        // Limit length to avoid overflow
        if (formatted.length > 100) {
            formatted = formatted.substring(0, 97) + '...';
        }

        return formatted;
    }

    /**
     * Convert to MathJax format
     */
    _toMathJax(value) {
        if (!value || value === '0') return '0';

        // Wrap in MathJax delimiters
        let math = value
            .replace(/√/g, '\\sqrt{}')
            .replace(/π/g, '\\pi')
            .replace(/≈/g, '\\approx')
            .replace(/∞/g, '\\infty')
            .replace(/÷/g, '\\div')
            .replace(/×/g, '\\times');

        // Return as inline math
        return `\\(${math}\\)`;
    }

    /**
     * Add glow effect to display
     */
    _addGlowEffect() {
        if (this.displayElement) {
            this.displayElement.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.4)';

            // Remove glow after animation
            setTimeout(() => {
                this.displayElement.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
            }, 100);
        }
    }

    /**
     * Update mode indicator display
     */
    _updateModeIndicator() {
        const modeIndicator = document.getElementById('modeIndicator');
        if (modeIndicator) {
            modeIndicator.textContent = appState.getState('angleMode');
        }
    }

    /**
     * Format fraction display (1/2 → ½)
     */
    _formatFraction(numerator, denominator) {
        const fractionMap = {
            '1/2': '½',
            '1/3': '⅓',
            '2/3': '⅔',
            '1/4': '¼',
            '3/4': '¾',
            '1/5': '⅕',
            '2/5': '⅖',
            '3/5': '⅗',
            '4/5': '⅘',
            '1/6': '⅙',
            '5/6': '⅚',
            '1/8': '⅛',
            '3/8': '⅜',
            '5/8': '⅝',
            '7/8': '⅞'
        };

        const frac = `${numerator}/${denominator}`;
        return fractionMap[frac] || frac;
    }

    /**
     * Format complex number (a+bi)
     */
    _formatComplex(real, imaginary) {
        if (imaginary === 0) return real.toString();

        const sign = imaginary > 0 ? '+' : '';
        return `${real}${sign}${imaginary}i`;
    }

    /**
     * Format matrix display
     */
    _formatMatrix(matrix) {
        if (!Array.isArray(matrix) || matrix.length === 0) {
            return '[]';
        }

        // Create nice matrix display
        let display = '[';
        for (let i = 0; i < matrix.length; i++) {
            if (i > 0) display += '; ';
            if (Array.isArray(matrix[i])) {
                display += matrix[i].join(', ');
            } else {
                display += matrix[i];
            }
        }
        display += ']';

        return display;
    }

    /**
     * Clear display
     */
    clear() {
        if (this.displayElement) {
            this.displayElement.textContent = '0';
            this.displayElement.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
        }
        if (this.inputBuffer) {
            this.inputBuffer.textContent = '';
        }
    }

    /**
     * Get diagnostics
     */
    getDiagnostics() {
        return {
            displayValue: this.displayElement?.textContent,
            expression: this.inputBuffer?.textContent,
            hasMathJax: typeof MathJax !== 'undefined'
        };
    }
}

// Initialize on load
const naturalDisplay = new NaturalDisplay();
window.naturalDisplay = naturalDisplay;
