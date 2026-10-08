/**
 * Display.js
 * [CALC-3.1] LCD Display Component
 * 
 * Manages the calculator display area:
 * - Expression line (top, smaller text)
 * - Result line (bottom, larger text)
 * - Mode indicators (DEG, RAD, GRAD, M)
 * - Display update logic
 */

class Display {
  constructor() {
    this.displayElement = document.getElementById('display');
    this.expressionLine = document.getElementById('expressionLine');
    this.resultLine = document.getElementById('resultLine');
    this.modeIndicators = {
      deg: document.getElementById('indicator-deg'),
      rad: document.getElementById('indicator-rad'),
      grad: document.getElementById('indicator-grad'),
      memory: document.getElementById('indicator-m'),
    };

    this.currentExpression = '0';
    this.currentResult = '0';
    this.angleMode = 'deg';
    this.hasMemory = false;

    this.init();
  }

  /**
   * Initialize display with startup animation
   */
  init() {
    // Trigger LCD startup flicker animation
    this.displayElement.classList.add('startup');
    
    // Remove animation class after duration
    setTimeout(() => {
      this.displayElement.classList.remove('startup');
      this.update('0', '0');
    }, 150); // Matches --lcd-flicker-duration

    // Optional: Enable glow effect
    // this.displayElement.classList.add('glow');
  }

  /**
   * Update display with expression and result
   * @param {string} expression - Current input expression
   * @param {string} result - Calculated result
   */
  update(expression = this.currentExpression, result = this.currentResult) {
    this.currentExpression = expression || '0';
    this.currentResult = result || '0';
    this.displayElement.classList.toggle(
      'has-input',
      this.currentExpression !== '0' || this.currentResult !== '0'
    );

    this.expressionLine.textContent = this.formatExpression(this.currentExpression);
    this.resultLine.textContent = this.formatResult(this.currentResult);
  }

  /**
   * Format expression for display
   * Replace symbols with display-friendly versions
   * @param {string} expr - Expression to format
   * @returns {string} Formatted expression
   */
  formatExpression(expr) {
    if (!expr || expr === '0') return '';
    
    let formatted = expr
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/-/g, '−')
      .replace(/\^/g, '^');
    
    // Truncate if too long (right-align display)
    if (formatted.length > 20) {
      formatted = '…' + formatted.slice(-19);
    }
    
    return formatted;
  }

  /**
   * Format result for display
   * Handle very large/small numbers (scientific notation)
   * @param {string} result - Result to format
   * @returns {string} Formatted result
   */
  formatResult(result) {
    if (!result || result === '0') return '0';

    const num = parseFloat(result);

    if (Number.isNaN(num) &&
        window.appState?.getState('calculatorMode') === 'base-n' &&
        /^[0-9a-f]+$/i.test(result)) {
      return result.toUpperCase();
    }
    
    // Check if number is very large or very small
    if (Math.abs(num) > 9999999999 || (Math.abs(num) < 0.0001 && num !== 0)) {
      return num.toExponential(10).replace('e', '×10');
    }

    // Truncate to fit display
    if (result.length > 15) {
      return result.substring(0, 15);
    }

    return result;
  }

  /**
   * Set angle mode (affects display indicator)
   * @param {string} mode - 'deg', 'rad', or 'grad'
   */
  setAngleMode(mode) {
    if (!['deg', 'rad', 'grad'].includes(mode)) {
      console.warn(`Invalid angle mode: ${mode}`);
      return;
    }

    this.angleMode = mode;
    
    // Update indicators
    Object.keys(this.modeIndicators).forEach(key => {
      if (key !== 'memory') {
        if (key === mode) {
          this.modeIndicators[key].classList.add('active');
        } else {
          this.modeIndicators[key].classList.remove('active');
        }
      }
    });
  }

  /**
   * Toggle memory indicator
   * @param {boolean} hasValue - True if memory has a value
   */
  setMemoryIndicator(hasValue) {
    this.hasMemory = hasValue;
    if (hasValue) {
      this.modeIndicators.memory.classList.add('active');
    } else {
      this.modeIndicators.memory.classList.remove('active');
    }
  }

  /**
   * Clear display (show 0)
   */
  clear() {
    this.update('0', '0');
  }

  /**
   * Show error message on display
   * @param {string} errorMsg - Error message to display
   */
  showError(errorMsg) {
    this.resultLine.textContent = 'Error: ' + errorMsg;
    this.resultLine.style.color = 'var(--btn-delete-bg)';
    
    // Reset color after 3 seconds
    setTimeout(() => {
      this.resultLine.style.color = 'var(--display-text)';
    }, 3000);
  }

  /**
   * Append character to expression (visual only, no calculation)
   * @param {string} char - Character to append
   */
  appendCharacter(char) {
    if (this.currentExpression === '0' && char !== '.') {
      this.currentExpression = char;
    } else {
      this.currentExpression += char;
    }
    this.update(this.currentExpression, this.currentResult);
  }

  /**
   * Remove last character from expression
   */
  backspace() {
    if (this.currentExpression.length > 1) {
      this.currentExpression = this.currentExpression.slice(0, -1);
    } else {
      this.currentExpression = '0';
    }
    this.update(this.currentExpression, this.currentResult);
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Display;
}
