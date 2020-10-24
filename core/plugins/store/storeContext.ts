import { useRoute } from "vue-router";
import {
  useStore,
  GetterTree,
  CommitOptions,
  DispatchOptions,
  Store
} from "vuex";

// 对 mutations / actions 的 TS 提示
type XActions<T = any, C = any, S = any, R = any> = {
  [K in keyof T]: (
    this: Store<S>,
    injectee: {
      dispatch: <_K extends keyof Omit<T, K>, P>(
        type: _K,
        payload?: Omit<T, K>[_K],
        options?: DispatchOptions
      ) => Promise<P>;
      commit: <_K extends keyof C>(
        type: _K | string,
        payload?: C[_K],
        options?: CommitOptions
      ) => void;
      state: S;
      getters: any;
      rootState: R;
      rootGetters: any;
    },
    payload?: T[K]
  ) => any;
};

type XMutations<T, S> = {
  [K in keyof T]: (state: S, payload?: T[K]) => any;
};

export { XMutations, XActions };

/**
 * 获取 Store 的 state，指定 name 获取对应 module 的 state
 *
 * @param name 模块名
 */
const useState = <T = any>(name?: string) => {
  const store = useStore();

  if (name) {
    return store.state[name] as T;
  } else {
    return store.state as T;
  }
};

/**
 * 获取 Store 的 getters name 获取对应 module 的 getters
 *
 * @param name 模块名
 */
const useGetters = (name?: string) => {
  const store = useStore();

  return Object.keys(store.getters)
    .filter(key => (name ? new RegExp(`^${name}.*`).test(key) : true))
    .reduce((r, key) => {
      const _key = name ? key.replace(`${name}/`, "") : key;
      r[_key] = store.getters[key];
      return r;
    }, {} as GetterTree<any, any>);
};

/**
 * commit mutation，指定 name 则 commit 对应 module 的 mutation
 *
 * @param name 模块名
 */
const useMutations = <T>(name?: string) => {
  const store = useStore();

  return {
    commit: <K extends keyof T>(
      type: K,
      payload?: T[K],
      options?: CommitOptions
    ) => {
      const _type = name ? `${name}/${type}` : `${type}`;
      return store.commit(_type, payload, options);
    }
  };
};

/**
 * dispatch action，指定 name 则 dispatch 对应 module 的 action
 *
 * @param name 模块名
 */
const useActions = <T>(name?: string) => {
  const store = useStore();

  return {
    dispatch: <K extends keyof T>(
      type: K,
      payload?: T[K],
      options?: DispatchOptions
    ) => {
      const _type = name ? `${name}/${type}` : `${type}`;
      return store.dispatch(_type, payload, options);
    }
  };
};

/**
 * 获取当前 route 下的 Store 的 state
 */
const useRouteState = <T = any>() => {
  const { name } = useRoute();
  return useState<T>(name as string);
};

/**
 * 获取当前 route 下的 Store 的 getters name 获取对应 module 的 getters
 */
const useRouteGetters = () => {
  const { name } = useRoute();
  return useGetters(name as string);
};

/**
 * commit 当前 route 下的 mutation
 */
const useRouteMutations = <T = any>() => {
  const { name } = useRoute();
  return useMutations(name as string);
};

/**
 * dispatch 当前 route 下的 action
 */
const useRouteActions = <T>() => {
  const { name } = useRoute();
  return useActions<T>(name as string);
};

export {
  useState,
  useGetters,
  useMutations,
  useActions,
  useRouteState,
  useRouteGetters,
  useRouteMutations,
  useRouteActions
};
