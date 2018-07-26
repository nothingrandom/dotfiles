'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns Cache storage.
 */
function getCacheStorage() {
    let storage = {};
    return {
        has: (uri) => {
            return storage.hasOwnProperty(uri);
        },
        get: (uri) => {
            return storage[uri] || null;
        },
        set: (uri, symbols) => {
            storage[uri] = symbols;
        },
        drop: (uri) => {
            if (storage.hasOwnProperty(uri)) {
                delete storage[uri];
            }
        },
        dispose: () => {
            storage = {};
        },
        storage: () => storage,
        keys: () => Object.keys(storage)
    };
}
exports.getCacheStorage = getCacheStorage;
/**
 * Cache invalidation. Removes items from the Cache when they are no longer available.
 */
function invalidateCacheStorage(cache, symbolsList) {
    Object.keys(cache.storage()).forEach((item) => {
        for (let i = 0; i < symbolsList.length; i++) {
            if (item === symbolsList[i].document) {
                return;
            }
        }
        cache.drop(item);
    });
}
exports.invalidateCacheStorage = invalidateCacheStorage;
