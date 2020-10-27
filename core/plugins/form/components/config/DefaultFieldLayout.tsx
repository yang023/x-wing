import { defineComponent, PropType } from "vue";
import { FieldCore } from "../../types";
import { useField } from "../XField";

import AntForm from "ant-design-vue/lib/form";
import "ant-design-vue/lib/form/style";

AntForm.name = "Form";
AntForm.Item.name = "FormItem";

const DefaultFieldLayout = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props, { slots }) {
    const field = useField(props.field);

    return () => (
      <AntForm.Item
        name={field.name}
        label={field.option.value.label}
        validateStatus={field.state.value.error ? "error" : ""}
        help={field.option.value.errors}
        extra={field.option.value.tips}
      >
        {slots.default?.()}
      </AntForm.Item>
    );
  }
});
export default DefaultFieldLayout;
