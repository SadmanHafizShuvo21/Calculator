# CASIO fx-991EX — Design, Functionality & Core Features

Extracted from the *fx-570EX / fx-991EX User's Guide* (RJA532432-001V01). Items marked **(fx-991EX only)** differ from the fx-570EX.

---

## 1. Hardware & Physical Design

| Property | fx-991EX |
|---|---|
| Power | Built-in solar cell + LR44 button battery × 1 |
| Battery life | ~2 years (1 hr/day use); replace at least every 3 years |
| Operating temperature | 0°C – 40°C (32°F – 104°F) |
| Dimensions | 11.1 (H) × 77 (W) × 165.5 (D) mm |
| Weight | ~90 g including battery |
| Display | Natural Textbook (dot-matrix) LCD, adjustable contrast |
| Case | Slide-off hard case (moves to back of unit when in use) |
| Auto power-off | ~10 minutes of non-use |

### Display
- **Two regions:** input expression line + calculation result line, with an indicator strip at the top.
- **Scroll indicators:** `▶` / `▷` on the right edge mean the line continues; use ◀ ▶ to scroll.
- **Solar indicator:** shown when powered (wholly/partly) by solar cell **(fx-991EX only)**.
- **MultiLine Font:** in Line I/O modes, Normal Font = 4 lines, Small Font = 6 lines.
- **Contrast:** `SHIFT` `MENU`(SETUP) → ▲ → `3`(Contrast), adjust with ◀ ▶. A dim display that contrast can't fix = low battery.

### Status Indicators (top of screen)
| Indicator | Meaning |
|---|---|
| `S` | Keypad shifted (SHIFT pressed) |
| `A` | Alpha input mode (ALPHA pressed) |
| `D` / `R` / `G` | Angle unit: Degree / Radian / Gradian |
| `FIX` / `SCI` | Fixed decimal places / fixed significant digits |
| `M` | Non-zero value in independent memory |
| STO arrow | Waiting for variable name after `STO` |
| `√▭` icon | MathI/MathO or MathI/DecimalO active |
| `▮▮` | Intermediate result of multi-statement calc (also while generating QR code) |
| `E` | Engineer Symbol setting is On |
| `i` / `∠` | Complex format: a+bi / r∠θ |
| Sun icon | Solar-powered **(fx-991EX only)** |

### Key Color Coding
| Color | Meaning |
|---|---|
| Yellow | Press `SHIFT` then key |
| Red | Press `ALPHA` then key (variable/constant/symbol) |
| Purple (or purple `「」`) | Available in Complex Mode |
| Blue (or blue `「」`) | Available in Base-N Mode |

### Notable Keys
`ON`, `SHIFT`, `ALPHA`, `MENU`, `OPTN`, `CALC`, `SOLVE` (SHIFT+CALC), `S⇔D`, `STO`/RECALL, `Ans`, `M+`, `ENG`, `AC`, `DEL`/INS/UNDO, cursor keys (◀ ▶ ▲ ▼), `=`, `≈` (SHIFT+`=`), `CONST` (SHIFT+7), `CONV` (SHIFT+8), `RESET` (SHIFT+9), `QR` (SHIFT+OPTN).

---

## 2. Calculation Modes (`MENU` main menu)

| # | Mode | Purpose |
|---|---|---|
| 1 | **Calculate** | General calculations (default mode) |
| 2 | **Complex** | Complex-number arithmetic |
| 3 | **Base-N** | Binary / octal / decimal / hexadecimal |
| 4 | **Matrix** | Matrices up to 4×4 |
| 5 | **Vector** | 2D and 3D vectors |
| 6 | **Statistics** | 1-variable and regression |
| 7 | **Distribution** | 7 distribution types |
| 8 | **Spreadsheet** | 45 rows × 5 columns (A1–E45) |
| — | **Table** | Number table from f(x) and optional g(x) |
| — | **Equation/Func** | Simultaneous & polynomial equations |
| — | **Inequality** | 2nd–4th degree inequalities |
| — | **Ratio** | Solve A:B = X:D or A:B = C:X |

Menus: select items by pressing the number key shown; ▲▼ scroll; ◀ returns from a sub-menu; `AC` closes.

---

## 3. Input / Output System

### Input/Output Formats (`SHIFT` `MENU` → 1)
| Option | Input | Output |
|---|---|---|
| **MathI/MathO** (default) | Natural Textbook | Fractions, √, π preserved |
| MathI/DecimalO | Natural Textbook | Decimal |
| LineI/LineO | Linear (single line) | Decimal or fraction |
| LineI/DecimalO | Linear | Decimal |

### Result Toggling
- `S⇔D` toggles fraction ↔ decimal, √ ↔ decimal, π ↔ decimal.
- `SHIFT` `=` (≈) gives a decimal result directly.
- `SHIFT` `S⇔D` switches improper ↔ mixed fraction.
- Limit: decimal → mixed fraction fails if total digits > 10.

### Editing Features
- **Replay:** ◀ / ▶ after a result to edit the previous expression.
- **Calculation History:** ▲ ▼ scroll through past calculations (cleared on ON, mode change, I/O change, or reset).
- **Undo/Redo:** `ALPHA` `DEL` (MathI only).
- **Insert/Overwrite:** `SHIFT` `DEL` (INS), Line I/O only.
- **Template jump:** `SHIFT` ▶ / ◀ exits a fraction/∫/Σ template.
- **Argument wrapping:** `SHIFT` `DEL` (INS) lets a selected value become the argument of the next function (e.g., wrap 7/6 in √).
- **Multi-statements:** colon `:` chains expressions.
- **Auto-parentheses:** omitted × before `(` or variable inserts brackets (`6÷2(1+2)` → `6÷(2(1+2))`).

### Operator Priority (high → low)
1. Parenthetical expressions
2. Functions with parentheses (`sin(`, `log(` …)
3. Postfix: x², x³, x⁻¹, x!, °′″, °, ʳ, ᵍ, %, ▸t, engineering symbols, powers, roots
4. Fractions
5. Negative sign, base-n symbols (d, h, b, o)
6. Metric conversions, estimated values (x̂, ŷ)
7. Implied multiplication
8. nPr, nCr, complex polar ∠
9. Dot product
10. × ÷
11. + −
12. `and`
13. `or`, `xor`, `xnor`

---

## 4. Setup Menu (`SHIFT` `MENU`)

| Setting | Options (◆ = default) |
|---|---|
| Input/Output | MathI/MathO◆, MathI/DecimalO, LineI/LineO, LineI/DecimalO |
| Angle Unit | Degree◆, Radian, Gradian |
| Number Format | Fix (0–9), Sci (0–9), Norm 1◆ (10⁻² > \|x\|, \|x\| ≥ 10¹⁰), Norm 2 (10⁻⁹, 10¹⁰) |
| Engineer Symbol | On, Off◆ |
| Fraction Result | ab/c (mixed), d/c◆ (improper) |
| Complex | a+bi◆, r∠θ |
| Statistics | Freq column On, Off◆ |
| Spreadsheet | Auto Calc (On◆/Off); Show Cell (Formula◆/Value) |
| Equation/Func | Complex solutions On◆, Off |
| Table | f(x); f(x),g(x)◆ |
| Decimal Mark | Dot◆, Comma |
| Digit Separator | On, Off◆ |
| MultiLine Font | Normal◆, Small |
| QR Code | Version 3, Version 11◆ |
| Contrast | Adjustable |

### Reset (`SHIFT` `9`)
1. Setup Data (keeps memory) · 2. Memory · 3. Initialize All (all data and settings, except contrast).

---

## 5. Core Features by Mode

### 5.1 Calculate Mode — Basic Features
- **Fractions** (mixed and improper), **percent** (`SHIFT` `Ans`), **sexagesimal (°′″)**, **multi-statements**
- **Engineering notation:** `ENG` / `SHIFT` `ENG`(←) shift exponent by ±3
- **Engineering symbols:** m, μ, n, p, f, k, M, G, T, P, E (input via `OPTN` → 3)
- **Prime factorization:** `SHIFT` `°′″`(FACT) for positive integers ≤ 10 digits (fails if a factor ≥ 1,018,081 or 2+ factors > 3 digits)
- **Precision:** 15 internal digits; range ±1×10⁻⁹⁹ to ±9.999999999×10⁹⁹

### 5.2 Memory
| Type | Description |
|---|---|
| **Ans** | Last result, reusable |
| **Variables** | A, B, C, D, E, F, M, x, y — `STO` to assign, `SHIFT` `STO` (RECALL) to view all |
| **Independent memory (M)** | `M+` / `SHIFT` `M+` (M−) accumulate |
| Clear | `SHIFT` `9` → 2 (Memory) |

Memory persists through AC, mode changes, and power-off.

### 5.3 Function Library
- **Trig:** sin, cos, tan and inverses (respect angle unit)
- **Hyperbolic:** sinh, cosh, tanh and inverses (angle-independent)
- **Angle unit tags:** °, ʳ, ᵍ
- **Exponential/log:** 10ˣ, eˣ, log (any base: `log(a,b)` or `log▭` template), ln
- **Powers/roots:** x², x³, xʸ, √, ³√, ʸ√, x⁻¹
- **Calculus:** ∫ (numerical integration), d/dx (derivative), Σ (summation) — Gauss-Kronrod / central-difference methods; tolerance defaults 1×10⁻⁵ (∫) and 1×10⁻¹⁰ (d/dx)
- **Coordinates:** Pol( ) and Rec( )
- **Other:** x!, Abs, Ran#, RanInt#, nPr, nCr, Rnd
- **Constants:** π, e

### 5.4 CALC
Store an expression with variables (e.g., `3A+B`), then press `CALC` to supply values and evaluate. Available in Calculate and Complex modes. Linear input is used while in CALC.

### 5.5 SOLVE
Newton's-method numeric equation solver (Calculate Mode only). Accepts forms like `y = x + 5`, `x = sin(M)`, `xy + C`. Displays the solution plus (Left − Right) as an accuracy check. Returns only one root; may ask "Continue:[=]" if unconverged. Errors: *Variable ERROR*, *Cannot Solve*.

### 5.6 Complex Mode
- Rectangular (a+bi) or polar (r∠θ) input and output; θ in (−180°, 180°]
- Functions: Conjugate, Argument, Real Part, Imaginary Part, Abs, ▸r∠θ, ▸a+bi
- Integer powers of complex numbers supported

### 5.7 Base-N Mode
- Switch DEC / HEX / BIN / OCT (`x²`, `xˣ`, `log▭`, `ln` keys)
- 32-bit signed range (decimal −2147483648 … 2147483647)
- Inline base tags: d, h, b, o
- Logic: and, or, xor, xnor, Not, Neg
- Hex digits A–F typed on dedicated keys
- No fractions or exponents; fractional results are truncated

### 5.8 Statistics Mode
- **Types:** 1-Variable; Linear (a+bx); Quadratic; Logarithmic; *e*-exponential; *ab*-exponential; Power; Inverse
- **Editor capacity:** 160 rows (x), 80 rows (x,y or x,Freq), 53 rows (x,y,Freq)
- **Outputs:** Σx, Σx², Σy, Σy², Σxy, Σx³, Σx²y, Σx⁴; n; mean; population/sample variance and std dev; min/max; Q1, median, Q3
- **Regression:** a, b, (c), r, and estimates x̂, x̂₁, x̂₂, ŷ
- **Normal distribution helpers:** P(, Q(, R(, ▸t (standardized variate)
- Data cleared on exit or on switching 1-var ↔ paired

### 5.9 Distribution Mode (7 types)
| Type | Inputs |
|---|---|
| Normal PD | x, σ, μ |
| Normal CD | Lower, Upper, σ, μ |
| Inverse Normal | Area, σ, μ (left tail) |
| Binomial PD / CD | x, N, p |
| Poisson PD / CD | x, λ |

Data input via **List** (up to 45 values) or single **Variable**; accuracy to ~6 significant digits.

### 5.10 Equation/Func Mode
- **Simultaneous linear:** 2, 3, or 4 unknowns
- **Polynomial:** degree 2, 3, or 4 (exact √ results shown in Polynomial)
- Quadratics also display the vertex (local min/max x and y)
- Solutions can be stored to variables with `STO`

### 5.11 Inequality Mode
Solve degree 2–4 polynomial inequalities (`<`, `>`, `≤`, `≥`). Shows interval solutions, "All Real Numbers", or "No Solution".

### 5.12 Matrix Mode
- Matrices up to **4×4**, stored in **MatA–MatD**, result in **MatAns**
- Operations: +, −, ×, ÷, Det, Trn (transpose), Identity, inverse (x⁻¹), x², x³, Abs
- Define/Edit/Copy matrix variables via `OPTN`

### 5.13 Vector Mode
- 2D and 3D vectors in **VctA–VctD**, result in **VctAns**
- Operations: +, −, scalar ×, dot product, cross product, Abs (magnitude), Angle, Unit Vector

### 5.14 Table Mode
- f(x) only (up to 45 rows) or f(x) & g(x) (up to 30 rows)
- Start / End / Step inputs; editable x cells; ± auto-fill from row above
- *Range ERROR* if the row limit is exceeded

### 5.15 Ratio Mode
- Solve **A:B = X:D** or **A:B = C:X** (inputs up to 10 digits; 0 causes Math ERROR)

### 5.16 Spreadsheet Mode
- **Grid:** A1–E45 (45 rows × 5 columns); edit box shows the active cell
- **Cell types:** constants (≤10 bytes) and formulas starting with `=` (≤49 bytes); total capacity 1,700 bytes
- **Functions:** Min(, Max(, Mean(, Sum( over ranges (`start:end`)
- **References:** relative, absolute (`$A$1`, `$A1`, `A$1`), and the **Grab** command to pick cells
- **Editing:** Edit Cell, Cut & Paste, Copy & Paste, delete cell / delete all
- **Batch fill:** *Fill Formula* and *Fill Value* over a range
- **Recalculation:** Auto Calc on/off; manual Recalculate
- **Variables:** assign cell values to A–F/M/x/y
- Contents are lost on exiting the mode, power-off, or pressing ON
- Errors: *Circular ERROR*, *Memory ERROR*, *Range ERROR*

---

## 6. Special Features

### 6.1 QR Code (`SHIFT` `OPTN`)
- Displays QR codes for result/setup/menu/error/table screens, readable by a smartphone (opens CASIO's web service)
- Multiple codes may be generated (e.g., `1/2`); advance with ▼ or `=`
- ◀ ▶ adjust QR-only contrast
- **Version 11** (default; supports more modes) or **Version 3** (easier to scan, fewer supported modes)

### 6.2 Scientific Constants (`SHIFT` `7`)
47 built-in constants (CODATA 2010) in 6 categories: Universal, Electromagnetic, Atomic & Nuclear, Physico-Chemical, Adopted Values, Other.

### 6.3 Metric Conversion (`SHIFT` `8`)
Unit conversions (NIST SP 811, 2008) across: Length, Area, Volume (US/UK gal), Mass, Velocity, Pressure, Energy, Power, Temperature.

---

## 7. Error Messages

| Error | Cause |
|---|---|
| Math ERROR | Result/input out of range, or illegal operation (e.g., ÷0) |
| Stack ERROR | Numeric/command/matrix/vector stack exceeded |
| Syntax ERROR | Malformed calculation |
| Argument ERROR | Invalid function argument |
| Dimension ERROR | Matrix/vector dimensions undefined or incompatible |
| Variable ERROR | SOLVE used with no variable |
| Cannot Solve | SOLVE could not converge |
| Range ERROR | Table too long, or invalid spreadsheet range |
| Time Out | ∫ / d/dx did not meet end condition (raise `tol`) |
| Circular ERROR | Circular spreadsheet reference |
| Memory ERROR | Spreadsheet capacity exceeded or chained references |

Press ◀/▶ to return to the cursor at the error location; `AC` clears the error and the calculation.

---

## 8. Technical Limits (Selected)

| Function | Input Range |
|---|---|
| sin/cos | Degree: \|x\| < 9×10⁹; Radian: < 157079632.7; Gradian: < 1×10¹⁰ |
| sin⁻¹/cos⁻¹ | \|x\| ≤ 1 |
| sinh/cosh | \|x\| ≤ 230.2585092 |
| log/ln | 0 < x ≤ 9.999999999×10⁹⁹ |
| eˣ | x ≤ 230.2585092 |
| x! | 0 ≤ x ≤ 69 (integer) |
| nPr / nCr | n < 1×10¹⁰, 0 ≤ r ≤ n |
| √x | 0 ≤ x < 1×10¹⁰⁰ |
| RanInt#(a,b) | a < b; \|a\|,\|b\| < 1×10¹⁰ |
| π-form display | \|x\| < 10⁶ |

Precision is generally ±1 at the 10th digit per operation; errors accumulate in chained calculations.

---

## 9. Care & Maintenance

- Replace battery at least every 3 years (LR44); never leave a dead battery inside.
- After replacing the battery, **Initialize All** (`ON` `SHIFT` `9` `3` `=`) — do not skip. Removing the battery erases all memory.
- Avoid temperature extremes, humidity, dust, impact, pressure, and bending; clean with a soft dry cloth.
- Troubleshooting order: check expression → confirm correct mode → press `ON` (self-check) → reset Setup Data.

---

## 10. Key Shortcuts Reference

| Action | Keys |
|---|---|
| Power off | `SHIFT` `AC` |
| Main menu | `MENU` |
| Setup | `SHIFT` `MENU` |
| Initialize all | `SHIFT` `9` `3` `=` |
| Reset setup only | `SHIFT` `9` `1` `=` |
| Clear memories | `SHIFT` `9` `2` `=` |
| Decimal result | `SHIFT` `=` |
| Toggle S⇔D | `S⇔D` |
| Mixed ↔ improper | `SHIFT` `S⇔D` |
| Undo | `ALPHA` `DEL` |
| Insert/overwrite | `SHIFT` `DEL` |
| Constants / Conversions | `SHIFT` `7` / `SHIFT` `8` |
| QR code | `SHIFT` `OPTN` |
| SOLVE | `SHIFT` `CALC` |
| Back to Calculate mode | `MENU` `1` |
