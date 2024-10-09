import { Observable, tap } from "rxjs";
import { cache } from "./variables";
import { setNewValueCache } from "./setNewValueCache";
import { getValueCache } from "./getValueCache";
import { getValueCache$ } from "./getValueCache$";
import { isEqual } from "./isEqual";
import { RxEasyCache } from "./types";

/**
 * * Stores the response of a call in cache. This function, through its parameters, will make the calls and store their values ​​in cache to avoid unnecessary recalls.
 *
 * * IF the value of the REQUEST parameter changes OR the RECALL parameter is sent as TRUE, a new request will be made and its value stored in cache.
 *
 * * IF the value of the REQUEST parameter does not change and RECALL is not sent as TRUE, when trying to make the call, the cached value will be delivered.
 * @method cachingHttpCall
 * @param httpCall request to be made.
 * @param funcName name of the service function in which the request will be made.
 * @param recall (optional) force a new request to update the cache.
 * @param request (optional) object or value used in the request. If it has a requisition value, it is mandatory to pass.
 * @return returns the response to the request made or the cached object, if the request is the same.
 */
const cachingHttpCall = <t>({ httpCall, funcName, recall, request }: RxEasyCache<t>): Observable<t> => {
  const callReturn = () =>
    httpCall.pipe(
      tap((res) =>
        setNewValueCache({
          ...(request && {
            [`req${funcName}`]: JSON.parse(JSON.stringify(request)),
          }),
          [funcName]: JSON.parse(JSON.stringify(res)),
        })
      )
    );

  if (recall) {
    return callReturn();
  }

  if (request && isEqual(request, cache._store[`req${funcName}`])) {
    return getValueCache$(funcName);
  }

  if (!request && getValueCache(funcName)) {
    return getValueCache$(funcName);
  }

  return callReturn();
};

export { cachingHttpCall };
