# 🏗️ PROJECT MASTER PLAN
## Web-Based Casio fx-991EX Scientific Calculator + Intelligent Guessing Game
**Prepared by:** Senior Software Engineer  
**Date:** August 2026  
**Version:** 2.0 (Modular Architecture)  
**Project Type:** Software Development Project II

---

## 📋 TABLE OF CONTENTS
1. [Product Validation: Are We Building the Right Thing?](#phase-0)
2. [System Architecture Overview](#phase-1)
3. [Frontend Architecture](#phase-2)
4. [Backend & WASM Architecture](#phase-3)
5. [Database Architecture & Data Flow](#phase-4)
6. [Module Breakdown (8 Core Modules)](#phase-5)
7. [Step-by-Step Implementation Roadmap](#phase-6)
8. [Memory Tracking & Project Monitoring](#phase-7)
9. [Validation Checkpoints & Exit Criteria](#phase-8)
10. [Risk Register & Mitigation](#phase-9)

---

## <a id="phase-0"></a>🔍 PHASE 0: PRODUCT VALIDATION
### "Am I Creating the Right Product?"

Before writing code, validate alignment between the project report and actual deliverables:

| Validation Question | Expected Answer | Your Checkpoint |
|---|---|---|
| **Target User** | Students, engineers, educators needing scientific calculation | ☐ Define persona |
| **Core Value Prop** | Browser-based Casio fx-991EX replica with game | ☐ Validate uniqueness |
| **Must-Have vs Nice-to-Have** | Must: Calculator engine, Natural Display, WASM, Game. Nice: Graph plotting, OCR | ☐ Prioritized backlog |
| **Tech Feasibility** | C++→WASM via Emscripten is proven; Firebase scales | ☐ Proof of Concept |
| **Differentiator** | WebAssembly speed + Natural Display + Guessing Game | ☐ Competitive check |

**🚦 GO/NO-GO Gate:** If you cannot compile a simple C++ function to WASM and call it from JS within 2 days, **STOP** and reassess the tech stack.

---

## <a id="phase-1"></a>🏛️ PHASE 1: SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   UI Layer   │  │  JS Controller│  │   WASM Runtime (C++)     │  │
│  │  HTML/CSS    │◄─┤   (State &   │◄─┤  • Calculator Engine     │  │
│  │  Responsive  │  │   Routing)   │  │  • Math Parser           │  │
│  │  Themes      │  │              │  │  • Guessing Game Logic   │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────────────┘  │
│                           │                                         │
│                      ┌────┴────┐                                    │
│                      │ Local   │                                    │
│                      │ Storage │                                    │
│                      └────┬────┘                                    │
└───────────────────────────┼─────────────────────────────────────────┘
                            │ HTTPS/REST
┌───────────────────────────┼─────────────────────────────────────────┐
│                    FIREBASE CLOUD                                    │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Authentication  │  │ Realtime DB  │  │    Firestore         │   │
│  │ (Anonymous/     │  │ (Game State  │  │ (Leaderboard,        │   │
│  │  Google OAuth)  │  │  Sync)       │  │  User Profiles)      │   │
│  └─────────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Data Flow Principle:**
```
User Input → JS Controller → WASM Engine (C++) → JS Controller → UI Render
                                    ↓
                              Firebase (async)
```

---

## <a id="phase-2"></a>🎨 PHASE 2: FRONTEND ARCHITECTURE

### 2.1 Layered Structure

```
frontend/
├── 📁 presentation/          # What the user sees
│   ├── 📁 components/        # Reusable UI blocks
│   │   ├── ButtonGrid/       # Calculator buttons (7×5 matrix)
│   │   ├── NaturalDisplay/   # MathJax/LaTeX-like rendering
│   │   ├── HistoryPanel/     # Slide-out calculation log
│   │   ├── GameInterface/    # Guessing game UI
│   │   └── ThemeToggle/      # Dark/Light mode
│   ├── 📁 layouts/           # Page skeletons
│   │   ├── CalculatorLayout/
│   │   └── GameLayout/
│   └── 📁 styles/            # CSS architecture
│       ├── tokens.css        # Colors, fonts, spacing variables
│       ├── calculator.css    # fx-991EX exact replica styling
│       ├── responsive.css    # Mobile breakpoints
│       └── animations.css    # Button press, transitions
│
├── 📁 application/           # Frontend logic (JS)
│   ├── 📁 controllers/       # Event handlers
│   │   ├── InputController.js    # Keyboard + touch + click
│   │   ├── CalcController.js     # Calculator orchestration
│   │   └── GameController.js     # Game flow management
│   ├── 📁 services/          # External communication
│   │   ├── WasmService.js        # C++ bridge
│   │   ├── FirebaseService.js    # DB operations
│   │   └── StorageService.js     # localStorage wrapper
│   └── 📁 state/             # Single source of truth
│       ├── CalculatorState.js    # Current expression, memory
│       ├── GameState.js          # Active game session
│       └── AppState.js           # Global settings
│
└── 📁 infrastructure/        # Bootstrapping
    ├── wasm-loader.js        # Emscripten module init
    ├── firebase-config.js    # API keys, env vars
    └── service-worker.js     # PWA caching (future)
```

### 2.2 Component Communication Pattern
**Observer + Command Pattern:**
- `AppState` is the central store (Observable)
- Components subscribe to state slices
- User actions dispatch Commands to Controllers
- Controllers update State → triggers re-render

### 2.3 Responsive Breakpoints
| Device | Width | Layout Adaptation |
|---|---|---|
| Mobile | < 480px | Stacked, full-width buttons, hamburger menu |
| Tablet | 481–768px | 2-column, condensed display |
| Desktop | > 768px | Full fx-991EX replica, side history panel |

---

## <a id="phase-3"></a>⚙️ PHASE 3: BACKEND & WASM ARCHITECTURE

### 3.1 C++ Engine Structure (Compiled to WASM)

```
cpp-engine/
├── 📁 core/                  # Foundation
│   ├── types.h               # BigDecimal, Complex, Matrix structs
│   ├── precision.h           # 15-digit accuracy config
│   └── error_handler.cpp     # Domain errors, overflow, syntax
│
├── 📁 math/                  # Scientific computation
│   ├── arithmetic.cpp        # +, −, ×, ÷, fractions
│   ├── transcendental.cpp    # sin, cos, tan, log, ln, eˣ
│   ├── hyperbolic.cpp        # sinh, cosh, tanh
│   ├── powers_roots.cpp      # x², x³, √, ⁿ√, xʸ
│   ├── combinatorics.cpp     # nPr, nCr, factorial
│   ├── statistics.cpp        # Σ, σ, regression
│   └── calculus.cpp          # Numerical integration, differentiation
│
├── 📁 algebra/               # Advanced features
│   ├── matrix.cpp            # 4×4 matrix ops, determinant, inverse
│   ├── vector.cpp            # 3D vector calculations
│   ├── complex.cpp           # a+bi operations
│   ├── equation_solver.cpp   # Linear & polynomial solvers
│   └── table_mode.cpp        # Function table generation
│
├── 📁 parser/                # Natural Display engine
│   ├── tokenizer.cpp         # String → tokens
│   ├── ast.cpp               # Abstract Syntax Tree
│   ├── infix_to_postfix.cpp  # Shunting-yard algorithm
│   └── formatter.cpp         # Pretty-print (Natural Display)
│
├── 📁 game/                  # Guessing Game Logic
│   ├── engine.cpp            # Random number generation
│   ├── difficulty.cpp        # Level configs (Easy/Medium/Hard)
│   ├── hint_system.cpp       # "Higher/Lower" + smart hints
│   ├── scoring.cpp           # Formula: score = f(time, attempts, difficulty)
│   └── validator.cpp         # Input bounds checking
│
└── 📁 bridge/                # JS ↔ C++ glue
    ├── exports.cpp           # EMSCRIPTEN_KEEPALIVE functions
    ├── js_bindings.h         # Type mappings
    └── memory_manager.cpp    # malloc/free for WASM heap
```

### 3.2 WASM Bridge API (JS Callable C++ Functions)

```cpp
// Calculator API
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    char* evaluate(const char* expression);      // Main entry

    EMSCRIPTEN_KEEPALIVE
    char* solve_equation(const char* eq, int type); // 0=linear, 1=poly

    EMSCRIPTEN_KEEPALIVE
    char* matrix_op(const char* json_matrices, int operation);

    EMSCRIPTEN_KEEPALIVE
    char* integrate(const char* func, double a, double b);

    EMSCRIPTEN_KEEPALIVE
    void set_angle_mode(int mode);               // 0=DEG, 1=RAD, 2=GRAD

    EMSCRIPTEN_KEEPALIVE
    void memory_store(double value, int slot);   // M1-M9
    EMSCRIPTEN_KEEPALIVE
    double memory_recall(int slot);
}

// Game API
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int game_start(int difficulty);              // Returns target number (hidden)

    EMSCRIPTEN_KEEPALIVE
    char* game_guess(int game_id, int guess);    // Returns JSON: {result, hint, attempts_left}

    EMSCRIPTEN_KEEPALIVE
    int game_calculate_score(int attempts, double time_sec, int difficulty);

    EMSCRIPTEN_KEEPALIVE
    char* game_get_leaderboard(int limit);       // Returns top N scores
}
```

### 3.3 Build Pipeline (Emscripten)
```bash
# Compile C++ to WASM with optimization
emcc src/**/*.cpp   -O3   -s WASM=1   -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "UTF8ToString"]'   -s ALLOW_MEMORY_GROWTH=1   -s MODULARIZE=1   -s EXPORT_NAME="CasioEngine"   -o dist/casio-engine.js
```

---

## <a id="phase-4"></a>🗄️ PHASE 4: DATABASE ARCHITECTURE & DATA FLOW

### 4.1 Firebase Schema Design

**Realtime Database (Game State Sync — Low Latency)**
```json
{
  "active_games": {
    "{game_session_id}": {
      "user_id": "anon_123",
      "difficulty": 2,
      "target_number": 87,
      "attempts_used": 3,
      "max_attempts": 10,
      "status": "active",
      "started_at": 1723456789,
      "last_guess": 45,
      "hint": "higher"
    }
  }
}
```

**Firestore (Persistent Data — Leaderboard & Analytics)**
```
collections/
├── users/{user_id}
│   ├── display_name: "Player1"
│   ├── total_games: 47
│   ├── best_score: 9850
│   ├── calculator_usage_minutes: 120
│   └── created_at: timestamp
│
├── scores/{score_id}
│   ├── user_id: "anon_123"
│   ├── user_name: "Player1"
│   ├── score: 9850
│   ├── difficulty: "hard"
│   ├── attempts: 4
│   ├── time_seconds: 12.5
│   ├── game_mode: "classic"
│   └── timestamp: server_timestamp
│
├── calculator_history/{entry_id}
│   ├── user_id: "anon_123"
│   ├── expression: "sin(45)+log(100)"
│   ├── result: "2.707..."
│   ├── mode: "DEG"
│   └── timestamp: server_timestamp
│
└── analytics/{daily_id}
    ├── date: "2026-08-12"
    ├── total_calculations: 15420
    ├── total_games_started: 340
    └── avg_session_duration_sec: 180
```

### 4.2 Data Flow Strategy

| Data Type | Primary Storage | Sync Strategy | Fallback |
|---|---|---|---|
| Active Game State | Firebase RTDB | Real-time (≤100ms) | In-memory JS state |
| Leaderboard | Firestore | Read: cache 5min, Write: immediate | localStorage top 100 |
| Calc History | Firestore | Batch write every 30s or on exit | localStorage queue |
| User Settings | Firestore | On change | localStorage mirror |
| Calculator Memory | localStorage | Immediate | — |

### 4.3 Offline-First Strategy
```
User Action → localStorage (immediate) → Background Sync → Firebase
                    ↑___________________________________|
                              (on reconnect)
```

---

## <a id="phase-5"></a>🧩 PHASE 5: MODULE BREAKDOWN (8 CORE MODULES)

### MODULE 1: Core Calculator Engine (C++ → WASM)
**Owner:** Backend Lead  
**Duration:** Weeks 1–3  
**Dependencies:** None

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 1.1 Tokenizer | Parses "sin(45)+3×4" correctly | Unit tests: 50 expressions |
| 1.2 AST Builder | Handles nested parentheses ≥5 levels | Fuzz testing |
| 1.3 Basic Arithmetic | ±0.0001% accuracy vs Python decimal | Regression suite |
| 1.4 Trig Functions | Matches Casio fx-991EX to 10 digits | DEG/RAD/GRAD matrix |
| 1.5 Fraction Engine | Displays "1┘2" not "0.5" when exact | Exact match tests |
| 1.6 WASM Export | JS can call `evaluate()` and get string | Integration test |

**Memory Constraint:** WASM heap starts at 16MB, grows to 128MB max.

---

### MODULE 2: Natural Display Renderer
**Owner:** Frontend Lead  
**Duration:** Weeks 2–4  
**Dependencies:** Module 1 (API contract)

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 2.1 Display Engine | Renders √(x²+y²) with proper radical symbol | Visual regression |
| 2.2 Fraction Rendering | Shows stacked numerator/denominator | Pixel-perfect compare |
| 2.3 Cursor Navigation | Arrow keys move through expression tree | Cypress e2e |
| 2.4 History Rendering | Previous calculations scrollable | Performance: 100 items @ 60fps |

**Key Decision:** Use HTML/CSS flexbox for layout, not Canvas (accessibility + text selection).

---

### MODULE 3: Input Controller & Keyboard Mapping
**Owner:** Frontend Dev  
**Duration:** Weeks 3–4  
**Dependencies:** Module 2

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 3.1 Button Grid | 7×5 matrix matches Casio layout | Visual audit |
| 3.2 Physical Keyboard | All keys mapped (0-9, +, -, Enter=Ans) | Key event unit tests |
| 3.3 Touch Feedback | <50ms visual response on mobile | Lighthouse TTI |
| 3.4 Input Buffer | Handles 99-character limit | Stress test |

---

### MODULE 4: Advanced Math Modules
**Owner:** Backend Lead  
**Duration:** Weeks 4–6  
**Dependencies:** Module 1

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 4.1 Matrix Ops | 4×4 determinant, inverse, multiplication | Compare with NumPy |
| 4.2 Complex Numbers | a+bi arithmetic, polar form | WolframAlpha validation |
| 4.3 Equation Solver | ax²+bx+c=0 → exact roots | 20 known equations |
| 4.4 Numerical Integration | ∫₀¹ x² dx = 0.333... ± ε | Simpson's rule verification |
| 4.5 Statistics | Σx, Σx², σ, linear regression | Excel dataset compare |

---

### MODULE 5: Intelligent Guessing Game
**Owner:** Full-Stack Dev  
**Duration:** Weeks 5–7  
**Dependencies:** Module 1 (random engine), Module 3 (input)

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 5.1 Random Engine | Uniform distribution χ² test p>0.05 | Statistical test (10k samples) |
| 5.2 Difficulty System | Easy(1-50, 10 tries), Hard(1-1000, 7 tries) | Boundary testing |
| 5.3 Hint Algorithm | "Higher/Lower" + elimination range | Logic verification |
| 5.4 Scoring Formula | Score = (difficulty × 1000) / (attempts × time) | Manual verification |
| 5.5 Timer | ±0.1s accuracy | Stopwatch comparison |

**Scoring Formula (v1):**
```
Base = Difficulty × 1000          // Easy=1000, Medium=2000, Hard=3000
TimeBonus = max(0, 60 - time_sec) × 50
AttemptBonus = max(0, max_attempts - attempts_used) × 100
Score = Base + TimeBonus + AttemptBonus
```

---

### MODULE 6: Firebase Integration & Data Layer
**Owner:** Full-Stack Dev  
**Duration:** Weeks 6–8  
**Dependencies:** Module 5

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 6.1 Auth | Anonymous + Google sign-in | Firebase Auth emulator |
| 6.2 Leaderboard | Top 100 scores, real-time updates | RTDB emulator tests |
| 6.3 Game Persistence | Resume game after refresh | Session restore test |
| 6.4 Calc History Cloud | 30-day retention, searchable | Firestore rules testing |
| 6.5 Security Rules | Users can only write their own data | Rules unit tests |

---

### MODULE 7: State Management & Memory Tracking
**Owner:** Frontend Lead  
**Duration:** Weeks 7–8  
**Dependencies:** All modules

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 7.1 Global State | Single source of truth, no prop drilling | Redux DevTools audit |
| 7.2 Memory Profiling | No leaks after 100 calculations | Chrome DevTools heap |
| 7.3 WASM Memory | Free C++ memory after each calculation | Valgrind/ASan in C++ |
| 7.4 Local Storage | <5MB total usage, compression if needed | Storage quota test |

---

### MODULE 8: Testing & Quality Assurance
**Owner:** QA Engineer  
**Duration:** Parallel (Weeks 3–9)

| Sub-Task | Acceptance Criteria | Test Strategy |
|---|---|---|
| 8.1 Unit Tests | >80% C++ coverage, >70% JS coverage | gcov + Jest |
| 8.2 Integration Tests | WASM→JS→UI end-to-end | Cypress + emscripten test |
| 8.3 Cross-Browser | Chrome, Firefox, Safari, Edge (last 2 versions) | BrowserStack |
| 8.4 Mobile Testing | iOS Safari + Android Chrome | Device lab |
| 8.5 Performance | <100ms calculation latency, <2s first paint | Lighthouse CI |
| 8.6 Accessibility | WCAG 2.1 AA, keyboard navigable | axe-core + screen reader |

---

## <a id="phase-6"></a>📅 PHASE 6: STEP-BY-STEP IMPLEMENTATION ROADMAP

### Sprint 0: Foundation (Week 1)
- [ ] Repo setup (GitHub), branch protection, CI/CD skeleton
- [ ] Emscripten "Hello World": C++ add() → WASM → JS call
- [ ] Firebase project creation, emulator suite setup
- [ ] Design system: CSS tokens, button component mockup
- [ ] **Deliverable:** Working WASM bridge in browser

### Sprint 1: Calculator Core (Weeks 2–3)
- [ ] C++ tokenizer + AST (Module 1.1–1.2)
- [ ] Basic arithmetic engine (Module 1.3)
- [ ] HTML button grid + CSS Casio styling (Module 3.1)
- [ ] JS→WASM→Display pipeline (Modules 1+2 integration)
- [ ] **Deliverable:** Can calculate "1+2×3" and see "7"

### Sprint 2: Display & Input (Weeks 4–5)
- [ ] Natural Display renderer (Module 2)
- [ ] Keyboard support (Module 3.2)
- [ ] Fraction rendering (Module 2.2)
- [ ] Memory operations (M+, M-, MR, MC)
- [ ] **Deliverable:** Casio UI replica, 90% input methods working

### Sprint 3: Scientific Functions (Weeks 6–7)
- [ ] Trig, log, powers, roots (Module 1.4–1.5)
- [ ] Angle mode switching (DEG/RAD/GRAD)
- [ ] Calculation history panel (local)
- [ ] **Deliverable:** Full scientific calculator (no matrices/complex yet)

### Sprint 4: Advanced Math (Weeks 8–9)
- [ ] Matrix operations UI + engine (Module 4.1)
- [ ] Complex number mode (Module 4.2)
- [ ] Equation solver (Module 4.3)
- [ ] **Deliverable:** All calculator features from project report

### Sprint 5: Guessing Game v1 (Weeks 10–11)
- [ ] Game engine in C++ (Module 5.1–5.3)
- [ ] Game UI overlay (Module 5)
- [ ] Scoring system (Module 5.4)
- [ ] Local leaderboard (localStorage)
- [ ] **Deliverable:** Playable game with local scores

### Sprint 6: Cloud Integration (Weeks 12–13)
- [ ] Firebase Auth (Module 6.1)
- [ ] Cloud leaderboard (Module 6.2)
- [ ] Game state persistence (Module 6.3)
- [ ] Calc history sync (Module 6.4)
- [ ] **Deliverable:** Multi-user leaderboard, cloud saves

### Sprint 7: Polish & Performance (Weeks 14–15)
- [ ] Memory leak fixes (Module 7)
- [ ] Dark/light theme (Module 2)
- [ ] Mobile responsiveness final pass
- [ ] PWA manifest + service worker (basic)
- [ ] **Deliverable:** Production-ready MVP

### Sprint 8: Testing & Launch (Weeks 16–17)
- [ ] Cross-browser testing (Module 8.3)
- [ ] Performance optimization (Module 8.5)
- [ ] Security audit (Firebase rules)
- [ ] Documentation + demo video
- [ ] **Deliverable:** v1.0 Release

---

## <a id="phase-7"></a>📊 PHASE 7: MEMORY TRACKING & PROJECT MONITORING

### 7.1 Development Velocity Tracker

Track story points per sprint:

```
Sprint | Planned | Completed | Velocity | Blockers
-------|---------|-----------|----------|----------
S0     | 20      | 20        | 20       | None
S1     | 25      | 22        | 22       | WASM string passing
S2     | 28      | 26        | 24       | Fraction CSS tricky
S3     | 30      | ?         | ?        | TBD
```

**Rule:** If velocity drops >20% for 2 sprints, call a team retrospective.

### 7.2 Technical Debt Register

| ID | Issue | Severity | Sprint Introduced | Resolution Sprint |
|---|---|---|---|---|
| TD-01 | C++ memory not freed after evaluate() | 🔴 High | S1 | S7 |
| TD-02 | Natural Display uses innerHTML (XSS risk) | 🟡 Med | S2 | S3 |
| TD-03 | Firebase reads not batched | 🟡 Med | S6 | S7 |
| TD-04 | No input sanitization on matrix JSON | 🔴 High | S4 | S5 |

### 7.3 Performance Budgets

| Metric | Budget | Measurement Tool | Alert Threshold |
|---|---|---|---|
| First Contentful Paint | <1.5s | Lighthouse | >2.0s |
| Time to Interactive | <3.5s | Lighthouse | >4.5s |
| WASM Load Time | <500ms | Custom timer | >800ms |
| Calculation Latency | <100ms | Performance API | >200ms |
| Memory Usage (Heap) | <64MB | Chrome DevTools | >100MB |
| Game Leaderboard Load | <300ms | Firebase perf | >500ms |

### 7.4 Weekly Health Check Dashboard

Track these every Friday:
- [ ] **Build Status:** CI passing? (GitHub Actions)
- [ ] **Test Coverage:** C++ __%, JS __%
- [ ] **Open Bugs:** P0: __, P1: __, P2: __
- [ ] **WASM Bundle Size:** ___ KB (target: <500KB gzipped)
- [ ] **Firebase Costs:** $___ (alert if >$10/week in dev)
- [ ] **Team Mood:** 😊😐😟 (quick pulse check)

---

## <a id="phase-8"></a>✅ PHASE 8: VALIDATION CHECKPOINTS & EXIT CRITERIA

### Checkpoint A: After Sprint 1 (Proof of Concept)
**Question:** Can we actually compile C++ math to WASM and display results?  
**Pass Criteria:**
- [ ] `evaluate("2+2")` returns `"4"` in browser console
- [ ] Button click triggers WASM call
- [ ] Result displays in DOM within 50ms

**If FAIL:** Reassess Emscripten setup or simplify C++ interface.

### Checkpoint B: After Sprint 3 (MVP Calculator)
**Question:** Is the calculator usable for basic + scientific math?  
**Pass Criteria:**
- [ ] 10 test users can calculate sin(30°) without instructions
- [ ] Natural Display renders fractions correctly
- [ ] No crashes in 100 consecutive calculations

**If FAIL:** Simplify display engine or reduce precision targets.

### Checkpoint C: After Sprint 5 (Game Integration)
**Question:** Is the guessing game fun and fair?  
**Pass Criteria:**
- [ ] Random distribution passes χ² test
- [ ] 5 playtesters complete ≥3 games each
- [ ] Average session time >2 minutes

**If FAIL:** Adjust difficulty curves or hint algorithms.

### Checkpoint D: After Sprint 7 (Pre-Launch)
**Question:** Are we ready for public release?  
**Pass Criteria:**
- [ ] Lighthouse score >90 (Performance, Accessibility, Best Practices)
- [ ] Zero P0 bugs, ≤3 P1 bugs
- [ ] Firebase security rules audited
- [ ] WASM bundle <500KB gzipped
- [ ] Mobile usability verified on 3 real devices

**If FAIL:** Extend Sprint 8 or cut non-critical features (e.g., Table Mode).

### Final Product Validation: "Am I Creating the Right Product?"

| Requirement from Report | Implementation Evidence | Status |
|---|---|---|
| Web-based Casio fx-991EX | UI matches physical calculator | ☐ |
| C++ calculation engine | `cpp-engine/` compiles to WASM | ☐ |
| WebAssembly execution | `casio-engine.wasm` loads in browser | ☐ |
| Natural Display | Fractions, roots, exponents render correctly | ☐ |
| Responsive UI | Works on 320px–1920px widths | ☐ |
| Intelligent Guessing Game | Playable with scoring + hints | ☐ |
| Firebase storage | Leaderboard persists across sessions | ☐ |
| Dark/Light theme | Toggle switches palettes | ☐ |
| Keyboard support | All functions accessible without mouse | ☐ |
| Calculation history | Last 50 calculations stored | ☐ |

**Final Sign-Off:** All 10 criteria must be ☑ before v1.0 tag.

---

## <a id="phase-9"></a>⚠️ PHASE 9: RISK REGISTER & MITIGATION

| Risk | Probability | Impact | Mitigation Strategy |
|---|---|---|---|
| Emscripten build complexity | Medium | High | Pin emsdk version; Dockerize build env |
| C++ memory leaks in WASM | Medium | High | Use `valgrind` in native tests; manual `free()` in bridge |
| Firebase free tier limits | Low | Medium | Implement request batching; localStorage fallback |
| Natural Display performance | Medium | Medium | Virtual scrolling for history; debounce renders |
| Mobile touch latency | High | Medium | CSS `touch-action: manipulation`; 300ms delay removal |
| Scope creep (AI Solver, OCR) | High | High | Strict backlog; post-MVP bucket for "Future Improvements" |
| Cross-browser WASM support | Low | High | Test on oldest supported browsers; polyfill strategy |
| Team C++ skill gap | Medium | Medium | Pair programming; code review checklist |

---

## 🎯 EXECUTIVE SUMMARY

**What you're building:** A browser-based scientific calculator that feels exactly like a Casio fx-991EX, powered by a C++ engine compiled to WebAssembly, with a cloud-backed number guessing game.

**How to build it:** 8 modules, 8 sprints, 17 weeks. Start with the WASM bridge (Sprint 0), build the calculator core first (Sprints 1–4), then layer the game (Sprints 5–6), and polish (Sprints 7–8).

**How to know it's right:** 4 hard checkpoints. If the WASM bridge doesn't work by Week 1, stop. If the calculator isn't usable by Week 5, simplify. If the game isn't fun by Week 11, redesign. If performance sucks by Week 15, optimize or cut features.

**Memory tracking:** Watch velocity, technical debt, performance budgets, and Firebase costs weekly. Don't let C++ memory leaks or innerHTML XSS debt accumulate.

---

*"Plan is nothing. Planning is everything."* — Dwight D. Eisenhower
