# 📋 REQUIREMENTS
## Web-Based Casio fx-991EX Scientific Calculator + Guessing Game

**Version:** 1.0 (derived from codebase inspection, October 2026)

---

## 1. Functional Requirements

### 1.1 Calculator — Core Operations

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-C01 | System shall evaluate arithmetic expressions: +, −, ×, ÷ | index.html buttons | 🏗️ JS fallback only |
| FR-C02 | System shall evaluate power expressions: x², √, ^, ⁿ√ | index.html buttons | 🏗️ JS fallback only |
| FR-C03 | System shall evaluate trigonometric functions: sin, cos, tan | index.html buttons | 🏗️ JS fallback only |
| FR-C04 | System shall evaluate logarithmic functions: log (base 10), ln | index.html buttons | 🏗️ JS fallback only |
| FR-C05 | System shall evaluate integral (∫) expressions numerically | index.html buttons | 🔴 Not implemented |
| FR-C06 | System shall evaluate derivative (d/dx) expressions numerically | index.html buttons | 🔴 Not implemented |
| FR-C07 | System shall evaluate summation (Σ) expressions | index.html buttons | 🔴 Not implemented |
| FR-C08 | System shall support previous-answer recall (Ans) | index.html buttons | 🏗️ Partial |
| FR-C09 | System shall support scientific notation entry (×10ˣ) | index.html buttons | 🔴 Not wired |

### 1.2 Calculator — Input Modes

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-M01 | System shall support DEG / RAD / GRAD angle modes | AppState.js | ✅ State done; UI indicator reactive |
| FR-M02 | System shall support SHIFT modifier (secondary functions) | index.html, InputController.js | 🏗️ Partial |
| FR-M03 | System shall support ALPHA modifier | index.html | 🔴 Not wired |
| FR-M04 | System shall support navigation arrows (↑ ↓) for history browsing | index.html | 🔴 Not implemented |
| FR-M05 | System shall support MENU key to access calculator modes | InputController.js | 🏗️ State toggle only |
| FR-M06 | System shall support CALC key | index.html | 🔴 Not wired |

### 1.3 Calculator — Memory

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-MEM01 | System shall support M+ (add to memory) | AppState.js, InputController.js | ✅ Logic done |
| FR-MEM02 | System shall support M− (subtract from memory) | InputController.js | ✅ Logic done |
| FR-MEM03 | System shall support MR (memory recall) | InputController.js | ✅ Logic done |
| FR-MEM04 | System shall support MC (memory clear) | InputController.js | ✅ Logic done |
| FR-MEM05 | System shall support 9 independent memory slots (M1–M9) | AppState.js | ✅ State only; UI needed |
| FR-MEM06 | Memory shall persist across page reloads (localStorage) | AppState.js `_persistState()` | ✅ Done |
| FR-MEM07 | M indicator badge shall display when memory is non-zero | index.html `#indicator-m` | 🔴 Not wired to state |

### 1.4 Calculator — Display

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-D01 | Display shall have two lines: expression (top) and result (bottom) | index.html | ✅ HTML done |
| FR-D02 | Display shall show DEG/RAD/GRAD indicator badge reactively | index.html `#indicator-deg/rad/grad` | 🔴 Not wired |
| FR-D03 | Display shall render fractions as stacked numerator/denominator | NaturalDisplay.js (stub) | 🔴 Not implemented |
| FR-D04 | Display shall render radical symbols (√) graphically | NaturalDisplay.js (stub) | 🔴 Not implemented |
| FR-D05 | Display shall switch to scientific notation for very large/small results | WasmService.js `_formatResult()` | ✅ Done (JS fallback) |
| FR-D06 | System shall maintain and display a scrollable history of last 50 calculations | CalculatorState reference, HistoryPanel.js | 🏗️ Partial |

### 1.5 Calculator — Input Handling

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-I01 | System shall handle button click input | InputController.js | ✅ Done |
| FR-I02 | System shall handle physical keyboard input (0–9, +, -, *, /, Enter, Esc, Backspace) | InputController.js | ✅ Done |
| FR-I03 | System shall handle keyboard shortcuts for scientific functions (Shift+S→sin, etc.) | InputController.js | ✅ Done |
| FR-I04 | System shall provide Ctrl+Z undo / Ctrl+Shift+Z redo | InputController.js, CalcController.js | ✅ Done |
| FR-I05 | System shall provide touch feedback on mobile (scale animation + optional vibration) | InputController.js | ✅ Done |
| FR-I06 | Buttons shall highlight visually when pressed (via keyboard or touch) | InputController.js `_highlightButton()` | ✅ Done |
| FR-I07 | System shall debounce rapid inputs (50ms threshold) | InputController.js | ✅ Done |

### 1.6 Advanced Math (Planned)

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-A01 | System shall support 4×4 matrix operations (multiply, determinant, inverse) | WasmService.js (stub API) | 🔴 C++ not written |
| FR-A02 | System shall support complex number (a+bi) arithmetic | WasmService.js (stub API) | 🔴 C++ not written |
| FR-A03 | System shall solve linear, quadratic, and cubic equations | WasmService.js, CalcController.js | 🔴 C++ not written |
| FR-A04 | System shall support nPr and nCr combinatorics | InputController.js (function list) | 🔴 C++ not written |
| FR-A05 | System shall support hyperbolic functions: sinh, cosh, tanh | InputController.js (function list) | 🔴 C++ not written |

### 1.7 Guessing Game

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-G01 | System shall support 3 difficulty levels: Easy (1–50, 10 tries), Medium (1–500, 7 tries), Hard (1–1000, 5 tries) | GameController.js, GameState.js | ✅ Done |
| FR-G02 | System shall generate a random target number within the difficulty range | GameState.js `startGame()` | ✅ Done |
| FR-G03 | System shall return "Higher" or "Lower" hints after each wrong guess | GameState.js `makeGuess()` | ✅ Done |
| FR-G04 | System shall provide smart range-narrowing hints (limited to 3/2/1 per difficulty) | GameState.js `getSmartHint()` | ✅ Done |
| FR-G05 | System shall detect and reject duplicate guesses | GameState.js | ✅ Done |
| FR-G06 | System shall calculate score: `Base + TimeBonus + AttemptBonus × StreakMultiplier` | GameState.js `_calculateScore()` | ✅ Done |
| FR-G07 | System shall track win/loss streaks and apply a multiplier after 2+ consecutive wins | GameState.js | ✅ Done |
| FR-G08 | System shall award achievements: first_win, perfect game, streak_5, streak_10, games_10/50 | GameState.js `_checkAchievements()` | ✅ Done |
| FR-G09 | System shall display a leaderboard (top 10) after each game | GameController.js `_updateLeaderboard()` | 🏗️ Partial |
| FR-G10 | System shall persist game stats (win rate, personal best) to localStorage | GameState.js `saveStats()` | ✅ Done |
| FR-G11 | User shall be able to resign / give up the current game | GameState.js `giveUp()`, `resign()` | ✅ Done |

### 1.8 Authentication & Cloud

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-F01 | System shall authenticate users anonymously on first load | FirebaseService.js `signInAnonymously()` | 🏗️ Service done; not called |
| FR-F02 | System shall support Google OAuth sign-in | FirebaseService.js `signInWithGoogle()` | 🏗️ Service done; not called |
| FR-F03 | System shall save game scores to Firestore `scores` collection | FirebaseService.js `saveGameScore()` | 🏗️ Service done; config placeholder |
| FR-F04 | System shall retrieve top 100 scores from Firestore for leaderboard | FirebaseService.js `getLeaderboard()` | 🏗️ Service done; not active |
| FR-F05 | System shall sync calculation history to Firestore when online | FirebaseService.js `saveCalculation()` | 🏗️ Service done; not active |
| FR-F06 | System shall enable offline persistence (Firestore cache) | FirebaseService.js `enablePersistence()` | 🏗️ Service done; not active |

### 1.9 UI & Theme

| ID | Requirement | Source | Status |
|---|---|---|---|
| FR-U01 | System shall support dark / light theme toggle | AppState.js, app-bootstrap.js | ✅ Done |
| FR-U02 | Theme preference shall persist to localStorage (`casio-theme` key) | app-bootstrap.js | ✅ Done |
| FR-U03 | System shall play optional sound effects (Web Audio API) for clicks, memory, errors | InputController.js `_playSound()` | ✅ Done |
| FR-U04 | Sound preference shall persist to localStorage | AppState.js | ✅ Done |
| FR-U05 | System shall provide optional haptic vibration feedback on touch | InputController.js | ✅ Done |
| FR-U06 | System shall display a calculation history export (CSV download) | CalcController.js `exportHistory()` | ✅ Done |

---

## 2. Non-Functional Requirements

### 2.1 Performance

| ID | Requirement | Target | Measurement |
|---|---|---|---|
| NFR-P01 | Calculation latency (WASM engine) | < 100ms (p95) | `performance.now()` in CalcController |
| NFR-P02 | WASM module load time | < 500ms | Custom timer on `initialize()` |
| NFR-P03 | First Contentful Paint | < 1.5s | Lighthouse CI |
| NFR-P04 | Time to Interactive | < 3.5s | Lighthouse CI |
| NFR-P05 | WASM bundle size (gzipped) | ≤ 500KB | Emscripten `-O3` output |
| NFR-P06 | JS heap usage | < 64MB | Chrome DevTools Memory panel |
| NFR-P07 | Leaderboard load time | < 300ms | Firebase performance monitoring |

### 2.2 Precision

| ID | Requirement | Target |
|---|---|---|
| NFR-PR01 | Calculator results match Casio fx-991EX to 10 significant digits | Validated against known Casio outputs |
| NFR-PR02 | Trig/log results within ±1 ULP of IEEE 754 double precision | Regression test suite |
| NFR-PR03 | Game random distribution passes χ² goodness-of-fit test | p > 0.05 over 10,000 samples |

### 2.3 Compatibility

| ID | Requirement |
|---|---|
| NFR-CO01 | Supports Chrome, Firefox, Safari, Edge — last 2 major versions |
| NFR-CO02 | Supports WebAssembly (required for C++ engine) |
| NFR-CO03 | Responsive on screens from 320px to 1920px width |
| NFR-CO04 | Usable on iOS Safari (16+) and Android Chrome (100+) |

### 2.4 Accessibility

| ID | Requirement |
|---|---|
| NFR-AC01 | WCAG 2.1 Level AA compliance |
| NFR-AC02 | All calculator buttons have `aria-label` attributes |
| NFR-AC03 | Calculator display has `aria-live="polite"` for screen readers |
| NFR-AC04 | Full keyboard operability without mouse |
| NFR-AC05 | Colour contrast ratio ≥ 4.5:1 for all text |
| NFR-AC06 | Animations respect `prefers-reduced-motion` media query |

### 2.5 Security

| ID | Requirement |
|---|---|
| NFR-S01 | Firebase Security Rules restrict reads/writes to authenticated users' own data |
| NFR-S02 | No raw `eval()` in production (JS fallback uses scoped Function constructor) |
| NFR-S03 | Firebase API keys are environment-specific; not committed to repository |
| NFR-S04 | WASM memory freed after each calculation (`engine_free_string()`) |
| NFR-S05 | Natural Display shall sanitize WASM output before inserting into DOM (prevent XSS) |

### 2.6 Reliability

| ID | Requirement |
|---|---|
| NFR-R01 | Calculator shall work fully offline (localStorage fallback) |
| NFR-R02 | Firebase failures shall not crash the calculator |
| NFR-R03 | WASM load failure shall fall back to JavaScript math engine transparently |
| NFR-R04 | Calculation history shall not exceed 50 entries to prevent memory bloat |

### 2.7 Maintainability

| ID | Requirement |
|---|---|
| NFR-MA01 | C++ unit test coverage ≥ 80% |
| NFR-MA02 | JavaScript unit test coverage ≥ 70% |
| NFR-MA03 | All public functions documented with JSDoc comments |
| NFR-MA04 | WASM bridge API documented in `ARCHITECTURE.md` |

---

## 3. Out of Scope (Post-MVP)

- Graph plotting / function grapher
- OCR input (photo of handwritten equation)
- AI solver / step-by-step explanation
- Table mode (generate f(x) table)
- QR code sharing of calculations
- Multiple language support
