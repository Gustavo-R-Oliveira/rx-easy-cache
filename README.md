Rx-easy-cache will allow you to cache and update call responses in your project without bureaucracy, being divided into two parts and following a minimum structure.

# How rx-easy-cache works?
When sending the object to rx-easy-cache, the following validations will be performed:
* Was the `recall` property sent as **true**?
  - **YES**. Then make a new request and cache the response.
  - **NO**. Proceed to next validation.

* Does this call have a request object?
  - **YES**. Was the value the last of this call?
    - **YES**. Then return the cached response.
    - **NO**. Proceed to next validation.
  - **NO**. Proceed to next validation.
 
* Does this call **NOT** have a request object?
  - **YES**. Is there already value for this call?
    - **YES**. Then return the cached response.
    - **NO**. Then make a new request and cache the response.
  - **NO**. Then make a new request and cache the response.

You won't need to worry about these validations. rx-easy-cache will return a new response whenever it has in the request parameters or when `recall` is sent as **true**.

# Installation

```shell
npm install @gustavo-r-oliveira/rx-easy-cache
```
# Usage

The usage is divided into two parts. For calls that fetch data and for calls that update data. 

> [!WARNING]
> For versions `RxJs < 6` the examples below undergo changes.

## Calls that fetch data

Using the `RxEasyCacheReq` interface as a base, all calls that fetch data will follow this construction pattern.

> [!WARNING]
> If something is passed to the request, it is **mandatory** to send it to `cachingHttpCall`

> [!WARNING]
> If the `recall` property of the `cachingHttpCall` interface is sent as true, a new call will always be made.

### Fetch API
```ts
import { cachingHttpCall, RxEasyCacheReq } from '@gustavo-r-oliveira/rx-easy-cache';
import { fromFetch } from 'rxjs/fetch';

getData({ recall, request }: RxEasyCacheReq<number>): Observable<DataResponseInterface> {

  const HTTP_CALL = fromFetch(URL, { selector: (response) => response.json() });

  const CACHE = {
    funcName: this.getData.name,
    httpCall: HTTP_CALL,
    request,
    recall,
  };

  return cachingHttpCall(CACHE);
}
```

### Axios
```ts
import { cachingHttpCall, RxEasyCacheReq } from '@gustavo-r-oliveira/rx-easy-cache';
import { map } from 'rxjs';
import axios from "axios";

getData({ recall, request }: RxEasyCacheReq<number>): Observable<DataResponseInterface> {

  const HTTP_CALL = from(axios.get(URL).pipe(map(({ data }) => data));

  const CACHE = {
    funcName: this.getData.name,
    httpCall: HTTP_CALL,
    request,
    recall,
  };

  return cachingHttpCall(CACHE);
}
```

### Angular HTTP
```ts
import { cachingHttpCall, RxEasyCacheReq } from '@gustavo-r-oliveira/rx-easy-cache';

getData({ recall, request }: RxEasyCacheReq<number>): Observable<DataResponseInterface> {

  const HTTP_CALL = this.http.get(URL);

  const CACHE = {
    funcName: this.getData.name,
    httpCall: HTTP_CALL,
    request,
    recall,
  };

  return cachingHttpCall(CACHE);
}
```
## Calls that update data

Para atualizar o cache de uma chamada após sua atualização no back-end, todas as chamadas que vão atualizar dados, seguirão esse padrão de construção. 

Usando a interface `RxEasyCacheReq` como base, todas as chamadas que vão buscar dados, seguirão esse padrão de construção. 

> [!WARNING]
> If you do not clear the call key, even updating the data in the back-end, the call that fetches the data will continue with its old value until the request changes, or `recall` is sent as true, or the application is restarted.

> [!NOTE]
> After the call is executed successfully, the next time you call getData(), a new request will be made.

### Fetch API
```ts
import { clearKeys } from '@gustavo-r-oliveira/rx-easy-cache';
import { fromFetch } from 'rxjs/fetch';

updateData(request): Observable<DataResponseInterface> {

  // keys of the calls you want to clear the cache at the end of this call
  const KEYS = [this.getData.name]

  return fromFetch(URL, { body: request, selector: (response) => response.json() });
}
```

### Axios
```ts
import { clearKeys } from '@gustavo-r-oliveira/rx-easy-cache';
import { map } from 'rxjs';
import axios from "axios";

updateData(request): Observable<DataResponseInterface> {

  // keys of the calls you want to clear the cache at the end of this call
  const KEYS = [this.getData.name]

  return from(axios.post(URL, request).pipe(map(({ data }) => data));
}
```

### Angular HTTP
```ts
import { clearKeys } from '@gustavo-r-oliveira/rx-easy-cache'

updateData(request): Observable<DataResponseInterface> {

  // keys of the calls you want to clear the cache at the end of this call
  const KEYS = [this.getData.name]

  return this.http.post(URL, request).pipe(clearKeys(KEYS));
}
```
