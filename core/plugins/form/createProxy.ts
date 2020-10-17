type ProxyFunction<T> = {
  [K in keyof T]: (k: T[K], context: T) => T[K];
};

const createProxy = <T extends object>(
  target: T,
  handlers?: Partial<ProxyFunction<T>>
) => {
  const _proxy = new Proxy<T>(target, {
    get: (t, key: keyof T) => {
      const prop = Reflect.get(t, key);
      if (!handlers) {
        return prop;
      }
      const handler = Reflect.get(handlers, key);
      return handler ? handler(prop, t) : prop;
    }
  });

  return _proxy;
};

export default createProxy;
