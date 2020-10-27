import { FieldCore } from "../../../types";
import { computed, defineComponent, PropType } from "vue";
import useValue from "./useValue";
import { useField } from "../../XField";

import AntSelect from "ant-design-vue/lib/select";
import "ant-design-vue/lib/select/style";
AntSelect.name = "Select";
AntSelect.Option.name = "SelectOption";

const Select = defineComponent({
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
      <AntSelect
        name={name}
        value={value.value}
        options={options.value.map(item => ({
          ...item,
          label: item.title,
          value: `${item.value}`,
          key: `${item.value}`
        }))}
        onSelect={(e: any) => {
          setValue(e);
        }}
      ></AntSelect>
    );
  }
});

export default Select;
