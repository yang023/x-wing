import { defineComponent, shallowRef } from "vue";

import { FormConfig } from "./config";
import { useForm } from "./Provider";
import XField from "./XField";

const Content = defineComponent((_props, { slots }) => {
  const layouts = shallowRef(FormConfig.layouts);
  const { fields } = useForm();

  const optionsContent = slots.options ? (
    <layouts.value.options>{slots.options()}</layouts.value.options>
  ) : null;

  return () => (
    <layouts.value.form>
      {fields.value.map(field => {
        return <XField field={field}></XField>;
      })}
      {optionsContent}
    </layouts.value.form>
  );
});

export default Content;
