/**
 * ADMX localStorage module.
 *
 * Creates the 'admx' key in localStorage if it doesn't exist yet.
 * If the key already exists (with any valid JSON), no changes are made.
 *
 * IMPORTANT: This module does NOT auto-initialize on import.
 * Call {@link initAdmxStorage} explicitly at app startup.
 */

import { ensureInitialized } from '../safe-storage.js';

const STORAGE_KEY = 'admx';

/**
 * Initializes ADMX storage entry in localStorage.
 * Writes seed only if the key is missing or contains invalid/corrupt JSON.
 *
 * @returns {boolean} true if seed was written
 */
export function initAdmxStorage() {
    return ensureInitialized(STORAGE_KEY, {});
}

