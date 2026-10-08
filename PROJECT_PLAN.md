# 📅 PROJECT PLAN
## Web-Based Casio fx-991EX Scientific Calculator + Guessing Game

**Developer:** Sadman (ID: 2102021) | **Course:** CIT-320 | **Status:** Active Development  
**Last Updated:** October 2026

---

## 🎯 Project Goals

| Goal | Description | Priority |
|---|---|---|
| **G1 — Calculator Accuracy** | Replicate Casio fx-991EX to 15-digit precision using C++ compiled to WASM | 🔴 Critical |
| **G2 — Authentic UI** | Pixel-faithful replica of the physical calculator layout & styling | 🔴 Critical |
| **G3 — Guessing Game** | Playable, fair guessing game with hints, scoring, and streaks | 🟡 High |
| **G4 — Cloud Leaderboard** | Firebase-backed real-time leaderboard with anonymous/Google auth | 🟡 High |
| **G5 — Natural Display** | Render fractions, radicals, and exponents like the physical device | 🟡 High |
| **G6 — Offline-First** | Calculator works fully offline; game syncs when online | 🟢 Medium |
| **G7 — Performance** | <100ms calculation latency, <2s first paint, Lighthouse ≥90 | 🟢 Medium |
| **G8 — Accessibility** | WCAG 2.1 AA, full keyboard navigability | 🟢 Medium |

---

## 📊 Milestones

| Milestone | Description | Target | Status |
|---|---|---|---|
| **M0 — Architecture** | Design system & folder structure established | Week 1 | ✅ Done |
| **M1 — WASM Proof of Concept** | `evaluate("2+2")` returns `"4"` in browser via C++ WASM | Week 2 | 🔴 Not started |
| **M2 — Calculator MVP** | All basic & scientific operations, full UI wired | Week 6 | 🏗️ In Progress |
| **M3 — Game v1** | Playable guessing game with local leaderboard | Week 9 | ✅ Logic done |
| **M4 — Cloud Integration** | Firebase auth + Firestore leaderboard live | Week 12 | 🔴 Pending |
| **M5 — Natural Display** | Fraction/radical/exponent rendering live | Week 13 | 🔴 Pending |
| **M6 — Production Ready** | Lighthouse ≥90, WASM ≤500KB, zero P0 bugs | Week 16 | 🔴 Pending |
| **M7 — v1.0 Release** | Full feature parity with project report spec | Week 17 | 🔴 Pending |

---

## 🗺️ Roadmap (17 Weeks Total)

### ✅ Sprint 0: Foundation (Week 1) — DONE
- [x] Project folder structure created
- [x] Frontend HTML layout (full Casio button grid)
- [x] CSS design tokens and base styles
- [x] State management layer (AppState, CalculatorState, GameState)
- [x] Service stubs (WasmService, FirebaseService, StorageService)
- [x] Controllers scaffolded (CalcController, InputController, GameController)
- [x] Game logic complete (guessing, scoring, hints, achievements)
- [ ] ⚠️ WASM "Hello World" bridge — **NOT done**

---

### 🔴 Sprint 1: WASM Bridge (Week 2–3) — CRITICAL BLOCKER
**Goal:** Compile C++ function to WASM and call from JavaScript in browser.

- [ ] Set up Emscripten (emsdk 3.1.x) build environment
- [ ] Write `cpp-engine/core/` — types, precision config, error handler
- [ ] Write `cpp-engine/parser/` — tokenizer, AST, infix-to-postfix
- [ ] Write `cpp-engine/bridge/exports.cpp` — `evaluate()` WASM export
- [ ] Verify: `wasmService.evaluate("2+2")` returns `{ value: "4", error: null }`
- [ ] **Checkpoint A:** WASM loads <500ms, callable from JS

---

### 🔴 Sprint 2: Core Arithmetic Engine (Week 4–5)
**Goal:** All basic and scientific math operations in C++.

- [ ] `cpp-engine/math/arithmetic.cpp` — +, −, ×, ÷, fractions
- [ ] `cpp-engine/math/transcendental.cpp` — sin, cos, tan, log, ln, exp
- [ ] `cpp-engine/math/powers_roots.cpp` — x², √, ^, ⁿ√
- [ ] `cpp-engine/math/combinatorics.cpp` — nPr, nCr, n!
- [ ] `cpp-engine/math/statistics.cpp` — Σ, σ, mean
- [ ] Angle mode (DEG/RAD/GRAD) passed from JS to C++
- [ ] JS fallback engine removed or kept as backup only
- [ ] **Checkpoint B:** `sin(30°) = 0.5`, `log(100) = 2`, `√16 = 4`

---

### 🏗️ Sprint 3: Display & Input Full Wiring (Week 6–7) — IN PROGRESS
**Goal:** Calculator is fully usable in the browser.

- [ ] Wire `ButtonGrid.js` → `InputController` → `CalcController` → `WasmService`
- [ ] Wire display updates: `expressionLine` and `resultLine` DOM elements
- [ ] Memory operations (M+, M−, MR, MC) fully working
- [ ] Mode indicator badges (DEG / RAD / GRAD / M) reactive
- [ ] SHIFT / ALPHA modifier key visual states
- [ ] History panel fully populated and scrollable
- [ ] **Deliverable:** Calculator is usable for everyday scientific math

---

### 🔴 Sprint 4: Advanced Math (Week 8–9)
**Goal:** Matrix, complex numbers, equation solver, integration.

- [ ] `cpp-engine/algebra/matrix.cpp` — 4×4 ops, determinant, inverse
- [ ] `cpp-engine/algebra/complex.cpp` — a+bi arithmetic
- [ ] `cpp-engine/algebra/equation_solver.cpp` — linear, quadratic, cubic
- [ ] `cpp-engine/math/calculus.cpp` — numerical integration (Simpson's), differentiation
- [ ] UI for matrix entry / complex mode toggle
- [ ] **Deliverable:** All calculator modes from project spec

---

### 🔴 Sprint 5: Natural Display (Week 10)
**Goal:** Results render as fractions, radicals, and exponents.

- [ ] `cpp-engine/parser/formatter.cpp` — AST → Natural Display string
- [ ] Frontend `NaturalDisplay.js` — parse and render formatted strings
- [ ] CSS for stacked fractions (`.frac`) and radical symbols (`.radical`)
- [ ] MathJax integration (optional fallback)
- [ ] **Deliverable:** `1/3` shows as proper fraction; `√2` shows with symbol

---

### 🔴 Sprint 6: Firebase Cloud Integration (Week 11–12)
**Goal:** Real Firebase project wired; leaderboard live.

- [ ] Create Firebase project; add real config keys to `FirebaseService.js`
- [ ] Firebase Auth SDK loaded and initialized
- [ ] Anonymous sign-in on app start
- [ ] Google OAuth sign-in button
- [ ] Firestore `scores` collection — write on game end
- [ ] Firestore `scores` collection — read top 100 for leaderboard
- [ ] Offline fallback: `localStorage` when not authenticated or offline
- [ ] **Checkpoint C:** Score submitted → appears in leaderboard in <5s

---

### 🔴 Sprint 7: Guessing Game C++ Engine (Week 13)
**Goal:** Move game logic from JS to C++ WASM.

- [ ] `cpp-engine/game/engine.cpp` — random generation, game loop
- [ ] `cpp-engine/game/difficulty.cpp` — difficulty presets
- [ ] `cpp-engine/game/hint_system.cpp` — Higher/Lower + smart hints
- [ ] `cpp-engine/game/scoring.cpp` — score formula
- [ ] Replace JS `GameState.makeGuess()` with WASM calls
- [ ] χ² test: random distribution passes (p > 0.05)

---

### 🔴 Sprint 8: Polish & Performance (Week 14–15)
**Goal:** Production-quality experience.

- [ ] Complete responsive CSS (320px mobile, 768px tablet, 1024px desktop)
- [ ] PWA manifest + service worker (offline caching)
- [ ] Memory leak audits (Chrome DevTools heap snapshots)
- [ ] WASM bundle optimization (<500KB gzipped)
- [ ] Accessibility audit (WCAG 2.1 AA, keyboard-only usable)
- [ ] **Checkpoint D:** Lighthouse ≥90 on all categories

---

### 🔴 Sprint 9: Testing & Launch (Week 16–17)
**Goal:** v1.0 release.

- [ ] C++ unit tests (Google Test / Catch2, >80% coverage)
- [ ] JavaScript unit tests (Jest / Vitest, >70% coverage)
- [ ] End-to-end tests (Cypress)
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge (last 2 versions)
- [ ] Mobile: iOS Safari, Android Chrome
- [ ] Firebase security rules audit
- [ ] Demo video recorded
- [ ] Documentation finalized
- [ ] **v1.0 tag on GitHub**

---

## 🚦 Validation Gates

| Gate | Condition | Pass Criteria |
|---|---|---|
| **A** (After Sprint 1) | WASM works | `evaluate("2+2")` = `"4"` in <50ms |
| **B** (After Sprint 2) | Scientific calc works | sin/log/sqrt correct to 10 digits |
| **C** (After Sprint 6) | Cloud works | Score visible in leaderboard in <5s |
| **D** (After Sprint 8) | Production ready | Lighthouse ≥90, WASM ≤500KB, 0 P0 bugs |

**If any gate FAILS → stop, reassess, do not proceed.**

---

## ⚠️ Known Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Emscripten build complexity | Medium | **HIGH** | Pin emsdk version; start build setup immediately |
| C++ memory leaks in WASM heap | Medium | High | Use Valgrind in native tests; manual `free()` in bridge |
| Natural Display CSS complexity | Medium | Medium | CSS flexbox approach; avoid Canvas |
| Firebase free-tier limits | Low | Medium | Batch writes; localStorage fallback |
| Mobile touch latency | High | Medium | `touch-action: manipulation`; remove 300ms delay |
| Scope creep (AI solver, OCR, graphing) | High | High | Strict post-MVP bucket |
| Project incomplete by deadline | Medium | High | Sprint 1 WASM gate is a hard stop |

---

*"Plan is nothing. Planning is everything." — Eisenhower*
