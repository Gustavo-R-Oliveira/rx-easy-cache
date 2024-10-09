import { EMPTY, Observable, of, skipWhile, switchMap } from "rxjs";
import { cache } from "./variables";

/**
 * Gets the cached value of a call.
 * @method getValorCache$
 * @param key parameter of the object you want to access. If you pass nothing, the entire object will be returned.
 * @return returns an Observable of the cached object.
 * @obs can also access object keys through destructuring.
 */
const getValueCache$ = (key = ""): Observable<any> => {
  if (key) {
    return cache.store$.pipe(
      switchMap((store) => {
        if (!store) {
          return EMPTY;
        }
        return of(JSON.parse(JSON.stringify(store[key])));
      })
    );
  }

  return cache.store$.pipe(
    skipWhile((store) => {
      return !store;
    })
  );
};

export { getValueCache$ };
