import { Module } from "vuex";

import { getStorage } from "../storage";

const localXStorage = getStorage("local");

/**
 * 创建 Vuex.Store 的 Module，其中，state 支持与 localStorage 同步
 * @param options vuex 模块配置
 */
const createModule = (
  name: string,
  options: Module<any, any>
): Module<any, any> => {
  if (options.state) {
    options.state = new Proxy(options.state, {
      get: (target, _name) => {
        // 不代理 vue#proxy 对象
        if (
          _name === Symbol.toStringTag ||
          String(_name).startsWith("__v_") ||
          _name === "toJSON"
        ) {
          return Reflect.get(target, _name);
        }

        // 代理普通对象
        const _val = localXStorage.getItem(`STORE:${name}/${String(_name)}`);
        Reflect.set(target, _name, _val);
        return _val;
      },
      set: (target, _name, _val) => {
        localXStorage.setItem(
          `STORE:${name}/${String(_name)}`,
          _val,
          7 * 24 * 3600 * 1000 // 存7天，7天后强制过期
        );
        Reflect.set(target, _name, _val);
        return true;
      }
    });
  }
  return {
    namespaced: true,
    ...options
  };
};

export default createModule;
