import { useForm } from "@core/app";
import { defineComponent } from "vue";

import { XFormWrapper } from "../extends";

const DefaultFormLayout = defineComponent({
  setup(_props, { slots }) {
    const { layout } = useForm();
    return () => (
      <XFormWrapper layout={layout.value}>{slots.default?.()}</XFormWrapper>
    );
  }
});

export default DefaultFormLayout;
