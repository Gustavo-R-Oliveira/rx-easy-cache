import { cache } from "./variables";

/**
 * Gets the cached value of a call.
 * @method getValorCache
 * @param key parameter of the object you want to access. If you pass nothing, the entire object will be returned.
 * @return returns a snapshot of the cached object.
 * @obs can also access object keys through destructuring.
 */
const getValueCache = (key = ""): any => {
  if (key) {
    return cache._store[key];
  }
  return cache._store;
};

export { getValueCache };
