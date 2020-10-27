import { FieldCore } from "../../../types";
import { defineComponent, PropType } from "vue";
import useValue from "./useValue";
import { useForm } from "../../Provider";

import AntInput from "ant-design-vue/lib/input";
import "ant-design-vue/lib/input/style";

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
      <AntInput
        value={value.value}
        id={id}
        type={props.field.type === "password" ? "password" : "text"}
        onChange={(e: Event) => {
          setValue((e.target as HTMLInputElement).value);
        }}
      ></AntInput>
    );
  }
});

export default Input;
