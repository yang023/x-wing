import { useRoute } from "vue-router";
import { useStore, GetterTree, CommitOptions, DispatchOptions } from "vuex";

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
const useMutations = <P>(name?: string) => {
  const store = useStore();

  return (type: string, payload?: P, options?: CommitOptions) => {
    const _key = name ? `${name}/${type}` : type;
    store.commit(_key, payload, options);
  };
};

/**
 * dispatch action，指定 name 则 dispatch 对应 module 的 action
 *
 * @param name 模块名
 */
const useActions = <P = any, R = any>(name?: string) => {
  const store = useStore();
  return (type: string, payload?: P, options?: DispatchOptions): Promise<R> => {
    const _key = name ? `${name}/${type}` : type;
    return store.dispatch(_key, payload, options);
  };
};

/**
 * 获取当前 route 下的 Store 的 state
 */
const useRouteState = <T = any>() => {
  const { name } = useRoute();
  return useState(name as string);
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
const useRouteMutations = <P>() => {
  const { name } = useRoute();
  return useMutations(name as string);
};

/**
 * dispatch 当前 route 下的 action
 */
const useRouteActions = <P = any, R = any>() => {
  const { name } = useRoute();
  return useActions(name as string);
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
