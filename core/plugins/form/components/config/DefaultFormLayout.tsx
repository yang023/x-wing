import { defineComponent } from "vue";

const DefaultFormLayout = defineComponent({
  setup(_props, { slots }) {
    return () => slots.default?.();
  }
});

export default DefaultFormLayout;
