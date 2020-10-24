import { createStore, StoreOptions } from "vuex";

export * from "./storeContext";

const config = {
  default: {} as StoreOptions<any>
};

const StoreContext = require.context("@", false, /store.(j|t)sx?/);

if (StoreContext.keys().length) {
  const _options = StoreContext<{ default: StoreOptions<any> }>(
    StoreContext.keys()[0]
  );
  config.default = _options.default;
}
const store = createStore(config.default);

export default store;
