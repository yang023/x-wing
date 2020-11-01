import { defineComponent, ref, watch } from "vue";

import LayoutStyle from "./style.module.css";
import XMenu from "./menu";
import { useRoute, useRouter } from "vue-router";

import * as Layout from "./Layout";
import { resolveOpenKeys } from "./utils";
import { useMenu } from ".";

const SplitMenuLayout = defineComponent({
  setup(_props, { slots }) {
    const config = useMenu();
    const sider = {
      open: ref([] as string[]),
      current: ref("")
    };
    const router = useRouter();
    const route = useRoute();

    watch(
      () => route.name,
      _name => {
        const keys = resolveOpenKeys(config.value, _name as string);
        const siderFirst = keys.pop();
        sider.open.value = keys;
        sider.current.value = siderFirst as string;
      },
      { immediate: true }
    );

    return () => (
      <Layout.LayoutWrapper
        class={[LayoutStyle.layoutOuter, LayoutStyle.overflowWrapper]}
      >
        <Layout.LayoutSider
          class={LayoutStyle.overflowWrapper}
          breakpoint="lg"
          collapsed-width="0"
        >
          <XMenu
            mode="inline"
            config={config.value}
            open={sider.open.value}
            current={sider.current.value}
            onClick={key => {
              router.push({ name: key });
            }}
          ></XMenu>
        </Layout.LayoutSider>
        <Layout.LayoutWrapper class={LayoutStyle.scrollerWrapper}>
          <Layout.LayoutHeader></Layout.LayoutHeader>
          <Layout.LayoutContent class={LayoutStyle.layouotPageContent}>
            {slots.default?.()}
          </Layout.LayoutContent>
        </Layout.LayoutWrapper>
      </Layout.LayoutWrapper>
    );
  }
});

export default SplitMenuLayout;
