import {
  computed,
  ComputedRef,
  defineComponent,
  inject,
  InjectionKey,
  PropType,
  provide,
  ref
} from "vue";
import { onFormStateChange, onFormValueChange } from "../createForm";
import {
  FieldCore,
  FormCore,
  FormState,
  FormData,
  FieldGroup,
  GridUiType,
  FormLayout
} from "../types";

type FormContext = {
  id: string;
  fields: ComputedRef<FieldCore[]>;
  data: ComputedRef<FormData>;
  state: ComputedRef<FormState>;
  layout: ComputedRef<FormLayout>;
  groups: ComputedRef<FieldGroup[]>;
  itemLabelCol: ComputedRef<GridUiType>;
  itemWrapperCol: ComputedRef<GridUiType>;
  itemGrid: ComputedRef<GridUiType>;
};
const FormInjection: InjectionKey<FormContext> = Symbol();

const Provider = defineComponent({
  props: {
    form: {
      type: Object as PropType<FormCore>,
      required: true
    }
  },
  setup(props, { slots }) {
    const fields = ref(props.form.fields);
    const data = ref(props.form.data);
    const state = ref(props.form.state.getState());

    onFormValueChange(value => {
      data.value = value;
    });
    onFormStateChange("*", () => {
      state.value = props.form.state.getState();
    });

    provide(FormInjection, {
      id: props.form.id,
      fields: computed(() => fields.value),
      data: computed(() => data.value),
      state: computed(() => state.value),
      groups: computed(() => props.form.groups),
      layout: computed(() => props.form.layout),
      itemLabelCol: computed(() => props.form.itemLayout.labelCol),
      itemWrapperCol: computed(() => props.form.itemLayout.wrapperCol),
      itemGrid: computed(() => props.form.itemGrid)
    });
    return () => slots.default?.();
  }
});

const useForm = () => {
  return inject(FormInjection) as FormContext;
};

export { useForm };

export default Provider;
