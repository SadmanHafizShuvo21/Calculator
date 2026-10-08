/**
 * ButtonGrid.js
 * [CALC-3.2] Button Grid Component
 * 
 * Manages the 5-column × 8-row button grid:
 * - Button click handlers
 * - Button press animation
 * - SHIFT/ALPHA modifier states
 * - Visual feedback (scale, shadow)
 */

class ButtonGrid {
  constructor() {
    this.gridElement = document.getElementById('buttonGrid');
    this.buttons = Array.from(document.querySelectorAll('#calculator .btn'));
    this.modeIndicator = document.getElementById('modeIndicator');

    this.shiftActive = false;
    this.alphaActive = false;
    this.buttonPressCallbacks = [];

    this.init();
  }

  /**
   * Initialize button grid event listeners
   */
  init() {
    this.buttons.forEach(button => {
      // Click handler
      button.addEventListener('click', (e) => this.handleButtonPress(button, e));

      // Keyboard focus styling (for accessibility)
      button.addEventListener('focus', (e) => this.handleButtonFocus(button, e));
      button.addEventListener('blur', (e) => this.handleButtonBlur(button));
    });

    // Physical keyboard support (wired later by InputController)
    this.setupKeyboardBindings();
  }

  /**
   * Handle button press event
   * @param {HTMLElement} button - Button element
   * @param {Event} event - Click event
   */
  handleButtonPress(button, event) {
    event.preventDefault();

    const key = button.getAttribute('data-key');
    const type = button.getAttribute('data-type');

    // Add visual press animation
    this.animateButtonPress(button);

    // Handle different button types
    switch (type) {
      case 'modifier':
        this.handleModifier(key);
        break;
      case 'number':
        this.notifyListeners({ type: 'number', value: key });
        break;
      case 'operator':
        this.notifyListeners({ type: 'operator', value: key });
        break;
      case 'function':
        this.notifyListeners({ type: 'function', value: key });
        break;
      case 'control':
        this.notifyListeners({ type: 'control', value: key });
        break;
      case 'memory':
        this.notifyListeners({ type: 'memory', value: key });
        break;
      case 'equals':
        this.notifyListeners({ type: 'equals', value: key });
        break;
      case 'navigation':
        this.notifyListeners({ type: 'navigation', value: key });
        break;
      default:
        console.warn(`Unknown button type: ${type}`);
    }
  }

  /**
   * Handle SHIFT/ALPHA modifier buttons
   * @param {string} key - Modifier key ('shift' or 'alpha')
   */
  handleModifier(key) {
    if (key === 'shift') {
      this.shiftActive = !this.shiftActive;
      this.alphaActive = false; // Cancel ALPHA
      this.updateModifierUI();
    } else if (key === 'alpha') {
      this.alphaActive = !this.alphaActive;
      this.shiftActive = false; // Cancel SHIFT
      this.updateModifierUI();
    }
  }

  /**
   * Update modifier indicator visual state
   */
  updateModifierUI() {
    if (this.shiftActive) {
      this.modeIndicator.classList.add('shift-active');
      this.modeIndicator.classList.remove('alpha-active');
    } else if (this.alphaActive) {
      this.modeIndicator.classList.add('alpha-active');
      this.modeIndicator.classList.remove('shift-active');
    } else {
      this.modeIndicator.classList.remove('shift-active', 'alpha-active');
    }
  }

  /**
   * Animate button press with scale and shadow
   * @param {HTMLElement} button - Button to animate
   */
  animateButtonPress(button) {
    button.classList.add('pressed');
    
    // Remove animation class after duration (allow re-triggering)
    setTimeout(() => {
      button.classList.remove('pressed');
    }, 80); // Matches --btn-press-duration
  }

  /**
   * Handle button focus (visual feedback for keyboard navigation)
   * @param {HTMLElement} button - Focused button
   * @param {Event} event - Focus event
   */
  handleButtonFocus(button, event) {
    button.style.outline = '2px solid var(--btn-shift-bg)';
    button.style.outlineOffset = '-2px';
  }

  /**
   * Handle button blur (remove focus styling)
   * @param {HTMLElement} button - Blurred button
   */
  handleButtonBlur(button) {
    button.style.outline = 'none';
  }

  /**
   * Set up keyboard bindings for physical keyboard input
   * Maps physical keys to calculator buttons
   */
  setupKeyboardBindings() {
    // This will be called by InputController with proper event delegation
    // For now, just a placeholder for documentation
    
    // Example mappings:
    // '0-9' -> number buttons
    // '+', '-', '*', '/' -> operator buttons
    // 'Enter' -> equals
    // 'Backspace' -> delete
    // 'Escape' -> AC (all clear)
    // 'Shift' -> SHIFT modifier
    // 'Alt' -> ALPHA modifier
  }

  /**
   * Get a button by data-key attribute
   * @param {string} key - Data key value
   * @returns {HTMLElement|null} Button element or null
   */
  getButtonByKey(key) {
    return document.querySelector(`#calculator [data-key="${key}"]`);
  }

  /**
   * Simulate button press programmatically (for testing)
   * @param {string} key - Button key to press
   */
  pressButton(key) {
    const button = this.getButtonByKey(key);
    if (button) {
      button.click();
    } else {
      console.warn(`Button with key '${key}' not found`);
    }
  }

  /**
   * Register callback for button press events
   * @param {Function} callback - Callback function(event)
   */
  onButtonPress(callback) {
    this.buttonPressCallbacks.push(callback);
  }

  /**
   * Notify listeners of button press
   * @param {Object} event - Event object {type, value, shift, alpha}
   */
  notifyListeners(event) {
    // Add modifier states to event
    event.shift = this.shiftActive;
    event.alpha = this.alphaActive;

    // Call all registered callbacks
    this.buttonPressCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error in button press callback:', err);
      }
    });

    // Auto-deactivate modifiers after function button press
    if (event.type === 'function' && (this.shiftActive || this.alphaActive)) {
      // Let controller decide when to deactivate
      // For now, don't auto-deactivate here
    }
  }

  /**
   * Disable all buttons
   */
  disableAll() {
    this.buttons.forEach(btn => btn.disabled = true);
  }

  /**
   * Enable all buttons
   */
  enableAll() {
    this.buttons.forEach(btn => btn.disabled = false);
  }

  /**
   * Get current modifier state
   * @returns {Object} {shift, alpha}
   */
  getModifierState() {
    return {
      shift: this.shiftActive,
      alpha: this.alphaActive,
    };
  }

  /**
   * Clear modifier state (deactivate SHIFT/ALPHA)
   */
  clearModifiers() {
    this.shiftActive = false;
    this.alphaActive = false;
    this.updateModifierUI();
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ButtonGrid;
}
