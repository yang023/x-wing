import { defineComponent } from "vue";

import { XCard, XRow } from "../extends";
import { useForm } from "@core/app";

const DefaultFieldLayout = defineComponent({
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  setup(props, { slots }) {
    const { options } = useForm();

    return () => (
      <XCard {...options.value} title={props.title} bordered={false}>
        <XRow gutter={10}>{slots.default?.()}</XRow>
      </XCard>
    );
  }
});
export default DefaultFieldLayout;
