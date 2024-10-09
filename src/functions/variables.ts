import { BehaviorSubject } from "rxjs";
import { RxEasyCacheStore } from "./types";

const cache: RxEasyCacheStore = {
  _store: {},
  store$: new BehaviorSubject<any>(undefined),
};

export { cache };
