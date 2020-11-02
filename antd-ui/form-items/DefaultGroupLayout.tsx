import { defineComponent } from "vue";

import { XCard, XRow } from "../extends";

const DefaultFieldLayout = defineComponent({
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    return () => (
      <XCard title={props.title} bordered={false}>
        <XRow gutter={10}>{slots.default?.()}</XRow>
      </XCard>
    );
  }
});
export default DefaultFieldLayout;
