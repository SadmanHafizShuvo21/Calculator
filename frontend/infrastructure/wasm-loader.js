/* ========================================
   WASM LOADER - Emscripten Module Initialization
   ======================================== */

class WasmLoader {
    constructor() {
        this.moduleReady = false;
        this.loadPromise = null;
    }

    /**
     * Load WASM module
     */
    async load(wasmPath = 'dist/casio-engine.js') {
        if (this.moduleReady) {
            return true;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this._loadModule(wasmPath);
        return this.loadPromise;
    }

    /**
     * Internal load implementation
     */
    async _loadModule(wasmPath) {
        return new Promise((resolve, reject) => {
            try {
                // Check if module already loaded (Emscripten)
                if (typeof window.CasioEngine !== 'undefined') {
                    console.log('✓ WASM module already loaded');
                    this.moduleReady = true;
                    resolve(true);
                    return;
                }

                // Load Emscripten module via script
                const script = document.createElement('script');
                script.src = wasmPath;
                script.async = true;
                script.onload = () => {
                    console.log('✓ WASM script loaded, initializing module...');

                    // Wait for Emscripten to initialize
                    if (window.CasioEngine) {
                        // CasioEngine is the module created by Emscripten
                        // Initialize if it has an onRuntimeInitialized callback
                        if (window.CasioEngine.onRuntimeInitialized) {
                            window.CasioEngine.onRuntimeInitialized(() => {
                                console.log('✓ WASM runtime initialized');
                                this.moduleReady = true;
                                resolve(true);
                            });
                        } else {
                            // Module already initialized
                            this.moduleReady = true;
                            resolve(true);
                        }
                    } else {
                        reject(new Error('CasioEngine module not found'));
                    }
                };

                script.onerror = () => {
                    console.warn('Failed to load WASM module, using fallback');
                    this.moduleReady = false;
                    resolve(false); // Don't reject, just disable WASM
                };

                script.onabort = () => {
                    reject(new Error('WASM module loading aborted'));
                };

                // Set script properties for CORS
                script.crossOrigin = 'anonymous';

                document.head.appendChild(script);

                // Timeout after 10 seconds
                setTimeout(() => {
                    if (!this.moduleReady) {
                        console.warn('WASM module loading timeout');
                        resolve(false);
                    }
                }, 10000);
            } catch (error) {
                console.error('WASM loader error:', error);
                reject(error);
            }
        });
    }

    /**
     * Check if ready
     */
    isReady() {
        return this.moduleReady;
    }

    /**
     * Get module status
     */
    getStatus() {
        return {
            ready: this.moduleReady,
            moduleAvailable: typeof window.CasioEngine !== 'undefined'
        };
    }
}

// Create singleton instance
const wasmLoader = new WasmLoader();

// Export for use
window.wasmLoader = wasmLoader;

console.log('✓ WASM Loader initialized');
