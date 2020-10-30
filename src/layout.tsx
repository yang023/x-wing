import { AdminLayout } from "@antd-ui/index";
import { defineComponent } from "vue";
import menu from "./menu_config";

const Layout = defineComponent({
  setup(_props, { slots }) {
    return () => <AdminLayout menu={menu}>{slots.default?.()}</AdminLayout>;
  }
});

export default Layout;
