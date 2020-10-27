import { FieldCore } from "../../../types";
import { computed, defineComponent, PropType } from "vue";
import useValue from "./useValue";
import { useField } from "../../XField";

import AntRadio from "ant-design-vue/lib/radio";
import "ant-design-vue/lib/radio/style";
AntRadio.name = "Radio";
AntRadio.Group.name = "RadioGroup";

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
      <AntRadio.Group
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
      ></AntRadio.Group>
    );
  }
});

export default Radio;
