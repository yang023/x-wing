import { createApp, defineComponent, App, Component, Plugin } from "vue";
import { RouterView } from "vue-router";

import router from "./plugins/router";
import store from "./plugins/store";

import "./plugins/storage";

const layoutContext = require.context("@/", false, /layout.(vue|(j|t)sx?)/);
const DefaultLayout = defineComponent((_props, { slots }) => {
  return () => slots.default?.();
});
const ConfiguratedLayout =
  layoutContext.keys().length === 1
    ? layoutContext(layoutContext.keys()[0]).default
    : DefaultLayout;

const starter = async (config?: {
  preset?: (app: App) => void;
  wrapper?: Component;
  plugins?: Plugin[];
  defaultLayout?: boolean;
}) => {
  const { wrapper, plugins = [] as Plugin[], defaultLayout = false } =
    config || {};
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
  _app.use(store);
  _app.use(router);
  plugins.forEach(plugin => {
    _app.use(plugin);
  });

  return (ele: string | HTMLElement) => _app.mount(ele);
};

export default starter;
