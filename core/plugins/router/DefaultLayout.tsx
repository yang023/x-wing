import { defineComponent } from "vue";

const DefaultLayout = defineComponent((_props, { slots }) => {
  return () => slots.default?.();
});

export default DefaultLayout;
