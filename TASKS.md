# ✅ TASKS
## Web-Based Casio fx-991EX Scientific Calculator + Guessing Game

**Last Updated:** October 2026 | **Legend:** 🔴 Critical · 🟡 High · 🟢 Medium · ⚪ Low

---

## 🚨 Bugs & Critical Issues

| ID | Priority | Description | File(s) Affected | Status |
|---|---|---|---|---|
| BUG-01 | 🔴 | `CalculatorState.js` is not loaded in `index.html` — `calculatorState` is undefined at runtime, breaking `InputController` and `CalcController` | `index.html` | Open |
| BUG-02 | 🔴 | `firebase-config.js` referenced in plan documents but does not exist; `FirebaseService` uses hardcoded placeholder keys | `FirebaseService.js` | Open |
| BUG-03 | 🔴 | `frontend/src/presentation/components/ButtonGrid.js` and `Display.js` exist but `index.html` script tags reference them without the `src/` prefix — path mismatch may cause 404s | `index.html` lines 151-152 | Open |
| BUG-04 | 🔴 | `service-worker.js` and `firebase-config.js` are referenced in architecture docs but do not exist in `infrastructure/` | N/A | Open |
| BUG-05 | 🟡 | `CalcController._onDisplayChange()` targets `#displayOutput` but the element in `index.html` is `#resultLine` — display will never update | `CalcController.js` line 134, `index.html` | Open |
| BUG-06 | 🟡 | `CalcController._updateDisplayPreview()` targets `#inputBuffer` but the element is `#expressionLine` — expression line never updates | `CalcController.js` line 158, `index.html` | Open |
| BUG-07 | 🟡 | `GameController._setupUIListeners()` looks for `#startGameBtn` and `#gameModalBody` — these elements don't exist in `index.html` | `GameController.js`, `index.html` | Open |
| BUG-08 | 🟡 | `InputController._handleInput()` routes `m+` (lowercase) but button has `data-key="M+"` (uppercase) — memory operations will never fire | `InputController.js` line 249, `index.html` | Open |
| BUG-09 | 🟡 | `GameState.useHint()` reads `this.state.previousGuess` which is never set — hint logic is broken | `GameState.js` line 309 | Open |
| BUG-10 | 🟢 | `WasmService._fallbackEvaluate()` uses `new Function()` with a bug: `sin` handler calls `_toRadians` but checks the return value with a truthy test instead of `angleMode !== 'RAD'` | `WasmService.js` line 508 | Open |
| BUG-11 | 🟢 | Duplicate `totalGamesPlayed` increment — `GameState.startGame()` calls `incrementGameCounter()` which adds 1, and `_updateStats()` also adds 1 | `GameState.js` | Open |
| BUG-12 | ⚪ | `app-bootstrap.js` has a legacy `AppBootstrap` class that is never used and adds confusion | `app-bootstrap.js` | Open |

---

## 🔴 TODO — Critical (Must do before any testing)

### Fix: Missing CalculatorState Loading
- [ ] Add `CalculatorState.js` to `index.html` script loading sequence (before `InputController.js`)
- [ ] Verify `CalculatorState` provides the same API used by `InputController` and `CalcController`

### Fix: DOM ID Mismatches
- [ ] Rename or alias `#displayOutput` → `#resultLine` in `CalcController._onDisplayChange()`
- [ ] Rename or alias `#inputBuffer` → `#expressionLine` in `CalcController._updateDisplayPreview()`
- [ ] Add `#startGameBtn` and `#gameModalBody` elements to `index.html` for game UI, OR refactor `GameController` to use the existing `#gameOverlay` / `#gameContainer`

### Fix: Button Key Case Mismatch
- [ ] Normalize all button `data-key` values and `InputController` handler keys to the same case convention (either all lowercase or match HTML)

### Fix: GameState.useHint()
- [ ] Track last guess in `GameState` state or pass it to `useHint()` to fix the Higher/Lower hint bug

---

## 🟡 TODO — High Priority

### Wire Display to State
- [ ] Subscribe `Display` component to `CalculatorState` changes
- [ ] Update `#expressionLine` content reactively from `calculatorState.expression`
- [ ] Update `#resultLine` content reactively from `calculatorState.displayValue`
- [ ] Update DEG/RAD/GRAD indicator badges reactively from `appState.angleMode`
- [ ] Update `#indicator-m` badge reactively from `appState.hasMemory`

### Wire Buttons to Controllers
- [ ] Verify every `data-key` in `index.html` has a matching handler in `InputController._handleInput()`
- [ ] Wire `←` (backspace arrow) button correctly
- [ ] Wire `↑` / `↓` navigation buttons (history scroll)
- [ ] Wire `MENU` button to open settings modal
- [ ] Wire `CALC` button to equation solver mode
- [ ] Wire `M+` button (fix case: match `'M+'` in `_handleMemory()`)

### Firebase Configuration
- [ ] Create Firebase project at `console.firebase.google.com`
- [ ] Enable Firestore, Authentication (Anonymous + Google)
- [ ] Replace placeholder config in `FirebaseService.js` with real values
- [ ] Add Firebase SDK script tags to `index.html` (CDN or npm bundle)
- [ ] Create `frontend/infrastructure/firebase-config.js` with environment-based config

### Resolve Duplicate Folder Structure
- [ ] Decide canonical location for components: `frontend/presentation/components/` vs `frontend/src/presentation/components/`
- [ ] Move or delete the duplicate; update `index.html` script tags accordingly
- [ ] Remove `frontend/src/` directory if it is legacy

---

## 🏗️ In Progress

| Task | Assignee | Notes |
|---|---|---|
| Calculator HTML layout | — | `index.html` complete with full button grid |
| CSS design tokens | — | `tokens.css` complete |
| State management layer | — | AppState, GameState functional; CalculatorState needs wiring |
| Game logic | — | GameState, GameController functionally complete; UI disconnected |
| WasmService API stubs | — | All WASM function wrappers written; WASM module not compiled |

---

## 🟢 TODO — Medium Priority (Feature Work)

### C++ Engine — Highest Impact Gap
- [ ] Set up Emscripten toolchain (`emsdk 3.1.x`)
- [ ] Write `cpp-engine/core/types.h`, `precision.h`, `error_handler.cpp`
- [ ] Write `cpp-engine/parser/` — tokenizer, AST, infix-to-postfix, formatter
- [ ] Write `cpp-engine/math/arithmetic.cpp`
- [ ] Write `cpp-engine/math/transcendental.cpp`
- [ ] Write `cpp-engine/math/powers_roots.cpp`
- [ ] Write `cpp-engine/math/combinatorics.cpp`
- [ ] Write `cpp-engine/bridge/exports.cpp` — all WASM exports
- [ ] Create `frontend/dist/` directory
- [ ] Run Emscripten build; produce `casio-engine.js` + `casio-engine.wasm`
- [ ] Remove JS fallback engine once WASM verified

### Natural Display
- [ ] Implement `NaturalDisplay.js` parsing logic
- [ ] CSS for `.frac` (stacked fractions): `sup/span/sub` layout
- [ ] CSS for `.radical` symbol display
- [ ] Wire WASM `calc_format_display()` output to NaturalDisplay renderer
- [ ] Test: `1/3` shows as fraction, `√2` shows with radical

### History Panel
- [ ] Populate `#historyList` with entries from `calculatorState.history`
- [ ] Make history panel slide-in/slide-out via CSS transition
- [ ] Wire history close button `#historyClose`
- [ ] Allow clicking a history item to restore expression

### SHIFT / ALPHA State
- [ ] Visual: SHIFT button active state (highlighted, sub-labels visible)
- [ ] Visual: ALPHA button active state
- [ ] Logic: next key press after SHIFT uses alternate function
- [ ] Logic: SHIFT and ALPHA cancel each other

### Advanced Math (Sprint 4)
- [ ] Write `cpp-engine/algebra/matrix.cpp`
- [ ] Write `cpp-engine/algebra/complex.cpp`
- [ ] Write `cpp-engine/algebra/equation_solver.cpp`
- [ ] Write `cpp-engine/math/calculus.cpp`
- [ ] UI for matrix input grid
- [ ] UI for complex mode display

### Game UI Polish
- [ ] Style game overlay (`#gameOverlay`, `#gameContainer`) with Casio-themed CSS
- [ ] Show difficulty selector inside game overlay (not using `alert()`)
- [ ] Replace hint `alert()` with styled in-overlay hint display
- [ ] Wire `#gameContainer` to `GameController` UI methods

---

## ⚪ TODO — Low Priority (Polish)

- [ ] PWA: create `manifest.json`, add to `index.html`
- [ ] Service worker for offline caching of static assets
- [ ] CSV export button in history panel UI
- [ ] Sound settings toggle in UI
- [ ] Vibration settings toggle in UI
- [ ] Remove legacy `AppBootstrap` class from `app-bootstrap.js`
- [ ] LCD startup flicker animation on page load
- [ ] Mobile: test on real iOS and Android devices
- [ ] Accessibility: verify all `aria-label` attributes are accurate
- [ ] Accessibility: `prefers-reduced-motion` for all animations

---

## ✅ Completed

| Task | Completed |
|---|---|
| Project folder structure designed and created | October 2026 |
| `index.html` — full Casio fx-991EX button grid, semantic HTML, ARIA labels | October 2026 |
| `tokens.css` — complete design token system (colors, fonts, spacing, animations) | October 2026 |
| `AppState.js` — Observable state with localStorage persistence, theme, memory, connectivity | October 2026 |
| `GameState.js` — Complete game loop: start, guess, hint, win/loss, scoring, achievements | October 2026 |
| `GameController.js` — Game flow orchestration and UI management | October 2026 |
| `InputController.js` — Keyboard + click + touch routing with debounce, sound, haptics | October 2026 |
| `CalcController.js` — Evaluation queue, WASM call, history, undo/redo, CSV export | October 2026 |
| `WasmService.js` — Full WASM bridge API + JavaScript fallback engine | October 2026 |
| `FirebaseService.js` — Auth (anon + Google), Firestore CRUD, real-time listener | October 2026 |
| `app-bootstrap.js` — App initialization, theme toggle, component wiring | October 2026 |
| Project plan documents (3 Markdown files) | August–October 2026 |

---

## 📊 Task Summary

| Category | Count |
|---|---|
| 🔴 Critical bugs | 4 |
| 🟡 High priority bugs | 8 |
| 🟢 Medium bugs | 2 |
| ⚪ Low priority bugs | 1 |
| 🔴 Critical TODOs | ~8 |
| 🟡 High TODOs | ~15 |
| 🟢 Medium TODOs | ~30 |
| ⚪ Low TODOs | ~10 |
| ✅ Completed | ~15 |
