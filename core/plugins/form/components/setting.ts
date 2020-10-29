import { defineComponent, DefineComponent, PropType } from "vue";
import { FieldCore } from "../types";

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

const DefaultComponent = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    console.warn(
      `Field type: ${props.field.type}. Component has not be registered`
    );

    return () => null;
  }
});

const Components: {
  [key in ComponentTypes]: Component;
} = {
  Input: DefaultComponent,
  Password: DefaultComponent,
  Date: DefaultComponent,
  Time: DefaultComponent,
  Checkbox: DefaultComponent,
  Radio: DefaultComponent,
  Select: DefaultComponent
};

const setComponent = (key: ComponentTypes, component: Component) => {
  Components[key] = component;
};

export { Components, ComponentTypes, setComponent };
