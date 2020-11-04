import {
  defineComponent,
  shallowRef,
  PropType,
  ref,
  readonly,
  computed
} from "vue";
import { onFieldOptionChange, onFieldStateChange } from "@core/plugins/form";
import { FieldCore, FieldType } from "@core/plugins/form/types";

import { FormConfig } from "./config";
import { ComponentTypes, Components } from "./setting";
import { useForm } from "./Provider";

// 将 type 转换成大驼峰组件名
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
  const formState = useForm().state;
  const _state = ref(field.state.getState());
  onFieldStateChange(field.name, "*", () => {
    setTimeout(() => {
      _state.value = field.state.getState();
    });
  });

  const option = ref(field.display);
  onFieldOptionChange(field.name, "*", () => {
    setTimeout(() => {
      option.value = { ...field.display };
    });
  });

  const ui = readonly(field.ui);
  const state = computed(() => {
    const $state = { ..._state.value };
    $state.disabled =
      formState.value.disabled ||
      formState.value.loading ||
      formState.value.submitting;
    return $state;
  });

  return { name, state, option, ui };
};

export { useField };

export default XField;
