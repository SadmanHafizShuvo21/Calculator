/* ========================================
   APP BOOTSTRAP - Application Initialization & Startup
   ======================================== */

console.log('🚀 Calculator App Starting...');

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  console.log('✅ DOM loaded, initializing components...');

  try {
    // Initialize Display Component
    const display = new Display();
    console.log('✅ Display component initialized');
    window.display = display;

    // Initialize Button Grid Component
    const buttonGrid = new ButtonGrid();
    console.log('✅ Button Grid component initialized');
    window.buttonGrid = buttonGrid;
    setupCalculatorModes(display);

    // Setup theme toggle
    setupThemeToggle();
    console.log('✅ Theme toggle ready');

    // Setup button press callback
    buttonGrid.onButtonPress((event) => {
      console.log('Button pressed:', event);
      
      // Temporarily update display to show button was pressed
      if (event.type === 'number') {
        display.appendCharacter(event.value);
      } else if (event.type === 'control' && event.value === 'AC') {
        display.clear();
        buttonGrid.clearModifiers();
      } else if (event.type === 'control' && event.value === 'ON') {
        display.clear();
        buttonGrid.clearModifiers();
      } else if (event.type === 'control' && event.value === 'DEL') {
        display.backspace();
      } else if (event.type === 'control' && event.value === 'STO') {
        handleMemoryKey(display, event.shift);
      } else if (event.type === 'control' && event.value === 'ENG') {
        toggleEngineeringResult(display);
      } else if (event.type === 'control' && event.value === 'S⇔D') {
        toggleDecimalResult(display);
      } else if (event.type === 'control' && event.value === 'menu') {
        const modeMenu = document.getElementById('modeMenu');
        modeMenu.hidden = !modeMenu.hidden;
      } else if (event.type === 'operator') {
        display.appendCharacter(' ' + event.value + ' ');
      } else if (event.type === 'function') {
        if (appState.getState('calculatorMode') === 'base-n' &&
            ['not', 'neg'].includes(event.value.toLowerCase())) {
          display.appendCharacter(event.value.toUpperCase() + ' ');
        } else if (event.value === 'x²') {
          display.appendCharacter('^2');
        } else if (event.value === '√') {
          display.appendCharacter('sqrt(');
        } else if (event.value === 'Ans') {
          display.appendCharacter(display.currentResult);
        } else if (event.value === '×10ˣ') {
          display.appendCharacter('×10^');
        } else if (event.value === 'π' || event.value === 'e') {
          display.appendCharacter(event.value);
        } else if (event.value === '!') {
          display.appendCharacter('!');
        } else {
          display.appendCharacter(event.value + '(');
        }
      } else if (event.type === 'equals') {
        evaluateCurrentExpression(display);
      } else if (event.type === 'memory' && event.value === 'M+') {
        const current = Number(display.currentResult);
        if (Number.isFinite(current)) {
          const memory = appState.getMemory('M') + current;
          appState.setMemory('M', memory);
          display.setMemoryIndicator(memory !== 0);
        }
      } else if (event.type === 'navigation') {
        navigateHistory(display, event.value);
      }
    });

    console.log('✅ All components initialized successfully!');
    console.log('💡 Ready for state management and WASM wiring');

  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
}

function setupCalculatorModes(display) {
  const modeMenu = document.getElementById('modeMenu');
  const baseNPanel = document.getElementById('baseNPanel');
  const baseNIndicator = document.getElementById('baseNIndicator');
  const angleIndicators = document.querySelectorAll('[data-mode]');
  let radix = 10;
  const initialMode = appState.getState('calculatorMode') === 'base-n' ? 'base-n' : 'calculate';

  baseNPanel.hidden = initialMode !== 'base-n';
  display.displayElement.classList.toggle('base-n-mode', initialMode === 'base-n');
  baseNIndicator.classList.toggle('active', initialMode === 'base-n');
  angleIndicators.forEach(indicator => {
    indicator.hidden = initialMode === 'base-n' && Boolean(indicator.dataset.mode);
  });
  modeMenu.querySelectorAll('[data-calculator-mode]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.calculatorMode === initialMode));
  });
  display.setMemoryIndicator(appState.getMemory('M') !== 0);

  modeMenu.querySelectorAll('[data-calculator-mode]').forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.calculatorMode;
      appState.setState({ calculatorMode: mode });
      modeMenu.hidden = true;
      baseNPanel.hidden = mode !== 'base-n';
      display.displayElement.classList.toggle('base-n-mode', mode === 'base-n');
      baseNIndicator.classList.toggle('active', mode === 'base-n');
      angleIndicators.forEach(indicator => {
        indicator.hidden = mode === 'base-n' && indicator.dataset.mode;
      });
      modeMenu.querySelectorAll('[data-calculator-mode]').forEach(option => {
        option.setAttribute('aria-pressed', String(option === button));
      });
      display.clear();
    });
  });

  baseNPanel.querySelectorAll('[data-radix]').forEach(button => {
    button.addEventListener('click', () => {
      radix = Number(button.dataset.radix);
      baseNIndicator.textContent = button.textContent;
      baseNPanel.querySelectorAll('[data-radix]').forEach(option => {
        const active = option === button;
        option.classList.toggle('is-active', active);
        option.setAttribute('aria-pressed', String(active));
      });
    });
  });

  window.getCalculatorRadix = () => radix;
}

function handleMemoryKey(display, recall) {
  if (recall) {
    display.appendCharacter(String(appState.getMemory('M')));
    return;
  }

  const value = Number(display.currentResult);
  if (!Number.isFinite(value)) {
    display.showError('Math ERROR');
    return;
  }

  appState.setMemory('M', value);
  display.setMemoryIndicator(value !== 0);
}

async function navigateHistory(display, direction) {
  try {
    const { history, error } = await localDataService.getCalculationHistory(100);
    if (error) {
      console.error('Unable to read calculation history:', error);
      return;
    }

    if (!history.length) return;
    if (!window.calculationHistory) {
      window.calculationHistory = history.sort(
        (first, second) => new Date(second.timestamp) - new Date(first.timestamp)
      );
      window.calculationHistoryIndex = -1;
    }

    const isPrevious = ['↑', '◀', '←'].includes(direction);
    const nextIndex = window.calculationHistoryIndex === -1
      ? (isPrevious ? 0 : -1)
      : Math.max(
        -1,
        Math.min(
          window.calculationHistory.length - 1,
          window.calculationHistoryIndex + (isPrevious ? 1 : -1)
        )
      );
    window.calculationHistoryIndex = nextIndex;
    if (nextIndex === -1) {
      display.clear();
      return;
    }

    const calculation = window.calculationHistory[nextIndex];
    display.update(calculation.expression, calculation.result);
    display.exactResult = String(calculation.result);
    display.formattedResult = String(calculation.result);
  } catch (error) {
    console.error('Unable to navigate calculation history:', error);
  }
}

function toggleEngineeringResult(display) {
  if (!display.exactResult || !Number.isFinite(Number(display.exactResult))) return;
  display.isEngineering = !display.isEngineering;
  if (!display.isEngineering) {
    display.update(display.currentExpression, display.formattedResult);
    return;
  }

  const value = Number(display.exactResult);
  if (value === 0) {
    display.update(display.currentExpression, '0');
    return;
  }

  const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
  const mantissa = value / (10 ** exponent);
  display.update(display.currentExpression, `${Number(mantissa.toPrecision(10))}e${exponent}`);
}

function toggleDecimalResult(display) {
  if (!display.exactResult || !display.formattedResult) return;
  display.showingExactResult = !display.showingExactResult;
  display.update(
    display.currentExpression,
    display.showingExactResult ? display.exactResult : display.formattedResult
  );
}

async function evaluateCurrentExpression(display) {
  const expression = display.currentExpression;
  const baseN = appState.getState('calculatorMode') === 'base-n';
  const result = await wasmService.evaluate(expression, appState.getState('angleMode'), {
    baseN,
    radix: window.getCalculatorRadix()
  });

  if (result.error) {
    display.showError(result.error);
    return;
  }

  display.update(expression, result.formatted || result.value);
  display.exactResult = String(result.value);
  display.formattedResult = String(result.formatted || result.value);
  display.showingExactResult = false;
  window.calculationHistory = null;
  try {
    await localDataService.saveCalculation(expression, result.value);
  } catch (error) {
    console.error('Failed to save calculation locally:', error);
  }
}

/**
 * Setup theme toggle functionality
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  if (!themeToggle) {
    console.warn('⚠️ Theme toggle button not found');
    return;
  }

  // Get stored theme or default to 'dark'
  const savedTheme = localStorage.getItem('casio-theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeToggle);

  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('casio-theme', newTheme);
    updateThemeIcon(newTheme, themeToggle);
    
    console.log(`🌓 Theme changed to: ${newTheme}`);
  });
}

/**
 * Update theme toggle icon
 */
function updateThemeIcon(theme, button) {
  button.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ========================================
   LEGACY BOOTSTRAP CLASS (kept for compatibility)
   ======================================== */

class AppBootstrap {
    constructor() {
        this.startTime = performance.now();
        this.initStatus = {
            state: false,
            services: false,
            controllers: false,
            components: false,
            complete: true
        };
    }

    async initialize() {
        console.log('AppBootstrap.initialize() called');
        return true;
    }

    getStatus() {
        return {
            ...this.initStatus,
            duration: (performance.now() - this.startTime).toFixed(0) + 'ms'
        };
    }
}

// Create singleton
const appBootstrap = new AppBootstrap();

// Export for debugging
window.appBootstrap = appBootstrap;
