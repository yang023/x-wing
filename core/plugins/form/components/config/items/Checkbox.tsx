import { FieldCore } from "../../../types";
import { computed, defineComponent, PropType } from "vue";
import useValue from "./useValue";
import { useField } from "../../XField";

import AntCheckbox from "ant-design-vue/lib/checkbox";
import "ant-design-vue/lib/checkbox/style";
AntCheckbox.name = "Checkbox";
AntCheckbox.Group.name = "CheckboxGroup";

const Checkbox = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    const [value, setValue] = useValue(props.field);

    const field = useField(props.field);
    const options = computed(() => field.option.value.eumns || []);

    return () => (
      <AntCheckbox.Group
        name={name}
        value={value.value}
        options={options.value.map(item => ({
          ...item,
          label: item.title,
          value: `${item.value}`
        }))}
        onChange={(_val: any[]) => {
          setValue(_val);
        }}
      ></AntCheckbox.Group>
    );
  }
});

export default Checkbox;
