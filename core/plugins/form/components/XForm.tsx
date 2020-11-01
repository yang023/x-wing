import { defineComponent, PropType } from "vue";
import { FormCore } from "../types";

import Provider from "./Provider";
import Content from "./Content";

const XForm = defineComponent({
  props: {
    form: {
      type: Object as PropType<FormCore>,
      required: true
    }
  },
  setup(props, { slots }) {
    return () => (
      <Provider form={props.form}>
        <Content v-slots={slots}></Content>
      </Provider>
    );
  }
});

export default XForm;
