import { BehaviorSubject, Observable } from "rxjs";

type RxEasyCache<t> = {
  httpCall: Observable<t>;
  funcName: string;
  recall?: boolean;
  request?: any;
};

type RxEasyCacheReq<t> = {
  recall?: boolean;
  request?: t;
};

type RxEasyCacheStore = {
  _store: any;
  store$: BehaviorSubject<any>;
};

export { RxEasyCacheReq, RxEasyCache, RxEasyCacheStore };
