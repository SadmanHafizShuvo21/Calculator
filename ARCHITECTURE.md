# 🏛️ ARCHITECTURE
## Web-Based Casio fx-991EX Scientific Calculator + Guessing Game

**Version:** Current (derived from codebase, October 2026)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                                                                 │
│  ┌──────────────┐   ┌──────────────────┐   ┌────────────────┐  │
│  │  Presentation │   │   Application    │   │  Infrastructure│  │
│  │  HTML + CSS  │◄──│  Controllers     │◄──│  wasm-loader   │  │
│  │  Components  │   │  Services        │   │  app-bootstrap │  │
│  │  Styles      │   │  State           │   │                │  │
│  └──────────────┘   └────────┬─────────┘   └────────────────┘  │
│                              │                                  │
│              ┌───────────────┼──────────────────┐              │
│              ▼               ▼                  ▼              │
│       ┌────────────┐  ┌───────────┐  ┌──────────────────┐     │
│       │   WASM     │  │  Local    │  │  Firebase SDK    │     │
│       │  Engine    │  │ Storage   │  │  (Planned)       │     │
│       │ (Planned)  │  │(localStorage│  │                  │     │
│       └────────────┘  └───────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────▼─────────────────────────────────┐
│                         FIREBASE CLOUD                          │
│  ┌──────────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │  Authentication  │  │  Firestore  │  │  Realtime DB      │  │
│  │  (Anon + Google) │  │ (Scores,    │  │  (Future: live    │  │
│  │                  │  │  Users,     │  │   game sync)      │  │
│  │                  │  │  History)   │  │                   │  │
│  └──────────────────┘  └─────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key data flow principle:**
```
User Input → InputController → CalcController → WasmService → Result
                                                     ↓
                                           CalculatorState (update)
                                                     ↓
                                            DOM render + Firebase sync
```

---

## 2. Frontend Architecture

### 2.1 Layer Breakdown

The frontend follows a **3-layer architecture** inside `frontend/`:

```
frontend/
├── presentation/          ← What the user sees (HTML components, CSS)
├── application/           ← Business logic (controllers, services, state)
└── infrastructure/        ← Bootstrapping, WASM loader
```

### 2.2 Presentation Layer (`frontend/presentation/`)

Responsible for all rendering. Pure HTML + CSS; no logic.

| File/Folder | Responsibility |
|---|---|
| `styles/tokens.css` | CSS custom properties: colors, fonts, spacing, button dimensions |
| `styles/calculator.css` | Casio fx-991EX body, display, button grid layout |
| `styles/animations.css` | Button press scale, history panel slide, LCD flicker |
| `styles/responsive.css` | Media queries: mobile <480px, tablet 481–768px, desktop >768px |
| `components/ButtonGrid/` | (Placeholder; actual in `src/`) |
| `components/NaturalDisplay/NaturalDisplay.js` | Math output renderer (stub) |
| `components/HistoryPanel/HistoryPanel.js` | Slide-out history panel (stub) |
| `components/ThemeToggle/ThemeToggle.js` | Dark/light toggle (stub) |

> ⚠️ **Structural issue:** There is a duplicate component tree under `frontend/src/presentation/`. The active components used by `index.html` reference `presentation/components/Display.js` and `presentation/components/ButtonGrid.js` but their actual files exist under `frontend/src/presentation/components/`. This requires reconciliation.

### 2.3 Application Layer (`frontend/application/`)

Contains all business logic. Organized into **Controllers**, **Services**, and **State**.

#### Controllers

| File | Responsibility |
|---|---|
| [`InputController.js`](frontend/application/controllers/InputController.js) | Routes all user input (click, keyboard, touch) to the correct handler. Manages debouncing, sound, and visual feedback. |
| [`CalcController.js`](frontend/application/controllers/CalcController.js) | Orchestrates expression evaluation: queues requests, calls `WasmService`, updates `CalculatorState`, syncs to Firebase, tracks performance metrics. |
| [`GameController.js`](frontend/application/controllers/GameController.js) | Manages game flow: start, guess, give-up, UI updates, leaderboard display. |

#### Services

| File | Responsibility |
|---|---|
| [`WasmService.js`](frontend/application/services/WasmService.js) | Bridge between JavaScript and C++ WASM engine. Provides typed wrappers for all WASM functions. Falls back to a JavaScript math engine if WASM is unavailable. |
| [`FirebaseService.js`](frontend/application/services/FirebaseService.js) | All Firebase interactions: authentication (anonymous, Google), Firestore reads/writes for scores, history, and user profiles. Handles offline persistence. |
| [`StorageService.js`](frontend/application/services/StorageService.js) | `localStorage` wrapper for offline-first data access. |

#### State (Observable Store)

| File | Responsibility |
|---|---|
| [`AppState.js`](frontend/application/state/AppState.js) | Global singleton. Holds: theme, angleMode, memory slots (M, M1–M9), UI state (modal, sidebar, menu), user preferences (sound, vibration), connectivity, session analytics. Persists to `localStorage`. |
| [`CalculatorState.js`](frontend/application/state/CalculatorState.js) | Holds current expression, display value, error, history, undo/redo stack. |
| [`GameState.js`](frontend/application/state/GameState.js) | Holds active game session, difficulty config, guesses, hints, scoring, streaks, achievements, daily stats. Persists stats to `localStorage`. |

**Observer pattern:** All state objects implement:
- `getState(path)` — read state at dot-notation path
- `setState(updates)` — merge updates and notify subscribers
- `subscribe(path, callback)` — receive notifications on a specific key
- `onStateChange(callback)` — subscribe to all changes

### 2.4 Infrastructure Layer (`frontend/infrastructure/`)

| File | Responsibility |
|---|---|
| [`wasm-loader.js`](frontend/infrastructure/wasm-loader.js) | Initializes the Emscripten `CasioEngine` WASM module |
| [`app-bootstrap.js`](frontend/infrastructure/app-bootstrap.js) | Entry point: creates `Display` and `ButtonGrid` components, sets up theme toggle, wires button press callbacks |

---

## 3. C++ Engine Architecture (Planned)

> ⚠️ **This layer does not yet exist.** The directory structure is planned; no `.cpp` files have been written.

```
cpp-engine/
├── core/
│   ├── types.h               # BigDecimal, Complex, Matrix, Vector structs
│   ├── precision.h           # 15-digit accuracy config
│   └── error_handler.cpp     # Error codes: domain error, overflow, syntax
│
├── math/
│   ├── arithmetic.cpp        # +, −, ×, ÷, fractions
│   ├── transcendental.cpp    # sin, cos, tan, log, ln, exp
│   ├── hyperbolic.cpp        # sinh, cosh, tanh
│   ├── powers_roots.cpp      # x², x³, √, ⁿ√, x^y
│   ├── combinatorics.cpp     # nPr, nCr, n!
│   ├── statistics.cpp        # Σ, σ, mean, regression
│   └── calculus.cpp          # Numerical integration, differentiation
│
├── algebra/
│   ├── matrix.cpp            # 4×4 matrix: multiply, determinant, inverse
│   ├── vector.cpp            # 3D: dot product, cross product, magnitude
│   ├── complex.cpp           # a+bi arithmetic
│   ├── equation_solver.cpp   # Linear, quadratic, cubic solvers
│   └── table_mode.cpp        # f(x) table generation
│
├── parser/
│   ├── tokenizer.cpp         # String → Token[]
│   ├── ast.cpp               # AST node types (BinOp, UnaryOp, Function, etc.)
│   ├── infix_to_postfix.cpp  # Shunting-yard algorithm
│   └── formatter.cpp         # AST → Natural Display string
│
├── game/
│   ├── engine.cpp            # RNG, game loop
│   ├── difficulty.cpp        # Difficulty presets (Easy/Medium/Hard)
│   ├── hint_system.cpp       # Higher/Lower + smart range hints
│   ├── scoring.cpp           # Score = f(base, time, attempts, streak)
│   └── validator.cpp         # Input bounds checking
│
└── bridge/
    ├── exports.cpp           # EMSCRIPTEN_KEEPALIVE C functions
    ├── js_bindings.h         # C ↔ JS type mappings
    └── memory_manager.cpp    # WASM heap management
```

### 3.1 WASM Bridge API

Functions exported from C++ to JavaScript via `EMSCRIPTEN_KEEPALIVE`:

```c
// Calculator
char* evaluate(const char* expression);              // Main entry point
void  set_angle_mode(int mode);                      // 0=DEG, 1=RAD, 2=GRAD
char* solve_equation(const char* eq, int type);      // 0=linear, 1=quad, 2=cubic
char* matrix_op(const char* json_matrices, int op);  // 0=multiply, 1=det, 2=inverse
char* integrate(const char* func, double a, double b);
void  memory_store(double value, int slot);          // M1–M9 (slot 0–8)
double memory_recall(int slot);

// Game
int   game_start(int difficulty);                    // 0=Easy, 1=Medium, 2=Hard
char* game_guess(int game_id, int guess);            // Returns JSON result
int   game_calculate_score(int attempts, double time_sec, int difficulty);
char* game_get_leaderboard(int limit);
```

**Return format:** All `char*` returns are JSON strings. JavaScript must call `engine_free_string(ptr)` after reading.

### 3.2 Build Command (Planned)

```bash
emcc cpp-engine/src/**/*.cpp \
  -O3 \
  -s WASM=1 \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="CasioEngine" \
  -o frontend/dist/casio-engine.js
```

---

## 4. Data Architecture

### 4.1 Local State (Immediate, In-Memory)

```
AppState.state {
  theme, angleMode, displayMode, calculatorMode,
  memory: { M, M1–M9 },
  hasMemory, menuOpen, sidebarTab, modalOpen,
  soundEnabled, vibrateEnabled, historyLimit,
  isOnline, syncInProgress, sessionStartTime, calculationCount
}

CalculatorState.state {
  expression, displayValue, error, newInput,
  history: [{ expression, result, timestamp, mode }],   // max 50
  undoStack, redoStack
}

GameState.state {
  currentGameId, isGameActive, targetNumber, difficulty,
  guesses[], attemptsRemaining, hintsRemaining, totalAttempts,
  gameStartTime, gameEndTime, currentScore, multiplier,
  gameStatus, lastHint, leaderboard[],
  personalBest: { easy, medium, hard },
  totalGamesPlayed, totalGamesWon, winRate,
  achievements[], currentWinStreak, bestWinStreak,
  dailyGames, dailyWins
}
```

### 4.2 Persisted State (localStorage)

| Key | Contents | Managed By |
|---|---|---|
| `appState` | theme, angleMode, displayMode, memory, sound, vibrate | `AppState._persistState()` |
| `casio-theme` | `"dark"` or `"light"` | `app-bootstrap.js` |
| `gameStats` | totalGamesPlayed, totalGamesWon, personalBest, achievements, bestWinStreak | `GameState.saveStats()` |
| `soundEnabled` | boolean | `AppState.setSound()` |
| `vibrateEnabled` | boolean | `AppState.setVibrate()` |

### 4.3 Firebase Firestore Schema (Planned)

```
scores/{score_id}
  userId: string
  userName: string
  score: number
  difficulty: "easy" | "medium" | "hard"
  attempts: number
  timeTaken: number (seconds)
  won: boolean
  timestamp: Timestamp

users/{user_id}
  displayName: string
  totalGames: number
  bestScore: number
  createdAt: Timestamp

calculations/{entry_id}
  userId: string
  expression: string
  result: string
  angleMode: "DEG" | "RAD" | "GRAD"
  timestamp: Timestamp
```

---

## 5. Key Design Patterns

| Pattern | Where Used | Purpose |
|---|---|---|
| **Observable (Pub/Sub)** | AppState, CalculatorState, GameState | Reactive state; components subscribe to slices |
| **Singleton** | All State and Service instances | One global instance per class, exposed on `window` for debugging |
| **Command** | CalcController evaluation queue | Queued evaluation; supports undo/redo |
| **Facade** | WasmService | Hides WASM complexity; provides clean JS API with fallback |
| **Middleware** | AppState `use()` | Hook into state changes for logging / analytics |

---

## 6. Script Loading Order

`index.html` loads scripts in strict dependency order:

```
1. wasm-loader.js           ← Emscripten module init (no deps)
2. WasmService.js           ← depends on window.CasioEngine
3. StorageService.js        ← no deps
4. FirebaseService.js       ← depends on firebase SDK (CDN) + AppState
5. AppState.js              ← no deps (creates singleton appState)
6. InputController.js       ← depends on appState, calculatorState, wasmService
7. CalcController.js        ← depends on calculatorState, wasmService, appState, firebaseService
8. Display.js               ← depends on nothing
9. ButtonGrid.js            ← depends on nothing
10. app-bootstrap.js        ← wires everything; must be last
```

> ⚠️ **Issue:** `InputController.js` and `CalcController.js` reference `calculatorState` which is in `CalculatorState.js` — but `CalculatorState.js` is **not currently loaded** in `index.html`. This will cause a runtime error when those controllers attempt to call `calculatorState.subscribe()`.

---

## 7. Folder Structure (Actual vs. Planned)

| Path | Actual State | Notes |
|---|---|---|
| `frontend/presentation/styles/` | ✅ Exists with 4 CSS files | Active |
| `frontend/presentation/components/` | 🏗️ Partially populated | ButtonGrid and GameInterface are empty dirs |
| `frontend/application/` | ✅ Fully scaffolded | All JS files present |
| `frontend/infrastructure/` | ✅ Exists | `firebase-config.js` and `service-worker.js` referenced but not present |
| `frontend/src/` | ⚠️ Duplicate/legacy | `ButtonGrid.js` and `Display.js` here; also referenced in `index.html` |
| `cpp-engine/` | 🔴 Empty dirs only | No `.cpp` files; no `CMakeLists.txt` |
| `docs/` | 🔴 Not created | Referenced in plan documents |
| `frontend/dist/` | 🔴 Not created | WASM output path; required before WASM can run |
