import { FieldCore } from "../../../types";
import { computed, defineComponent, PropType } from "vue";
import useValue from "./useValue";

import AntDatePicker from "ant-design-vue/lib/date-picker";
import "ant-design-vue/lib/date-picker/style";
import toMoment from "./toMoment";
import { useField } from "../../XField";
AntDatePicker.name = "DatePicker";

const DatePicker = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    const [value, setValue] = useValue(props.field);
    const field = useField(props.field);
    const _val = computed(() => toMoment(value.value));

    return () => (
      <AntDatePicker
        value={_val.value}
        onChange={(e: moment.Moment) => {
          setValue(e);
        }}
        disabledDate={field.option.value.disabledDate}
      ></AntDatePicker>
    );
  }
});

export default DatePicker;
