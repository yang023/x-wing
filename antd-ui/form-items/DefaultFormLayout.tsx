import { defineComponent } from "vue";

import { XFormWrapper } from "../extends";

const DefaultFormLayout = defineComponent({
  setup(_props, { slots }) {
    return () => <XFormWrapper>{slots.default?.()}</XFormWrapper>;
  }
});

export default DefaultFormLayout;
