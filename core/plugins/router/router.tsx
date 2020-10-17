import { App, defineAsyncComponent, defineComponent, reactive } from "vue";
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
    /.*(\/index.(vue|(t|j)sx?)|\/config.(t|j)s|\/layout.(vue|(t|j)sx?)$)/,
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
      const _state = reactive(r.config?.state || {});
      return {
        title: r.config?.title || appTitle,
        api: r.config || {},
        state: _state
      } as PageState<any>;
    };

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
export const useRoute = <T extends object>() => {
  const currentRoute = (_useRoute() as unknown) as ExtRoute<T>;
  return currentRoute;
};

export default router;
