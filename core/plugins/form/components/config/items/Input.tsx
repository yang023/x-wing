import { FieldCore } from "../../../types";
import { computed, defineComponent, InputHTMLAttributes, PropType } from "vue";
import useValue from "./useValue";
import { useForm } from "../../Provider";
import moment from "moment";
import { isString } from "@core/plugins/form/utils";

type InputHtmlType = "text" | "password" | "date" | "time" | "datetime-local";

const judgeType = (
  type: InputHtmlType,
  value: any,
  handlers: {
    plain?: (value: any) => any;
    date: (value: any) => any;
    time: (value: any) => any;
    datetime: (value: any) => any;
  }
) => {
  if (!value) {
    return value || undefined;
  }
  const { plain = value => value, date, time, datetime } = handlers;
  if (["text", "password"].includes(type)) {
    return plain(value);
  }

  if (type === "date") {
    return date(value);
  }

  if (type === "time") {
    return time(value);
  }

  if (type === "datetime-local") {
    return datetime(value);
  }
};

const toString = (
  type: InputHtmlType,
  value: moment.Moment | string | Date
) => {
  return judgeType(type, value, {
    date: (val: moment.Moment | string | Date) => {
      let _moment;
      if (val instanceof Date) {
        _moment = moment(val);
      } else if (isString(val)) {
        _moment = moment(new Date(val as string));
      } else {
        _moment = (val || (null as unknown)) as moment.Moment;
      }
      return _moment?.format("YYYY-MM-DD");
    },
    time: (val: moment.Moment | string | Date) => {
      let _moment;
      if (val instanceof Date) {
        _moment = moment(val);
      } else if (isString(val)) {
        _moment = moment(new Date(`${moment().format("YYYY-MM-DD")}T${val}`));
      } else {
        _moment = (val || (null as unknown)) as moment.Moment;
      }
      return _moment?.format("HH:mm");
    },
    datetime: (val: moment.Moment | string | Date) => {
      let _moment;
      if (val instanceof Date) {
        _moment = moment(val);
      } else if (isString(val)) {
        _moment = moment(new Date(val as string));
      } else {
        _moment = (val || (null as unknown)) as moment.Moment;
      }
      return _moment?.format("YYYY-MM-DDTHH:mm");
    }
  });
};

const toMoment = (type: InputHtmlType, value: string) => {
  return judgeType(type, value, {
    date: (val: string | Date) => {
      if (val instanceof Date) {
        return moment(val);
      }
      const split = val.split("-").map(i => parseInt(i));
      return moment(split);
    },
    time: (val: string | Date) => {
      if (val instanceof Date) {
        return moment(val);
      }
      const split = val.split(":").map(i => parseInt(i));
      const time = new Date();
      time.setHours(split[0]);
      time.setMinutes(split[1]);

      return moment(time);
    },
    datetime: (val: string | Date) => {
      if (val instanceof Date) {
        return moment(val);
      }
      const split = val.split("T");
      const date = split[0];
      const time = split[1];

      const datetime = [
        ...date.split("-").map(i => parseInt(i)),
        ...time.split(":").map(i => parseInt(i))
      ];

      return moment(datetime);
    }
  });
};

const Input = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    },
    type: {
      type: String as PropType<InputHtmlType>,
      default: "text"
    }
  },
  setup(props) {
    const [value, setValue] = useValue(props.field);
    props.field.setInitialValue(toMoment(props.type, props.field.initialValue));
    const { id } = useForm();

    const _value = computed(() => {
      return toString(props.type, value.value);
    });

    return () => (
      <input
        value={_value.value as InputHTMLAttributes["value"]}
        type={props.type}
        form={id}
        onInput={e => {
          const _val = (e.target as HTMLInputElement).value;
          const parsed = toMoment(props.type, _val);

          setValue(parsed);
        }}
      ></input>
    );
  }
});

export default Input;
