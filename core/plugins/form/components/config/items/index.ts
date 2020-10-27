import { DefineComponent, PropType } from "vue";
import { FieldCore } from "../../../types";
import Select from "./Select";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Input from "./Input";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

type ComponentTypes =
  | "Input"
  | "Password"
  | "Date"
  | "Time"
  | "Checkbox"
  | "Radio"
  | "Select";
type Component = DefineComponent<{
  field: {
    type: PropType<FieldCore>;
    required: true;
  };
}>;

const Components: {
  [key in ComponentTypes]: Component;
} = {
  Input: Input,
  Password: Input,
  Date: DatePicker,
  Time: TimePicker,
  Checkbox: Checkbox,
  Radio: Radio,
  Select: Select
};

const setComponent = (key: ComponentTypes, component: Component) => {
  Components[key] = component;
};

export { Components, ComponentTypes, setComponent };
export { default as useValue } from "./useValue";
