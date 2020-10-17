import { onFieldValueChange } from "@core/plugins/form/createForm";
import { FieldCore } from "@core/plugins/form/types";
import { Ref, ref } from "vue";

const useValue = (
  field: FieldCore,
  defaultValue?: any
): [Ref<any>, (val: any) => void] => {
  const value: Ref<any> = ref(field.value || defaultValue || undefined);
  const setValue = (_value: any) => {
    field.setValue(_value);
  };

  onFieldValueChange(field.name, ctx => {
    const _val = ctx.value || defaultValue || undefined;
    value.value = _val;
  });

  return [value, setValue];
};

export default useValue;
