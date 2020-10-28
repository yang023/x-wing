 # x-wing
基于 Vue (Composition API) + TypeScript 启动环境，对 vue-router 进行封装扩展，以及整合应用系统的相关配置

## 启动

```
yarn install # 安装依赖

yarn serve # 启动开发服务

yarn build # 启动编译打包生产代码
```

扩展&开发建议使用接入 vue-ui

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

# 说明
[约定式路由](./docs/router.md)

[约定式状态管理](./docs/store.md)

[表单驱动器](./docs/form.md)

[异步请求](./docs/http.md)

[扩展的 Storage](./docs/storage.md)


# 求道友
### 半路出家的前端JSer，刚踏进TS这条不归路。
<p style="color:red">这不是 admin 后台框架，目标是前端基本组件和工具的集合的设计思路和方案，包括表单<input type="checkbox" checked>、列表、异步请求<input type="checkbox" checked>、国际化、主题切换等。设计上存在的不合理处和有待改善的地方，请多指点！</p>

### 期待几位道友一起完善扩展这个小框架，不求天下第一，只求一席之地。


### 设想
* 补全web应用基本的环境：如工具类，组件库接入方式等
* 抽象为 base, web 等分支版本
* 以管理应用为主，开发功能齐全的后台管理应用
* 开发脚手架
