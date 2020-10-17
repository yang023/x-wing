import { defineComponent, PropType } from "vue";
import { FieldCore } from "../../../types";

import Input from "./Input";

const RenderInput = (
  type: "text" | "password" | "date" | "time" | "datetime-local"
) =>
  defineComponent({
    props: {
      field: {
        type: Object as PropType<FieldCore>,
        required: true
      }
    },
    setup(props) {
      return () => <Input field={props.field} type={type}></Input>;
    }
  });

export default RenderInput;
