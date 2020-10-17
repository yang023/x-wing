import { DefineComponent, PropType } from "vue";
import { FieldCore } from "../../../types";
import Select from "./Select";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import RenderInput from "./RenderInput";

type ComponentTypes =
  | "Input"
  | "Password"
  | "Date"
  | "Time"
  | "Datetime"
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
  Input: RenderInput("text"),
  Password: RenderInput("password"),
  Date: RenderInput("date"),
  Time: RenderInput("time"),
  Datetime: RenderInput("datetime-local"),
  Checkbox: Checkbox,
  Radio: Radio,
  Select: Select
};

const setComponent = (key: ComponentTypes, component: Component) => {
  Components[key] = component;
};

export { Components, ComponentTypes, setComponent };
export { default as useValue } from "./useValue";
