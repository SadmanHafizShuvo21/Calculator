/* ========================================
   WASM SERVICE - JavaScript <-> C++ Bridge for Calculator Engine
   ======================================== */

class WasmService {
    constructor() {
        this.wasmModule = null;
        this.isReady = false;
        this.wasmPath = 'dist/casio-engine.js'; // Path to compiled Emscripten module
        this.messageQueue = [];
    }

    /**
     * Initialize WASM module
     */
    async initialize() {
        if (this.isReady) return true;

        try {
            // Load WASM module (will be created by Emscripten build)
            if (typeof window.CasioEngine === 'undefined') {
                console.warn('WASM module not loaded yet, using fallback math engine');
                this.isReady = true;
                return true;
            }

            this.wasmModule = window.CasioEngine;
            this.isReady = true;
            console.log('✓ WASM module initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize WASM module:', error);
            this.isReady = false;
            return false;
        }
    }

    /**
     * Check if WASM is ready
     */
    async ensureReady() {
        if (!this.isReady) {
            await this.initialize();
        }
        if (!this.isReady) {
            throw new Error('WASM module not available. Using fallback engine.');
        }
    }

    /**
     * ============ BASIC CALCULATOR OPERATIONS ============
     */

    /**
     * Evaluate mathematical expression
     * Input: "sin(45)+2*3"
     * Output: { value: "7.707...", formatted: "7.71", error: null }
     */
    async evaluate(expression, angleMode = 'DEG', options = {}) {
        try {
            await this.ensureReady();

            if (options.baseN) {
                return this._evaluateBaseN(expression, options.radix);
            }

            // Set angle mode
            if (this.wasmModule && this.wasmModule.ccall) {
                const mode = angleMode === 'DEG' ? 0 : angleMode === 'RAD' ? 1 : 2;
                this.wasmModule.ccall('set_angle_mode', 'void', ['number'], [mode]);
            }

            // Call WASM function
            if (this.wasmModule && this.wasmModule.ccall) {
                const result = this.wasmModule.ccall(
                    'evaluate',
                    'string',
                    ['string'],
                    [expression]
                );
                
                return {
                    value: result,
                    formatted: this._formatResult(result),
                    error: null
                };
            } else {
                // Fallback: use JavaScript math engine
                return this._fallbackEvaluate(expression, angleMode);
            }
        } catch (error) {
            return {
                value: null,
                formatted: null,
                error: error.message || 'Calculation error'
            };
        }
    }

    /**
     * Solve equation
     * Types: 0 = linear (ax+b=c), 1 = quadratic (ax²+bx+c=0), 2 = cubic
     */
    async solveEquation(equation, type = 0) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const result = this.wasmModule.ccall(
                    'solve_equation',
                    'string',
                    ['string', 'number'],
                    [equation, type]
                );
                
                return {
                    solutions: JSON.parse(result),
                    error: null
                };
            }
        } catch (error) {
            return {
                solutions: [],
                error: error.message
            };
        }
    }

    /**
     * ============ SCIENTIFIC FUNCTIONS ============
     */

    /**
     * Calculate sine
     */
    async sin(value, angleMode = 'DEG') {
        return this.evaluate(`sin(${value})`, angleMode);
    }

    /**
     * Calculate cosine
     */
    async cos(value, angleMode = 'DEG') {
        return this.evaluate(`cos(${value})`, angleMode);
    }

    /**
     * Calculate tangent
     */
    async tan(value, angleMode = 'DEG') {
        return this.evaluate(`tan(${value})`, angleMode);
    }

    /**
     * Calculate logarithm (base 10)
     */
    async log(value) {
        return this.evaluate(`log(${value})`);
    }

    /**
     * Calculate natural logarithm
     */
    async ln(value) {
        return this.evaluate(`ln(${value})`);
    }

    /**
     * Calculate exponential (e^x)
     */
    async exp(value) {
        return this.evaluate(`exp(${value})`);
    }

    /**
     * Calculate square root
     */
    async sqrt(value) {
        return this.evaluate(`sqrt(${value})`);
    }

    /**
     * Calculate factorial
     */
    async factorial(n) {
        return this.evaluate(`${n}!`);
    }

    /**
     * Calculate power
     */
    async power(base, exponent) {
        return this.evaluate(`${base}^${exponent}`);
    }

    /**
     * ============ MATRIX OPERATIONS ============
     */

    /**
     * Matrix multiplication
     * Format: JSON string of matrices
     */
    async multiplyMatrices(matrix1Json, matrix2Json) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const combined = JSON.stringify([
                    JSON.parse(matrix1Json),
                    JSON.parse(matrix2Json)
                ]);

                const result = this.wasmModule.ccall(
                    'matrix_op',
                    'string',
                    ['string', 'number'],
                    [combined, 0] // 0 = multiply
                );

                return {
                    matrix: JSON.parse(result),
                    error: null
                };
            }
        } catch (error) {
            return {
                matrix: null,
                error: error.message
            };
        }
    }

    /**
     * Matrix determinant
     */
    async matrixDeterminant(matrixJson) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const result = this.wasmModule.ccall(
                    'matrix_op',
                    'string',
                    ['string', 'number'],
                    [matrixJson, 1] // 1 = determinant
                );

                return {
                    determinant: parseFloat(result),
                    error: null
                };
            }
        } catch (error) {
            return {
                determinant: null,
                error: error.message
            };
        }
    }

    /**
     * Matrix inverse
     */
    async matrixInverse(matrixJson) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const result = this.wasmModule.ccall(
                    'matrix_op',
                    'string',
                    ['string', 'number'],
                    [matrixJson, 2] // 2 = inverse
                );

                return {
                    matrix: JSON.parse(result),
                    error: null
                };
            }
        } catch (error) {
            return {
                matrix: null,
                error: error.message
            };
        }
    }

    /**
     * ============ INTEGRATION & DIFFERENTIATION ============
     */

    /**
     * Numerical integration (Simpson's rule)
     */
    async integrate(func, start, end) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const result = this.wasmModule.ccall(
                    'integrate',
                    'string',
                    ['string', 'number', 'number'],
                    [func, start, end]
                );

                return {
                    value: parseFloat(result),
                    error: null
                };
            }
        } catch (error) {
            return {
                value: null,
                error: error.message
            };
        }
    }

    /**
     * ============ MEMORY OPERATIONS ============
     */

    /**
     * Store value in memory
     */
    async memoryStore(value, slot = 0) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                this.wasmModule.ccall(
                    'memory_store',
                    'void',
                    ['number', 'number'],
                    [value, slot]
                );
            }

            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * Recall value from memory
     */
    async memoryRecall(slot = 0) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const value = this.wasmModule.ccall(
                    'memory_recall',
                    'number',
                    ['number'],
                    [slot]
                );

                return {
                    value: value,
                    error: null
                };
            }
        } catch (error) {
            return {
                value: null,
                error: error.message
            };
        }
    }

    /**
     * ============ GAME ENGINE ============
     */

    /**
     * Start guessing game
     */
    async gameStart(difficulty = 2) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const gameId = this.wasmModule.ccall(
                    'game_start',
                    'number',
                    ['number'],
                    [difficulty]
                );

                return {
                    gameId: gameId,
                    error: null
                };
            }
        } catch (error) {
            return {
                gameId: null,
                error: error.message
            };
        }
    }

    /**
     * Make a guess in game
     */
    async gameGuess(gameId, guess) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const resultJson = this.wasmModule.ccall(
                    'game_guess',
                    'string',
                    ['number', 'number'],
                    [gameId, guess]
                );

                return {
                    result: JSON.parse(resultJson),
                    error: null
                };
            }
        } catch (error) {
            return {
                result: null,
                error: error.message
            };
        }
    }

    /**
     * Calculate game score
     */
    async gameCalculateScore(attempts, timeSec, difficulty) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const score = this.wasmModule.ccall(
                    'game_calculate_score',
                    'number',
                    ['number', 'number', 'number'],
                    [attempts, timeSec, difficulty]
                );

                return {
                    score: score,
                    error: null
                };
            }
        } catch (error) {
            return {
                score: null,
                error: error.message
            };
        }
    }

    /**
     * Get leaderboard
     */
    async gameGetLeaderboard(limit = 10) {
        try {
            await this.ensureReady();

            if (this.wasmModule.ccall) {
                const resultJson = this.wasmModule.ccall(
                    'game_get_leaderboard',
                    'string',
                    ['number'],
                    [limit]
                );

                return {
                    leaderboard: JSON.parse(resultJson),
                    error: null
                };
            }
        } catch (error) {
            return {
                leaderboard: [],
                error: error.message
            };
        }
    }

    /**
     * ============ FALLBACK (JavaScript) ENGINE ============
     */

    /**
     * Fallback evaluation using JavaScript
     */
    _fallbackEvaluate(expression, angleMode) {
        try {
            // Simple expression evaluator (for fallback)
            // In production, this would use a more robust parser
            
            // Replace common operations
            let expr = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/(\d+(?:\.\d+)?)!/g, 'factorial($1)');

            // Handle scientific functions
            const mathFuncs = {
                sin: (x) => this._toRadians(x, angleMode) ? Math.sin(this._toRadians(x, angleMode)) : Math.sin(x),
                cos: (x) => Math.cos(this._toRadians(x, angleMode)),
                tan: (x) => Math.tan(this._toRadians(x, angleMode)),
                sqrt: (x) => Math.sqrt(x),
                log: (x) => Math.log10(x),
                ln: (x) => Math.log(x),
                exp: (x) => Math.exp(x),
                abs: (x) => Math.abs(x),
                factorial: (x) => {
                    if (!Number.isInteger(x) || x < 0 || x > 69) {
                        throw new Error('Math ERROR');
                    }
                    let result = 1;
                    for (let factor = 2; factor <= x; factor++) result *= factor;
                    return result;
                },
                π: Math.PI,
                pi: Math.PI,
                e: Math.E
            };

            // Evaluate
            let result = Function(...Object.keys(mathFuncs), `return ${expr}`)
                (...Object.values(mathFuncs));

            return {
                value: result.toString(),
                formatted: this._formatResult(result.toString()),
                error: null
            };
        } catch (error) {
            return {
                value: null,
                formatted: null,
                error: error.message
            };
        }
    }

    _evaluateBaseN(expression, radix = 10) {
    const tokenPattern = /\s*(?:(0x[0-9a-f]+)|(and|or|xor|xnor|not|neg)|([0-9a-f]+)|([()+\-~]))\s*/igy;
    const tokens = [];
    let position = 0;

    while (position < expression.length) {
        tokenPattern.lastIndex = position;
        const match = tokenPattern.exec(expression);
        if (!match) {
            if (/^\s*$/.test(expression.slice(position))) break;
            return { value: null, formatted: null, error: 'Syntax ERROR' };
        }
        tokens.push(match[1] || match[2]?.toLowerCase() || match[3] || match[4]);
        position = tokenPattern.lastIndex;
    }

    let cursor = 0;
    const precedence = { or: 1, xor: 1, xnor: 1, and: 2 };
    const toInt32 = value => value | 0;

    const parsePrimary = () => {
        const token = tokens[cursor++];
        if (token === undefined) throw new Error('Syntax ERROR');
        if (token === '(') {
            const value = parseExpression(1);
            if (tokens[cursor++] !== ')') throw new Error('Syntax ERROR');
            return value;
        }
        if (token === 'not' || token === '~') return ~parsePrimary();
        if (token === 'neg') return toInt32(-parsePrimary());
        if (token === '-') {
            if (radix === 10 &&
                tokens[cursor] &&
                /^\d+$/.test(tokens[cursor]) &&
                Number(tokens[cursor]) === 0x80000000) {
                cursor++;
                return -0x80000000;
            }
            return toInt32(-parsePrimary());
        }
        if (token === '+') return parsePrimary();

        const isHexLiteral = /^0x/i.test(token);
        const digits = isHexLiteral ? token.slice(2) : token;
        const literalRadix = isHexLiteral ? 16 : radix;
        if (literalRadix !== 2 && literalRadix !== 8 && literalRadix !== 10 && literalRadix !== 16) {
            throw new Error('Invalid number base');
        }
        if ([...digits].some(digit => Number.parseInt(digit, 16) >= literalRadix)) {
            throw new Error(`Invalid digit for base ${literalRadix}`);
        }
        const value = Number.parseInt(digits, literalRadix);
        if (!Number.isSafeInteger(value) ||
            value > 0xffffffff ||
            (literalRadix === 10 && value > 0x7fffffff)) {
            throw new Error('Math ERROR');
        }
        return toInt32(value);
    };

    const parseExpression = minimumPrecedence => {
        let left = parsePrimary();
        while (cursor < tokens.length) {
            const operator = tokens[cursor];
            const operatorPrecedence = precedence[operator];
            if (operatorPrecedence === undefined || operatorPrecedence < minimumPrecedence) break;
            cursor++;
            const right = parseExpression(operatorPrecedence + 1);
            if (operator === 'and') left = left & right;
            else if (operator === 'or') left = left | right;
            else if (operator === 'xor') left = left ^ right;
            else if (operator === 'xnor') left = ~(left ^ right);
        }
        return toInt32(left);
    };

    try {
        if (!tokens.length) throw new Error('Syntax ERROR');
        const result = parseExpression(1);
        if (cursor !== tokens.length) throw new Error('Syntax ERROR');
        const outputValue = result < 0 && radix !== 10 ? result >>> 0 : result;
        return {
            value: String(result),
            formatted: outputValue.toString(radix).toUpperCase(),
            error: null
        };
    } catch (error) {
        return { value: null, formatted: null, error: error.message };
    }
    }

    /**
     * Convert degrees to radians
     */
    _toRadians(degrees, angleMode) {
        if (angleMode === 'RAD') return degrees;
        if (angleMode === 'GRAD') return degrees * (Math.PI / 200);
        return degrees * (Math.PI / 180); // DEG
    }

    /**
     * Format result for display
     */
    _formatResult(value) {
        if (typeof value === 'string') {
            value = parseFloat(value);
        }

        if (isNaN(value)) return 'NaN';
        if (!isFinite(value)) return '∞';

        // Round to 10 decimal places
        const rounded = Math.round(value * 1e10) / 1e10;

        // Format for display
        if (Math.abs(rounded) < 1e-10) return '0';
        if (Math.abs(rounded) >= 1e10 || Math.abs(rounded) < 1e-4) {
            return rounded.toExponential(10);
        }

        return rounded.toString();
    }

    /**
     * Get module info
     */
    getInfo() {
        return {
            isReady: this.isReady,
            hasModule: this.wasmModule !== null,
            wasmPath: this.wasmPath,
            fallbackMode: this.wasmModule === null
        };
    }
}

// Create and export singleton instance
const wasmService = new WasmService();

// Auto-initialize on page load
window.addEventListener('load', () => {
    wasmService.initialize().catch(error => {
        console.warn('WASM initialization failed, will use fallback:', error);
    });
});

// Debug in console
window.wasmService = wasmService;
