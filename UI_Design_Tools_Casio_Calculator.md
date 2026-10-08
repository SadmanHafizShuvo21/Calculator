# 🎨 UI Design Tools Guide
## For Casio fx-991EX Web Calculator — Copilot-Integrated Workflow

**Project:** Web-Based Casio fx-991EX Scientific Calculator  
**Developer:** Sadman (CIT-320)  
**Purpose:** Free tools to design, prototype, and export production CSS/HTML for the calculator UI  
**Updated:** August 2026  

---

## 📌 TL;DR — Which Tool for Which Task?

| You Want To... | Use This Tool |
|---|---|
| Design the Casio body shape & button layout visually | **Penpot** or **Figma Free** |
| Generate HTML/CSS from a design file automatically | **Anima** (Figma plugin) or **Locofy** |
| Prompt-generate React calculator components | **v0 by Vercel** |
| Turn a screenshot of real Casio into code | **Builder.io Visual Copilot** |
| Get CSS tokens, spacing, and color values | **Penpot Inspector** or **Figma Dev Mode** |
| Animate button presses, display glows | **Framer** (free tier) |
| Get open-source, no-account-needed tool | **Penpot** (self-hosted or cloud) |

---

## 🛠️ THE 6 RECOMMENDED FREE TOOLS

---

### 1. 🟣 Penpot — Open-Source Design + CSS Export
**Website:** https://penpot.app  
**Cost:** Free forever (unlimited files, projects, users)  
**Best For:** Designing the calculator body layout + exporting clean CSS directly to Copilot  

#### Why It Fits the Casio Project:
<details>
<summary>Expand details</summary>

- **CSS Grid/Flexbox native** — Penpot uses CSS logic internally, so inspected values map directly to your `calculator.css` without translation
- **SVG-native rendering** — every element is real SVG, perfect for the Casio's rounded body, display bezel, and button curves
- **CSS export** — highlight any element → Inspect panel → copy CSS; paste directly into your project
- **Design Tokens built-in** — define `--btn-primary-bg`, `--display-text-color` once, reuse everywhere
- **100% free and open source** — no account limits, no export paywalls
- **Copilot compatible** — copy CSS from Penpot inspector → paste into VSCode → Copilot refines and completes it

</details>

#### Copilot Workflow:
```
Penpot → Design calculator body + button grid
      ↓
      Inspect panel → Copy CSS values (colors, border-radius, padding)
      ↓
      Paste into VSCode → Copilot auto-completes missing rules
      ↓
      Iterate: change Penpot → update tokens.css → Copilot fills gaps
```

#### Prompt to Use with Copilot After Penpot:
```
[RESPONSIVE] I have these CSS variables from Penpot for the Casio fx-991EX body:
  --calc-body-color: #1a2332;
  --calc-display-bg: #c8d5a0;
  --btn-primary-bg: #2d3f55;
  --btn-shift-bg: #f5a623;
  --btn-alpha-bg: #e74c3c;
  --border-radius-btn: 4px;
  --btn-width: 44px;
  --btn-height: 32px;

Generate responsive CSS for the 7×5 button grid with these values.
Target breakpoints: 320px (mobile), 481px (tablet), 769px (desktop).
```

#### Key Features for This Project:
- Draw the calculator body (dark navy `#1a2332`) as a rounded rectangle
- Add the bezel for the display (the green-tinted LCD area)
- Grid the 7×5 button layout using Penpot's CSS Grid mode
- Color-code button groups: SHIFT (orange), ALPHA (red), numbers (dark gray), functions (dark navy)
- Export: `File → Export → CSS` or use the inspector panel

---

### 2. 🔵 Figma (Free Plan) + Anima Plugin — Design to Code
**Website:** https://figma.com | Plugin: https://www.figma.com/community/plugin/788477122896843932  
**Cost:** Figma Free (unlimited personal files) + Anima Free (5 code generations/day)  
**Best For:** Pixel-perfect Casio layout design → auto-generate HTML/CSS/React  

#### Why It Fits the Casio Project:
<details>
<summary>Expand details</summary>

- **Auto Layout = CSS Flexbox** — Figma's Auto Layout mirrors CSS Flexbox exactly; what you design is what Anima exports
- **Anima plugin** — converts your Figma frames directly to HTML/CSS or React components, targeting Tailwind or vanilla CSS
- **Dev Mode** — share a Figma link with Copilot context, extract spacing, font sizes, and border-radius values
- **Component system** — design one button style, apply as a Figma component across all 50 buttons; Anima exports as reusable CSS class
- **Figma MCP server** — in 2026, Figma has an MCP server that lets Copilot/Cursor read your Figma file directly

</details>

#### Copilot Workflow:
```
Figma → Design Casio layout with Auto Layout + Components
      ↓
      Anima Plugin → Generate HTML/CSS or React
      ↓
      Copy generated code → paste into VSCode project
      ↓
      Copilot refines: adds event handlers, WASM calls, state updates
```

#### Casio-Specific Figma Setup:
```
Frame: 360×640px (mobile portrait — matches physical calc)
 ├── Calculator Body (rounded rect, fill: #1a2332, corner: 20px)
 │   ├── Display Area (80×120px, fill: #c8d5a0, border: 2px solid #7a9b6e)
 │   │   ├── Expression Line (top, 14px monospace)
 │   │   └── Result Line (bottom, 28px bold monospace)
 │   └── Button Grid (Auto Layout, columns: 5, rows: 7, gap: 4px)
 │       ├── Row 1: [SHIFT] [ALPHA] [←] [↑] [▼]
 │       ├── Row 2: [MENU] [CALC] [∫] [d/dx] [x]
 │       ├── Row 3: [x²] [√] [^] [log] [ln]
 │       ├── Row 4: [sin] [cos] [tan] [,] [M+]
 │       ├── Row 5: [7] [8] [9] [DEL] [AC]
 │       ├── Row 6: [4] [5] [6] [×] [÷]
 │       └── Row 7: [1] [2] [3] [+] [-]
 └── Bottom Row: [0] [.] [×10ˣ] [Ans] [=]
```

#### Button Color Groups (Define as Figma Components):
```
.btn-shift    → background: #f5a623  (orange — top-left)
.btn-alpha    → background: #c0392b  (red — second from left)
.btn-number   → background: #3d5168  (dark blue-gray)
.btn-op       → background: #2c3e50  (darker navy)
.btn-equals   → background: #e67e22  (orange-amber)
.btn-delete   → background: #c0392b  (red)
```

#### Prompt to Use with Copilot After Anima Export:
```
[CALC-3.1] Anima exported this button HTML structure. Wire it to my WASM calculator:

<div class="btn-grid">
  <button class="btn btn-number" data-key="7">7</button>
  <!-- ... -->
  <button class="btn btn-equals" data-key="=">=</button>
</div>

Add:
1. Click event listeners calling WasmService.evaluate()
2. Keyboard binding (physical keyboard ↔ button visual press)
3. Button press animation (CSS transform: scale(0.95))
4. State update via appState.dispatch(new CalcEvaluateCommand(expr))
```

---

### 3. 🟡 v0 by Vercel — Prompt-to-React Component Generator
**Website:** https://v0.dev  
**Cost:** Free ($5 monthly credits included)  
**Best For:** Generating React/Tailwind calculator UI components directly from text prompts  

#### Why It Fits the Casio Project:
<details>
<summary>Expand details</summary>

- **Prompt-driven** — describe the Casio UI in words, get a working React component instantly
- **Tailwind CSS output** — clean, production-level Tailwind classes
- **shadcn/ui compatible** — components use the same design system as modern React apps
- **Iterative** — keep prompting to refine (add dark mode, adjust button sizes, fix mobile layout)
- **Copy directly into VSCode** — paste output into your `/frontend/src/presentation/components/` folder
- **Copilot-friendly** — v0 output reads as clean React, Copilot can extend it immediately

</details>

#### Starter Prompt for the Casio Calculator in v0:
```
Create a React component for a Casio fx-991EX scientific calculator replica.

Requirements:
- Dark navy body (#1a2332) with rounded corners (20px)
- LCD display area: green-tinted (#c8d5a0 background, #2d4a1e text) with 2 lines
  - Top line: current expression (smaller, right-aligned)
  - Bottom line: result (large, right-aligned)
- Button grid: 5 columns × 8 rows
- Button colors:
  - SHIFT button: orange (#f5a623)
  - ALPHA button: red (#c0392b) 
  - Number buttons (0-9): dark blue-gray (#3d5168)
  - Scientific function buttons: darker navy (#2c3e50)
  - Equals button: amber (#e67e22), wider
  - DEL/AC: red tones
- Buttons have slight 3D shadow (box-shadow bottom-right)
- Button press: scale(0.95) + 80ms transition
- Use Tailwind CSS + shadcn/ui
- Include: sin, cos, tan, log, ln, √, x², ^, (, ), DEL, AC
- Display mode indicator in top-left (DEG / RAD / GRAD)
- Small orange dot for SHIFT indicator

Make it pixel-accurate to the physical Casio fx-991EX.
```

#### Follow-up Prompts for Iteration:
```
v0 Prompt 2: Add dark/light theme toggle — light mode should look like the pink/white 
              Casio fx-991EX Pink edition body (#f8e4e4 body, same button colors)

v0 Prompt 3: Add a slide-out history panel on the right side, showing last 10 
              calculations in a monospace font

v0 Prompt 4: Make the display glow slightly with CSS animation — simulate the 
              green LCD backlight effect

v0 Prompt 5: Make it responsive — on mobile, scale the button grid to 90% viewport width
```

#### Copilot Integration After v0:
```
[WASM] Wire this v0 React component to the WASM calculator engine.
Replace the placeholder onClick handlers with WasmService.evaluate() calls.
The component receives: expression (string), result (string), angleMode (string).
Use the appState Observable pattern from AppState.js.
```

---

### 4. ⚫ Builder.io Visual Copilot — Screenshot to Code
**Website:** https://www.builder.io/m/design-to-code  
**Cost:** Free tier (~60 credits/month)  
**Best For:** Converting a screenshot of the real Casio fx-991EX to working HTML/CSS instantly  

#### Why It Fits the Casio Project:
<details>
<summary>Expand details</summary>

- **Screenshot → Code** — take a photo/screenshot of the physical Casio fx-991EX → Builder.io generates HTML+CSS that matches
- **VS Code extension available** — Builder.io's "Visual Copilot" VSCode plugin integrates directly with GitHub Copilot
- **Component mapping** — maps design elements to your existing components in the codebase (ButtonGrid.js, Display.js, etc.)
- **Multi-framework** — export React, Vue, HTML/CSS, Next.js, or Angular
- **Best fidelity** — rated highest for structural accuracy among Figma-to-code tools

</details>

#### Copilot Workflow:
```
1. Take a screenshot of physical Casio fx-991EX (or use casio.com product image)
2. Upload to Builder.io → Visual Copilot
3. Select target: React + Tailwind
4. Map detected elements to your components:
   - "Button cluster" → ButtonGrid.js
   - "LCD display" → Display.js
   - "Body shell" → CalculatorLayout.js
5. Export code → paste into VSCode
6. Ask Copilot to wire event handlers + WASM calls
```

#### VSCode Extension Prompt After Builder.io Export:
```
[CALC-3] Builder.io generated this component from a Casio fx-991EX screenshot.
Map each button's data-key to its WASM function:

data-key="sin"  → calc_evaluate("sin(" + state.expr + ")")
data-key="cos"  → calc_evaluate("cos(" + state.expr + ")")
data-key="√"    → calc_evaluate("sqrt(" + state.expr + ")")
data-key="="    → full evaluate and display result
data-key="DEL"  → remove last character from expression
data-key="AC"   → clear all (expression + result)

Add to CalcController.js handleButtonPress() method.
```

---

### 5. 🟢 Framer — Animation + Interaction Design
**Website:** https://framer.com  
**Cost:** Free (limited pages, Framer.com subdomain)  
**Best For:** Designing micro-interactions, button animations, and the game UI transitions  

#### Why It Fits the Casio Project:
<details>
<summary>Expand details</summary>

- **Motion design without code** — design button press animations, display flicker effects visually
- **React code export** — Framer animations export as real CSS + JS (motion library)
- **Interactive prototypes** — simulate the calculator before writing WASM code
- **LCD flicker animation** — design the green display refresh animation in Framer → export as CSS keyframes
- **Game UI transitions** — animate the guessing game overlay sliding in/out

</details>

#### What to Design in Framer for This Project:

| Animation | CSS Output | Use In |
|---|---|---|
| Button press (scale down/up) | `transform: scale(0.95)` + `transition: 80ms` | `animations.css` |
| LCD screen turn-on flicker | CSS `@keyframes lcd-flicker` | `animations.css` |
| History panel slide-in | `transform: translateX(0)` from `translateX(110%)` | `HistoryPanel.js` |
| Game overlay fade-in | `opacity: 0 → 1` + `backdrop-filter: blur` | `GameUI.js` |
| Mode indicator pulse | `@keyframes pulse` on DEG/RAD badge | `Display.js` |

#### Framer → VSCode Workflow:
```
Framer: Design animation → Preview → Copy CSS/Motion code
        ↓
        Paste into animations.css
        ↓
        Copilot prompt: [RESPONSIVE] Apply this animation to .btn:active 
        and ensure it respects prefers-reduced-motion media query
```

---

### 6. 🔴 Locofy — Figma to Production React/Next.js
**Website:** https://locofy.ai  
**Cost:** Free tier (pay-as-you-go, limited monthly exports)  
**Best For:** Converting a fully finished Figma design into production-quality React components  

#### Why It Fits the Casio Project:
<details>
<summary>Expand details</summary>

- **Figma plugin** — works inside Figma, no context switch needed
- **Tag your design** — tell Locofy which Figma frames are components, which are containers
- **Clean React output** — considered the cleanest component structure among Figma-to-code tools
- **CSS Modules or Tailwind** — choose output style based on your project setup
- **Lightning mode** — converts nearly 80% of frontend automatically

</details>

#### Workflow for Casio Project:
```
Figma (Casio Design) → Locofy Plugin
                     → Tag: ButtonGrid (mapped to ButtonGrid.js)
                     → Tag: Display (mapped to Display.js)  
                     → Tag: HistoryPanel (mapped to HistoryPanel.js)
                     → Export: React + CSS Modules
                     → Copy into frontend/src/presentation/components/
                     → Copilot: add props, event handlers, WASM wiring
```

---

## 🎨 CASIO fx-991EX: DESIGN TOKENS REFERENCE

Copy this into `frontend/src/presentation/styles/tokens.css` and use with all tools above:

```css
/* ============================================================
   CASIO fx-991EX DESIGN TOKENS
   Reference: Physical device color-picked values
   Use with Penpot, Figma, v0, or any tool above
   ============================================================ */

:root {
  /* === BODY & STRUCTURE === */
  --calc-body-bg:          #1a2332;   /* Dark navy — main body */
  --calc-body-bg-alt:      #f2d0d8;   /* Pink edition (light mode) */
  --calc-border-color:     #0d1520;   /* Outer border/shadow */
  --calc-body-radius:      20px;      /* Rounded corners */
  --calc-body-width:       340px;     /* Desktop exact width */
  --calc-body-padding:     16px;

  /* === DISPLAY (LCD AREA) === */
  --display-bg:            #c8d5a0;   /* Green-tinted LCD background */
  --display-bg-dark:       #2a3a1a;   /* Dark mode display */
  --display-text:          #1a2d0a;   /* Dark green text on LCD */
  --display-bezel-bg:      #0f1e2e;   /* Frame around the display */
  --display-bezel-radius:  8px;
  --display-padding:       8px 12px;
  --display-font:          'Courier New', 'Consolas', monospace;
  --display-expr-size:     13px;      /* Expression line (smaller) */
  --display-result-size:   26px;      /* Result line (larger) */
  --display-height:        72px;

  /* === BUTTON BASE === */
  --btn-width:             52px;
  --btn-height:            28px;
  --btn-radius:            4px;
  --btn-font-size:         11px;
  --btn-font-family:       Arial, sans-serif;
  --btn-font-weight:       600;
  --btn-shadow:            0 3px 0 rgba(0,0,0,0.5);
  --btn-shadow-pressed:    0 1px 0 rgba(0,0,0,0.5);
  --btn-transition:        transform 80ms ease, box-shadow 80ms ease;

  /* === BUTTON COLORS (By Group) === */
  --btn-shift-bg:          #f5a623;   /* Orange — SHIFT key */
  --btn-shift-text:        #1a2332;
  --btn-alpha-bg:          #c0392b;   /* Red — ALPHA key */
  --btn-alpha-text:        #ffffff;
  --btn-number-bg:         #3d5168;   /* Dark blue-gray — 0-9 */
  --btn-number-text:       #ffffff;
  --btn-sci-bg:            #2c3e50;   /* Darker navy — functions */
  --btn-sci-text:          #ffffff;
  --btn-equals-bg:         #e67e22;   /* Amber — equals */
  --btn-equals-text:       #ffffff;
  --btn-delete-bg:         #c0392b;   /* Red — DEL/AC */
  --btn-delete-text:       #ffffff;
  --btn-nav-bg:            #2c3e50;   /* Arrow keys, MENU */
  --btn-nav-text:          #f5a623;   /* Orange label on nav buttons */

  /* === LABEL COLORS (Sub-labels above/below buttons) === */
  --label-shift-color:     #f5a623;   /* Orange — SHIFT functions */
  --label-alpha-color:     #c0392b;   /* Red — ALPHA functions */
  --label-secondary-size:  8px;       /* Secondary label font size */

  /* === INDICATOR BADGES (DEG / RAD / GRAD / CMPLX) === */
  --indicator-bg:          #2c3e50;
  --indicator-text:        #f5a623;
  --indicator-font-size:   9px;
  --indicator-padding:     2px 4px;
  --indicator-radius:      2px;

  /* === GRID LAYOUT === */
  --btn-grid-cols:         5;
  --btn-grid-gap:          4px;
  --btn-grid-padding:      8px;

  /* === ANIMATION === */
  --btn-press-scale:       0.92;
  --btn-press-duration:    80ms;
  --lcd-flicker-duration:  150ms;
  --panel-slide-duration:  300ms;
  --panel-slide-easing:    cubic-bezier(0.4, 0, 0.2, 1);

  /* === SHADOWS & DEPTH === */
  --calc-body-shadow:      0 8px 32px rgba(0,0,0,0.6),
                           0 2px 8px rgba(0,0,0,0.4);
  --display-inner-shadow:  inset 0 2px 6px rgba(0,0,0,0.3);

  /* === DARK / LIGHT THEME SWITCH === */
  --theme-bg:              #0d1520;   /* Page background */
  --theme-surface:         #1a2332;   /* Calculator body */
}

/* Dark mode (default for calculator, but page bg switches) */
[data-theme="light"] {
  --theme-bg:              #e8ecf0;
  --calc-body-bg:          #f2d0d8;   /* Pink edition */
  --display-bg:            #d4e0a8;
}
```

---

## 🔄 RECOMMENDED WORKFLOW: Tools Working Together

```
PHASE 1 — DESIGN (Week 1-2)
┌─────────────────────────────────────────────────────────┐
│  Option A: Penpot (free, open-source)                   │
│    → Design Casio body, display, button grid            │
│    → Inspect panel → copy CSS tokens                    │
│    → Paste into tokens.css                              │
│                                                         │
│  Option B: Figma Free                                   │
│    → Design with Auto Layout (= Flexbox)                │
│    → Use Casio button components with variants          │
│    → Anima plugin → generate HTML/CSS/React             │
└─────────────────────────────────────────────────────────┘
                          ↓
PHASE 2 — CODE GENERATION (Week 2-3)
┌─────────────────────────────────────────────────────────┐
│  v0 by Vercel                                           │
│    → Prompt-generate base React components              │
│    → Iterate with follow-up prompts                     │
│                                                         │
│  OR Builder.io                                          │
│    → Screenshot of real Casio → paste → export React   │
│    → Best for pixel-accurate starting point             │
└─────────────────────────────────────────────────────────┘
                          ↓
PHASE 3 — ANIMATION (Week 3-4)
┌─────────────────────────────────────────────────────────┐
│  Framer (free tier)                                     │
│    → Design button press + LCD animations visually      │
│    → Export CSS keyframes → paste into animations.css   │
│    → Copilot refines + adds prefers-reduced-motion      │
└─────────────────────────────────────────────────────────┘
                          ↓
PHASE 4 — COPILOT REFINEMENT (Ongoing)
┌─────────────────────────────────────────────────────────┐
│  VSCode Copilot                                         │
│    → Wire all components to WASM + AppState             │
│    → Add responsive breakpoints                         │
│    → Generate keyboard shortcuts                        │
│    → Write unit tests for UI components                 │
└─────────────────────────────────────────────────────────┘
```

---

## 💬 COMPLETE COPILOT PROMPT LIBRARY (UI-Specific)

### Prompt 1 — Generate the Full HTML Structure
```
[CALC-3.1] Generate the complete HTML structure for the Casio fx-991EX calculator.

Use these CSS token classes:
- calc-body → main body container
- calc-display → LCD display area
- display-expression → top line (smaller, right-aligned)
- display-result → bottom line (larger, right-aligned)
- display-indicators → row of mode badges (DEG, M, STO, etc.)
- btn-grid → 5-column CSS Grid container
- btn, btn-shift, btn-alpha, btn-number, btn-sci, btn-equals → button variants

Include data-key attribute on every button matching the physical Casio layout.
Include aria-label on every button for accessibility.
Wrap in semantic HTML5 elements.
```

### Prompt 2 — Apply Casio Color Scheme from Tokens
```
[RESPONSIVE] Apply the CSS design tokens from tokens.css to the calculator layout.

Rules:
1. All button colors must use the --btn-*-bg CSS variables (no hardcoded hex)
2. Display must use --display-bg with --display-inner-shadow
3. Body uses --calc-body-bg and --calc-body-shadow
4. Button press state: scale(var(--btn-press-scale)) in var(--btn-press-duration)
5. All transitions must use prefers-reduced-motion: 
   @media (prefers-reduced-motion: reduce) { transition: none; }
```

### Prompt 3 — Generate LCD Flicker Animation
```
[CALC-3.2] Add the LCD turn-on animation for the Casio calculator display.

Requirements:
- On page load: display flickers 3 times (on/off pattern)
- Timing: 0ms → on, 100ms → off, 200ms → on, 300ms → off, 400ms → solid on
- Use CSS @keyframes named 'lcd-startup'
- Apply to .calc-display element
- Duration: var(--lcd-flicker-duration)
- After animation: display shows "CASIO fx-991EX" for 800ms, then clears

Generate the CSS keyframes + JS initialization trigger.
```

### Prompt 4 — Make Buttons 3D (Casio-Style)
```
[CALC-3.3] Add 3D effect to calculator buttons matching physical Casio appearance.

CSS requirements:
- Resting state: box-shadow: 0 3px 0 rgba(0,0,0,0.5) (appears raised)
- Active/pressed state: 
    transform: translateY(2px)
    box-shadow: 0 1px 0 rgba(0,0,0,0.5) (appears pressed down)
- Text shadow on buttons: 0 1px 0 rgba(255,255,255,0.15)
- Top edge highlight: border-top: 1px solid rgba(255,255,255,0.15)
- Bottom edge shadow: border-bottom: 1px solid rgba(0,0,0,0.4)

Apply to all .btn variants.
Transition must complete in 80ms.
```

### Prompt 5 — SHIFT/ALPHA Indicator System
```
[STATE] Implement the SHIFT/ALPHA visual indicator system.

When SHIFT is pressed once:
  - .btn-shift gets class 'active' → background brightens
  - All buttons with data-shift attribute show their shift label
  - Small "S" indicator appears in display top-left
  - Next function press uses shift value, then SHIFT deactivates

When ALPHA is pressed once:
  - Same pattern but with alpha values
  - Display shows "A" indicator

Both modifiers cancel each other (SHIFT cancels ALPHA and vice versa).

Update CalculatorState.js → add { shiftMode: boolean, alphaMode: boolean }
Update CalcController.js → toggle modifier on SHIFT/ALPHA key press
Update Display.js → show mode indicator badges
```

### Prompt 6 — Natural Display (Fraction/Radical Rendering)
```
[CALC-2.1] Implement Natural Display in the calculator UI.

When WASM returns a fraction result (e.g., "3/4"):
  - Display as a proper vertical fraction (numerator/denominator stacked)
  - HTML structure: <span class="frac"><sup>3</sup><span>/</span><sub>4</sub></span>

When WASM returns a radical (e.g., "√2"):
  - Display with CSS radical symbol
  - HTML: <span class="radical"><span class="radical-content">2</span></span>

When result is very long (> 10 digits): switch to scientific notation (e.g., 1.234×10⁻⁵)

Update Display.js → parseAndRender(resultString) method
Use the formatter output from calc_format_display() WASM function
```

### Prompt 7 — Dark/Light Theme Toggle
```
[RESPONSIVE] Implement the dark/light theme toggle for the calculator.

Light mode (Pink Casio edition):
  --calc-body-bg: #f2d0d8      ← soft pink
  --display-bg: #d4e0a8        ← slightly lighter green
  (all other tokens stay same)

Dark mode (standard edition):
  Uses default token values from :root

Implementation:
1. ThemeToggle.js → toggle data-theme attribute on <body>
2. Store preference in localStorage key 'casio-theme'
3. On load: read preference → apply before first paint (no flash)
4. Add toggle button in top-right of calculator body (small sun/moon icon)
5. Transition: body { transition: background 300ms ease; }
```

---

## 📊 TOOLS COMPARISON TABLE

| Feature | Penpot | Figma + Anima | v0 by Vercel | Builder.io | Framer | Locofy |
|---|---|---|---|---|---|---|
| **Cost** | 🟢 Free forever | 🟡 Free + plugin (5/day) | 🟡 $5 credits/mo | 🟡 60 credits/mo | 🟡 Free (limited) | 🟡 Pay-as-go |
| **No Account Needed** | ❌ (email only) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Outputs Code** | 🟡 CSS inspect only | 🟢 HTML/CSS/React | 🟢 React+Tailwind | 🟢 React/Vue/HTML | 🟡 CSS + motion | 🟢 React/Next.js |
| **Copilot-Friendly** | 🟢 Excellent | 🟢 Excellent | 🟢 Best | 🟢 Excellent | 🟡 Good | 🟢 Good |
| **Screenshot → Code** | ❌ | ❌ | 🟡 Via image upload | 🟢 Best in class | ❌ | ❌ |
| **Animation Design** | 🟡 Basic | 🟡 Basic | ❌ | ❌ | 🟢 Best in class | ❌ |
| **Open Source** | 🟢 Yes (MIT) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Self-Hostable** | 🟢 Yes (Docker) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Best For** | CSS tokens, design | Pixel-perfect design | Rapid React gen | Screenshot → code | Animations | Figma → prod code |
| **Casio Project Use** | 1st design tool | Alternative to Penpot | Quick component gen | Body replica | Animations only | Final polish |

**Recommended combo for your project:** `Penpot` (design tokens) → `v0` (component gen) → `Framer` (animations) → `Copilot` (wiring)

---

## 🚀 QUICK START: Day 1 Action Plan

**Total setup time: ~2 hours**

### Step 1 — Set Up Penpot (20 min)
```
1. Go to https://penpot.app → Sign up free
2. New project → "Casio Calculator"
3. New file → "Calculator UI"
4. Set up design tokens (colors from tokens.css above)
5. Draw: Body → Display → ButtonGrid
6. Inspect panel: copy CSS for each element
```

### Step 2 — Get v0 Running (10 min)
```
1. Go to https://v0.dev → sign in with GitHub
2. New chat → paste the "Starter Prompt for Casio" from above
3. Iterate with follow-up prompts
4. Copy generated React component
5. Paste into frontend/src/presentation/components/CalculatorLayout.jsx
```

### Step 3 — Set Up Framer for Animations (20 min)
```
1. Go to https://framer.com → sign up free
2. New project → design button press animation
3. Export CSS → paste into frontend/src/presentation/styles/animations.css
```

### Step 4 — Copilot Takes Over (Rest of project)
```
Use prompt library above to:
- Wire HTML → WASM → State
- Add keyboard support
- Add responsive breakpoints
- Generate unit tests
```

---

## 📌 CASIO fx-991EX PHYSICAL REFERENCE

For pixel-perfect accuracy, reference these physical specs when designing:

| Element | Physical Size | Web Equivalent |
|---|---|---|
| Calculator body | 77 × 165 × 11.1mm | `340px × 620px` (desktop) |
| Display area | 60 × 20mm | `280px × 75px` |
| Display rows | 6 rows visible | `6-line display div` |
| Button size | ~8 × 6mm | `44px × 28px` |
| Button grid | 5 cols × 7 rows + bottom row | `5-column CSS Grid` |
| Body color | Dark navy | `#1a2332` |
| Display color | Green-tinted LCD | `#c8d5a0` |
| SHIFT key | Orange | `#f5a623` |
| ALPHA key | Red | `#c0392b` |
| Equals key | Darker, slightly wider | `width: 100%, background: #e67e22` |

---

## 🔗 QUICK LINKS

| Tool | URL | Free Tier |
|---|---|---|
| Penpot | https://penpot.app | Unlimited forever |
| Figma | https://figma.com | Unlimited personal files |
| Anima Plugin | figma.com/community → search "Anima" | 5 exports/day |
| v0 by Vercel | https://v0.dev | $5 credits/month |
| Builder.io | https://www.builder.io/m/design-to-code | 60 credits/month |
| Framer | https://framer.com | Free (limited publish) |
| Locofy | https://locofy.ai | Pay-as-you-go |

---

*Guide maintained by Sadman | Casio fx-991EX Project | CIT-320, PSTU*  
*Last updated: August 2026*
