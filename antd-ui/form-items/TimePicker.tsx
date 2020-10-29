import { computed, defineComponent, PropType } from "vue";

import { FieldCore } from "@core/app.d";
import { useValue, useField, toMoment } from "@core/app";

import { XTimePicker } from "../extends";

import moment from "moment";

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
      <XTimePicker
        value={_val.value}
        onChange={(e: moment.Moment) => {
          setValue(e);
        }}
        disabledTime={field.option.value.disabledDate}
      ></XTimePicker>
    );
  }
});

export default TimePicker;
