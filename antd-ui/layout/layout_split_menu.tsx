import { defineComponent, ref, watch } from "vue";

import LayoutStyle from "./style.module.css";
import XMenu, { NestedItemType } from "./menu";
import { useRoute, useRouter } from "vue-router";

import * as Layout from "./Layout";
import { resolveOpenKeys } from "./utils";
import { useMenu } from ".";

const SplitMenuLayout = defineComponent({
  setup(_props, { slots }) {
    const config = useMenu();
    const _config = config.value.map(item => {
      const { children, ..._item } = item;
      return {
        ..._item,
        _children: children
      };
    });

    const getChildren = (key: string) => {
      const stack = _config.map(item => item);
      while (stack.length > 0) {
        const _item = stack.pop();
        if (!_item) {
          continue;
        }

        if (_item.name === key) {
          return _item._children || [];
        }
        _item?._children &&
          stack.push(
            ..._item._children.map(_i => {
              const { children, ..._item } = _i;
              return {
                ..._item,
                _children: children
              };
            })
          );
      }
      return [];
    };

    const header = ref("");
    const sider = {
      open: ref([] as string[]),
      current: ref("")
    };
    const router = useRouter();
    const route = useRoute();

    const _children = ref([] as NestedItemType[]);

    watch(
      () => route.name,
      _name => {
        const keys = resolveOpenKeys(config.value, _name as string);
        const first = keys.shift();
        header.value = first as string;
        const siderFirst = keys.pop();
        sider.open.value = keys;
        sider.current.value = siderFirst as string;

        _children.value = getChildren(header.value);
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
            config={_children.value}
            open={sider.open.value}
            current={sider.current.value}
            onClick={key => {
              router.push({ name: key });
            }}
          ></XMenu>
        </Layout.LayoutSider>
        <Layout.LayoutWrapper class={LayoutStyle.overflowWrapper}>
          <Layout.LayoutHeader>
            <XMenu
              mode="horizontal"
              config={_config}
              current={header.value}
              onClick={key => {
                _children.value = getChildren(key);
                header.value = key;
              }}
            ></XMenu>
          </Layout.LayoutHeader>
          <Layout.LayoutContent
            class={[
              LayoutStyle.scrollerWrapper,
              LayoutStyle.layouotPageContent
            ]}
          >
            {slots.default?.()}
          </Layout.LayoutContent>
        </Layout.LayoutWrapper>
      </Layout.LayoutWrapper>
    );
  }
});

export default SplitMenuLayout;
