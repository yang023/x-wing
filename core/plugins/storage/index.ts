import { App } from "vue";
import XStorage from "./Storage";

const Storages = {
  local: new XStorage("local"),
  session: new XStorage("session")
};
const useStorage = (type: StorageType): XStorage => Storages[type];

export { useStorage };

import { disabledGlobalStorage } from "./helper";

const Plugin = {
  install: (
    _app: App,
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
