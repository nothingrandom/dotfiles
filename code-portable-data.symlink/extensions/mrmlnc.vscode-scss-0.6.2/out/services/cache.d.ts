import { ISymbols } from '../types/symbols';
export interface ICache {
    has: (uri: string) => boolean;
    get: (uri: string) => ISymbols;
    set: (uri: string, symbols: ISymbols) => void;
    drop: (uri: string) => void;
    dispose: () => void;
    storage: () => any;
    keys: () => string[];
}
/**
 * Returns Cache storage.
 */
export declare function getCacheStorage(): ICache;
/**
 * Cache invalidation. Removes items from the Cache when they are no longer available.
 */
export declare function invalidateCacheStorage(cache: ICache, symbolsList: ISymbols[]): void;
