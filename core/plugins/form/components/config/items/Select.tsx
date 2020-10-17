import { FieldCore } from "../../../types";
import { computed, defineComponent, OptionHTMLAttributes, PropType } from "vue";
import useValue from "./useValue";
import { useField } from "../../XField";

const Select = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    const [value] = useValue(props.field);

    const field = useField(props.field);
    const options = computed(() => field.option.value.eumns || []);

    return () => (
      <select v-model={value.value}>
        {options.value.map(item => {
          return (
            <option value={item.value as OptionHTMLAttributes["value"]}>
              {item.title}
            </option>
          );
        })}
      </select>
    );
  }
});

export default Select;
