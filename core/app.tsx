import { createApp, defineComponent, App, Component, Plugin } from "vue";
import { RouterView } from "vue-router";

import router from "./plugins/router";
import store from "./plugins/store";

import storage from "./plugins/storage";

export { useStorage } from "./plugins/storage";
export { useRoute } from "./plugins/router";
export {
  useActions,
  useGetters,
  useMutations,
  useRouteActions,
  useRouteGetters,
  useRouteMutations,
  useRouteState,
  useState
} from "./plugins/store";

export {
  // 表单组件
  XForm,
  // 自定义表单项 UI 组件设置
  setComponent,
  // 核心函数，表单驱动器创建函数
  createForm,
  // 事件监听
  onEvent,
  onFieldOptionChange,
  onFieldStateChange,
  onFieldValueChange,
  onFormStateChange,
  onFormValueChange,
  // 工具
  useForm,
  useField,
  useValue,
  toMoment,
  Transfers,
  setTransfer,
  FormConfig
} from "./plugins/form";
export {
  useHttpClient,
  setClient,
  setUrl,
  setAllUrl
} from "./plugins/http-client";

import { setAllUrl } from "./plugins/http-client";
import { BaseURL } from "./plugins/http-client/index.d";

const layoutContext = require.context("@/", false, /layout.(vue|(j|t)sx?)/);
const DefaultLayout = defineComponent((_props, { slots }) => {
  return () => slots.default?.();
});

const ConfiguratedLayout =
  layoutContext.keys().length === 1
    ? layoutContext(layoutContext.keys()[0]).default || DefaultLayout
    : DefaultLayout;

const starter = async (config?: {
  preset?: (app: App) => void;
  wrapper?: Component;
  plugins?: Plugin[];
  defaultLayout?: boolean;
  disabledGlobalStorage?: boolean;
  baseUrl?: { [key: string]: BaseURL };
}) => {
  const {
    wrapper,
    plugins = [] as Plugin[],
    defaultLayout = false,
    disabledGlobalStorage = false,
    baseUrl = null
  } = config || {};
  const CurrentLayout = defaultLayout ? DefaultLayout : ConfiguratedLayout;

  const Content = () => (
    <CurrentLayout>
      <RouterView></RouterView>
    </CurrentLayout>
  );
  const _app = createApp(
    wrapper ? (
      <wrapper>
        <Content />
      </wrapper>
    ) : (
      <Content />
    )
  );
  config?.preset?.(_app);
  _app.use(storage, { disabledGlobal: disabledGlobalStorage });
  _app.use(store);
  _app.use(router);
  plugins.forEach(plugin => {
    _app.use(plugin);
  });

  if (baseUrl) {
    setAllUrl(baseUrl);
  }
  return (ele: string | HTMLElement) => _app.mount(ele);
};

export default starter;
