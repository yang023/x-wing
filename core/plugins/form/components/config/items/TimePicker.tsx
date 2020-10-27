import { FieldCore } from "../../../types";
import { computed, defineComponent, PropType } from "vue";
import useValue from "./useValue";

import AntTimePicker from "ant-design-vue/lib/date-picker";
import "ant-design-vue/lib/date-picker/style";
import moment from "moment";
import toMoment from "./toMoment";
import { useField } from "../../XField";
AntTimePicker.name = "TimePicker";

const TimePicker = defineComponent({
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
      <AntTimePicker
        value={_val.value}
        onChange={(e: moment.Moment) => {
          setValue(e);
        }}
        disabledTime={field.option.value.disabledDate}
      ></AntTimePicker>
    );
  }
});

export default TimePicker;
