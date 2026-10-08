# 📐 DECISIONS
## Technical Decisions Log — Casio fx-991EX Web Calculator + Guessing Game

Each entry records: **what was decided**, **why**, and **the alternatives considered**.

---

## DEC-01: Vanilla JavaScript — No UI Framework

**Date:** August 2026  
**Status:** ✅ Active

### Decision
Use plain Vanilla JavaScript (ES2022+) with custom classes instead of React, Vue, or Angular.

### Reasoning
1. **Course constraint:** CIT-320 project assessment likely expects foundational web skills, not framework knowledge.
2. **Bundle size:** No framework overhead. Every KB saved helps keep WASM bundle under the 500KB target.
3. **Full control:** Custom Observable + Command pattern gives full visibility into state changes — important for debugging WASM integration.
4. **No build step needed** for the JS layer (only Emscripten for C++).

### Trade-offs
- Manual DOM manipulation is more verbose than JSX.
- No reactivity primitives; must manually subscribe to state changes.
- Component reuse is more effort without a component system.

### Alternatives Considered
| Option | Rejected Because |
|---|---|
| React + Vite | Framework overhead; course context; adds build complexity |
| Lit (Web Components) | Less familiar; adds learning curve |
| Alpine.js | Good fit, but even small framework adds dependency risk |

---

## DEC-02: C++ → WebAssembly for Math Engine

**Date:** August 2026  
**Status:** ⚠️ Decided but not yet implemented (WASM not compiled)

### Decision
Implement the calculator math engine in C++ and compile it to WebAssembly using Emscripten. JavaScript is used only as a bridge/fallback.

### Reasoning
1. **Project requirement:** CIT-320 specification explicitly requires WebAssembly.
2. **Precision:** C++ `double` with custom precision layers gives better control than JavaScript's IEEE 754 floating point for edge cases (e.g., fraction exact representation).
3. **Performance:** C++ arithmetic is faster than JS eval-based parsing, especially for complex expression trees.
4. **Authenticity:** A real Casio fx-991EX replica should compute like the device.

### Trade-offs
- Significant build complexity (Emscripten toolchain setup).
- Memory management: C++ heap memory must be manually freed after WASM calls.
- Debugging is harder (no native browser devtools for WASM stepping yet in all browsers).
- **Risk:** If WASM compilation fails to set up, the whole project depends on the JS fallback — which lacks precision.

### Fallback
`WasmService._fallbackEvaluate()` uses a scoped `new Function()` evaluator for when WASM is unavailable. This is temporary and will be replaced once the engine is compiled.

### Decision: JS Fallback Security
`eval()` is **not** used. Instead, `new Function(...keys, `return ${expr}`)` with an explicit whitelist of math function names limits the attack surface. However, this is still not production-safe — when WASM is live, the fallback should be disabled.

---

## DEC-03: Observable Pattern for State Management

**Date:** August 2026  
**Status:** ✅ Active (implemented in AppState, CalculatorState, GameState)

### Decision
Build a custom lightweight observable store instead of using Redux, Zustand, or MobX.

### Reasoning
1. No external dependencies (consistent with DEC-01).
2. Simple subscribe/dispatch model is sufficient for this application's complexity level.
3. Three separate state stores (`AppState`, `CalculatorState`, `GameState`) keep concerns isolated.

### Pattern Details
```
State.subscribe(key, callback)  →  reactive listener
State.setState(updates)         →  merge + notify subscribers
State.getState(path)            →  dot-notation read
```

### Trade-offs
- No time-travel debugging (no Redux DevTools).
- No immutability enforcement (state object is mutated in-place with `_mergeState()`).
- Three separate stores means cross-store operations require manual coordination.

---

## DEC-04: Firebase for Cloud Backend

**Date:** August 2026  
**Status:** ⚠️ Decided; config placeholder; not yet active

### Decision
Use Firebase (Firestore + Authentication) for:
- Anonymous and Google OAuth user auth
- Game leaderboard (Firestore `scores` collection)
- Calculation history sync (Firestore `calculations` collection)

### Reasoning
1. **Zero backend code:** Firebase provides BaaS; no server to maintain.
2. **Free tier generous:** Spark plan covers 50k reads/day, 20k writes/day — more than sufficient for a course project.
3. **Real-time capability:** Firestore `onSnapshot()` enables live leaderboard updates.
4. **Offline support:** Firestore `enablePersistence()` provides automatic offline caching.

### Trade-offs
- Firebase vendor lock-in.
- Security rules must be carefully authored (risk of accidental data exposure).
- Free-tier limits could be hit if the app becomes popular.

### Offline Strategy
```
User Action → localStorage (immediate) → FirebaseService sync (async on reconnect)
```

---

## DEC-05: CSS Custom Properties (Design Tokens) Over Preprocessors

**Date:** August 2026  
**Status:** ✅ Active (`tokens.css` implemented)

### Decision
Use native CSS custom properties (`--var-name`) as design tokens instead of Sass/SCSS variables.

### Reasoning
1. No build step needed.
2. CSS custom properties are runtime-changeable — essential for dark/light theme switching via `data-theme` attribute on `<body>`.
3. 50+ tokens defined for all color, sizing, animation, and shadow values.

### Trade-offs
- Less powerful than Sass (no mixins, nesting, loops in plain CSS).
- Requires modern browser support (all major browsers since ~2018 — acceptable).

---

## DEC-06: HTML/CSS Flexbox for Natural Display (Not Canvas)

**Date:** August 2026  
**Status:** ✅ Decided; implementation pending

### Decision
Render Natural Display (fractions, radicals, superscripts) using HTML/CSS (`<span>`, flexbox, custom `.frac` / `.radical` classes) rather than Canvas or SVG.

### Reasoning
1. **Accessibility:** HTML text is selectable, readable by screen readers, and copyable. Canvas/SVG would require additional ARIA work.
2. **CSS is sufficient:** Stacked fractions (`sup`/`sub` with a horizontal line) and radical symbols can be achieved purely with CSS.
3. **No MathJax dependency** required if we keep it simple (MathJax is available as fallback).
4. **Cursor positioning:** Future cursor-in-expression navigation is simpler with DOM nodes than Canvas.

### Trade-offs
- More complex CSS for edge cases (nested fractions, radical over fraction).
- Cannot render arbitrary LaTeX without MathJax.

### Fallback
If CSS Natural Display proves too complex, `CalcController._renderMathDisplay()` already includes a MathJax rendering path (with `typesetPromise()`).

---

## DEC-07: Singleton Pattern for All Services and Controllers

**Date:** August 2026  
**Status:** ✅ Active

### Decision
Each service and controller class is instantiated exactly once and exposed as a module-level `const`. All instances are also attached to `window` for console debugging.

```js
const wasmService = new WasmService();
window.wasmService = wasmService;
```

### Reasoning
1. Simplest approach without ES Modules (which would require a bundler or `type="module"` scripts with CORS constraints).
2. Debugging: attaching to `window` allows direct testing in browser devtools console.
3. Avoids circular import issues inherent in non-module scripts.

### Trade-offs
- Global namespace pollution (all state, service, and controller instances live on `window`).
- No tree-shaking possible.
- Harder to test in isolation (no dependency injection).

### Future Migration
When/if a bundler (Vite or esbuild) is introduced, singletons should be converted to proper ES Module exports and `window.*` debug assignments removed.

---

## DEC-08: Scoring Formula Design

**Date:** August 2026  
**Status:** ✅ Active (implemented in `GameState._calculateScore()`)

### Decision
Game scoring formula:

```
Base     = difficulty.baseScore       (Easy=1000, Medium=2000, Hard=3000)
TimeBon  = max(0, 60 - timeSec) × 50
AttemptB = max(0, maxAttempts - attempts) × 100
Streak   = 1.0 if streak ≤ 2, else 1.1 + (min(streak, 10) × 0.05)
Score    = floor((Base + TimeBon + AttemptB) × Streak)
```

### Reasoning
- **Base** rewards playing higher difficulty.
- **Time bonus** rewards speed but capped at 60s (so slow players can still score).
- **Attempt bonus** rewards efficiency.
- **Streak multiplier** rewards consistency and adds a meta-game layer without being dominant.

### Example
Hard mode, 3 attempts, 15 seconds, 5-win streak:
```
Base = 3000
TimeBon = (60-15) × 50 = 2250
AttemptB = (5-3) × 100 = 200
Streak = 1.1 + (5 × 0.05) = 1.35
Score = floor((3000 + 2250 + 200) × 1.35) = floor(7371) = 7371
```

---

## DEC-09: Three Separate State Stores vs. One Global Store

**Date:** August 2026  
**Status:** ✅ Active

### Decision
Three separate observable state objects:
- `AppState` — global app preferences and UI state
- `CalculatorState` — expression, result, history, undo/redo
- `GameState` — active game session and statistics

### Reasoning
1. **Separation of concerns:** Calculator state changes frequently; game state changes only during a game; app state changes rarely. Mixing them would cause unnecessary re-renders.
2. **Clear ownership:** Each controller knows exactly which state it owns and subscribes to.
3. **Independent persistence:** Game stats and app prefs have different localStorage lifetimes.

### Trade-offs
- Cross-store coordination requires accessing multiple stores (e.g., `GameState.saveGameResult()` calls `appState.getState('userId')`).
- No single `store.getState()` for diagnostics — must query all three.

---

## DEC-10: No Test Framework Yet

**Date:** October 2026  
**Status:** ⚠️ Deferred — no tests written

### Decision
Tests have been deferred to Sprint 9 (Week 16–17). No test framework is currently installed.

### Reasoning
The frontend scaffold and state layer need to be functionally connected first. Writing tests for disconnected code produces false confidence.

### Planned Approach
- **C++ unit tests:** Google Test or Catch2 (built natively before compiling to WASM)
- **JavaScript unit tests:** Jest or Vitest (for controllers, services, state)
- **End-to-end tests:** Cypress (full calculator workflow)
- **Coverage targets:** C++ ≥80%, JS ≥70%

### Risk
Deferring testing is the highest technical risk after the WASM engine. If tests are not written, bugs discovered late (especially in C++ math precision) will be costly to fix.
