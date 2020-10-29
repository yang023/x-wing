import { defineComponent, PropType } from "vue";

import { FieldCore } from "@core/app.d";
import { useValue, useForm } from "@core/app";

import { XInput } from "../extends";

const Input = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    const [value, setValue] = useValue(props.field);
    const { id } = useForm();

    return () => (
      <XInput
        value={value.value}
        id={id}
        type={props.field.type === "password" ? "password" : "text"}
        onChange={(e: Event) => {
          setValue((e.target as HTMLInputElement).value);
        }}
      ></XInput>
    );
  }
});

export default Input;
