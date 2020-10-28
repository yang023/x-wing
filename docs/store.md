## 约定式状态管理

基于 Vuex 4 实现，扩展配置、使用等 Api
* 提供 ts 支持的工具类型
* 与 VueRouter 强绑定，实现页面级别的状态管理
* 状态持久化到 localStorage 中（扩展的 XStorage）

> 根状态配置
```
src/store.ts // store.js or store.jsx or store.tsx
const opotion = {
  state: {},
  mutations: {},
  actions: {}
  // ...
}
export default option;
```
在 src 目录下创建 store.ts （.tsx/.js/.jsx） 文件，并导出默认配置对象 (export default)，即完成 Vuex 根状态的配置

> 路由的状态配置（modules）
```
\-- views
    \-- index.ts
    \-- store
        \-- state.ts
        \-- getters.ts
        \-- actions.ts
        \-- mutations.ts
```
在页面目录下创建 store 子目录，并分别创建 state、getters、actions、mutations 文件（.(j|t)sx?），导出默认配置对象，即完成 Vuex 的模块配置，自动加载到 Vuex.Store 对象中完成创建

使用 useActions, useMutations, useState, useGetters，扩展 useStore
```
const state = useGetters();
// ==> 
const state = useStore().state;

const getters = useGetters();
// ==> 
const getters = useStore().getters;

// action: test
const actions = useActions("index");
actions.dispatch("test");
// ==> 
const store = useStore();
store.dispatch("index/test");

// nutation: test
const mutations = useMutations("index");
mutations.commit("test");
// ==> 
const store = useStore();
store.commit("index/test");
```

** 也可直接使用 Vuex 的 API

* 提供 actions、mutations 定义的 TS 工具类型，在 useActions, useMutations, useState, useGetters 中设置泛型参数即可获得 TS 类型提示
```
type XActions<T = any, C = any, S = any, R = any> = {
  [K in keyof T]: (
    this: Store<S>,
    injectee: {
      dispatch: <_K extends keyof Omit<T, K>, P>(
        type: _K,
        payload?: Omit<T, K>[_K],
        options?: DispatchOptions
      ) => Promise<P>;
      commit: <_K extends keyof C>(
        type: _K | string,
        payload?: C[_K],
        options?: CommitOptions
      ) => void;
      state: S;
      getters: any;
      rootState: R;
      rootGetters: any;
    },
    payload?: T[K]
  ) => any;
};

type XMutations<T, S> = {
  [K in keyof T]: (state: S, payload?: T[K]) => any;
};
```

使用 XActions
```
// ./store/actions.ts
import { State } from "./state";
import { IndexMutation } from "./mutations";
import { XActions } from "@core/app.d";

type IndexActions = {
  ACTION_A: number;
  ACTION_B: string;
};

const actions: XActions<IndexActions, IndexMutation, State> = {
  ACTION_A: ({ commit }, payload = 0) => {
    commit("TEST_A", payload);
  },
  ACTION_B: ({ commit }, payload = "") => {
    commit("TEST_B", payload);
  }
};

export default actions;

export { IndexActions };

// index.ts

import { useActions } from "@core/app";
import { IndexAction } from "./store/actions.ts";

const actions = useActions<IndexAction>("index");
actions.dispatch("ACTION_A", 1);
```

使用 XMutations
```
// ./store/mutations.ts
import { State } from "./state";
import { XMutations } from "@core/app.d";

type IndexMutation = {
  TEST_A: number;
  TEST_B: string;
};

const mutations: XMutations<IndexMutation, State> = {
  TEST_A: (state, payload = 0) => {
    state.a = payload;
  },
  TEST_B: (state, payload = "") => {
    state.b = payload;
  }
};

export default mutations;

export { IndexMutation };

// index.ts

import { useMutations } from "@core/app";
import { IndexMutations } from "./store/actions.ts";

const mutations = useMutations<IndexMutations>("index");
mutations.commit("TEST_A", 1);
```

[返回](../README.md)
