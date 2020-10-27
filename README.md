 # x-wing
基于 Vue (Composition API) + TypeScript 启动环境，对 vue-router 进行封装扩展，以及整合应用系统的相关配置

## 启动
```
yarn install

yarn serve
```

## 目录结构

```
.
\-- core 核心工具
    \-- app.tsx 应用启动器
    \-- app.d.ts 类型文件
    \-- plugins 启动插件
        \-- router 扩展 vue-router，实现 0 配置单页面路由应用
        \-- store 扩展 vuex 的工具库
        \-- form 表单驱动器
        \-- http-client 异步请求工具
        \-- storage 扩展/替换 localStorage 和 sessionStorage
\-- src 应用源码
    \-- assets 资源文件
    \-- views 页面目录
    \-- main.ts 应用入口文件
    \-- shims-vue.d.ts 模块定义
    \-- app.config.json 应用相关配置
    \-- store.ts vuex 的根配置

```

## 约定式路由

简化路由的初始化，脱离繁琐的路由页面定义，约定页面规则生成路由相关配置

* 页面文件存放于 src/views/ 目录下
* 目录 src/views/ 下，每个子目录（页面目录）为一个页面/路由
* 每个页面目录下：
  * index.vue | index.js | index.ts | index.jsx | index.tsx 为页面文件
  * config.js | config.ts | config.jsx | config.tsx 为页面配置，包括：
    * title: 页面标题
    * state: 页面参数，初始化页面配置用
  * layout.vue | layout.js | layout.ts | layout.jsx | layout.tsx 为页面布局文件
  * 目录名为路由名，其中页面文件必须，配置文件、布局文件可选
  * 扩展支持泛型 meta 的 useRoute
* app.config.json 文件中，"index.path" 为指定首页的路由名

```
src
|-- views
    |-- index
        |-- index.tsx
        |-- config.ts ("title": "Index Page")
    |-- about
        |-- index.tsx
        |-- config.ts ("title": "About Page", "state": {"a": 1})
app.config.json 中，"index.path": "index"

生成路由配置
[
  {
    path: "/",
    component: LayoutComponent,
    children: [
      {
        name: "index",
        path: "",
        component: defineAsyncComponent(() => import(pageFile)), 
        mata: {
          title: "Index Page",
          state: {}
        }
      }
    ]
  },
  {
    path: "/about",
    component: LayoutComponent,
    children: [
      {
        name: "index",
        path: "",
        component: defineAsyncComponent(() => import(pageFile)), 
        mata: {
          title: "About Page",
          state: {
            a: 1
          }
        }
      }
    ]
  }
]

# 获取当前路由的 meta 并取得泛型提示
import { useRoute } from "@core/plugins/router";

type Meta = {
  a: number | string;
}

const { meta } = useRoute<Meta>();

console.log(meta.a);

```

#### 待实现：
* 路由鉴权


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


## 表单驱动器
统一管理收集用户输入，并校验输入结果的组件集合

> 借鉴 [formily](https://formilyjs.org/)，实现非嵌套结构的表单统一化组件，简化表单的数据收集、UI布局等繁琐操作，实现表单页面的快速开发

为支持接入不同的 UI 框架，表单驱动器仅包含对表单数据、表单字段的管理，以及维护的输入组件
目前支持的输入组件：
* Input
* Select
* Checkbox
* Radio
* Date
* Time
* Datetime

默认的组件UI：[ant-design-vue](https://2x.antdv.com/docs/vue/introduce-cn/)

### 创建表单
```
import { defineComponent } from "vue";

import { createForm, XForm } from "@core/plugins/form";

type Data = {
  a: string;
  b: string;
};

export default defineComponent(() => {

  // 创建表单驱动器，指定泛型后，编译器会对 form.setData, form.setInitialData 方法提供类型支持
  const { form } = createForm<Data>({
    // 定义表单的 ID
    id: "1", 
    // 定义表单字段
    fields: [
      {
        name: "a",
        label: "A",
        type: "datetime",
        tips: "123",
        defaultValue: new Date(),
        rules: { required: true, message: "错误" }
      },
      {
        name: "b",
        type: "checkbox",
        eumns: [
          { title: "A", value: "a" },
          { title: "B", value: "b" }
        ],
        label: "B",
        defaultValue: [],
        rules: { required: true, message: "错误" }
      }
    ]
  });

  // 调用此方法后表单组件正式启动
  form.create();

  return () => (
    <div style="width: 500px;margin:10px auto">
      <XForm form={form}></XForm>
      <button
        onClick={() => {
          // 校验表单输入
          form.validate(errors => {
            console.log(errors, form.data);
          });
        }}
      >
        Validate
      </button>
      <button
        onClick={() => {
          // 清空表单数据
          form.clearData();
        }}
      >
        ClearData
      </button>
      <button
        onClick={() => {
          // 重置表单数据
          form.resetData();
        }}
      >
        ResetData
      </button>
    </div>
  );
});

```

#### 字段定义：
  * name: 必填，指定字段名
  * label: 可选，
  * tips: 可选，字段描述提示
  * type: 可选，受支持的输入组件
  * eumns: 可选，下拉框、单选、多选等所需，作为数据源提供选择
    * title: 选项标题/描述
    * value: 选项值
    * disable: 禁用选项
  * defaultValue: 可选，字段的默认值，resetValue() 方法会使用其设置字段的值
  * rules: 可选，async-validator 的配置
  * valueFormat: 可选，字段解构用，默认为 name 值

#### 字段转换与解构
第三方组件中，DatePicker 的范围选择器的 value 一般为数组，但待提交的表单数据通常为一维字段对象，使用 valueFormat 对数据进行解构设置，使用 sourceFormat 对输入数据进行转换：
```
解构规则
valueFormat: "{0:startTime,1endTime}"

字段数据
value: [Date(2020-10-01), Date(2020-10-08)];

解构结果
{
  // ...
  startTime: Date(2020-10-01),
  endTime: Date(2020-10-08)
}

转换规则：
sourceFormat: "{0:b1,1:b2}"

输入实体：
{
  // ...
  startTime: Date(2020-10-01),
  endTime: Date(2020-10-08)
}

转换结果：
value: [Date(2020-10-01), Date(2020-10-08)];


```

#### 事件驱动
  * 表单事件：form.[EVENTS]
  * 字段事件：field.[FIELD_PATH].[EVENTS]
  * EVENTS：状态变化：state.[STATE_TYPE].change
    * 值变化：value.change
    * 配置变化：option.[OPTION_TYPE].change
    * 控件事件：item.[EVENT_TYPE]
    * 表单：提交：submit
    * 校验成功：valid
    * 校验失败：invalid
  * EVENT_TYPE：控件相关的事件类型，如 input 的 onInput, onBlur, onFocus 等, 去掉 on 后的小写名称：input, blue, focus 等
#### 路径系统
  * 参考 [formily](https://formilyjs.org/)， 基于 [cool-path](https://github.com/janrywang/cool-path) 实现路径匹配机制
  * 如监听字段值的变化
```
import { onFieldValueChange } from "@core/plugins/form";

// 监听字段 a 值变化
onFieldValueChange("field.a.value.change", ({name, value}) => {
  // do something
});

// 动态表单（目前尚未支持）： 
// 监听字段 第一组字段a 值变化
onFieldValueChange("field.0.a1.value.change", ({name, value}) => {
  // do something
});

```
具体匹配规则参考 [cool-path](https://github.com/janrywang/cool-path) 文档

#### 接入第三方组件（如 ant-design-vue）：
```
import { defineComponent, PropType } from "vue";
import { emitFieldEvent, setComponent, useValue } from "@core/plugins/form";
import { FieldCore } from "@core/plugins/form/types";

// 若为按需引入
import Input from "ant-design-vue/lib/input";
import "ant-design-vue/lib/input/style";

const AntInput = defineComponent({

  // props 默认定义，不支持其他参数
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    // useValue 为包装 value 值、监听表单值变化，直接使用即可
    const [value, setValue] = useValue(props.field, "");

    // 具体组件使用规则参考第三方 UI 框架文档
    return () => (
      <Input
        value={value.value}
        onBlur={(e: Event) => {
          // 使用 emitFieldEvent 函数触发相关事件
          emitFieldEvent(`${props.field.name}.blur`, e);
        }}
        onChange={(value: string) => {
          setValue(value);
        }}
      ></Input>
    );
  }
});

setComponent(Input, AntInput);

```

#### 待实现：
* 动态表单：动态增、删列表表单
* 动态结构：通过 ajax 从服务端获取表单 schema 结构生成表单


## 异步请求

通过统一接口（interface）整合应用的 http 请求服务，默认使用 fetch 进行实现。支持接入多个 api 服务，并支持对每个接口进行 url 版本配置，简单配置即可完成 api-url 的版本切换

> 兼容不支持 FetchApi 的浏览器，请自行 [polyfill](https://github.com/github/fetch) 或使用其他异步请求库，并通过继承 AbstractHttpClient（doSending 方法）实现对接

> 兼容不支持 PromissionApi 的浏览器，手动实现吧，当背面试题（[polyfill](https://www.npmjs.com/package/promise-polyfill) 它不香吗？-_-）

### 使用
设置 url 前缀
```
import { set } from "@core/plugins/http-client"

set("host", {
    default: "http://www.example.com/api",
    v1: "http://www.example.com/api/v1"
});

// or 

set("host","http://www.example.com/api");
set("host",{
  v1: "http://www.example.com/api/v1"
});

// ==>
{
  default: "http://www.example.com/api",
  v1: "http://www.example.com/api/v1"
}
```

设置 axios 为异步请求库（若使用 jQuery.ajax，同理，继承 AxiosHttpClient）
```
// 创建 AxiosClient:

// src/AxiosHttpClient.ts
export default class AxiosHttpClient<I, P> extends AbstractClient<I, P> {
  async doSending(
    url: string,
    method: "get" | "post" | "put" | "delete",
    data?: I,
    headers = new Headers()
  ): Promise<P> {
    const _headers: { [key: string]: string } = {};
    headers.forEach((value, key) => {
      _headers[key] = value;
    });

    const config: AxiosRequestConfig = {
      url,
      method
    };

    if (method === "get") {
      config.params = Object.assign({}, data);
    } else {
      config.data = Object.assign({}, data);
    }

    const res: AxiosResponse<P> = await _axios(config).then();

    return res.data;
  }
}

// use
import AxiosHttpClient from "@/AxiosHttpClient";
import { setClient } from "@core/plugins/http-client"
setClient(AxiosHttpClient);

```

通过 useHttpClient 函数进行数据的异步请求
```
import { useHttpClient } from "@core/plugins/http-client";

useHttpClient((baseUrl, service) => {
  const key = "host"; // required
  const version = "v1"; // default is "default"
  const url = baseUrl(key, "/example/{test}", version);
  const method = "get"; // "get" or "post" or "delete" or "put"
  const data = {
    test: "a"
  };

  // real url is "http://www.example.com/api/example/a"
  service(url, method, data); 
}, {
  onSuccess: (res) => {
    console.log(res)
  },
  onError: (err) => {
    console.log(err)
  }
})
```


## 扩展的 Storage

> 增强/替换 localStorage 和 sessionStorage

基于前端数据的缓存、存储机制的特点和存在问题，localStorage, sessionStorage 相对兼容大部分情况，因此选择 localStorage 和 sessionStorage 构建解决以下问题的 Storage 机制：

* 对非 string 类型的数据存储支持不友好，大部分情况下，要存储 array, obejct 等类型的数据，需要使用 JSON.stringify 转换数据为 string 类型后再储存；获取时也需要调用 JSON.parse 等方法还原对象，产生需对无用，重复的代码

* localStorage 本身为永久存储机制，但大部分数据有一定的使用期限，在有效期中的数据才生效，但又非 sessionStorage 的 “会话” 级别的有效期，浏览器关闭后也需要保留该有效期内的数据供下次浏览器打开时使用

Storage 的扩展点

* 支持 string, number, boolean, object, array 类型的数据结构的存储

* 支持有效期机制（ms）

* 调用方式与原生 localStorage 和 sessionStorage 基本一致，并提供泛型支持

使用

```
import { useStorage } from "@core/app";

const storage = useStorage("local"); // or "session";

const value = {
  a: 1
};
// "key" 指向的数据在 2小时 内有效
storage.setItem("key", value, 7200 * 1000);

// getItem 函数支持泛型
// 若 "key" 已过期，返回 null 
const _value = storage.getItem<{
  a: number
}>("key");
```


# 求道友
### 半路出家的前端JSer，刚踏进TS这条不归路。
<p style="color:red">这不是 admin 后台框架，目标是前端基本组件和工具的集合的设计思路和方案，包括表单<input type="checkbox" checked>、列表、异步请求<input type="checkbox" checked>、国际化、主题切换等。设计上存在的不合理处和有待改善的地方，请多指点！</p>

### 期待几位道友一起完善扩展这个小框架，不求天下第一，只求一席之地。


### 设想
* 补全web应用基本的环境：如工具类，组件库接入方式等
* 抽象为 base, web 等分支版本
* 以管理应用为主，开发功能齐全的后台管理应用
* 开发脚手架
