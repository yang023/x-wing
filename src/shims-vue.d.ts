declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: JSX.Element & ReturnType<typeof defineComponent>;
  export default component;
}

declare module "ant-design-vue/*";

declare module "*.module.css" {
  const content: {
    [key: string]: string;
  };
  export default content;
}
declare module "*.module.less" {
  const content: {
    [key: string]: string;
  };
  export default content;
}
