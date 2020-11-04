import { XButton, XDrawer } from "@antd-ui/extends";
import {
  computed,
  DefineComponent,
  defineComponent,
  inject,
  InjectionKey,
  PropType,
  provide,
  Ref,
  ref
} from "vue";
import { XForm, createForm, onFieldValueChange, useStorage } from "@core/app";

import LayoutStyle from "./style.module.css";
import { NestedItemType } from "./menu";
import DefaultLayout from "./layout_default";
import SplitMenuLayout from "./layout_split_menu";

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
    l: DefaultLayout
  },
  splitMenu: {
    title: "菜单拆分",
    l: SplitMenuLayout
  }
};
const LayoutInjectionKey: InjectionKey<LayoutInjection> = Symbol();

const Layout = defineComponent({
  props: {
    menu: {
      type: Array as PropType<NestedItemType[]>,
      required: true
    },
    layouts: {
      type: Array as PropType<LayoutType[]>,
      default: () => Object.keys(layoutMap) as LayoutType[]
    }
  },
  setup(props, { slots }) {
    const storage = useStorage("local");

    // 当前 layout 值保存到 storage 中
    const _layout = ref("default" as LayoutType);
    const layoutKey = computed({
      get: () => {
        return storage.getItem<LayoutType>("layout") || "default";
      },
      set: val => {
        _layout.value = val;
        storage.setItem<LayoutType>("layout", val);
      }
    });
    _layout.value = layoutKey.value;

    const Component = computed(() => layoutMap[_layout.value].l);

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
          eumns: Object.keys(layoutMap)
            .filter(key => props.layouts.includes(key as LayoutType))
            .map(key => {
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
          title="设置面板"
          visible={drawerVisible.value}
          onClose={() => {
            setDrawerVisible(false);
          }}
        >
          <XForm
            form={form}
            getFormOptions={resolve => {
              resolve({
                bodyStyle: {
                  padding: 0
                }
              });
            }}
          ></XForm>
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
