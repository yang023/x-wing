import { BaseURL, BaseUrlContext } from "./index.d";

const BaseUrl: {
  [key: string]: BaseUrlContext;
} = {};

/**
 * 根据 key 与版本号获取 baseUrl
 * @param key baseUrl 名称
 * @param version 版本号
 */
const get = (key: string, version?: string) => {
  version = version || "default";
  const base = BaseUrl[key];
  if (!base) {
    return "";
  }
  return base[version] || "";
};

/**
 *
 * @param key baseUrl 名称
 * @param base baseUrl 配置
 */
const set = (key: string, base: BaseURL) => {
  if (typeof base === "string") {
    BaseUrl[key] = {
      default: base
    };
  } else {
    Object.assign(BaseUrl, {
      [key]: Object.assign({}, BaseUrl[key] || {}, base)
    });
  }
};

/**
 * 统一设置 baseUrl
 * @param all baseUrl 的配置
 */
const setAll = (all: { [key: string]: BaseURL }) => {
  Object.keys(all).forEach(key => {
    set(key, all[key]);
  });
};

export { get, set, setAll };
