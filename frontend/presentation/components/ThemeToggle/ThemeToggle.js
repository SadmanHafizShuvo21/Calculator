/* ========================================
   THEME TOGGLE COMPONENT - Dark/Light Mode Management
   ======================================== */

class ThemeToggle {
    constructor() {
        this.currentTheme = appState.getState('theme');
        this.init();
    }

    init() {
        this._setupEventListeners();
        this._applyTheme(this.currentTheme);

        // Listen to state changes
        appState.subscribe('theme', (value) => {
            this.currentTheme = value;
            this._applyTheme(value);
            this._updateToggleButton();
        });

        console.log('✓ Theme Toggle initialized');
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                appState.toggleTheme();
            });
        }
    }

    /**
     * Apply theme to document
     */
    _applyTheme(theme) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);

        // Set meta theme color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            if (theme === 'dark') {
                metaTheme.setAttribute('content', '#1a1a1a');
            } else {
                metaTheme.setAttribute('content', '#f5f5f5');
            }
        }

        // Emit event
        window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    }

    /**
     * Update toggle button appearance
     */
    _updateToggleButton() {
        const themeBtn = document.getElementById('themeToggle');
        const themeIcon = themeBtn?.querySelector('.theme-icon');

        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            themeIcon.style.animation = 'spin 0.6s ease-in-out';

            setTimeout(() => {
                themeIcon.style.animation = '';
            }, 600);
        }
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
        appState.setTheme(theme);
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        appState.toggleTheme();
    }
}

// Initialize on load
const themeToggle = new ThemeToggle();
window.themeToggle = themeToggle;
