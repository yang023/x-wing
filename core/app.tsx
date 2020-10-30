import { createApp, App, Component, Plugin } from "vue";
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

/**
 * 屏蔽 app 对象创建逻辑，整合插件设置及其他环境配置
 * @param config app 启动配置
 */
const starter = (config?: {
  // 对 app 对象进行启动前设置，如进行全局变量输入等
  preset?: (app: App) => void;
  // 全局配置容器，如 ant-design-vue 中的 ConfigProvider
  wrapper?: Component;
  // 其他 vue 插件
  plugins?: Plugin[];
  // 是否禁用 localStorage 和 sessionStorage 的 API, 禁用后调用则报 undefined 错误
  disabledGlobalStorage?: boolean;
  // 设置接口主机
  baseUrl?: { [key: string]: BaseURL };
}) => {
  const {
    wrapper,
    plugins = [] as Plugin[],
    disabledGlobalStorage = false,
    baseUrl = null
  } = config || {};

  const Content = () => <RouterView></RouterView>;
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
  return {
    start: (ele: string | HTMLElement, onCreated?: (app: App) => void) => {
      _app.mount(ele);
      onCreated?.(_app);
      console.log(`App is running. Vue version: ${_app.version}`);
    }
  };
};

export default starter;
