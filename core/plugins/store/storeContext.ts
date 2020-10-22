import { useStore, GetterTree, CommitOptions, DispatchOptions } from "vuex";

const useState = <T = any>(name?: string) => {
  const store = useStore();

  if (name) {
    return store.state[name] as T;
  } else {
    return store.state as T;
  }
};

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

const useMutations = <P>(name?: string) => {
  const store = useStore();

  return (type: string, payload?: P, options?: CommitOptions) => {
    const _key = name ? `${name}/${type}` : type;
    store.commit(_key, payload, options);
  };
};

const useActions = <P = any, R = any>(name?: string) => {
  const store = useStore();
  return (type: string, payload?: P, options?: DispatchOptions): Promise<R> => {
    const _key = name ? `${name}/${type}` : type;
    return store.dispatch(_key, payload, options);
  };
};

export { useState, useGetters, useMutations, useActions };
