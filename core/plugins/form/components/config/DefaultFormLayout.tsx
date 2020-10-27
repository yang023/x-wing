import { defineComponent } from "vue";

import AntForm from "ant-design-vue/lib/form";
import "ant-design-vue/lib/form/style";

AntForm.name = "Form";
AntForm.Item.name = "FormItem";

const DefaultFormLayout = defineComponent({
  setup(_props, { slots }) {
    return () => <AntForm>{slots.default?.()}</AntForm>;
  }
});

export default DefaultFormLayout;
