import XStorage from "./Storage";

const Storages = {
  local: new XStorage("local"),
  session: new XStorage("session")
};
const getStorage = (type: StorageType): XStorage => Storages[type];

export { getStorage };
