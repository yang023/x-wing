/**
 * UI 相关配置
 */
import { defineComponent } from "vue";

import DefaultFormLayout from "./DefaultFormLayout";
import DefaultFieldLayout from "./DefaultFieldLayout";

type Component = (() => JSX.Element) | ReturnType<typeof defineComponent>;
type FormSize = "default" | "small" | "large" | "medium";

const FormConfig = {
  layouts: {
    form: DefaultFormLayout as Component,
    field: (DefaultFieldLayout as unknown) as Component
  },
  size: "default" as FormSize,
  setFormLayout: (layout: Component) => {
    FormConfig.layouts.form = layout;
    return FormConfig;
  },
  setFieldLayout: (layout: Component) => {
    FormConfig.layouts.field = layout;
    return FormConfig;
  },
  setSize: (size: FormSize) => {
    FormConfig.size = size;
    return FormConfig;
  }
};

export { FormConfig };
