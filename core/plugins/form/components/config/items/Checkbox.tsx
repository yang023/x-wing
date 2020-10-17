import { FieldCore } from "../../../types";
import { computed, defineComponent, InputHTMLAttributes, PropType } from "vue";
import useValue from "./useValue";
import { useField } from "../../XField";

const Checkbox = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    const [value, setValue] = useValue(props.field, []);

    const field = useField(props.field);
    const options = computed(() => field.option.value.eumns || []);

    return () => (
      <>
        {options.value.map(item => {
          const id = `$checkbox_${item.value}`;
          return (
            <label for={id}>
              <input
                id={id}
                type="checkbox"
                name={name}
                v-model={value.value}
                value={item.value as InputHTMLAttributes["value"]}
                onChange={() => {
                  setValue(value.value);
                }}
              ></input>
              {item.title}
            </label>
          );
        })}
      </>
    );
  }
});

export default Checkbox;
