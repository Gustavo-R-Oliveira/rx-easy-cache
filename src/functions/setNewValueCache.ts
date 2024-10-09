import { cache } from "./variables";

/**
 * Store a value in cache.
 * @method setNewValueCache
 * @param obj object you want to cache.
 */
const setNewValueCache = (obj: any): void => {
  Object.entries(obj).forEach(([key, value]) => (cache._store[key] = value));
  cache.store$.next(cache._store);
};

export { setNewValueCache };
