import Layout from "ant-design-vue/lib/layout";
import "ant-design-vue/lib/layout/style";

Layout.name = "XLayout";
Layout.Content.name = "XLayoutContent";
Layout.Footer.name = "XLayoutFooter";
Layout.Header.name = "XLayoutHeader";
Layout.Sider.name = "XLayoutSider";

const LayoutContent = Layout.Content;
const LayoutFooter = Layout.Footer;
const LayoutHeader = Layout.Header;
const LayoutSider = Layout.Sider;

export {
  Layout as LayoutWrapper,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider
};
