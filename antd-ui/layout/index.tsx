import { XButton, XDrawer } from "@antd-ui/extends";
import {
  computed,
  defineAsyncComponent,
  DefineComponent,
  defineComponent,
  inject,
  InjectionKey,
  PropType,
  provide,
  Ref,
  ref
} from "vue";
import { XForm, createForm, onFieldValueChange } from "@core/app";

import LayoutStyle from "./style.module.css";
import { NestedItemType } from "./menu";

type LayoutInjection = {
  menu: Ref<NestedItemType[]>;
};

type LayoutType = "default" | "splitMenu";

const layoutMap: {
  [key in LayoutType]: {
    title: string;
    l: DefineComponent;
  };
} = {
  default: {
    title: "默认",
    l: defineAsyncComponent(() => import("./layout_default"))
  },
  splitMenu: {
    title: "菜单拆分",
    l: defineAsyncComponent(() => import("./layout_split_menu"))
  }
};
const LayoutInjectionKey: InjectionKey<LayoutInjection> = Symbol();

const Layout = defineComponent({
  props: {
    menu: {
      type: Array as PropType<NestedItemType[]>,
      required: true
    }
  },
  setup(props, { slots }) {
    const layoutKey = ref("default" as LayoutType);
    const Component = computed(() => layoutMap[layoutKey.value].l);

    const drawerVisible = ref(false);
    const setDrawerVisible = (_visible: boolean) => {
      drawerVisible.value = _visible;
    };

    const { form } = createForm({
      id: "options",
      fields: [
        {
          name: "layout",
          type: "radio",
          label: "布局设置",
          defaultValue: "default",
          eumns: Object.keys(layoutMap).map(key => {
            return {
              value: key,
              title: layoutMap[key as LayoutType].title
            };
          })
        }
      ]
    });

    onFieldValueChange("layout", ({ value }) => {
      layoutKey.value = value || "default";
    });

    provide(LayoutInjectionKey, {
      menu: ref(props.menu)
    });

    return () => (
      <>
        <XDrawer
          visible={drawerVisible.value}
          onClose={() => {
            setDrawerVisible(false);
          }}
        >
          <XForm form={form}></XForm>
        </XDrawer>
        <div class={LayoutStyle.layoutSettingsTriggeer}>
          <XButton
            onClick={() => {
              setDrawerVisible(true);
            }}
          >
            Setting
          </XButton>
        </div>
        <Component.value>{slots.default?.()}</Component.value>
      </>
    );
  }
});

const useMenu = () => {
  return inject(LayoutInjectionKey, {} as LayoutInjection).menu;
};

export { useMenu };
export default Layout;
