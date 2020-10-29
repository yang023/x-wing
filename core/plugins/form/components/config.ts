/**
 * UI 相关配置
 */
import { DefineComponent, defineComponent, PropType } from "vue";
import { FieldCore } from "../types";

type Component = DefineComponent<{
  field: {
    type: PropType<FieldCore>;
    required: true;
  };
}>;
type FormSize = "default" | "small" | "large" | "medium";

type FormLayoutComponent = DefineComponent<{}>;
type FieldLayoutComponent = DefineComponent<{
  field: {
    type: PropType<FieldCore>;
    required: true;
  };
}>;

const LayoutComponent = defineComponent({
  setup() {
    console.warn("Form Layout Component has not be registered");
    return () => null;
  }
});

const FormConfig = {
  layouts: {
    form: LayoutComponent as FormLayoutComponent,
    field: (LayoutComponent as unknown) as FieldLayoutComponent
  },
  size: "default" as FormSize,
  setFormLayout: (layout: FormLayoutComponent) => {
    FormConfig.layouts.form = layout;
    return FormConfig;
  },
  setFieldLayout: (layout: FieldLayoutComponent) => {
    FormConfig.layouts.field = layout;
    return FormConfig;
  },
  setSize: (size: FormSize) => {
    FormConfig.size = size;
    return FormConfig;
  }
};

export { FormConfig };
