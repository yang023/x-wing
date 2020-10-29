import { computed, defineComponent, PropType } from "vue";

import { FieldCore } from "@core/app.d";
import { useValue, useField, toMoment } from "@core/app";

import { XDatePicker } from "../extends";

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
      <XDatePicker
        value={_val.value}
        onChange={(e: moment.Moment) => {
          setValue(e);
        }}
        disabledDate={field.option.value.disabledDate}
      ></XDatePicker>
    );
  }
});

export default DatePicker;
