# 🏗️ CASIO fx-991EX CALCULATOR + GAME
## AI-Optimized Project Master Plan for VSCode Copilot

**Project:** Web-Based Casio fx-991EX Scientific Calculator + Intelligent Guessing Game  
**Developer:** Sadman (ID: 2102021)  
**Version:** 2.0 (Copilot-Ready)  
**Last Updated:** August 2026  
**Course:** CIT-320 (Software Development Project II)

---

## 📌 QUICK START FOR COPILOT

### What is this project?
A browser-based scientific calculator (replica of Casio fx-991EX) with:
- **Calculator Core:** C++ engine compiled to WebAssembly (WASM) for 15-digit precision
- **UI:** Responsive, themeable HTML/CSS that matches the physical device
- **Game:** Intelligent guessing game with hints, scoring, and cloud leaderboard
- **Storage:** Firebase for authentication, real-time sync, and leaderboard

### When asking Copilot for help, use these prefixes:
```
"[CALC-<module>] <task>"  → Module-specific help
"[WASM] <task>"            → C++ to JavaScript bridge
"[GAME] <task>"            → Game logic
"[STATE] <task>"           → State management
"[FIREBASE] <task>"        → Cloud integration
"[RESPONSIVE] <task>"      → Mobile/breakpoint fixes
```

### Example prompts for Copilot:
- `[CALC-1.3] Implement factorial function that handles BigDecimal inputs`
- `[WASM] Create JavaScript wrapper for C++ function pointer return`
- `[STATE] Add undo/redo to CalculatorState using command pattern`
- `[FIREBASE] Implement batch write for 10 leaderboard entries`

---

## 🎯 TECH STACK AT A GLANCE

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend UI** | HTML5 + CSS3 + Vanilla JS | Responsive calculator interface |
| **Calculator Engine** | C++23 (compiled to WASM via Emscripten) | Fast math computation |
| **Game Logic** | C++ (in WASM) | Guess-the-number engine |
| **State Management** | Vanilla JS Observables + command pattern | Reactive UI updates |
| **Cloud Backend** | Firebase Realtime DB + Firestore | Leaderboard, auth, profiles |
| **Local Storage** | IndexedDB (via StorageService wrapper) | Offline calculation history |
| **Build Tool** | Emscripten (emsdk 3.1.x) | C++ → WASM compilation |
| **Version Control** | Git + GitHub | Repository management |

---

## 📂 EXPECTED PROJECT DIRECTORY STRUCTURE

```
casio-calculator/
│
├── frontend/
│   ├── index.html                    # Entry point
│   ├── assets/
│   │   ├── icons/                    # Button icons, theme assets
│   │   └── fonts/                    # MathJax, monospace fonts
│   │
│   ├── src/
│   │   ├── presentation/
│   │   │   ├── components/
│   │   │   │   ├── ButtonGrid.js     # 7x5 button matrix
│   │   │   │   ├── Display.js        # Natural Display + History
│   │   │   │   ├── GameUI.js         # Game overlay
│   │   │   │   └── ThemeToggle.js    # Dark/Light switch
│   │   │   ├── layouts/
│   │   │   │   ├── CalculatorLayout.js
│   │   │   │   └── GameLayout.js
│   │   │   └── styles/
│   │   │       ├── tokens.css        # --color-*, --spacing-*, --font-*
│   │   │       ├── calculator.css    # Casio replica styling
│   │   │       ├── responsive.css    # @media queries
│   │   │       └── animations.css    # Transitions, button press feedback
│   │   │
│   │   ├── application/
│   │   │   ├── controllers/
│   │   │   │   ├── InputController.js    # Keyboard/touch/click → AppState
│   │   │   │   ├── CalcController.js     # Calculation orchestration
│   │   │   │   └── GameController.js     # Game flow
│   │   │   ├── services/
│   │   │   │   ├── WasmService.js        # C++ bridge (load + call functions)
│   │   │   │   ├── FirebaseService.js    # Auth + DB operations
│   │   │   │   └── StorageService.js     # IndexedDB wrapper
│   │   │   └── state/
│   │   │       ├── AppState.js           # Global observable store
│   │   │       ├── CalculatorState.js    # Current expr, memory, history
│   │   │       └── GameState.js          # Active game session
│   │   │
│   │   └── infrastructure/
│   │       ├── wasm-loader.js        # Emscripten module initialization
│   │       ├── firebase-config.js    # API keys (from .env)
│   │       └── service-worker.js     # PWA cache (future)
│   │
│   ├── tests/
│   │   ├── unit/                     # Controller, service, state tests
│   │   └── integration/              # WASM bridge, Firebase mock tests
│   │
│   └── package.json                  # npm deps: Firebase SDK, others
│
├── cpp-engine/
│   ├── CMakeLists.txt               # Build config (native + Emscripten)
│   ├── emscripten-build.sh          # Compilation script (outputs casio.wasm)
│   │
│   ├── src/
│   │   ├── core/
│   │   │   ├── types.h              # BigDecimal, Complex, Matrix, Vector
│   │   │   ├── precision.h          # Precision config + rounding
│   │   │   └── error_handler.cpp    # Error codes + messages
│   │   │
│   │   ├── math/
│   │   │   ├── arithmetic.cpp       # +, -, ×, ÷
│   │   │   ├── transcendental.cpp   # sin, cos, tan, log, ln, e^x
│   │   │   ├── hyperbolic.cpp       # sinh, cosh, tanh
│   │   │   ├── powers_roots.cpp     # x², ³√, √, x^y
│   │   │   ├── combinatorics.cpp    # nPr, nCr, !
│   │   │   ├── statistics.cpp       # Σ, σ, regression
│   │   │   └── calculus.cpp         # Numerical integration/diff
│   │   │
│   │   ├── algebra/
│   │   │   ├── matrix.cpp           # 4×4 ops, det, inv
│   │   │   ├── vector.cpp           # 3D vector dot, cross, norm
│   │   │   ├── complex.cpp          # a+bi operations
│   │   │   ├── equation_solver.cpp  # Linear solver (Gaussian elim)
│   │   │   └── table_mode.cpp       # f(x) table generation
│   │   │
│   │   ├── parser/
│   │   │   ├── tokenizer.cpp        # String → Token[]
│   │   │   ├── ast.cpp              # AST node definitions
│   │   │   ├── infix_to_postfix.cpp # Shunting-yard algorithm
│   │   │   └── formatter.cpp        # AST → Natural Display string
│   │   │
│   │   ├── game/
│   │   │   ├── engine.cpp           # Random number + game loop
│   │   │   ├── difficulty.cpp       # Difficulty presets
│   │   │   ├── hint_system.cpp      # "Higher/Lower" + smart hints
│   │   │   ├── scoring.cpp          # Score formula
│   │   │   └── validator.cpp        # Input validation
│   │   │
│   │   └── bridge/
│   │       ├── exports.cpp          # EMSCRIPTEN_KEEPALIVE C functions
│   │       ├── js_bindings.h        # Type mappings (C ↔ JS)
│   │       └── memory_manager.cpp   # WASM heap management
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── test_arithmetic.cpp  # Unit tests for math
│   │   │   ├── test_parser.cpp      # Parser correctness
│   │   │   └── test_game.cpp        # Game logic tests
│   │   └── benchmark/
│   │       └── perf_test.cpp        # Latency + throughput
│   │
│   └── build/                       # CMake output (native binaries)
│
├── docs/
│   ├── API.md                       # WASM function signatures
│   ├── ARCHITECTURE.md              # Detailed system design
│   ├── STATE_MANAGEMENT.md          # AppState, commands, subscriptions
│   ├── DEPLOYMENT.md                # Firebase setup, env vars
│   └── TESTING.md                   # Unit + integration strategy
│
├── .env.example                     # Firebase keys template
├── .gitignore                       # Node modules, WASM build, env files
├── README.md                        # Quick start guide
└── package.json                     # Root (if monorepo)
```

---

## 🔗 WASM BRIDGE API (Copy-Paste Reference)

### C++ Function Signatures (In `cpp-engine/src/bridge/exports.cpp`)

```cpp
extern "C" {
    // ========== CALCULATOR API ==========
    
    // Main calculation entry point
    // Input: "2+2*3", "sin(30)", "2³+√16"
    // Output: JSON string {"result": "8", "display": "8", "error": null}
    EMSCRIPTEN_KEEPALIVE
    const char* calc_evaluate(const char* expression);
    
    // Parse expression for natural display (AST → formatted string)
    // Input: "2 + 2 * 3"
    // Output: "2+2×3" or LaTeX representation
    EMSCRIPTEN_KEEPALIVE
    const char* calc_format_display(const char* expression);
    
    // Get calculation history (last N entries)
    // Input: limit = 50
    // Output: JSON array of {expr, result, timestamp}
    EMSCRIPTEN_KEEPALIVE
    const char* calc_get_history(int limit);
    
    // Memory operations
    EMSCRIPTEN_KEEPALIVE
    const char* calc_memory_add(const char* value);         // M+
    
    EMSCRIPTEN_KEEPALIVE
    const char* calc_memory_subtract(const char* value);    // M−
    
    EMSCRIPTEN_KEEPALIVE
    const char* calc_memory_recall(void);                   // MR
    
    EMSCRIPTEN_KEEPALIVE
    void calc_memory_clear(void);                           // MC
    
    // ========== GAME API ==========
    
    // Initialize new game session
    // Input: difficulty 0=Easy, 1=Medium, 2=Hard
    // Output: JSON {game_id, secret_number, min, max}
    EMSCRIPTEN_KEEPALIVE
    const char* game_init(int difficulty);
    
    // Submit a guess
    // Input: game_id, user_guess
    // Output: JSON {result: "higher"|"lower"|"correct", score, game_over}
    EMSCRIPTEN_KEEPALIVE
    const char* game_guess(const char* game_id, int user_guess);
    
    // Get hint for current game
    // Output: JSON {hint_text, hints_used}
    EMSCRIPTEN_KEEPALIVE
    const char* game_get_hint(const char* game_id);
    
    // ========== UTILITY ==========
    
    // Initialize the engine (call once at startup)
    EMSCRIPTEN_KEEPALIVE
    void engine_init(void);
    
    // Free memory after string operations
    // C++ caller must free returned strings
    EMSCRIPTEN_KEEPALIVE
    void engine_free_string(const char* ptr);
}
```

### JavaScript Wrapper Pattern (In `frontend/src/application/services/WasmService.js`)

```javascript
class WasmService {
    static #wasmModule = null;
    static #initialized = false;

    static async init() {
        // Load Emscripten module
        this.#wasmModule = await Module();
        this.#wasmModule._engine_init();
        this.#initialized = true;
    }

    // Wrapper: calc_evaluate
    static evaluate(expression) {
        if (!this.#initialized) throw new Error("WASM not initialized");
        const result = this.#wasmModule._calc_evaluate(expression);
        const jsonStr = this.#readCString(result);
        this.#wasmModule._engine_free_string(result);
        return JSON.parse(jsonStr);
    }

    // Wrapper: game_guess
    static gameGuess(gameId, guess) {
        const result = this.#wasmModule._game_guess(gameId, guess);
        const jsonStr = this.#readCString(result);
        this.#wasmModule._engine_free_string(result);
        return JSON.parse(jsonStr);
    }

    // Helper: Read null-terminated C string from WASM memory
    static #readCString(ptr) {
        const view = new Uint8Array(this.#wasmModule.HEAPU8.buffer, ptr);
        let str = '';
        for (let i = 0; view[i] !== 0; i++) {
            str += String.fromCharCode(view[i]);
        }
        return str;
    }
}
```

---

## 🧠 STATE MANAGEMENT ARCHITECTURE

### Core Principle: Observable Pattern + Command Pattern

```javascript
// File: frontend/src/application/state/AppState.js
class AppState {
    #state = {
        calculator: {
            currentExpression: '',
            result: null,
            memory: 0,
            displayMode: 'decimal', // 'decimal', 'fraction', 'complex'
            angleMode: 'deg',       // 'deg', 'rad', 'grad'
            history: [],            // [{expr, result, timestamp}, ...]
        },
        game: {
            isActive: false,
            gameId: null,
            difficulty: 0,           // 0=Easy, 1=Med, 2=Hard
            secretNumber: null,
            userGuesses: [],
            hints: [],
            score: 0,
        },
        ui: {
            theme: 'light',          // 'light' or 'dark'
            language: 'en',
            isHistoryOpen: false,
        },
    };

    #subscribers = new Map();  // {stateKey: [callback1, callback2, ...]}

    // Subscribe to state changes
    subscribe(stateKey, callback) {
        if (!this.#subscribers.has(stateKey)) {
            this.#subscribers.set(stateKey, []);
        }
        this.#subscribers.get(stateKey).push(callback);
        
        // Return unsubscribe function
        return () => {
            const list = this.#subscribers.get(stateKey);
            list.splice(list.indexOf(callback), 1);
        };
    }

    // Dispatch command to modify state
    dispatch(command) {
        const prevState = JSON.parse(JSON.stringify(this.#state));
        command.execute(this.#state);
        
        // Notify subscribers of changed keys
        for (const key of command.affectedKeys) {
            const callbacks = this.#subscribers.get(key) || [];
            callbacks.forEach(cb => cb(this.#state[key], prevState[key]));
        }
    }

    getState(path = null) {
        if (!path) return this.#state;
        return path.split('.').reduce((obj, key) => obj[key], this.#state);
    }
}

// Export singleton
export const appState = new AppState();
```

### Example Commands

```javascript
// File: frontend/src/application/state/commands/CalcEvaluateCommand.js
export class CalcEvaluateCommand {
    constructor(expression) {
        this.expression = expression;
    }

    execute(state) {
        // Call WASM engine
        const result = WasmService.evaluate(this.expression);
        
        // Update state
        state.calculator.result = result.result;
        state.calculator.currentExpression = this.expression;
        state.calculator.history.unshift({
            expr: this.expression,
            result: result.result,
            timestamp: new Date().toISOString(),
        });
    }

    get affectedKeys() {
        return ['calculator'];
    }
}
```

---

## 📋 8 CORE MODULES WITH CHECKLIST

### Module 1: C++ Math Engine (Core Arithmetic + Scientific)
**Files:** `cpp-engine/src/math/*` + `cpp-engine/src/core/*`  
**Copilot Prompt Template:**
```
[CALC-1.X] Implement [function_name] in C++ that:
- Takes input: [params and types]
- Returns: [type and format]
- Handles edge cases: [NaN, Infinity, overflow]
- Must pass precision test: [expected output]
```

**Status Checklist:**
- [ ] `arithmetic.cpp` — Basic operations (+, −, ×, ÷)
- [ ] `powers_roots.cpp` — x², √x, x^y, ⁿ√x
- [ ] `transcendental.cpp` — sin, cos, tan, log, ln, e^x
- [ ] `hyperbolic.cpp` — sinh, cosh, tanh
- [ ] `combinatorics.cpp` — nPr, nCr, n!
- [ ] `statistics.cpp` — Σ, σ, mean, variance
- [ ] `precision.h` — 15-digit accuracy config
- [ ] Unit tests pass for all functions

---

### Module 2: Natural Display Engine (Rendering)
**Files:** `cpp-engine/src/parser/*`  
**Key Classes:** `Tokenizer`, `AST`, `Formatter`

**Status Checklist:**
- [ ] `tokenizer.cpp` — Parse "1+2*3" → [1, +, 2, *, 3]
- [ ] `ast.cpp` — AST node types (BinOp, UnaryOp, Function, etc.)
- [ ] `infix_to_postfix.cpp` — Shunting-yard implementation
- [ ] `formatter.cpp` — AST → LaTeX/Natural Display string
- [ ] Test: "2+3*4" displays as "2+3×4" (not "14")
- [ ] Test: "sqrt(16)" displays with radical symbol
- [ ] Test: Fractions (e.g., "1/3") show as proper fraction display
- [ ] Frontend CSS for math symbols + fonts

---

### Module 3: Frontend UI & Responsiveness
**Files:** `frontend/src/presentation/*`

**Status Checklist:**
- [ ] `ButtonGrid.js` — 7×5 button matrix, click handlers
- [ ] `Display.js` — Natural Display output + history panel
- [ ] `calculator.css` — Casio replica styling (colors, fonts)
- [ ] `responsive.css` — Mobile (< 480px), tablet (481–768px), desktop (> 768px)
- [ ] `ThemeToggle.js` — Dark/Light mode + persistence
- [ ] `GameUI.js` — Game overlay component
- [ ] Keyboard support (number keys, Enter, Backspace, etc.)
- [ ] Lighthouse score > 85 (Performance, Accessibility)

---

### Module 4: Advanced Math (Matrix, Complex, Equation Solver)
**Files:** `cpp-engine/src/algebra/*`

**Status Checklist:**
- [ ] `matrix.cpp` — 4×4 matrix ops, determinant, inverse
- [ ] `complex.cpp` — a+bi arithmetic
- [ ] `equation_solver.cpp` — Linear system solver (Gaussian elimination)
- [ ] `vector.cpp` — Dot product, cross product, magnitude
- [ ] `table_mode.cpp` — Generate f(x) table (e.g., sin(x) from 0–360°)
- [ ] UI for matrix input/output
- [ ] Test: `det([[1,2],[3,4]])` = -2

---

### Module 5: Guessing Game Logic
**Files:** `cpp-engine/src/game/*`

**Copilot Prompt:**
```
[GAME] Implement [game_function] that ensures:
- Fair random number generation in range [min, max]
- Hints that don't exceed limit
- Score = f(attempts, time, difficulty)
```

**Status Checklist:**
- [ ] `engine.cpp` — Random number generation + game loop
- [ ] `difficulty.cpp` — Easy (1–50), Medium (1–100), Hard (1–1000)
- [ ] `hint_system.cpp` — "Higher/Lower" + smart hints (range narrowing)
- [ ] `scoring.cpp` — Score formula: `(difficultyMultiplier × timeBonus) / attempts`
- [ ] `validator.cpp` — Input range checking
- [ ] `GameUI.js` — Guess input, hint button, score display
- [ ] Test: χ² test for random distribution (p > 0.05)

---

### Module 6: Cloud Integration (Firebase)
**Files:** `frontend/src/application/services/FirebaseService.js`

**Status Checklist:**
- [ ] Firebase project created + config keys in `.env`
- [ ] `FirebaseService.js` — Auth (anonymous + Google OAuth)
- [ ] Leaderboard in Firestore (schema: `{userId, gameId, score, timestamp}`)
- [ ] User profiles (schema: `{userId, username, gamesPlayed, bestScore}`)
- [ ] Real-time leaderboard sync (top 100)
- [ ] Offline fallback to localStorage
- [ ] Security rules audited (no read without auth, write restricted)
- [ ] Test: Submit score → appears in leaderboard within 5s

---

### Module 7: Memory Management & Performance
**Files:** `cpp-engine/src/bridge/memory_manager.cpp` + Frontend perf audits

**Status Checklist:**
- [ ] `valgrind` reports zero memory leaks in C++ tests
- [ ] WASM heap usage < 50MB (test via DevTools)
- [ ] `calc_evaluate()` latency < 100ms for complex expressions
- [ ] WASM bundle < 500KB gzipped
- [ ] Calculation history limited to last 50 entries (prevent memory bloat)
- [ ] Game history capped at 1000 entries
- [ ] No memory leaks in event listeners (proper cleanup)

---

### Module 8: Testing, CI/CD & Documentation
**Files:** `cpp-engine/tests/`, `frontend/tests/`, `.github/workflows/`

**Status Checklist:**
- [ ] C++ unit tests (via Google Test or Catch2): > 80% coverage
- [ ] JavaScript unit tests (Jest/Vitest): > 75% coverage
- [ ] Integration tests (WASM bridge calls)
- [ ] E2E tests (full calculator workflow)
- [ ] GitHub Actions CI pipeline (compile C++, run tests, deploy)
- [ ] API documentation (`docs/API.md`)
- [ ] State management guide (`docs/STATE_MANAGEMENT.md`)
- [ ] Deployment guide (`docs/DEPLOYMENT.md`)

---

## 🛠️ COMMON COPILOT PROMPTS BY TASK

### Adding a New Calculator Function

**Prompt Template:**
```
[CALC-1.X] Add [FunctionName] to the calculator:

Requirements:
- Input: [type and range, e.g., "single floating-point value"]
- Output: [type and format]
- Precision: [15 digits or exact]
- Edge cases: [NaN, Infinity, domain errors]
- Button label: [e.g., "sin", "√"]
- Test case: [e.g., "sin(30) = 0.5 in degrees"]

Add to:
1. cpp-engine/src/math/[module].cpp → function implementation
2. cpp-engine/src/bridge/exports.cpp → if new WASM export needed
3. frontend/src/presentation/components/ButtonGrid.js → button UI
4. frontend/tests/unit/ → unit tests
```

**Example:**
```
[CALC-1.6] Add logarithm functions (log₁₀, ln, log_b) to the calculator:

Requirements:
- Input: Single floating-point value (positive, > 0)
- Output: 15-digit precision floating-point
- Precision: Match Casio fx-991EX ± 1 ULP
- Edge cases: log(0) → error "Math ERROR", negative → error
- Button labels: "log" (log₁₀), "ln"
- Test: log(100) = 2, ln(e) = 1

Add to:
1. cpp-engine/src/math/transcendental.cpp → implement log10(), log_natural()
2. cpp-engine/src/bridge/exports.cpp → WASM wrapper
3. frontend/src/presentation/components/ButtonGrid.js → "log" and "ln" buttons
4. frontend/tests/unit/math.test.js → test vectors
```

---

### Fixing a State Management Issue

**Prompt Template:**
```
[STATE] [Issue description]

Current behavior: [What happens now]
Expected behavior: [What should happen]
State path affected: [e.g., "calculator.history", "game.score"]

Steps:
1. Identify which component/controller is dispatching the wrong command
2. Check if AppState.dispatch() is being called correctly
3. Verify command.affectedKeys includes the right state paths
4. Add console.log() to trace state changes

Affected files:
- frontend/src/application/state/AppState.js
- frontend/src/application/state/commands/[CommandName].js
- frontend/src/application/controllers/[ControllerName].js
```

**Example:**
```
[STATE] When user clicks M+ button, memory value doesn't persist after reload

Current behavior: M+ works, history shows update, but after F5 refresh memory is 0
Expected behavior: Memory value persists in localStorage or IndexedDB
State path affected: calculator.memory

Steps:
1. Check CalculatorState subscribers in CalcController
2. Verify StorageService.set('memory', value) is called after M+
3. Check app startup: is calc_memory_recall() called on init?

Affected files:
- frontend/src/application/state/AppState.js
- frontend/src/application/controllers/CalcController.js
- frontend/src/application/services/StorageService.js
```

---

### Implementing a WASM Function

**Prompt Template:**
```
[WASM] Implement [FunctionName] C++ function to WASM bridge

Signature needed:
// Input: [C data types]
// Output: [C data types or JSON string]
const char* [function_name](/* params */);

Steps:
1. Implement in cpp-engine/src/bridge/exports.cpp
2. Use EMSCRIPTEN_KEEPALIVE macro
3. Return JSON strings: const char* result = json_string_copy(...);
4. Allocate memory on WASM heap (use emscripten API if needed)
5. Test with JavaScript wrapper in WasmService.js
6. Run valgrind to check for memory leaks

Files to modify:
- cpp-engine/src/bridge/exports.cpp
- frontend/src/application/services/WasmService.js
- cpp-engine/tests/unit/test_bridge.cpp
```

---

### Adding a New Firebase Collection

**Prompt Template:**
```
[FIREBASE] Add [CollectionName] to Firebase Realtime DB

Schema:
{
  [docId]: {
    [field1]: [type],
    [field2]: [type],
    timestamp: number (milliseconds)
  }
}

Firestore Rules (allow read/write conditions):
- Read: [Condition, e.g., "auth.uid == resource.data.userId"]
- Write: [Condition]

JavaScript implementation:
1. Add method to FirebaseService.js: async add[CollectionName]()
2. Use firebase/firestore: addDoc(), query(), orderBy()
3. Handle errors: offline, quota exceeded
4. Add retry logic for failed writes

Files:
- frontend/src/application/services/FirebaseService.js
- docs/DEPLOYMENT.md (security rules update)
```

---

## 📊 SPRINT ROADMAP (17 Weeks)

| Sprint | Focus | Deliverable | Copilot Role |
|--------|-------|-------------|--------------|
| **0** (W1–2) | WASM Setup POC | `evaluate("2+2")` works | Help debug Emscripten build |
| **1** (W3) | Arithmetic Core | All basic ops in WASM | Code generator for math functions |
| **2** (W4–5) | Display + Input | Casio UI replica | CSS debugging, responsive fixes |
| **3** (W6–7) | Scientific Ops | sin, log, √, etc. + UI | Function implementations |
| **4** (W8–9) | Advanced Math | Matrix, complex, solver | Algorithm optimization |
| **5** (W10–11) | Game Engine | Playable game + local scores | Game logic + scoring formulas |
| **6** (W12–13) | Cloud | Firebase leaderboard | DB schema + security rules |
| **7** (W14–15) | Polish | Theme, performance, PWA | Profiling, optimization |
| **8** (W16–17) | Testing + Launch | v1.0 release | Test generation, documentation |

### For Copilot: Use sprint tags in your prompts
```
[S0] Help me debug Emscripten build error: __WASM_UNREACHABLE
[S3] Implement sin() in C++ with 15-digit precision
[S6] Set up Firestore leaderboard schema + security rules
```

---

## ✅ VALIDATION CHECKPOINTS (Must Pass)

### Checkpoint A: End of Sprint 0
```
[CHECKPOINT-A] WASM POC Validation

Test: evaluate("1+2*3") in browser console
Expected output: {result: "7", error: null}
Pass criteria:
  ✓ C++ compiles without errors
  ✓ WASM loads in 500ms or less
  ✓ Function callable from JavaScript
  ✓ Result returns correctly formatted JSON

If FAIL → Stop and debug build system
```

### Checkpoint B: End of Sprint 3
```
[CHECKPOINT-B] Scientific Calculator MVP

Test suite (run all):
  ✓ sin(30°) = 0.5
  ✓ log₁₀(100) = 2
  ✓ √16 = 4
  ✓ 2³ = 8
  ✓ 5! = 120
  ✓ Natural Display renders fractions
  ✓ UI responsive on 320px phone

If FAIL → Simplify feature set or extend deadline
```

### Checkpoint C: End of Sprint 5
```
[CHECKPOINT-C] Game Quality Gate

Test:
  ✓ Random distribution χ² test (p > 0.05)
  ✓ 5 users play 3+ games, avg session > 2 min
  ✓ Scoring formula rewards faster guesses
  ✓ Hints don't exceed limit (3 max)

If FAIL → Adjust difficulty or redesign hints
```

### Checkpoint D: End of Sprint 7
```
[CHECKPOINT-D] Production Readiness

Metrics:
  ✓ Lighthouse score ≥ 90
  ✓ WASM bundle ≤ 500KB gzipped
  ✓ Calc latency ≤ 100ms (p95)
  ✓ Firebase rules audited
  ✓ Zero P0 bugs, ≤ 3 P1 bugs
  ✓ Mobile testing on 3 real devices

If FAIL → Extend Sprint 8 or cut features
```

---

## 🚨 TOP RISKS & MITIGATION

| Risk | Probability | Impact | Copilot Help |
|------|-----------|--------|--------------|
| Emscripten build failures | MEDIUM | HIGH | Provide build scripts, Docker setup |
| C++ memory leaks | MEDIUM | HIGH | Generate valgrind tests, review free() calls |
| Natural Display complexity | MEDIUM | MEDIUM | AST + formatter templates, test matrices |
| Firebase quota/costs | LOW | MEDIUM | Implement batching, caching, rate limiting |
| Mobile touch latency | HIGH | MEDIUM | CSS optimizations, event debouncing |
| Scope creep (OCR, AI solver) | HIGH | HIGH | Say "NO" firmly; move to v2 roadmap |

---

## 📝 HOW TO USE THIS DOCUMENT WITH COPILOT

### Workflow:
1. **Read** the section relevant to your current task (e.g., "Module 3: Frontend UI")
2. **Copy** the Copilot Prompt Template from that section
3. **Customize** it with your specific function/file names
4. **Paste** into VSCode Copilot Chat with the `[TAG]` prefix
5. **Copilot** generates code stubs, tests, or fixes based on your context

### Example Interaction:
```
You:  [CALC-1.2] Implement square root function...
Copilot: 
  // Generates sqrt() implementation in C++
  // Returns: float sqrt_value(float x)
  
You: Add natural display for this
Copilot:
  // Extends formatter.cpp to show √x notation
  
You: [WASM] Create JavaScript wrapper
Copilot:
  // WasmService.sqrt = (x) => { ... }
```

---

## 🎯 QUICK REFERENCE: File → Responsibility

| Task | Primary File | Secondary |
|------|-------------|-----------|
| Add math function | `cpp-engine/src/math/*.cpp` | `ButtonGrid.js`, `exports.cpp` |
| Fix state bug | `AppState.js` | `*Command.js`, `*Controller.js` |
| Style issue | `responsive.css` | `tokens.css`, component `.js` |
| WASM error | `exports.cpp` | `WasmService.js` |
| Game logic | `cpp-engine/src/game/*.cpp` | `GameController.js` |
| Database | `FirebaseService.js` | Firestore console |
| Performance | DevTools Profiler → target module | Module 7 perf budgets |

---

## 📌 FINAL NOTES FOR COPILOT

- **Always check** the "WASM Bridge API" section before calling any C++ function from JS
- **Always use** the state management pattern (AppState → dispatch command) for UI updates
- **Always test** C++ math against Casio fx-991EX actual results (not just any calculator)
- **Always prefix** your prompts with `[MODULE]` or `[SPRINT]` tags for clarity
- **Always refer back** to the "Expected Directory Structure" when creating new files
- **Always include** test cases and edge cases in your implementation requests

---

*Last Updated: August 2026 | For Sadman's CIT-320 Project*
