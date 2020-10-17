import { defineComponent, shallowRef } from "vue";

import { FormConfig } from "./config";
import { useForm } from "./Provider";
import XField from "./XField";

const Content = defineComponent(() => {
  const layouts = shallowRef(FormConfig.layouts);
  const { fields } = useForm();

  return () => (
    <layouts.value.form>
      {fields.value.map(field => {
        return <XField field={field}></XField>;
      })}
    </layouts.value.form>
  );
});

export default Content;
