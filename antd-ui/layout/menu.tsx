import Menu from "ant-design-vue/lib/menu";
import { defineComponent, PropType, ref, watch } from "vue";

import "ant-design-vue/lib/menu/style";

Menu.name = "XMenu";
Menu.Item.name = "XMenuItem";
Menu.ItemGroup.name = "XMenuItemGroup";
Menu.SubMenu.name = "XMenuSubMenu";
Menu.Divider.name = "XMenuDivider";

type MenuItemType = {
  name: string;
  title: string;
  icon: string;
};

type NestedItemType = Pick<MenuItemType, "name"> &
  Partial<Exclude<MenuItemType, "name">> & {
    children?: NestedItemType[];
  };

const nestedParseMenu = (config: NestedItemType[]) => {
  return config.map(item => {
    if ((item.children || []).length === 0) {
      return <Menu.Item key={item.name}>{item.title || item.name}</Menu.Item>;
    } else {
      return (
        <Menu.SubMenu key={item.name} title={item.title || item.name}>
          {nestedParseMenu(item.children || [])}
        </Menu.SubMenu>
      );
    }
  });
};

const XMenu = defineComponent({
  props: {
    theme: {
      type: String as PropType<"light" | "dark">,
      default: "dark"
    },
    mode: {
      type: String as PropType<
        "vertical" | "vertical-right" | "horizontal" | "inline"
      >,
      required: false
    },
    config: {
      type: Array as PropType<NestedItemType[]>,
      default: () => []
    },
    current: {
      type: String,
      required: false
    },
    open: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    onClick: {
      type: Function as PropType<(key: string) => void>,
      required: false
    }
  },
  setup(props, { emit }) {
    const _config = ref(props.config);
    const _current = ref(props.current || "");
    const _open = ref([...(props.open || ([] as string[]))]);

    watch(
      () => props.config,
      config => {
        _config.value = config;
      }
    );

    watch(
      () => props.current,
      current => {
        _current.value = current || "";
      }
    );

    watch(
      () => props.open,
      _val => {
        if (_open.value.length === 0) {
          _open.value = _val;
        }
      }
    );

    return () => (
      <Menu
        theme={props.theme}
        mode={props.mode}
        openKeys={_open.value}
        selectedKeys={[_current.value]}
        onClick={(e: { key: string }) => {
          props.onClick?.(e.key);
        }}
        onOpenChange={(e: string[]) => {
          emit("update:open", e);
          _open.value = e;
        }}
      >
        {nestedParseMenu(_config.value)}
      </Menu>
    );
  }
});

export default XMenu;
export { NestedItemType };
