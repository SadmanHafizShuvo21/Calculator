/* ========================================
   STORAGE SERVICE - LocalStorage & IndexedDB Wrapper
   ======================================== */

class StorageService {
    constructor() {
        this.storageType = this._detectStorage();
        this.prefix = 'casio_calc_';
        this.db = null;
        this._initIndexedDB();
    }

    /**
     * Detect best storage method
     */
    _detectStorage() {
        // Check for IndexedDB
        try {
            const test = '__indexeddb_test__';
            const request = indexedDB.open(test);
            request.onerror = () => console.warn('IndexedDB not available');
            return 'indexeddb';
        } catch (e) {
            // Fallback to localStorage
            return 'localStorage';
        }
    }

    /**
     * Initialize IndexedDB
     */
    async _initIndexedDB() {
        if (this.storageType !== 'indexeddb') return;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open('CasioCalculator', 1);

            request.onerror = () => {
                console.warn('IndexedDB init failed, falling back to localStorage');
                this.storageType = 'localStorage';
                reject();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('calculations')) {
                    db.createObjectStore('calculations', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('gameScores')) {
                    db.createObjectStore('gameScores', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
        });
    }

    /**
     * ============ CALCULATION STORAGE ============
     */

    /**
     * Save calculation to storage
     */
    async saveCalculation(expression, result) {
        const data = {
            id: `calc_${Date.now()}_${Math.random()}`,
            expression,
            result,
            timestamp: new Date().toISOString(),
            angleMode: appState.getState('angleMode')
        };

        if (this.storageType === 'indexeddb') {
            return this._saveToIndexedDB('calculations', data);
        } else {
            return this._saveToLocalStorage(`calculations`, data);
        }
    }

    /**
     * Get calculation history
     */
    async getCalculationHistory(limit = 50) {
        if (this.storageType === 'indexeddb') {
            return this._getFromIndexedDB('calculations', limit);
        } else {
            const data = localStorage.getItem(`${this.prefix}calculations`);
            return data ? JSON.parse(data).slice(0, limit) : [];
        }
    }

    /**
     * Delete calculation
     */
    async deleteCalculation(id) {
        if (this.storageType === 'indexeddb') {
            return this._deleteFromIndexedDB('calculations', id);
        } else {
            const data = localStorage.getItem(`${this.prefix}calculations`) || '[]';
            const items = JSON.parse(data).filter(item => item.id !== id);
            localStorage.setItem(`${this.prefix}calculations`, JSON.stringify(items));
        }
    }

    /**
     * Clear all calculations
     */
    async clearCalculations() {
        if (this.storageType === 'indexeddb') {
            return this._clearObjectStore('calculations');
        } else {
            localStorage.removeItem(`${this.prefix}calculations`);
        }
    }

    /**
     * ============ GAME SCORE STORAGE ============
     */

    /**
     * Save game score
     */
    async saveGameScore(score) {
        const data = {
            id: `game_${Date.now()}_${Math.random()}`,
            ...score,
            timestamp: new Date().toISOString()
        };

        if (this.storageType === 'indexeddb') {
            return this._saveToIndexedDB('gameScores', data);
        } else {
            return this._saveToLocalStorage(`gameScores`, data);
        }
    }

    /**
     * Get game scores
     */
    async getGameScores(difficulty = null, limit = 50) {
        let scores;
        
        if (this.storageType === 'indexeddb') {
            scores = await this._getFromIndexedDB('gameScores', limit);
        } else {
            const data = localStorage.getItem(`${this.prefix}gameScores`) || '[]';
            scores = JSON.parse(data);
        }

        if (difficulty) {
            scores = scores.filter(s => s.difficulty === difficulty);
        }

        return scores.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    /**
     * Get personal best
     */
    async getPersonalBest(difficulty) {
        const scores = await this.getGameScores(difficulty, 1);
        return scores.length > 0 ? scores[0].score : 0;
    }

    /**
     * Clear game scores
     */
    async clearGameScores() {
        if (this.storageType === 'indexeddb') {
            return this._clearObjectStore('gameScores');
        } else {
            localStorage.removeItem(`${this.prefix}gameScores`);
        }
    }

    /**
     * ============ SETTINGS STORAGE ============
     */

    /**
     * Save setting
     */
    async setSetting(key, value) {
        const data = { key, value, timestamp: new Date().toISOString() };

        if (this.storageType === 'indexeddb') {
            return this._saveToIndexedDB('settings', data);
        } else {
            let settings = {};
            try {
                const saved = localStorage.getItem(`${this.prefix}settings`);
                settings = saved ? JSON.parse(saved) : {};
            } catch (e) {
                console.error('Failed to parse settings:', e);
            }
            settings[key] = value;
            localStorage.setItem(`${this.prefix}settings`, JSON.stringify(settings));
        }
    }

    /**
     * Get setting
     */
    async getSetting(key, defaultValue = null) {
        if (this.storageType === 'indexeddb') {
            const data = await this._getFromIndexedDB('settings', 1, key);
            return data.length > 0 ? data[0].value : defaultValue;
        } else {
            try {
                const settings = localStorage.getItem(`${this.prefix}settings`);
                const parsed = settings ? JSON.parse(settings) : {};
                return parsed[key] !== undefined ? parsed[key] : defaultValue;
            } catch (e) {
                console.error('Failed to get setting:', e);
                return defaultValue;
            }
        }
    }

    /**
     * Get all settings
     */
    async getAllSettings() {
        if (this.storageType === 'indexeddb') {
            return this._getFromIndexedDB('settings');
        } else {
            try {
                const settings = localStorage.getItem(`${this.prefix}settings`);
                return settings ? JSON.parse(settings) : {};
            } catch (e) {
                console.error('Failed to get all settings:', e);
                return {};
            }
        }
    }

    /**
     * ============ GENERAL STORAGE ============
     */

    /**
     * Get item
     */
    async getItem(key, defaultValue = null) {
        try {
            if (this.storageType === 'indexeddb') {
                const data = await this._getFromIndexedDB('settings', 1, key);
                return data.length > 0 ? data[0].value : defaultValue;
            } else {
                const item = localStorage.getItem(`${this.prefix}${key}`);
                return item ? JSON.parse(item) : defaultValue;
            }
        } catch (e) {
            console.error(`Failed to get item ${key}:`, e);
            return defaultValue;
        }
    }

    /**
     * Set item
     */
    async setItem(key, value) {
        try {
            if (this.storageType === 'indexeddb') {
                return this._saveToIndexedDB('settings', { key, value });
            } else {
                localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
            }
        } catch (e) {
            console.error(`Failed to set item ${key}:`, e);
        }
    }

    /**
     * Remove item
     */
    async removeItem(key) {
        try {
            if (this.storageType === 'indexeddb') {
                return this._deleteFromIndexedDB('settings', key);
            } else {
                localStorage.removeItem(`${this.prefix}${key}`);
            }
        } catch (e) {
            console.error(`Failed to remove item ${key}:`, e);
        }
    }

    /**
     * ============ STORAGE INFO ============
     */

    /**
     * Get storage usage
     */
    async getStorageInfo() {
        if (navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                return {
                    usage: estimate.usage,
                    quota: estimate.quota,
                    percentage: (estimate.usage / estimate.quota) * 100
                };
            } catch (e) {
                console.warn('Failed to get storage estimate:', e);
            }
        }

        // Fallback: estimate localStorage size
        let size = 0;
        for (let key in localStorage) {
            if (key.startsWith(this.prefix)) {
                size += localStorage[key].length + key.length;
            }
        }

        return {
            usage: size,
            quota: 5242880, // 5MB
            percentage: (size / 5242880) * 100
        };
    }

    /**
     * Clear all storage
     */
    async clearAll() {
        if (this.storageType === 'indexeddb') {
            await this._clearObjectStore('calculations');
            await this._clearObjectStore('gameScores');
            await this._clearObjectStore('settings');
        } else {
            for (let key in localStorage) {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

    /**
     * ============ PRIVATE METHODS - IndexedDB ============
     */

    /**
     * Save to IndexedDB
     */
    _saveToIndexedDB(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.put(data);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(data);
        });
    }

    /**
     * Get from IndexedDB
     */
    _getFromIndexedDB(storeName, limit = null, key = null) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const request = key ? objectStore.get(key) : objectStore.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                let results = Array.isArray(request.result) ? request.result : [request.result];
                if (limit) results = results.slice(0, limit);
                resolve(results.filter(r => r !== undefined));
            };
        });
    }

    /**
     * Delete from IndexedDB
     */
    _deleteFromIndexedDB(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Clear object store
     */
    _clearObjectStore(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * ============ PRIVATE METHODS - LocalStorage ============
     */

    /**
     * Save to localStorage
     */
    _saveToLocalStorage(key, data) {
        try {
            let items = [];
            const existing = localStorage.getItem(`${this.prefix}${key}`);
            if (existing) {
                items = JSON.parse(existing);
            }
            items.push(data);
            localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(items));
        } catch (e) {
            console.error(`Failed to save to localStorage:`, e);
            throw e;
        }
    }
}

// Create and export singleton instance
const storageService = new StorageService();

// Debug in console
window.storageService = storageService;
