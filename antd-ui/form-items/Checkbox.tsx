import { computed, defineComponent, PropType } from "vue";

import { FieldCore } from "@core/app.d";
import { useValue, useField } from "@core/app";

import { XCheckboxGroup } from "../extends";

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
      <XCheckboxGroup
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
      ></XCheckboxGroup>
    );
  }
});

export default Checkbox;
