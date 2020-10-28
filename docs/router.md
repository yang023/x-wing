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

[返回](../README.md)
