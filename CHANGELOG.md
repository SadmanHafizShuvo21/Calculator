# 📜 CHANGELOG
## Web-Based Casio fx-991EX Scientific Calculator + Guessing Game

All notable changes to this project are documented here.  
Format: **[Version] — Date** · Type: `Added` · `Changed` · `Fixed` · `Removed` · `Planned`

---

## [Unreleased] — Upcoming

### Planned
- WASM engine: compile C++ math core to WebAssembly
- Natural Display: fraction and radical rendering
- Firebase integration: live leaderboard, cloud auth
- CalculatorState.js loaded in index.html (critical bug fix)
- DOM ID mismatches resolved (BUG-05, BUG-06, BUG-07, BUG-08)

---

## [0.1.0] — October 2026

> **Initial development snapshot.** Frontend scaffold complete with full JavaScript application layer. WASM and Firebase not yet active.

### Added
- **`frontend/index.html`** — Complete Casio fx-991EX HTML layout
  - Full 8-row button grid (40 buttons) matching physical device layout
  - Semantic HTML5 (`<main>`, `<section>`, `<aside>`)
  - ARIA labels on all buttons, display region, and history panel
  - DEG/RAD/GRAD indicator badges wired to HTML (not yet reactive to state)
  - Dark/light theme via `data-theme` attribute on `<body>`
  - History panel (`<aside>`) shell with header and close button
  - Game overlay (`<div role="dialog">`) shell

- **CSS architecture** (`frontend/presentation/styles/`)
  - `tokens.css` — Full design token system (50+ CSS custom properties):
    - Body: `--calc-body-bg: #1a2332`, `--calc-body-radius: 20px`
    - Display: `--display-bg: #c8d5a0`, monospace font stack
    - Button groups: shift (orange), alpha (red), numbers (dark blue-gray), functions (navy), equals (amber)
    - Animation variables: `--btn-press-scale: 0.92`, `--btn-press-duration: 80ms`
  - `calculator.css` — Base calculator body and button styles
  - `animations.css` — Button press, slide transitions, LCD flicker keyframes
  - `responsive.css` — Breakpoints: <480px (mobile), 481–768px (tablet), >768px (desktop)

- **State management** (`frontend/application/state/`)
  - `AppState.js` — Global observable store:
    - Theme, angle mode (DEG/RAD/GRAD), display mode
    - Memory slots: M, M1–M9 with `setMemory()`, `getMemory()`, `addToMemory()`, `clearMemory()`
    - UI state: menuOpen, sidebarTab, modalOpen
    - User prefs: soundEnabled, vibrateEnabled — persisted to localStorage
    - Connectivity tracking (online/offline events)
    - Session analytics: calculationCount, sessionStartTime
    - State persistence to `localStorage` key `appState`
    - State restore from `localStorage` on initialization
    - Deep merge, middleware support, wildcard listeners
  - `GameState.js` — Full game session state:
    - Difficulty configs: Easy (1–50, 10 tries, 3 hints, base 1000), Medium (1–500, 7 tries, 2 hints, base 2000), Hard (1–1000, 5 tries, 1 hint, base 3000)
    - `startGame(difficulty)` — RNG target, reset session state, generate game ID
    - `makeGuess(guess)` — validates, deduplicates, evaluates win/loss
    - `getSmartHint()` — range-narrowing algorithm based on previous guesses
    - Scoring formula: `(baseScore + timeBonus + attemptBonus) × streakMultiplier`
    - Streak multiplier: 1.1 + (streak × 0.05) after 2+ wins, capped at 10
    - Achievement detection: first_win, perfect game, streak_5, streak_10, games_10, games_50
    - Stats persistence to localStorage key `gameStats`
    - `giveUp()`, `resign()` game-end handlers
  - `CalculatorState.js` — (referenced but not confirmed present in active file list)

- **Services** (`frontend/application/services/`)
  - `WasmService.js` — JS ↔ WASM bridge:
    - All planned WASM function wrappers: `evaluate()`, `solveEquation()`, `integrate()`, `memoryStore()`, `memoryRecall()`, `multiplyMatrices()`, `matrixDeterminant()`, `matrixInverse()`
    - Game wrappers: `gameStart()`, `gameGuess()`, `gameCalculateScore()`, `gameGetLeaderboard()`
    - JS fallback engine with `new Function()` evaluator (active when WASM not loaded)
    - Result formatter: rounds to 10 decimal places, switches to scientific notation >1e10 or <1e-4
  - `FirebaseService.js` — Firebase integration:
    - Anonymous sign-in and Google OAuth sign-in
    - `saveGameScore()`, `getLeaderboard()` — Firestore `scores` collection
    - `saveCalculation()`, `getCalculationHistory()` — Firestore `calculations` collection
    - `getPersonalStats()`, `updatePersonalStats()` — Firestore `users` collection
    - `syncToCloud()` — batch sync local data to Firestore on reconnect
    - `onLeaderboardChange()` — real-time Firestore listener
    - Offline persistence: `db.enablePersistence()`
    - Config placeholder (real keys not yet set)
  - `StorageService.js` — localStorage abstraction layer

- **Controllers** (`frontend/application/controllers/`)
  - `InputController.js`:
    - Click handlers on all `.btn` elements
    - Full keyboard mapping: digits, operators, Enter→`=`, Escape→`AC`, Backspace→delete
    - Shift+S→sin, Shift+C→cos, Shift+T→tan, Shift+L→ln, Shift+R→√
    - Ctrl+Z→undo, Ctrl+Shift+Z→redo, Ctrl+H→history, Ctrl+M→menu
    - 50ms debounce on rapid input
    - Visual button highlight on press (100ms)
    - Touch: scale(0.98) animation on `touchstart`/`touchend`
    - Haptic: `navigator.vibrate(10)` if enabled
    - Sound: Web Audio API synthesis for click (800Hz), memory (600Hz), error (300Hz)
    - Scientific function routing: wraps expression in `func(expr)` pattern
    - Memory routing: M+, M−, MR, MC
  - `CalcController.js`:
    - Evaluation queue (handles concurrent evaluation requests)
    - `evaluateExpression()` → `WasmService.evaluate()` → state update
    - Performance metrics tracking (last 100 calculations, avg/max/min latency)
    - 100ms budget warning in console
    - `solveEquation()` — linear, quadratic, cubic types
    - Async batch evaluate: `batchEvaluate(expressions[])`
    - Undo/Redo wired to `calculatorState`
    - History CSV export with Blob download
    - Error notification: fixed-position toast with 3s auto-dismiss
    - Post-calculation Firebase sync (if online)
  - `GameController.js`:
    - `startGame(difficulty)` — starts session, shows game UI
    - `makeGuess(guess)` — validates, delegates to GameState, updates UI
    - Difficulty selector UI rendered via `innerHTML` in modal
    - Game board UI: attempts counter, guess input, guess history, hint button
    - Game results UI: win/loss display with Play Again button
    - Leaderboard display: top 10 fetched from Firebase after game ends
    - Toast notifications for hints (2s auto-dismiss)

- **Infrastructure** (`frontend/infrastructure/`)
  - `wasm-loader.js` — Emscripten module initialization placeholder
  - `app-bootstrap.js`:
    - Creates `Display` and `ButtonGrid` instances on DOMContentLoaded
    - Theme toggle: reads/writes `casio-theme` localStorage key
    - Theme icon: ☀️ for dark, 🌙 for light
    - Button press callback: appends characters to display for number/operator/function types

- **Presentation components** (`frontend/src/presentation/components/`)
  - `ButtonGrid.js` — Button grid component with modifier key support
  - `Display.js` — Display component with `appendCharacter()`, `clear()`, `backspace()`

- **Planning documents** (root directory)
  - `Project_Master_Plan_Casio_fx991EX.md` — Full 17-week sprint plan, architecture diagrams, risk register
  - `Casio_fx991EX_Copilot_Optimized.md` — AI-assistant prompt guide with module checklists
  - `UI_Design_Tools_Casio_Calculator.md` — Design tool recommendations and CSS token reference

---

## [0.0.0] — August 2026

### Added
- Initial project conception and architecture planning
- Project master plan document drafted (17 sprints, 8 modules)
- Tech stack decision: C++→WASM, Vanilla JS, Firebase, no frameworks
- Design token reference established

---

*Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)*
