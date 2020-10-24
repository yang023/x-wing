import { App } from "vue";
import XStorage from "./Storage";

const Storages = {
  local: new XStorage("local"),
  session: new XStorage("session")
};
const getStorage = (type: StorageType): XStorage => Storages[type];

export { getStorage };

import { disabledGlobalStorage } from "./helper";

const Plugin = {
  install: (
    app: App,
    options?: {
      disabledGlobal?: boolean;
    }
  ) => {
    const { disabledGlobal = true } = options || {};
    if (disabledGlobal) {
      disabledGlobalStorage();
    }
  }
};

export default Plugin;
