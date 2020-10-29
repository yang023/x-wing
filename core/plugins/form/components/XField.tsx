import { defineComponent, shallowRef, PropType, ref } from "vue";
import { onFieldOptionChange, onFieldStateChange } from "@core/plugins/form";
import { FieldCore, FieldType } from "@core/plugins/form/types";

import { FormConfig } from "./config";
import { ComponentTypes, Components } from "./setting";

const getComponentType = (type: FieldType): ComponentTypes => {
  return type.replace(/^\w{1,1}/, r => r.toUpperCase()) as ComponentTypes;
};

const XField = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    const layouts = shallowRef(FormConfig.layouts);
    const Component = Components[getComponentType(props.field.type)];

    return () => (
      <layouts.value.field field={props.field}>
        <Component field={props.field}></Component>
      </layouts.value.field>
    );
  }
});

const useField = (field: FieldCore) => {
  const state = ref(field.state.getState());
  onFieldStateChange(field.name, "*", () => {
    setTimeout(() => {
      state.value = field.state.getState();
    });
  });

  const option = ref(field.display);
  onFieldOptionChange(field.name, "*", () => {
    setTimeout(() => {
      option.value = { ...field.display };
    });
  });

  return { name, state, option };
};

export { useField };

export default XField;
