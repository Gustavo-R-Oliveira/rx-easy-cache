import { BehaviorSubject } from "rxjs";
import { cache } from "./variables";

/**
 * Clears cache data. If called without parameter, all store data will be deleted.
 * @method clearStore
 * @param arrKey List of keys that should be deleted from the store.
 */
const clearStore = (arrKey?: string[]): void => {
  if (arrKey) {
    arrKey.forEach((key) => delete cache._store[key]);
    cache.store$.next(cache._store);
    return;
  }
  cache._store = {};
  cache.store$ = new BehaviorSubject<any>(undefined);
};

export { clearStore };
