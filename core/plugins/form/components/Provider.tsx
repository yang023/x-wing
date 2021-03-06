import {
  computed,
  ComputedRef,
  defineComponent,
  inject,
  InjectionKey,
  onMounted,
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
  instance: ComputedRef<FormCore>;
  fields: ComputedRef<FieldCore[]>;
  data: ComputedRef<FormData>;
  state: ComputedRef<FormState>;
  layout: ComputedRef<FormLayout>;
  groups: ComputedRef<FieldGroup[]>;
  itemLabelCol: ComputedRef<GridUiType>;
  itemWrapperCol: ComputedRef<GridUiType>;
  itemGrid: ComputedRef<GridUiType>;
  options: ComputedRef<any>;
};
const FormInjection: InjectionKey<FormContext> = Symbol();

const Provider = defineComponent({
  props: {
    form: {
      type: Object as PropType<FormCore>,
      required: true
    },
    getFormOptions: {
      type: Function as PropType<
        (resolve: <T = object>(optionos: T) => void) => void
      >,
      default: null
    }
  },
  setup(props, { slots }) {
    const fields = ref(props.form.fields);
    const data = ref(props.form.data);
    const state = ref(props.form.state.getState());
    const options = ref({});

    onFormValueChange(value => {
      data.value = value;
    });
    onFormStateChange("*", () => {
      state.value = props.form.state.getState();
    });
    onMounted(() => {
      props.getFormOptions?.(data => {
        options.value = data;
      });
    });

    provide(FormInjection, {
      id: props.form.id,
      instance: computed(() => props.form),
      fields: computed(() => fields.value),
      data: computed(() => data.value),
      state: computed(() => state.value),
      groups: computed(() => props.form.groups),
      layout: computed(() => props.form.layout),
      itemLabelCol: computed(() => props.form.itemLayout.labelCol),
      itemWrapperCol: computed(() => props.form.itemLayout.wrapperCol),
      itemGrid: computed(() => props.form.itemGrid),
      options: computed(() => options.value)
    });
    return () => slots.default?.();
  }
});

const useForm = () => {
  return inject(FormInjection) as FormContext;
};

export { useForm };

export default Provider;
