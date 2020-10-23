import { App, defineAsyncComponent, defineComponent } from "vue";
import { Module } from "vuex";
import Store from "../store";
import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterView,
  useRoute as _useRoute
} from "vue-router";
import { ExtRoute, PageRoutesConfig, PageConfig, PageState } from "./types";
import appConfig from "@/app.config.json";
import DefaultLayout from "./DefaultLayout";

import createModule from "../store/createModule";

/**
 * 根据 views 结构创建路由配置
 * TODO: 多层级结构
 */
const resolveRoutes: () => Array<RouteRecordRaw> = () => {
  const configContext = require.context("@/views", true, /.*config.(t|j)s$/);
  const layoutContext = require.context(
    "@/views",
    true,
    /.layout.(vue|(t|j)sx?)$/,
    "lazy"
  );
  const context = require.context(
    "@/views",
    true,
    /.*(\/index.(vue|(t|j)sx?)|(\/store\/.*\.(t|j)sx?)|\/config.(t|j)s|\/layout.(vue|(t|j)sx?)$)/,
    "lazy"
  );
  const store = require.context(
    "@/views",
    true,
    /.*(\/store\/.*\.(t|j)sx?)$/,
    "lazy"
  );
  const reducer: (result: PageRoutesConfig, key: string) => PageRoutesConfig = (
    result,
    key
  ) => {
    const name = key.replace(/(^\.\/)/g, "").replace(/\/.*/, "");
    if (!result[name]) {
      result[name] = {
        name
      };
    }
    const config = result[name];
    if (/config.(t|j)s$/.test(key)) {
      config.config = configContext(key).default;
    } else if (/layout.(vue|tsx?)$/.test(key)) {
      config.layout = key;
    } else if (/.*\/store\/.*/.test(key)) {
      if (!config.state) {
        config.state = {};
      }
      const storeKey = key.replace(/.*store\/|(\.(j|t)sx?)/g, "");
      if (["state", "mutations", "actions", "getters"].includes(storeKey)) {
        config.state[storeKey] = key;
      }
    } else {
      config.file = key;
    }
    return result;
  };
  const config = context.keys().reduce(reducer, {});
  const routesConfig = Object.keys(config).map(key => config[key]);
  const indexRoute = appConfig["index.path"];
  const appTitle = appConfig["app.title"];

  const routes = [] as Array<RouteRecordRaw>;
  routesConfig.forEach(r => {
    const resolveConfig: () => PageConfig<any> = () => {
      return {
        title: r.config?.title || appTitle,
        state: r.config?.state || {}
      } as PageState<any>;
    };

    if (r.state) {
      const promises = Object.keys(r.state).map(key => {
        return store(r.state?.[key]).then((m: { default: any }) => {
          return {
            module: m.default,
            key: key
          };
        });
      });

      Promise.all(promises)
        .then((m: { module: any; key: string }[]) => {
          return m.reduce((res, i) => {
            res[i.key as keyof Module<any, any>] = i.module;

            return r;
          }, {} as Module<any, any>);
        })
        .then(c => {
          const _module = createModule(r.name, c);
          Store.registerModule(r.name, _module);
        });
    }

    const Layout = r.layout
      ? defineAsyncComponent(() => layoutContext(r.layout as string))
      : DefaultLayout;
    const Content = {
      path: "",
      name: r.name,
      component: defineAsyncComponent(() => context(`${r.file}`)),
      meta: resolveConfig()
    };
    const Component = defineComponent({
      setup() {
        return () => (
          <Layout>
            <RouterView></RouterView>
          </Layout>
        );
      }
    });
    if (indexRoute === r.name) {
      routes.push({
        path: `/`,
        component: Component,
        children: [Content]
      });
    } else {
      routes.push({
        path: `/${r.name}`,
        component: Component,
        children: [Content]
      });
    }
  });

  return routes;
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: []
});

const _install = router.install;
router.install = (app: App) => {
  const routes = resolveRoutes();
  routes.forEach(route => {
    router.addRoute(route);
  });

  router.beforeEach(to => {
    const meta = to.meta as PageState<any>;
    document.title = meta.title;
    return true;
  });
  return _install.call(router, app);
};

// 提供 meta 的泛型数据
const useRoute = <T extends object>() => {
  const currentRoute = (_useRoute() as unknown) as ExtRoute<T>;
  return currentRoute;
};

export default router;

export { useRoute };
