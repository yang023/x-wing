import { computed, defineComponent, PropType } from "vue";

import { FieldCore } from "@core/app.d";
import { useValue, useField } from "@core/app";

import { XRadioGroup } from "../extends";

const Radio = defineComponent({
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
      <XRadioGroup
        name={name}
        value={value.value}
        options={options.value.map(item => ({
          ...item,
          label: item.title,
          value: `${item.value}`
        }))}
        onChange={(e: Event) => {
          setValue((e.target as HTMLInputElement).value);
        }}
      ></XRadioGroup>
    );
  }
});

export default Radio;
