import { defineComponent, PropType } from "vue";

import { FieldCore } from "@core/app.d";
import { useField } from "@core/app";

import { XFormItem } from "../extends";

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
      <XFormItem
        name={field.name}
        label={field.option.value.label}
        validateStatus={field.state.value.error ? "error" : ""}
        help={field.option.value.errors}
        extra={field.option.value.tips}
      >
        {slots.default?.()}
      </XFormItem>
    );
  }
});
export default DefaultFieldLayout;
