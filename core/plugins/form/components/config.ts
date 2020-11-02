/**
 * UI 相关配置
 */
import { DefineComponent, defineComponent, PropType } from "vue";
import { FieldCore } from "../types";

type FormSize = "default" | "small" | "large" | "medium";

type FormLayoutComponent = DefineComponent;
type FieldLayoutComponent = DefineComponent<{
  field: {
    type: PropType<FieldCore>;
    required: true;
  };
}>;
type OptionLayoutComponent = DefineComponent;
type FieldGroupLayoutComponent = DefineComponent<{
  title: {
    type: PropType<string>;
    required: true;
  };
}>;
type FieldGroupItemLayoutComponent = DefineComponent;

const LayoutComponent = defineComponent({
  setup() {
    console.warn("Form Layout Component has not be registered");
    return () => null;
  }
});

const FormConfig = {
  layouts: {
    form: LayoutComponent as FormLayoutComponent,
    field: LayoutComponent as FieldLayoutComponent,
    options: LayoutComponent as OptionLayoutComponent,
    group: {
      wrapper: LayoutComponent as FieldGroupLayoutComponent,
      item: LayoutComponent as FieldGroupItemLayoutComponent
    }
  },
  size: "default" as FormSize,
  setFormLayout: (layout: FormLayoutComponent) => {
    FormConfig.layouts.form = layout;
    return FormConfig;
  },
  setFieldGroupLayout: (
    wrapper: FieldGroupLayoutComponent,
    item: FieldGroupItemLayoutComponent
  ) => {
    FormConfig.layouts.group = {
      wrapper,
      item
    };
    return FormConfig;
  },
  setFieldLayout: (layout: FieldLayoutComponent) => {
    FormConfig.layouts.field = layout;
    return FormConfig;
  },
  setOptionsLayout: (layout: OptionLayoutComponent) => {
    FormConfig.layouts.options = layout;
    return FormConfig;
  },
  setSize: (size: FormSize) => {
    FormConfig.size = size;
    return FormConfig;
  }
};

export { FormConfig };
