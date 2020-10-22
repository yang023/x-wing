const Storages = {
  local: localStorage,
  session: sessionStorage
};

Object.defineProperty(window, "localStorage", {
  get: () => null
});
Object.defineProperty(window, "sessionStorage", {
  get: () => null
});

const getStorage = (type: StorageType) => {
  return Storages[type];
};

const MainKey = "$Storage:";

const setItem = <T>(type: StorageType, key: string, value: T, timeout = 0) => {
  const storage = getStorage(type);
  const _key = `${MainKey}${key}`;
  const payload: StorageData<T> = {
    _key,
    _timeout: timeout,
    _value: value,
    _setIn: Date.now()
  };
  const _value = JSON.stringify(payload);

  storage.setItem(_key, _value);
};

const getItem = <T>(type: StorageType, key: string) => {
  const storage = getStorage(type);
  const _key = `${MainKey}${key}`;
  const _value = storage.getItem(_key);
  if (!_value) {
    return undefined;
  }

  const value: StorageData<T> = JSON.parse(_value);
  const now = Date.now();
  if (value._timeout === 0) {
    return value._value;
  }
  if (value._timeout + value._setIn < now) {
    storage.removeItem(_key);
    return undefined;
  }
  return value._value;
};

const removeItem = (type: StorageType, ...keys: string[]) => {
  const storage = getStorage(type);
  keys.forEach(key => {
    const _key = `${MainKey}${key}`;
    storage.removeItem(_key);
  });
};

export { setItem, getItem, removeItem };
