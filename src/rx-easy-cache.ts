import {
  Observable,
  BehaviorSubject,
  MonoTypeOperatorFunction,
  tap,
  switchMap,
  EMPTY,
  of,
  skipWhile,
} from "../node_modules/rxjs/dist/types/index";

export type CacheReq<t> = {
  recall?: boolean;
  request?: t;
};

type Cache<t> = {
  httpCall: Observable<t>;
  funcName: string;
  recall?: boolean;
  request?: any;
};

let _store: any = {};
let store$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

/**
 * RXJS Pipe utilizado com a função de deletar um ou mais valores do store.
 * @method clearKeys
 * @param arrChaves lista de chaves que deverá ser deletados do store.
 * @param requisicao Indica se serão deletadas so valores das requisições. Valor padrão é TRUE
 */
const clearKeys = <t>(arrChaves: string[], requisicao = true): MonoTypeOperatorFunction<t> => {
  const chavesReq = requisicao ? arrChaves.map((chave) => `req${chave}`) : arrChaves;

  return tap<t>(() => {
    clearStore(chavesReq);
  });
};

/**
 * * Guarda a resposta de uma chama em cache. Essa função, através de seus parâmetros, fará as chamadas e guardará seus valores em cache para evitar rechamadas desnecessárias.
 *
 * * SE o valor do parametro REQUEST mudar OU for enviado o parametro RECALL como TRUE, uma nova requisição será feita e seu valor guardado em cache.
 *
 * * SE o valor do parametro REQUEST não mudar e RECALL não ser enviado como TRUE, ao tentar fazer a chamada, irá ser entregue o valor guardado em cache.
 * @method cachingHttpCall
 * @param httpCall requisição a ser feita
 * @param funcName nome da função do service em que a requisição será feita
 * @param recall (opcional) forçar uma nova requisição para atualizar o cache
 * @param request (opcional) objeto ou valor usado na requisição. Se tiver valor de requisição, é obrigatório passar
 * @return retorna a resposta da requisição feita ou o objeto em cache, caso a requisição seja a mesma
 */
const cachingHttpCall = <t>({ httpCall, funcName, recall, request }: Cache<t>): Observable<t> => {
  // pipe para mostrar o andamento do fluxo. Não faz parte do serviço

  const retorno = () =>
    httpCall.pipe(
      tap((res) =>
        setNovoValorCache({
          ...(request && {
            [`req${funcName}`]: JSON.parse(JSON.stringify(request)),
          }),
          [funcName]: JSON.parse(JSON.stringify(res)),
        })
      )
    );

  if (recall) {
    // pipe para mostrar o andamento do fluxo. Não faz parte do serviço
    return retorno();
  }

  if (request && isEqual(request, _store[`req${funcName}`])) {
    // pipe para mostrar o andamento do fluxo. Não faz parte do serviço
    return getValorCache$(funcName);
  }

  if (!request && getValorCache(funcName)) {
    // pipe para mostrar o andamento do fluxo. Não faz parte do serviço
    return getValorCache$(funcName);
  }

  // pipe para mostrar o andamento do fluxo. Não faz parte do serviço
  return retorno();
};

/**
 * Guarda um valor em cache.
 * @method setNovoValorCache
 * @param obj objeto que deseja cachear.
 */
const setNovoValorCache = (obj: any): void => {
  Object.entries(obj).forEach(([key, value]) => (_store[key] = value));
  store$.next(_store);
};

/**
 * Pega o valor de uma chamada guardado em cache.
 * @method getValorCache
 * @param key parametro do objeto que deseja acessar. Ao não passar nada, será retornado o objeto inteiro.
 * @return retorna um snapshot do objeto em cache
 * @obs também pode acessar as chaves do objeto através de destructuring
 */
const getValorCache = (key = ""): any => {
  if (key) {
    return _store[key];
  }
  return _store;
};

/**
 * Pega o valor de uma chamada guardado em cache.
 * @method getValorCache$
 * @param key parametro do objeto que deseja acessar. Ao não passar nada, será retornado o objeto inteiro.
 * @return retorna um observable do objeto em cache
 * @obs também pode acessar as chaves do objeto através de destructuring
 */
const getValorCache$ = (key = ""): Observable<any> => {
  if (key) {
    return store$.pipe(
      switchMap((store) => {
        if (!store) {
          return EMPTY;
        }
        return of(JSON.parse(JSON.stringify(store[key])));
      })
    );
  }

  return store$.pipe(
    skipWhile((store) => {
      return !store;
    })
  );
};

/**
 * Checa se o valor da requisição foi modificado ou não.
 * @method isEqual
 * @param requisicao requisição que irá ser checada.
 * @return retorna um boolean indicando se teve mudança ou não.
 */
const isEqual = (value: any, other: any): boolean => {
  if (typeof value !== "object" && typeof other !== "object") {
    return Object.is(value, other);
  }

  if (value === null && other === null) {
    return true;
  }
  if (typeof value !== typeof other) {
    return false;
  }

  if (value === other) {
    return true;
  }

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i])) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(value) || Array.isArray(other)) {
    return false;
  }

  if (Object.keys(value).length !== Object.keys(other).length) {
    return false;
  }

  for (const [k, v] of Object.entries(value)) {
    if (!(k in other)) {
      return false;
    }
    if (!isEqual(v, other[k])) {
      return false;
    }
  }

  return true;
};

/**
 * Apaga os dados do store. Se chamar sem parâmetro, todos os dados do store serão apagados
 * @method clearStore
 * @param arrChaves lista de chaves que deverá ser deletados do store.
 */
const clearStore = (arrChaves?: string[]): void => {
  if (arrChaves) {
    arrChaves.forEach((chave) => delete _store[chave]);
    store$.next(_store);
    return;
  }
  _store = {};
  store$ = new BehaviorSubject<any>(undefined);
};

export { clearKeys, cachingHttpCall };
