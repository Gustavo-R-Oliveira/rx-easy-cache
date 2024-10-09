import { MonoTypeOperatorFunction, tap } from "rxjs";
import { clearStore } from "./clearStore";

/**
 * RXJS Pipe used in a call with SUCCESS return.
 * @method clearKeys
 * @param arrKeys list of keys that should be deleted from the store.
 * @param request Indicates whether request values ​​will be deleted. Default value is TRUE.
 */
const clearKeys = <t>(arrKeys: string[], request = true): MonoTypeOperatorFunction<t> => {
  const reqKeys = request ? arrKeys.map((key) => `req${key}`) : arrKeys;

  return tap<t>(() => {
    clearStore(reqKeys);
  });
};

export { clearKeys };
