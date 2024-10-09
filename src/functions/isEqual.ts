/**
 * Checks whether the request value has been modified or not.
 * @method isEqual
 * @param request request that will be checked.
 * @return returns a boolean indicating whether there was a change or not.
 */
const isEqual = (request: any, storeRequest: any): boolean => {
  if (typeof request !== "object" && typeof storeRequest !== "object") {
    return Object.is(request, storeRequest);
  }

  if (request === null && storeRequest === null) {
    return true;
  }
  if (typeof request !== typeof storeRequest) {
    return false;
  }

  if (request === storeRequest) {
    return true;
  }

  if (Array.isArray(request) && Array.isArray(storeRequest)) {
    if (request.length !== storeRequest.length) {
      return false;
    }

    for (let i = 0; i < request.length; i++) {
      if (!isEqual(request[i], storeRequest[i])) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(request) || Array.isArray(storeRequest)) {
    return false;
  }

  if (Object.keys(request).length !== Object.keys(storeRequest).length) {
    return false;
  }

  for (const [k, v] of Object.entries(request)) {
    if (!(k in storeRequest)) {
      return false;
    }
    if (!isEqual(v, storeRequest[k])) {
      return false;
    }
  }

  return true;
};

export { isEqual };
