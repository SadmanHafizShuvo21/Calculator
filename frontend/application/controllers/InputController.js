/* ========================================
   INPUT CONTROLLER - Handle All User Input
   ======================================== */

class InputController {
    constructor() {
        this.lastInputTime = 0;
        this.inputDelay = 50; // Debounce in ms
        this.keyBindings = this._initKeyBindings();
        this.init();
    }

    /**
     * Initialize input listeners
     */
    init() {
        // Button click handlers
        this._setupButtonHandlers();

        // Keyboard input
        document.addEventListener('keydown', (e) => this._handleKeyDown(e));
        document.addEventListener('keyup', (e) => this._handleKeyUp(e));

        // Touch feedback
        this._setupTouchFeedback();

        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.btn')) {
                e.preventDefault();
            }
        }, { passive: false });

        console.log('✓ Input Controller initialized');
    }

    /**
     * ============ BUTTON HANDLERS ============
     */

    /**
     * Setup button click handlers
     */
    _setupButtonHandlers() {
        // Get all buttons
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            const key = button.dataset.key;

            // Click handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this._handleInput(key);
                this._playSound('click');
            });

            // Touch feedback
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            });

            button.addEventListener('touchend', () => {
                button.style.transform = '';
            });

            // Hover sound (optional)
            button.addEventListener('mouseenter', () => {
                if (appState.getState('soundEnabled')) {
                    // Play subtle hover sound
                }
            });
        });
    }

    /**
     * ============ KEYBOARD HANDLERS ============
     */

    /**
     * Initialize key bindings
     */
    _initKeyBindings() {
        return {
            // Numbers
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',

            // Operators
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '/',
            '^': '^',
            '=': '=',
            'Enter': '=',

            // Special keys
            '.': '.',
            '(': '(',
            ')': ')',
            'Escape': 'AC',
            'Backspace': 'backspace',
            'Delete': 'del',
            'ArrowLeft': 'ArrowLeft',
            'ArrowRight': 'ArrowRight',

            // Functions (mapped to keyboard shortcuts)
            'Shift+s': 'sin',
            'Shift+c': 'cos',
            'Shift+t': 'tan',
            'Shift+l': 'ln',
            'Shift+r': '√',
            'Shift+!': '!',

            // Special
            'Control+z': 'undo',
            'Control+Shift+z': 'redo',
            'Control+h': 'history',
            'Control+m': 'menu'
        };
    }

    /**
     * Handle key down
     */
    _handleKeyDown(e) {
        const key = this._getKeyName(e);

        if (!key) return;

        // Handle modifier keys
        let shortcut = key;
        if (e.ctrlKey || e.metaKey) shortcut = 'Control+' + shortcut;
        if (e.shiftKey) shortcut = 'Shift+' + shortcut;
        if (e.altKey) shortcut = 'Alt+' + shortcut;

        // Find matching binding
        const action = this.keyBindings[shortcut] || this.keyBindings[key];

        if (action) {
            e.preventDefault();
            this._handleInput(action);
        }
    }

    /**
     * Handle key up
     */
    _handleKeyUp(e) {
        // Could be used for key release actions
    }

    /**
     * Get standardized key name
     */
    _getKeyName(e) {
        const keyMap = {
            '*': '*',
            '+': '+',
            '-': '-',
            '/': '/',
            '.': '.',
            'Enter': 'Enter',
            'Backspace': 'Backspace',
            'Delete': 'Delete',
            'Escape': 'Escape',
            'ArrowUp': 'ArrowUp',
            'ArrowDown': 'ArrowDown',
            'ArrowLeft': 'ArrowLeft',
            'ArrowRight': 'ArrowRight',
            'Tab': 'Tab'
        };

        return keyMap[e.key] || e.key.toLowerCase();
    }

    /**
     * ============ INPUT ROUTING ============
     */

    /**
     * Main input handler - routes to appropriate function
     */
    async _handleInput(key) {
        // Debounce rapid inputs
        const now = Date.now();
        if (now - this.lastInputTime < this.inputDelay) {
            return;
        }
        this.lastInputTime = now;

        // Visual feedback
        this._highlightButton(key);

        // Route to handler
        switch (true) {
            // Digits
            case /^\d$/.test(key):
                calculatorState.appendDigit(key);
                break;

            // Decimal point
            case key === '.':
                if (!calculatorState.getState('expression').includes('.')) {
                    calculatorState.appendDigit('.');
                }
                break;

            // Operators
            case ['+', '-', '*', '/', '^'].includes(key):
                calculatorState.appendOperator(key);
                break;

            // Equals
            case key === '=':
                await calculatorState.evaluate();
                appState.incrementCalculationCount();
                break;

            // Clear
            case key === 'AC':
                calculatorState.clear();
                break;

            // Backspace
            case key === 'backspace':
                calculatorState.backspace();
                break;

            // Delete
            case key === 'del':
                calculatorState.delete();
                break;

            // Parentheses
            case key === '(' || key === ')':
                calculatorState.setState({
                    expression: calculatorState.getState('expression') + key
                });
                break;

            // Scientific functions
            case this._isFunction(key):
                this._handleFunction(key);
                break;

            // Memory operations
            case key.startsWith('m'):
                this._handleMemory(key);
                break;

            // Mode operations
            case key === 'mode':
                appState.toggleAngleMode();
                break;

            // Menu
            case key === 'menu':
                appState.toggleMenu();
                break;

            // Game
            case key === 'game':
                appState.setSidebarTab('game');
                break;

            // Undo/Redo
            case key === 'undo':
                calculatorState.undo();
                break;

            case key === 'redo':
                calculatorState.redo();
                break;

            default:
                console.log('Unknown input:', key);
        }
    }

    /**
     * Check if input is a scientific function
     */
    _isFunction(key) {
        const functions = ['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh',
                          'log', 'ln', 'e', '√', 'x²', 'x³', '^',
                          '!', 'π', 'nCr', 'nPr', 'frac', 'abs'];
        return functions.includes(key);
    }

    /**
     * Handle function calls
     */
    _handleFunction(func) {
        const expr = calculatorState.getState('expression');
        let newExpr = expr;

        switch (func) {
            case '√':
                newExpr = '√(' + expr + ')';
                break;
            case 'x²':
                newExpr = '(' + expr + ')²';
                break;
            case 'x³':
                newExpr = '(' + expr + ')³';
                break;
            case '!':
                newExpr = expr + '!';
                break;
            case 'π':
                newExpr = expr + 'π';
                break;
            case 'e':
                newExpr = expr + 'e';
                break;
            default:
                newExpr = func + '(' + expr + ')';
        }

        calculatorState.setState({ expression: newExpr });
    }

    /**
     * Handle memory operations
     */
    _handleMemory(key) {
        const expr = calculatorState.getState('expression');
        const value = parseFloat(expr) || 0;

        switch (key) {
            case 'm+':
                appState.addToMemory('M', value);
                this._playSound('memory');
                break;
            case 'm-':
                appState.addToMemory('M', -value);
                this._playSound('memory');
                break;
            case 'mr':
                const memValue = appState.getMemory('M');
                calculatorState.setState({
                    expression: memValue.toString(),
                    displayValue: memValue.toString()
                });
                break;
            case 'mc':
                appState.setMemory('M', 0);
                break;
        }
    }

    /**
     * ============ VISUAL FEEDBACK ============
     */

    /**
     * Highlight button when pressed
     */
    _highlightButton(key) {
        const button = document.querySelector(`[data-key="${key}"]`);
        if (button) {
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
        }
    }

    /**
     * Setup touch feedback
     */
    _setupTouchFeedback() {
        // Haptic feedback on touch
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn') && navigator.vibrate) {
                if (appState.getState('vibrateEnabled')) {
                    navigator.vibrate(10);
                }
            }
        });
    }

    /**
     * ============ AUDIO FEEDBACK ============
     */

    /**
     * Play sound effect
     */
    _playSound(type) {
        if (!appState.getState('soundEnabled')) return;

        // Use Web Audio API for sound synthesis
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        // Different sounds for different actions
        switch (type) {
            case 'click':
                oscillator.frequency.value = 800;
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'memory':
                oscillator.frequency.value = 600;
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;

            case 'error':
                oscillator.frequency.value = 300;
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
        }
    }

    /**
     * ============ GESTURE SUPPORT ============
     */

    /**
     * Handle multi-touch gestures (pinch to zoom, etc.)
     */
    _setupGestures() {
        // Could implement pinch-to-zoom, two-finger tap, etc.
        // For now, basic touch support is sufficient
    }
}

// Create and export singleton instance
const inputController = new InputController();

// Debug in console
window.inputController = inputController;
